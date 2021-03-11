import { tmi } from "../tmi";
import { ChatUserstate } from "tmi.js";
import { config } from "../config";
import WebSocketServer from "../WebSocketServer";
import { MoodChangePacket, MainframeEvent } from "p4nth3rb0t-types";

export const sendMoodChangeEvent = async (mood: string, rewardId: string) => {
  try {
    const moodChangeEvent: MoodChangePacket = {
      event: MainframeEvent.moodChange,
      id: rewardId,
      data: {
        mood,
      },
    };

    WebSocketServer.sendData(moodChangeEvent);
  } catch (error) {
    console.log(error);
  }
};

tmi.on(
  "message",
  async (
    channel: string,
    tags: ChatUserstate,
    message: string,
    self: boolean,
  ) => {
    const rewardId: string = tags["custom-reward-id"];

    if (Object.keys(config.redemptions).includes(rewardId)) {
      const mood: string = config.redemptions[rewardId];
      const username: string = tags["username"] as string;

      await sendMoodChangeEvent(mood, rewardId);

      tmi.say(
        config.channel,
        `whitep30PEWPEW @${username} redeemed ${mood} panther! whitep30PEWPEW`,
      );
    }
  },
);
