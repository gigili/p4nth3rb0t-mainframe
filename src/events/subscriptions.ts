import { testConfig } from "./../../testConfig";
import { wsServer } from "../websocket";
import { tmi } from "./../tmi";
import { ChatUserstate } from "tmi.js";
import UserManager from "../users/UserManager";
import { Packet, TwitchEvent } from "../data/types";
import { config } from "../config";

const DEBUG = false;

const userManager = new UserManager();

//According to tmijs docs that is what is happening.
//Subgif is a gift to someone directly as in 1:1,
//where as mysterygift can be 1:N number of gifts given

const sendSubEvent = async (userId: string, messageId: string) => {
  try {
    const user = await userManager.getUser(userId as string);

    const subEvent: Packet = {
      broadcaster: config.broadcaster,
      event: TwitchEvent.sub,
      id: messageId,
      data: {
        logoUrl: user.logo as string,
      },
    };

    wsServer.clients.forEach((client) => {
      client.send(JSON.stringify(subEvent));
    });
  } catch (error) {
    console.log(error);
  }
};

if (DEBUG) {
  tmi.on(
    "message",
    async (
      channel: string,
      tags: ChatUserstate,
      message: string,
      self: boolean
    ) => {
      sendSubEvent(tags["user-id"] as string, tags["id"] as string);
    }
  );
}

tmi.on(
  "anongiftpaidupgrade",
  async (channel: string, username: string, userstate: ChatUserstate) => {
    sendSubEvent(userstate["user-id"] as string, userstate["id"] as string);
  }
);

tmi.on(
  "giftpaidupgrade",
  async (
    channel: string,
    username: string,
    sender: string,
    userstate: ChatUserstate
  ) => {
    sendSubEvent(userstate["user-id"] as string, userstate["id"] as string);
  }
);

tmi.on(
  "subgift",
  (
    channel: string,
    username: string,
    streakMonths: number,
    recipient: string,
    methods: {},
    userstate: ChatUserstate
  ) => {
    sendSubEvent(userstate["user-id"] as string, userstate["id"] as string);
  }
);

tmi.on(
  "subscription",
  (
    channel: string,
    username: string,
    methods: {},
    message: string,
    userstate: ChatUserstate
  ) => {
    testConfig.connectToFdgt
      ? sendSubEvent(testConfig.userId, testConfig.userId)
      : sendSubEvent(userstate["user-id"] as string, userstate["id"] as string);
  }
);

tmi.on(
  "resub",
  (
    channel: string,
    username: string,
    months: number,
    message: string,
    userstate: ChatUserstate,
    methods: {}
  ) => {
    sendSubEvent(userstate["user-id"] as string, userstate["id"] as string);
  }
);

tmi.on(
  "submysterygift",
  (
    channel: string,
    username: string,
    numbOfSubs: number,
    methods: {},
    userstate: ChatUserstate
  ) => {
    sendSubEvent(userstate["user-id"] as string, userstate["id"] as string);
  }
);
