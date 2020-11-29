import { tmi } from "./../tmi";
import WebSocketServer from "../WebSocketServer";
import { ChatUserstate } from "tmi.js";
import { config } from "../config";
import { Packet, TwitchEvent } from "../data/types";
import { getCommandFromMessage, ChatCommands } from "../utils/commands";
import { isSillyQuestion } from "../utils/sillyQuestions";
import {
  TwitchChannel,
  TeamMembers,
  TeamMember,
  ChatMessageData,
  MyBadges,
} from "../data/types";
import UserManager from "../users/UserManager";
import Team from "../users/Team";

let possibleTeamMember: TeamMember | undefined;
const teamMembers: TeamMembers = Team.getUserNames();
const teamMembersGreeted: TeamMembers = [];

const sendChatMessageEvent = async (data: ChatMessageData) => {
  try {
    const chatMessageEvent: Packet = {
      broadcaster: config.broadcaster.name,
      event: TwitchEvent.chatMessage,
      id: data.messageId,
      data,
    };

    WebSocketServer.sendData(chatMessageEvent);
  } catch (error) {
    console.log(error);
  }
};

const sendteamMemberJoinEvent = async (teamMember: TeamMember) => {
  try {
    const user = await UserManager.getUserById(teamMember.id as string);

    const teamMemberJoin: Packet = {
      broadcaster: config.broadcaster.name,
      event: TwitchEvent.teamMemberJoin,
      id: teamMember.name + "-" + Date.now(),
      data: {
        logoUrl: user.logo,
      },
    };

    WebSocketServer.sendData(teamMemberJoin);
  } catch (error) {
    console.log(error);
  }
};

tmi.on(
  "chat",
  async (
    channel: string,
    tags: ChatUserstate,
    message: string,
    self: boolean,
  ) => {
    if (config.ignoredUsers.includes(tags.username as string)) {
      return;
    }

    if (config.ignoredMessages.includes(message)) {
      return;
    }

    if (tags.username === config.broadcaster.name) {
      if (message === "!reset") {
        teamMembersGreeted.splice(0, teamMembersGreeted.length);
        tmi.say(
          config.channel,
          `${config.teamName} greetings cache has been reset. Current length of cache is ${teamMembersGreeted.length}.`,
        );
      }
    }

    if (config.teamShoutoutEnabled && process.env.NODE_ENV === "production") {
      possibleTeamMember = teamMembers.find(
        (member) => member.name === tags.username,
      );

      if (
        possibleTeamMember &&
        !teamMembersGreeted.includes(possibleTeamMember) &&
        possibleTeamMember.name !== config.broadcaster.name
      ) {
        const teamMemberChannel = await Team.getChannelById(
          possibleTeamMember.id,
        );

        tmi.say(
          config.channel,
          Team.getWelcomeMessage(teamMemberChannel as TwitchChannel),
        );
        teamMembersGreeted.push(possibleTeamMember);
        sendteamMemberJoinEvent(possibleTeamMember);
      }
    }

    if (isSillyQuestion(message)) {
      tmi.say(config.channel, config.botResponses.SillyQuestion(tags.username));
    }

    const possibleCommand: string = getCommandFromMessage(
      message,
    ).toLowerCase();
    const foundHandler = ChatCommands[possibleCommand];

    if (typeof foundHandler === "function") {
      foundHandler(tags, message);
    } else if (!message.startsWith("!")) {
      //if no 'command', send a chat message
      const badges: MyBadges = tags.badges || {};
      const isMod: boolean = tags.mod || false;
      const isSubscriber: boolean =
        tags.subscriber || badges.founder !== undefined || false;
      const isVip: boolean = badges.vip ? badges.vip === "1" : false;

      const isBroadcaster: boolean = badges.broadcaster
        ? badges.broadcaster === "1"
        : false;

      const user = await UserManager.getUserById(tags["user-id"] as string);

      const chatMessageData: ChatMessageData = {
        userId: tags["user-id"] as string,
        username: tags.username as string,
        displayName: tags["display-name"] as string,
        messageId: tags.id as string,
        message: message as string,
        logoUrl: user.logo,
        isMod,
        isVip,
        isSubscriber,
        isBroadcaster,
        isTeamMember: config.teamShoutoutEnabled
          ? possibleTeamMember !== undefined || isBroadcaster
          : false,
        emotes: tags.emotes,
        type: tags["message-type"],
        id: tags["id"],
      };

      await sendChatMessageEvent(chatMessageData);
    }
  },
);
