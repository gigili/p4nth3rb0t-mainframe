import { ChatUserstate } from "tmi.js";
import { sendDropUserEvent, sendWeatherEvent } from "../actions/drop";

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
  "!rain": (tags, message) => {
    sendWeatherEvent("!rain", tags["id"] as string);
  },
  "!shower": (tags, message) => {
    sendWeatherEvent("!shower", tags["id"] as string);
  },
  "!snow": (tags, message) => {
    sendWeatherEvent("!snow", tags["id"] as string);
  },
  "!hail": (tags, message) => {
    sendWeatherEvent("!hail", tags["id"] as string);
  },
  "!blizzard": (tags, message) => {
    sendWeatherEvent("!blizzard", tags["id"] as string);
  },
};

export { ChatCommands };
