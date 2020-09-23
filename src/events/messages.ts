import { tmi } from "./../tmi";
import { wsServer } from "../websocket";
import { ChatUserstate } from "tmi.js";
import { config } from "../config";
import { Packet, TwitchEvent } from "../types";
import { getCommandFromMessage, ChatCommands } from "../utils/commands";
import { isSillyQuestion } from "../utils/sillyQuestions";
import UserManager from "../users/UserManager";
import LiveCoders, { Coders, Coder } from "../users/LiveCoders";

const userManager = new UserManager();

const liveCoders = new LiveCoders();
let teamMembers: Coders = [];
const teamMembersGreeted: Coders = [];

const teamMembersPromise = liveCoders.getUserNames();
teamMembersPromise.then((res) => (teamMembers = res));

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
      //https://github.com/CodingGarden/twitch-team-shoutout-bot/blob/master/src/twitchAPI.js
      //https://github.com/CodingGarden/twitch-team-shoutout-bot/blob/master/src/config.js
      tmi.say(
        config.channel,
        `whitep30PEWPEW Live Coder detected! 👋 Hello there, @${possibleLiveCoder.name}! Check out their channel here: https://twitch.tv/${possibleLiveCoder.name}`
      );
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
