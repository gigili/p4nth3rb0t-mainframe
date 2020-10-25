import { tmi } from "../tmi";
import { wsServer } from "../websocket";
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

    wsServer.clients.forEach((client) => {
      client.send(JSON.stringify(cheerEvent));
    });
  } catch (error) {
    console.log(error);
  }
};

tmi.on(
  "cheer",
  (channel: string, userstate: ChatUserstate, message: string) => {
    sendCheerEvent(userstate["bits"] as string, userstate["id"] as string);
  }
);
