import WebsocketServer from "../WebSocketServer";
import { config } from "../config";
import UserManager from "../users/UserManager";
import TwitchFollowerModel from "../data/models/TwitchFollower";
import { getActiveBroadcasterStreamByBroadcasterId } from "../utils/twitchUtils";
import { FollowPacket, MainframeEvent } from "@whitep4nth3r/p4nth3rb0t-types";

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
        const broadcasterFollowEvent: FollowPacket = {
          event: MainframeEvent.follow,
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
