import axios from "axios";
import { off } from "process";
import AccessToken from "./classes/AccessToken";
import { config } from "./config";
import { AccessTokenData } from "./data/models/AccessToken";
import { TeamMembers, TeamMember, EventSubscription, EventSubscriptionReseponse, EventSubDefinition, EventSubType } from "./data/types";
import Team from "./users/Team";

const accessTokenUtil = new AccessToken();

//TODO: do not run if process.env.TWITCH_API_CALLBACK_URL is unavailable

const eventSubApiUrl = "https://api.twitch.tv/helix/eventsub/subscriptions";

async function getEnabledSubscriptions(): Promise<EventSubscriptionReseponse | undefined> {
  const accessTokenData = await accessTokenUtil.get();
  if (accessTokenData) {
    try {
      const response = await axios.get(`${eventSubApiUrl}?status=enabled`, {
        headers: {
          Authorization: `Bearer ${accessTokenData.accessToken}`,
          "Client-ID": process.env.CLIENT_ID,
          "Content-Type": "application/json",
        },
      });
      return response.data;
    } catch (err) {
      console.error(err);
    } 
  }
  return;
}

async function registerEventSub(definition: EventSubDefinition) {
  if (process.env.TWITCH_API_CALLBACK_URL) {
    const accessTokenData = await accessTokenUtil.get();

    if (accessTokenData) {
      const data = {
        "type": definition.eventType,
        "version": "1",
        "condition": {
          "broadcaster_user_id": definition.userId
        },
        "transport": {
          "method": "webhook",
          "callback": definition.callbackUrl,
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

function createDefinition(type: EventSubType, callbackUrl: string, userId: string): EventSubDefinition {
  return {
    eventType: type,
    userId: userId,
    callbackUrl: callbackUrl
  }
}

function createStreamerOfflineDefinition(userId: string) {
  return createDefinition(EventSubType.StreamOffline, `${process.env.TWITCH_API_CALLBACK_URL}/team/${userId}`, userId);
}

function createStreamerOnlineDefinition(userId: string) {
  return createDefinition(EventSubType.StreamOnline, `${process.env.TWITCH_API_CALLBACK_URL}/team/${userId}`, userId);
}

(async () => {
  const subscriptionResponse = await getEnabledSubscriptions();
  const knownSubs = new Set<string>();
  if (subscriptionResponse) {
    subscriptionResponse.data.forEach((eventSub) => {
      const def: EventSubDefinition = {
        eventType: eventSub.type as EventSubType,
        userId: eventSub.condition.broadcaster_user_id,
        callbackUrl: eventSub.transport.callback
      };
      knownSubs.add(JSON.stringify(def));
    });
  }
  const followDefinition: EventSubDefinition = {
    eventType: EventSubType.ChannelFollow,
    userId: config.broadcaster.user_id,
    callbackUrl: `${process.env.TWITCH_API_CALLBACK_URL}/broadcaster/follow`
  };
  if (knownSubs.has(JSON.stringify(followDefinition))) {
    console.log("Already subscribed to follow events");
  } else {
    await registerEventSub(followDefinition);
  }
  
  // Register any team member stream listeners that are not already registered
  const teamMembers: TeamMembers = await Team.getMembers();
  teamMembers.forEach(async (member: TeamMember) => {
    const offlineDefinition = createStreamerOfflineDefinition(member.user_id);
    if (knownSubs.has(JSON.stringify(offlineDefinition))) {
      console.log("Already subscribed to streamer offline for " + member.user_name);
    } else {
      await registerEventSub(offlineDefinition);
    }
    const onlineDefinition = createStreamerOnlineDefinition(member.user_id);
    if (knownSubs.has(JSON.stringify(onlineDefinition))) {
      console.log("Already subscribed to streamer online for " + member.user_name);
    } else {
      await registerEventSub(onlineDefinition);
    }
  });
  console.log("Webhooks initialization complete");
})();
