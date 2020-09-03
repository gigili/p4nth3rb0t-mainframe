import { wsServer } from "../websocket";
import { tmi } from "./../tmi";
import { ChatUserstate } from "tmi.js";
import UserManager from "../users/UserManager";
import {
  getCommandFromMessage,
  getRestOfMessage,
  ChatCommands,
} from "../utils/commands";
import { SocketPacket, TwitchEvent } from "../types";

const userManager = new UserManager();

const sendDropUserEvent = async (userId: string) => {
  try {
    const user = await userManager.getUser(userId as string);

    // TODO - only do user drop if this-
    // if (Date.now() - new Date(user.created_at) >= config.minAccountAge) {}

    const dropUserEvent: SocketPacket = {
      broadcaster: "sdfsdf",
      event: TwitchEvent.dropUser,
      id: "sdfsdf",
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

tmi.on(
  "message",
  async (
    channel: string,
    tags: ChatUserstate,
    message: string,
    self: boolean
  ) => {
    const possibleCommand = getCommandFromMessage(message);
    const foundCommand = ChatCommands.find(
      (command) => possibleCommand === command
    );

    if (!foundCommand) {
      return;
    }

    if (getRestOfMessage(message)[0] === "me") {
      sendDropUserEvent(tags["user-id"] as string);
    }
  }
);
