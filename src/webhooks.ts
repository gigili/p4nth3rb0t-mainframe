import axios from "axios";
import AccessToken from "./classes/AccessToken";
import { config } from "./config";
import { TeamMembers, TeamMember } from "./data/types";
import Team from "./users/Team";

const accessTokenUtil = new AccessToken();

//TODO: do not run if process.env.TWITCH_API_CALLBACK_URL is unavailable

const enum WebhookType {
  StreamAnnouncement = "StreamAnnouncement",
  BroadcasterFollow = "BroadcasterFollow",
}

async function registerWebhook(
  topicUrl: string,
  member_id: string,
  webhookType: WebhookType,
) {
  if (process.env.TWITCH_API_CALLBACK_URL) {
    const webhooksApiUrl = "https://api.twitch.tv/helix/webhooks/hub";

    const accessTokenData = await accessTokenUtil.get();

    let hubCallback;

    switch (webhookType) {
      case WebhookType.StreamAnnouncement:
        hubCallback = `${process.env.TWITCH_API_CALLBACK_URL}/team/${member_id}`;
        break;
      case WebhookType.BroadcasterFollow:
        hubCallback = `${process.env.TWITCH_API_CALLBACK_URL}/broadcaster/follow`;
        break;
      default:
        `${process.env.TWITCH_API_CALLBACK_URL}`;
    }

    if (accessTokenData) {
      const data = {
        "hub.callback": hubCallback,
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
}

//Subscribe to new followers for broadcaster
registerWebhook(
  `https://api.twitch.tv/helix/users/follows?first=1&to_id=${config.broadcaster.user_id}`,
  config.broadcaster.user_id,
  WebhookType.BroadcasterFollow,
);

(async () => {
  //Register all team member stream listeners
  const teamMembers: TeamMembers = await Team.getMembers().then((response) =>
    response.forEach((member: TeamMember) => {
      return registerWebhook(
        `https://api.twitch.tv/helix/streams?user_id=${member.user_id}`,
        member.user_id,
        WebhookType.StreamAnnouncement,
      );
    }),
  );
})();
