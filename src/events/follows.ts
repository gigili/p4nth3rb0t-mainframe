import WebsocketServer from "../websocket";
import { Packet, TwitchEvent } from "../data/types";
import { config } from "../config";
import UserManager from "../users/UserManager";

export const sendBroadcasterFollowEvent = async (
  followerName: string,
  followerUserId: string,
) => {
  const user = await UserManager.getUserById(followerUserId as string);

  try {
    const broadcasterFollowEvent: Packet = {
      broadcaster: config.broadcaster.name,
      event: TwitchEvent.broadcasterFollow,
      id: followerName + "-" + Date.now(),
      data: {
        followerName,
        followerUserId,
        logoUrl: user.logo,
      },
    };

    WebsocketServer.sendDataOverWebsocket(broadcasterFollowEvent);
  } catch (error) {
    console.log(error);
  }
};
