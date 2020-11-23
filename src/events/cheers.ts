import { tmi } from "../tmi";
import WebSocketServer from "../WebSocketServer";
import { Packet, TwitchEvent } from "../data/types";
import { config } from "../config";
import { ChatUserstate } from "tmi.js";
import UserManager from "../users/UserManager";

const sendCheerEvent = async (
  bitCount: string,
  messageId: string,
  username: string,
) => {
  const user = await UserManager.getUserByLogin(username);

  //will I need to update p4nth3rdrop to accept this new cheer event
  //due to the validation we have on it?
  try {
    const cheerEvent: Packet = {
      broadcaster: config.broadcaster.name,
      event: TwitchEvent.cheer,
      id: messageId,
      data: {
        bitCount: bitCount,
        cheererName: username,
        logoUrl: user.users[0].logo,
      },
    };

    WebSocketServer.sendData(cheerEvent);
  } catch (error) {
    console.log(error);
  }
};

tmi.on(
  "cheer",
  (channel: string, userstate: ChatUserstate, message: string) => {
    sendCheerEvent(
      userstate["bits"] as string,
      userstate["id"] as string,
      userstate["username"] as string,
    );
  },
);
