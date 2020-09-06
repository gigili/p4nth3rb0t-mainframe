import { tmi } from "./../tmi";
import { ChatUserstate } from "tmi.js";

import { getCommandFromMessage, ChatCommands } from "../utils/commands";

tmi.on(
  "message",
  async (
    channel: string,
    tags: ChatUserstate,
    message: string,
    self: boolean
  ) => {
    const possibleCommand: string = getCommandFromMessage(message);
    const foundHandler = ChatCommands[possibleCommand];

    if (!foundHandler) {
      return;
    }

    foundHandler(tags, message);
  }
);
