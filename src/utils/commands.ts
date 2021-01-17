import { tmi } from "./../tmi";
import { sendDropEmotesEvent } from "./../actions/drop";
import { ChatUserstate } from "tmi.js";
import { config } from "../config";
import {
  sendDropUserEvent,
  sendWeatherEvent,
  sendWeatherTrailEvent,
  sendYeetEvent,
  sendImageDropEvent,
} from "../actions/drop";
import { ImageDrops } from "../data/types";

export const getCommandFromMessage = (message: string) => message.split(" ")[0];

const getRestOfMessage = (message: string) => message.split(" ").slice(1);

type Handler = (tags: ChatUserstate, message: string) => void;

type Commands = {
  [key: string]: Handler;
};

const ChatCommands: Commands = {
  "!start-trail": async (tags, message) => {
    if (tags.username === config.broadcaster.name) {
      sendWeatherTrailEvent(true);
    }
  },
  "!end-trail": async (tags, message) => {
    if (tags.username === config.broadcaster.name) {
      sendWeatherTrailEvent(false);
    }
  },
  "!bigdrop": async (tags, message) => {
    if (tags.emotes) {
      sendDropEmotesEvent(
        Object.keys(tags.emotes) as [],
        true,
        tags["id"] as string,
        "!bigdrop",
      );
    }
  },
  "!drop": async (tags, message) => {
    if (tags.emotes) {
      sendDropEmotesEvent(
        Object.keys(tags.emotes) as [],
        false,
        tags["id"] as string,
        "!drop",
      );
    }

    // !drop me
    // TODO - only do user drop if this-
    // if (Date.now() - new Date(user.created_at) >= config.minAccountAge) {}

    if (getRestOfMessage(message)[0] === "me") {
      sendDropUserEvent(tags["user-id"] as string, tags["id"] as string);
    }
  },
  "!rain": async (tags, message) => {
    sendWeatherEvent("!rain", tags["id"] as string);
  },
  "!shower": async (tags, message) => {
    sendWeatherEvent("!shower", tags["id"] as string);
  },
  "!snow": async (tags, message) => {
    sendWeatherEvent("!snow", tags["id"] as string);
  },
  "!hail": async (tags, message) => {
    sendWeatherEvent("!hail", tags["id"] as string);
  },
  "!blizzard": async (tags, message) => {
    sendWeatherEvent("!blizzard", tags["id"] as string);
  },
  "!fire": async (tags, message) => {
    sendWeatherEvent("!fire", tags["id"] as string);
  },
  "!yeet": async (tags, message) => {
    const userToYeet = getRestOfMessage(message);

    if (userToYeet[0] === "me" && tags["display-name"]) {
      sendYeetEvent(tags["display-name"], tags["id"] as string);
    } else if (userToYeet.length === 1) {
      sendYeetEvent(userToYeet[0].replace("@", ""), tags["id"] as string);
    }
  },
  "!content": async (tags, message) => {
    tmi.say(
      config.channel,
      "Salma is a Developer Evangelist for Contentful. Find out more about Contentful at the Developer Portal: https://www.contentful.com/developers/",
    );
    sendImageDropEvent(ImageDrops.Contentful, tags["id"] as string);
  },
};

export { ChatCommands };
