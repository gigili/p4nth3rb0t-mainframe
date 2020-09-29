import { tmi } from "./../tmi";
import { wsServer } from "../websocket";
import { Packet, TwitchEvent } from "../data/types";
import { config } from "../config";

const sendRaidEvent = async (raiderCount: number, username: string) => {
  try {
    const raidEvent: Packet = {
      broadcaster: config.broadcaster,
      event: TwitchEvent.raid,
      id: username + "-" + raiderCount,
      data: {
        raiderCount: raiderCount,
        raider: username,
      },
    };

    wsServer.clients.forEach((client) => {
      client.send(JSON.stringify(raidEvent));
    });
  } catch (error) {
    console.log(error);
  }
};

tmi.on("raided", (channel: string, username: string, viewers: number) => {
  sendRaidEvent(viewers, username);
});
