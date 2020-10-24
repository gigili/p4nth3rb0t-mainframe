import { TeamMembers } from "./data/types";
import axios from "axios";
import AccessToken from "./classes/AccessToken";
import { config } from "./config";
import type { TeamMember } from "./data/types";

const accessTokenUtil = new AccessToken();

async function registerWebhook(topicUrl: string, member_id: string) {
  const webhooksApiUrl = "https://api.twitch.tv/helix/webhooks/hub";

  const accessTokenData = await accessTokenUtil.get();

  if (accessTokenData) {
    const data = {
      "hub.callback": `${process.env.TWITCH_API_CALLBACK_URL}/${member_id}`,
      "hub.mode": "subscribe",
      "hub.topic": topicUrl,
      "hub.lease_seconds": 84600,
    };

    try {
      const response = await axios.post(webhooksApiUrl, data, {
        headers: {
          Authorization: `Bearer ${accessTokenData.accessToken}`,
          "Client-Id": process.env.CLIENT_ID,
          "Content-Type": "application/json",
        },
      });
    } catch (err) {
      console.error(err);
    }
  }
}

//Example: Subscribe to new followers to a twitch user with id: 469006291 (me)
registerWebhook(
  `https://api.twitch.tv/helix/users/follows?first=1&to_id=${config.broadcaster.id}`,
  config.broadcaster.id
);

const toSubscribeTo = [...config.teamMembers, config.broadcaster].map(
  (member) => member.id
);

//Register all team member stream listeners
toSubscribeTo.map((member: string) => {
  registerWebhook(
    `https://api.twitch.tv/helix/streams?user_id=${member}`,
    member
  );
});
