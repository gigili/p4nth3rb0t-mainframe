import { tmi } from "./../tmi";
import { config } from "../config";
import { sendDropEmotesEvent } from "./../actions/drop";
import { ChatUserstate } from "tmi.js";
import {
  sendDropUserEvent,
  sendWeatherEvent,
  sendWeatherTrailEvent,
  sendYeetEvent,
  sendImageDropEvent,
} from "../actions/drop";
import { sendMoodChangeEvent } from "../events/moods";
import { sendShoutoutEvent } from "../events/shoutout";
import Giveaway from "../actions/Giveaway";
import { ImageDrops } from "../data/types";
import { sendMerchEvent } from "../events/merch";
import { sendBackseatEvent, sendClearBackSeatEvent } from "../events/backseat";
import { sendFreezeEvent } from "../events/freeze";

export const getCommandFromMessage = (message: string) => message.split(" ")[0];

export const getRestOfMessage = (message: string) =>
  message.split(" ").slice(1);

type Handler = (tags: ChatUserstate, message: string) => void;

type Commands = {
  [key: string]: Handler;
};

export const ExclusiveCommands: Commands = {};

export const BroadcasterCommands: Commands = {
  "!freeze": async (tags, message) => {
    tmi.say(config.channel, "p4nth3rRAID [DEFENCES UP] p4nth3rRAID");
    // toggle FREEZE_MODE
    config.FREEZE_MODE = true;
    // clear chat
    tmi.say(config.channel, "/clear");
    // activate sub only
    tmi.say(config.channel, "/subscribers");
    sendClearBackSeatEvent();
    sendFreezeEvent();
  },
  "!unfreeze": async (tags, message) => {
    tmi.say(config.channel, "p4nth3rMAGIC [DEFENCES DOWN] p4nth3rMAGIC");
    // toggle FREEZE_MODE
    config.FREEZE_MODE = false;
    // deactivate sub only
    tmi.say(config.channel, "/subscribersoff");
  },
  "!start-trail": async (tags, message) => {
    if (!config.FREEZE_MODE) {
      sendWeatherTrailEvent(true);
    }
  },
  "!end-trail": async (tags, message) => {
    if (!config.FREEZE_MODE) {
      sendWeatherTrailEvent(false);
    }
  },
  "!coffee": async (tags, message) => {
    if (!config.FREEZE_MODE) {
      sendMoodChangeEvent("coffee", tags["id"] as string);
    }
  },
  "!cool": async (tags, message) => {
    if (!config.FREEZE_MODE) {
      sendMoodChangeEvent("cool", tags["id"] as string);
    }
  },
  "!dolla": async (tags, message) => {
    if (!config.FREEZE_MODE) {
      sendMoodChangeEvent("dolla", tags["id"] as string);
    }
  },
  "!fire": async (tags, message) => {
    if (!config.FREEZE_MODE) {
      sendMoodChangeEvent("fire", tags["id"] as string);
    }
  },
  "!heart": async (tags, message) => {
    if (!config.FREEZE_MODE) {
      sendMoodChangeEvent("heart", tags["id"] as string);
    }
  },
  "!hype": async (tags, message) => {
    if (!config.FREEZE_MODE) {
      sendMoodChangeEvent("hype", tags["id"] as string);
    }
  },
  "!majick": async (tags, message) => {
    if (!config.FREEZE_MODE) {
      sendMoodChangeEvent("majick", tags["id"] as string);
    }
  },
  "!pewpew": async (tags, message) => {
    if (!config.FREEZE_MODE) {
      sendMoodChangeEvent("pewpew", tags["id"] as string);
    }
  },
  "!rap": async (tags, message) => {
    if (!config.FREEZE_MODE) {
      sendMoodChangeEvent("rap", tags["id"] as string);
    }
  },
  "!sad": async (tags, message) => {
    if (!config.FREEZE_MODE) {
      sendMoodChangeEvent("sad", tags["id"] as string);
    }
  },
  "!so": async (tags, message) => {
    if (!config.FREEZE_MODE) {
      sendShoutoutEvent(tags["id"] as string, message);
    }
  },
  "!star": async (tags, message) => {
    if (!config.FREEZE_MODE) {
      sendMoodChangeEvent("star", tags["id"] as string);
    }
  },
  "!tattoo": async (tags, message) => {
    if (!config.FREEZE_MODE) {
      sendMoodChangeEvent("tattoo", tags["id"] as string);
    }
  },
  "!troll": async (tags, message) => {
    if (!config.FREEZE_MODE) {
      sendMoodChangeEvent("troll", tags["id"] as string);
    }
  },
  "!merch": async (tags, message) => {
    if (!config.FREEZE_MODE) {
      sendMerchEvent(tags["id"] as string);
    }
  },
};

export const ChatCommands: Commands = {
  "!raidcall": async () => {
    if (!config.FREEZE_MODE) {
      tmi.say(
        config.channel,
        "p4nth3rRAID p4nth3rHYPE p4nth3rUP PANTHER RAID!!! p4nth3rRAID p4nth3rHYPE p4nth3rUP PANTHER RAID!!! p4nth3rRAID p4nth3rHYPE p4nth3rUP PANTHER RAID!!! p4nth3rRAID p4nth3rHYPE p4nth3rUP PANTHER RAID!!! p4nth3rRAID p4nth3rHYPE p4nth3rUP PANTHER RAID!!! p4nth3rRAID p4nth3rHYPE p4nth3rUP PANTHER RAID!!! p4nth3rRAID p4nth3rHYPE p4nth3rUP",
      );
    }
  },
  "!nobs": async (tags, message) => {
    sendClearBackSeatEvent();
  },
  "!bs": async (tags, message) => {
    if (!config.FREEZE_MODE) {
      const username = getRestOfMessage(message)[0]
        .replace("@", "")
        .toLowerCase();
      sendBackseatEvent(username);
    }
  },
  "!win": async (tags, message) => {
    if (!config.FREEZE_MODE) {
      if (Giveaway.inProgress()) {
        Giveaway.enter(tags.username as string);
      } else {
        console.log("here 2222");

        tmi.say(config.channel, Giveaway.getInactiveMessage());
      }
    }
  },
  "!bigdrop": async (tags, message) => {
    if (tags.emotes && !config.FREEZE_MODE) {
      sendDropEmotesEvent(
        Object.keys(tags.emotes) as [],
        true,
        tags["id"] as string,
        "!bigdrop",
      );
    }
  },
  "!drop": async (tags, message) => {
    if (!config.FREEZE_MODE) {
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
    }
  },
  "!rain": async (tags, message) => {
    if (!config.FREEZE_MODE) {
      sendWeatherEvent("!rain", tags["id"] as string);
    }
  },
  "!shower": async (tags, message) => {
    if (!config.FREEZE_MODE) {
      sendWeatherEvent("!shower", tags["id"] as string);
    }
  },
  "!snow": async (tags, message) => {
    if (!config.FREEZE_MODE) {
      sendWeatherEvent("!snow", tags["id"] as string);
    }
  },
  "!hail": async (tags, message) => {
    if (!config.FREEZE_MODE) {
      sendWeatherEvent("!hail", tags["id"] as string);
    }
  },
  "!blizzard": async (tags, message) => {
    if (!config.FREEZE_MODE) {
      sendWeatherEvent("!blizzard", tags["id"] as string);
    }
  },
  "!fire": async (tags, message) => {
    if (!config.FREEZE_MODE) {
      sendWeatherEvent("!fire", tags["id"] as string);
    }
  },
  "!yeet": async (tags, message) => {
    if (!config.FREEZE_MODE) {
      const userToYeet = getRestOfMessage(message);

      if (userToYeet[0] === "me" && tags["display-name"]) {
        sendYeetEvent(tags["display-name"], tags["id"] as string);
      } else if (userToYeet.length === 1) {
        sendYeetEvent(userToYeet[0].replace("@", ""), tags["id"] as string);
      }
    }
  },
  "!content": async (tags, message) => {
    if (!config.FREEZE_MODE) {
      tmi.say(
        config.channel,
        "Salma works in Developer Relations for Contentful. Find out more about Contentful at the Developer Portal: https://www.contentful.com/developers/",
      );
      sendImageDropEvent(ImageDrops.Contentful, tags["id"] as string);
    }
  },
  "!checkmark": async (tags, message) => {
    if (!config.FREEZE_MODE) {
      sendImageDropEvent(ImageDrops.Partner, tags["id"] as string);
    }
  },
  "!theclaw": async (tags, message) => {
    if (!config.FREEZE_MODE) {
      tmi.say(
        config.channel,
        "p4nth3rMOTH p4nth3rMOTH p4nth3rMOTH The Claw Stream Team has landed! https://twitch.tv/team/theclaw p4nth3rMOTH p4nth3rMOTH p4nth3rMOTH",
      );
      sendImageDropEvent(ImageDrops.TheClaw, tags["id"] as string);
    }
  },
  "!battlesnake": async (tags, message) => {
    if (!config.FREEZE_MODE) {
      sendImageDropEvent(ImageDrops.Battlesnake, tags["id"] as string);
    }
  },
};
