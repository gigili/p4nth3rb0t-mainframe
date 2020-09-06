import { ChatUserstate } from "tmi.js";
import { sendDropUserEvent } from "../actions/drop";

export const getCommandFromMessage = (message: string) => message.split(" ")[0];

const getRestOfMessage = (message: string) => message.split(" ").slice(1);

type Handler = (tags: ChatUserstate, message: string) => void;

type Commands = {
  [key: string]: Handler;
};

const ChatCommands: Commands = {
  "!drop": (tags, message) => {
    // !drop me

    // TODO - only do user drop if this-
    // if (Date.now() - new Date(user.created_at) >= config.minAccountAge) {}

    if (getRestOfMessage(message)[0] === "me") {
      sendDropUserEvent(tags["user-id"] as string, tags["id"] as string);
    }
  },
  "!rain": () => {},
};

export { ChatCommands };
