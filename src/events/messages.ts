import { tmi } from "./../tmi";
import { wsServer } from "../websocket";
import { ChatUserstate, Badges } from "tmi.js";
import { config } from "../config";
import { Packet, TwitchEvent } from "../data/types";
import { getCommandFromMessage, ChatCommands } from "../utils/commands";
import { isSillyQuestion } from "../utils/sillyQuestions";
import { TwitchChannel, Coders, Coder, ChatMessageData } from "../data/types";
import UserManager from "../users/UserManager";
import Team from "../users/Team";

// import { testConfig } from "../../testConfig";

let possibleTeamMember: Coder;
const teamMembers: Coders = Team.getUserNames();
const teamMembersGreeted: Coders = [];

const sendChatMessageEvent = async (data: ChatMessageData) => {
  try {
    const chatMessageEvent: Packet = {
      broadcaster: config.broadcaster,
      event: TwitchEvent.chatMessage,
      id: data.messageId,
      data,
    };

    wsServer.clients.forEach((client) => {
      client.send(JSON.stringify(chatMessageEvent));
    });
  } catch (error) {
    console.log(error);
  }
};

const sendteamMemberJoinEvent = async (coder: Coder) => {
  try {
    const user = await UserManager.getUser(coder.id as string);

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
  "chat",
  async (
    channel: string,
    tags: ChatUserstate,
    message: string,
    self: boolean
  ) => {
    if (config.ignoredUsers.includes(tags.username as string)) {
      return;
    }

    //todo - make into regex
    if (config.ignoredMessages.includes(message)) {
      return;
    }

    if (tags.username === config.broadcaster) {
      if (message === "!reset") {
        teamMembersGreeted.splice(0, teamMembersGreeted.length);
        tmi.say(
          config.channel,
          `${config.teamName} greetings cache has been reset. Current length of cache is ${teamMembersGreeted.length}.`
        );
      }
    }

    if (config.teamShoutoutEnabled) {
      const possibleTeamMember = teamMembers.find(
        (member) => member.name === tags.username
      );

      if (
        possibleTeamMember &&
        !teamMembersGreeted.includes(possibleTeamMember) &&
        possibleTeamMember.name !== config.broadcaster
      ) {
        const teamMemberChannel = await Team.getChannelById(
          possibleTeamMember.id
        );

        tmi.say(
          config.channel,
          Team.getWelcomeMessage(teamMemberChannel as TwitchChannel)
        );
        teamMembersGreeted.push(possibleTeamMember);
        sendteamMemberJoinEvent(possibleTeamMember);
      }
    }

    if (isSillyQuestion(message)) {
      tmi.say(config.channel, config.botResponses.SillyQuestion(tags.username));
    }

    const possibleCommand: string = getCommandFromMessage(message);
    const foundHandler = ChatCommands[possibleCommand];

    //if no 'command', send a chat message
    if (!foundHandler && !message.startsWith("!")) {
      const badges: Badges = tags.badges || {};
      const isMod: boolean = badges.moderator
        ? badges.moderator === "1"
        : false;

      const isVip: boolean = badges.vip ? badges.vip === "1" : false;

      const isSubscriber: boolean =
        (badges.subscriber ? badges.subscriber === "1" : false) ||
        (badges.premium ? badges.premium === "1" : false);

      const isBroadcaster: boolean = badges.broadcaster
        ? badges.broadcaster === "1"
        : false;

      const user = await UserManager.getUser(tags["user-id"] as string);

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
          ? possibleTeamMember !== undefined
          : false,
        emotes: tags.emotes,
      };

      await sendChatMessageEvent(chatMessageData);
      return;
    }

    foundHandler(tags, message);
  }
);
