import WebsocketServer from "../WebSocketServer";
import { Packet, TwitchEvent } from "../data/types";
import { config } from "../config";
import UserManager from "../users/UserManager";
import TwitchFollowerModel from "../data/models/TwitchFollower";
import { getActiveBroadcasterStreamByBroadcasterId } from "../utils/twitchUtils";

export const sendBroadcasterFollowEvent = async (
  followerName: string,
  followerUserId: string,
) => {
  const existingFollower = await TwitchFollowerModel.findOne({
    userId: followerUserId,
  });

  if (!existingFollower) {
    //TODO: cache this
    const broadcasterStream = await getActiveBroadcasterStreamByBroadcasterId(
      config.broadcaster.id,
    );

    if (broadcasterStream) {
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

        WebsocketServer.sendData(broadcasterFollowEvent);

        await TwitchFollowerModel.updateOne(
          { userId: followerUserId },
          {
            userId: followerUserId,
            userDisplayName: followerName,
            streamId: broadcasterStream.id,
            logoUrl: user.logo,
          },
          { upsert: true },
        );
      } catch (error) {
        console.log(error);
      }
    }
  }
};
