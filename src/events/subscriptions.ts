import { testConfig } from "./../../testConfig";
import { wsServer } from "../websocket";
import { tmi } from "./../tmi";
import { ChatUserstate, Userstate } from "tmi.js";
import UserManager from "../users/UserManager";
import { Packet, TwitchEvent } from "../data/types";
import { config } from "../config";

//According to tmijs docs that is what is happening.
//Subgif is a gift to someone directly as in 1:1,
//where as mysterygift can be 1:N number of gifts given

const sendSubEvent = async (userId: string, messageId: string) => {
  try {
    const user = await UserManager.getUser(userId as string);

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

tmi.on(
  "anongiftpaidupgrade",
  (channel: string, username: string, userstate: Userstate) => {
    sendSubEvent(userstate["user-id"] as string, userstate["id"] as string);
  }
);

tmi.on(
  "giftpaidupgrade",
  (channel: string, username: string, sender: string, userstate: Userstate) => {
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
    userstate: Userstate
  ) => {
    testConfig.connectToFdgt
      ? sendSubEvent(testConfig.userId, testConfig.userId)
      : sendSubEvent(
          userstate["msg-param-recipient-id"] as string,
          userstate["id"] as string
        );
  }
);

tmi.on(
  "subscription",
  (
    channel: string,
    username: string,
    methods: {},
    message: string,
    userstate: Userstate
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
    userstate: Userstate,
    methods: {}
  ) => {
    sendSubEvent(userstate["user-id"] as string, userstate["id"] as string);
  }
);
