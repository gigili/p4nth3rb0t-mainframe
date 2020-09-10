import { tmi } from "../tmi";
import { wsServer } from "../websocket";
import { Packet, TwitchEvent } from "../types";
import { config } from "../config";

const sendSpecialUserJoinEvent = async (username: string) => {
  try {
    const cheerEvent: Packet = {
      broadcaster: config.broadcaster,
      event: TwitchEvent.specialUserJoin,
      id: username + "-" + Date.now(),
      data: {
        username: username,
      },
    };

    wsServer.clients.forEach((client) => {
      client.send(JSON.stringify(cheerEvent));
    });
  } catch (error) {
    console.log(error);
  }
};

tmi.on("join", (channel: string, username: string, self: boolean) => {
  if (config.specialUsers.includes(username)) {
    sendSpecialUserJoinEvent(username as string);
  }
});
