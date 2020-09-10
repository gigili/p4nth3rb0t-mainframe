import { tmi } from "./../tmi";
import { ChatUserstate } from "tmi.js";
import { config } from "../config";
import { getCommandFromMessage, ChatCommands } from "../utils/commands";

// please describe the evening's plan in detail, kindest regards
// to whom this concerns would you kindly explain what is the purpose of your live streaming event this fine evening
const wordTetris = {
  what: [
    "what",
    "wut",
    "wot",
    "wat",
    "wht",
    "whaat",
    "vat",
    "why",
    "whut",
    "vvhat",
    "waat",
    "w4t",
    "twaat",
  ],
  are: ["are", "r", "ar", "ae", "re", "array", "4re"],
  you: ["you", "yu", "yo", "u", "yoo", "yuu", "yew", "ewe", "uu", "uyo"],
  doing: ["doing", "doin", "dooing", "doign", "ding", "dong", "dwoing"],
  working: ["working", "woring", "coding"],
};

const isSillyQuestion = (message: string): boolean => {
  return (
    message
      .replace("?", "")
      .replace("how", "")
      .split(" ")
      .map(
        (word) =>
          wordTetris.what.includes(word) ||
          wordTetris.are.includes(word) ||
          wordTetris.you.includes(word) ||
          wordTetris.doing.includes(word) ||
          wordTetris.working.includes(word)
      )
      .filter(Boolean).length >= 4
  );
};

tmi.on(
  "message",
  async (
    channel: string,
    tags: ChatUserstate,
    message: string,
    self: boolean
  ) => {
    if (isSillyQuestion(message)) {
      tmi.say(config.channel, config.botResponses.SillyQuestion(tags.username));
    }

    const possibleCommand: string = getCommandFromMessage(message);
    const foundHandler = ChatCommands[possibleCommand];

    if (!foundHandler) {
      return;
    }

    foundHandler(tags, message);
  }
);
