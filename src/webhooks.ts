import axios from "axios";
import AccessToken from "./classes/AccessToken";

const accessTokenUtil = new AccessToken();

async function registerWebhook(topicUrl: string) {
  const webhooksApiUrl = "https://api.twitch.tv/helix/webhooks/hub";

  const accessTokenData = await accessTokenUtil.get();

  if (accessTokenData) {
    const data = {
      "hub.callback": process.env.TWITCH_API_CALLBACK_URL,
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
  "https://api.twitch.tv/helix/users/follows?first=1&to_id=469006291"
);

//Register all team member stream listeners


