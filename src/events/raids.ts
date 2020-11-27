import { tmi } from "./../tmi";
import WebSocketServer from "../WebSocketServer";
import { Packet, TwitchEvent } from "../data/types";
import { config } from "../config";
import UserManager from "../users/UserManager";

const sendRaidEvent = async (raiderCount: number, username: string) => {
  const user = await UserManager.getUserByLogin(username as string);

  try {
    const raidEvent: Packet = {
      broadcaster: config.broadcaster.name,
      event: TwitchEvent.raid,
      id: username + "-" + raiderCount,
      data: {
        raiderCount: raiderCount,
        raider: username,
        logoUrl: user.users[0].logo,
      },
    };

    WebSocketServer.sendData(raidEvent);
  } catch (error) {
    console.log(error);
  }
};

tmi.on("raided", (channel: string, username: string, viewers: number) => {
  sendRaidEvent(viewers, username);
});
