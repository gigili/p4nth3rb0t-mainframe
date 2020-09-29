import { sendDropEmotesEvent } from "./../actions/drop";
import { ChatUserstate } from "tmi.js";
import { config } from "../config";
import {
  sendDropUserEvent,
  sendWeatherEvent,
  sendWeatherTrailEvent,
} from "../actions/drop";

export const getCommandFromMessage = (message: string) => message.split(" ")[0];

const getRestOfMessage = (message: string) => message.split(" ").slice(1);

type Handler = (tags: ChatUserstate, message: string) => void;

type Commands = {
  [key: string]: Handler;
};

const ChatCommands: Commands = {
  "!start-trail": (tags, message) => {
    if (tags.username === config.broadcaster) {
      sendWeatherTrailEvent(true);
    }
  },
  "!end-trail": (tags, message) => {
    if (tags.username === config.broadcaster) {
      sendWeatherTrailEvent(false);
    }
  },
  "!bigdrop": (tags, message) => {
    // !drop emotes
    if (tags.emotes) {
      sendDropEmotesEvent(
        Object.keys(tags.emotes) as [],
        true,
        tags["id"] as string,
        "!bigdrop"
      );
    }
  },
  "!drop": (tags, message) => {
    if (tags.emotes) {
      sendDropEmotesEvent(
        Object.keys(tags.emotes) as [],
        false,
        tags["id"] as string,
        "!drop"
      );
    }

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
  "!fire": (tags, message) => {
    sendWeatherEvent("!fire", tags["id"] as string);
  },
};

export { ChatCommands };
