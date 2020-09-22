import { tmi } from "./../tmi";
import { wsServer } from "../websocket";
import { ChatUserstate } from "tmi.js";
import { config } from "../config";
import { Packet, TwitchEvent } from "../types";
import { getCommandFromMessage, ChatCommands } from "../utils/commands";
import UserManager from "../users/UserManager";
import LiveCoders, { Coders, Coder } from "../users/LiveCoders";

const userManager = new UserManager();

const liveCoders = new LiveCoders();
let teamMembers: Coders = [];

const teamMembersPromise = liveCoders.getUserNames();
teamMembersPromise.then((res) => (teamMembers = res));

const teamMembersGreeted: Coders = [];

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

const sendLiveCoderJoinEvent = async (coder: Coder) => {
  try {
    const user = await userManager.getUser(coder.id as string);

    const liveCoderJoin: Packet = {
      broadcaster: config.broadcaster,
      event: TwitchEvent.liveCoderJoin,
      id: coder.name + "-" + Date.now(),
      data: {
        logoUrl: user.logo,
      },
    };

    wsServer.clients.forEach((client) => {
      client.send(JSON.stringify(liveCoderJoin));
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
    if (tags.username === config.broadcaster) {
      if (message === "!reset") {
        teamMembersGreeted.splice(0, teamMembersGreeted.length);
      }
    }

    const possibleLiveCoder = teamMembers.find(
      (member) => member.name === tags.username
    );

    if (
      possibleLiveCoder &&
      !teamMembersGreeted.includes(possibleLiveCoder) &&
      possibleLiveCoder.name !== config.broadcaster
    ) {
      tmi.say(config.channel, `Yo, ${possibleLiveCoder.name}!`);
      teamMembersGreeted.push(possibleLiveCoder);
      sendLiveCoderJoinEvent(possibleLiveCoder);
    }

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
