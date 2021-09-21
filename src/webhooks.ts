import axios from "axios";
import AccessToken from "./classes/AccessToken";
import { config } from "./config";
import { AccessTokenData } from "./data/models/AccessToken";
import { TeamMembers, TeamMember } from "./data/types";
import Team from "./users/Team";

const accessTokenUtil = new AccessToken();

//TODO: do not run if process.env.TWITCH_API_CALLBACK_URL is unavailable

const enum EventSubType {
  StreamOnline = "stream.online",
  StreamOffline = "stream.offline",
  ChannelFollow = "channel.follow",
}
const eventSubApiUrl = "https://api.twitch.tv/helix/eventsub/subscriptions";

async function cleanEventSubs() {
  const accessTokenData = await accessTokenUtil.get();
  if (accessTokenData) {
    try {
      const response = await axios.get(eventSubApiUrl, {
        headers: {
          Authorization: `Bearer ${accessTokenData.accessToken}`,
          "Client-ID": process.env.CLIENT_ID,
          "Content-Type": "application/json",
        },
      });
      response.data.data.map((sub: any) => {
        deleteSubscription(sub.id, accessTokenData);
      });
      console.log(`🚮 Deleted ${response.data.data.length} previous subscriptions.`);
    } catch (err) {
      console.error(err);
    } 
  }
}

async function deleteSubscription(id: string, accessTokenData: AccessTokenData) {
  try {
    await axios.delete(`${eventSubApiUrl}?id=${id}`, {
      headers: {
        Authorization: `Bearer ${accessTokenData.accessToken}`,
        "Client-ID": process.env.CLIENT_ID,
        "Content-Type": "application/json",
      },
    });
  } catch (err) {
    console.error(err);
  } 
}

async function registerEventSub(callbackUrl: string, subType: EventSubType) {
  if (process.env.TWITCH_API_CALLBACK_URL) {
    const accessTokenData = await accessTokenUtil.get();

    if (accessTokenData) {
      const data = {
        "type": subType,
        "version": "1",
        "condition": {
          "broadcaster_user_id": config.broadcaster.user_id
        },
        "transport": {
          "method": "webhook",
          "callback": callbackUrl,
          "secret": "sup3rs3cr3t"
        },
      };
  
      try {
        const response = await axios.post(eventSubApiUrl, data, {
          headers: {
            Authorization: `Bearer ${accessTokenData.accessToken}`,
            "Client-ID": process.env.CLIENT_ID,
            "Content-Type": "application/json",
          },
        });
      } catch (err) {
        console.error(err);
      }  
    }
  }
}

(async () => {
  await cleanEventSubs();
  // There seems to be a slight delay on deletions on the Twitch side so sometimes we get 403 errors when starting
  // to register the new subscriptions. Add a fixed delay or would it work to ask Twitch how many active subscriptions
  // we have and delay only if active subscriptions > 0?
  await registerEventSub(`${process.env.TWITCH_API_CALLBACK_URL}/broadcaster/follow`, EventSubType.ChannelFollow);
  //Register all team member stream listeners
  const teamMembers: TeamMembers = await Team.getMembers().then((response) =>
    response.forEach((member: TeamMember) => {
      registerEventSub(
        `${process.env.TWITCH_API_CALLBACK_URL}/team/${member.user_id}`,
        EventSubType.StreamOnline,
      );
      return registerEventSub(
        `${process.env.TWITCH_API_CALLBACK_URL}/team/${member.user_id}`,
        EventSubType.StreamOffline,
      );
    }),
  );
})();
