import { tmi } from "./../tmi";
import { wsServer } from "../websocket";
import { ChatUserstate } from "tmi.js";
import { config } from "../config";
import { Packet, TwitchEvent } from "../data/types";
import { getCommandFromMessage, ChatCommands } from "../utils/commands";
import { isSillyQuestion } from "../utils/sillyQuestions";
import { TwitchChannel, Coders, Coder } from "../data/types";

import { testConfig } from "../../testConfig";

import UserManager from "../users/UserManager";
const userManager = new UserManager();

import Team from "../users/Team";

let teamMembers: Coders = [];
const teamMembersGreeted: Coders = [];

const teamMembersPromise = Team.getUserNames();
teamMembersPromise.then((res) => (teamMembers = res));

const sendteamMemberJoinEvent = async (coder: Coder) => {
  try {
    const user = await userManager.getUser(coder.id as string);

    const teamMemberJoin: Packet = {
      broadcaster: config.broadcaster,
      event: TwitchEvent.teamMemberJoin,
      id: coder.name + "-" + Date.now(),
      data: {
        logoUrl: user.logo,
      },
    };

    wsServer.clients.forEach((client) => {
      client.send(JSON.stringify(teamMemberJoin));
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
        tmi.say(
          config.channel,
          `${config.teamName} greetings cache has been reset. Current length of cache is ${teamMembersGreeted.length}.`
        );
      }
    }

    const possibleTeamMember = teamMembers.find(
      (member) => member.name === tags.username
    );

    if (
      possibleTeamMember &&
      !teamMembersGreeted.includes(possibleTeamMember) &&
      possibleTeamMember.name !== config.broadcaster
    ) {
      const liveCoderChannel = await Team.getChannelById(possibleTeamMember.id);

      tmi.say(
        config.channel,
        Team.getWelcomeMessage(liveCoderChannel as TwitchChannel)
      );
      teamMembersGreeted.push(possibleTeamMember);
      sendteamMemberJoinEvent(possibleTeamMember);
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
