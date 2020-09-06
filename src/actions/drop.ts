import { config } from "../config";
import { SocketPacket, TwitchEvent } from "../types";
import { wsServer } from "../websocket";

import UserManager from "../users/UserManager";
const userManager = new UserManager();

export const sendDropUserEvent = async (userId: string, messageId: string) => {
  try {
    const user = await userManager.getUser(userId as string);

    const dropUserEvent: SocketPacket = {
      broadcaster: config.broadcaster,
      event: TwitchEvent.dropUser,
      id: messageId,
      data: {
        logoUrl: user.logo as string,
      },
    };

    wsServer.clients.forEach((client) => {
      client.send(JSON.stringify(dropUserEvent));
    });
  } catch (error) {
    console.log(error);
  }
};
