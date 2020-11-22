import { tmi } from "../tmi";
import WebSocketServer from "../websocket";
import { Packet, TwitchEvent } from "../data/types";
import { config } from "../config";
import { ChatUserstate } from "tmi.js";

const sendCheerEvent = async (bitCount: string, messageId: string) => {
  try {
    const cheerEvent: Packet = {
      broadcaster: config.broadcaster.name,
      event: TwitchEvent.cheer,
      id: messageId,
      data: {
        bitCount: bitCount,
      },
    };

    WebSocketServer.sendDataOverWebsocket(cheerEvent);
  } catch (error) {
    console.log(error);
  }
};

tmi.on(
  "cheer",
  (channel: string, userstate: ChatUserstate, message: string) => {
    sendCheerEvent(userstate["bits"] as string, userstate["id"] as string);
  },
);
