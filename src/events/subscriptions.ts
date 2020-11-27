import { testConfig } from "./../../testConfig";
import WebSocketServer from "../WebSocketServer";
import { tmi } from "./../tmi";
import { Userstate } from "tmi.js";
import UserManager from "../users/UserManager";
import { Packet, TwitchEvent } from "../data/types";
import { config } from "../config";

// I'm confused
// I don't think we want this
const sendGiftSubEvent = async (
  userId: string,
  messageId: string,
  subscriberUsername: string,
  subTier: string,
  gifterUsername?: string,
) => {
  const gifter = !gifterUsername ? "" : gifterUsername;

  try {
    const user = await UserManager.getUserById(userId as string);

    const giftSubEvent: Packet = {
      broadcaster: config.broadcaster.name,
      event: TwitchEvent.sub,
      id: messageId,
      data: {
        logoUrl: user.logo as string,
        subscriberUsername,
        gifterUsername: gifter,
        subTier,
      },
    };

    WebSocketServer.sendData(giftSubEvent);
  } catch (error) {
    console.log(error);
  }
};

const sendSubEvent = async (
  userId: string,
  username: string,
  messageId: string,
  message: string,
  subTier: string,
  months?: number,
) => {
  try {
    const user = await UserManager.getUserById(userId as string);

    const subEvent: Packet = {
      broadcaster: config.broadcaster.name,
      event: TwitchEvent.sub,
      id: messageId,
      data: {
        logoUrl: user.logo,
        subscriberUsername: username,
        subTier,
        message,
        months,
      },
    };

    WebSocketServer.sendData(subEvent);
  } catch (error) {
    console.log(error);
  }
};

//TODO ADD MYSTERY GIFT?
//According to tmijs docs that is what is happening.
//Subgif is a gift to someone directly as in 1:1,
//where as mysterygift can be 1:N number of gifts given

tmi.on(
  "anongiftpaidupgrade",
  (channel: string, username: string, userstate: Userstate) => {
    sendGiftSubEvent(
      userstate["user-id"] as string,
      userstate["id"] as string,
      userstate["msg-param-recipient-user-name"],
      "subtier",
    );
  },
);

tmi.on(
  "giftpaidupgrade",
  (channel: string, username: string, sender: string, userstate: Userstate) => {
    sendGiftSubEvent(
      userstate["user-id"] as string,
      userstate["id"] as string,
      userstate["msg-param-recipient-user-name"],
      "subtier",
    );
  },
);

tmi.on(
  "subgift",
  (
    channel: string,
    username: string,
    streakMonths: number,
    recipient: string,
    methods: {},
    userstate: Userstate,
  ) => {
    testConfig.connectToFdgt
      ? sendGiftSubEvent(
          testConfig.userId,
          testConfig.username,
          testConfig.userId,
          "1",
        )
      : sendGiftSubEvent(
          userstate["user-id"] as string,
          userstate["id"] as string,
          userstate["msg-param-recipient-user-name"],
          "subtier",
        );
  },
);

tmi.on(
  "subscription",
  (
    channel: string,
    username: string,
    methods: {},
    message: string,
    userstate: Userstate,
  ) => {
    testConfig.connectToFdgt
      ? sendSubEvent(
          testConfig.userId,
          testConfig.username,
          testConfig.userId,
          "test message",
          "1",
        )
      : sendSubEvent(
          userstate["user-id"] as string,
          userstate["username"] as string,
          userstate["id"] as string,
          message,
          "1",
        );
  },
);

tmi.on(
  "resub",
  (
    channel: string,
    username: string,
    months: number,
    message: string,
    userstate: Userstate,
    methods: {},
  ) => {
    sendSubEvent(
      userstate["user-id"] as string,
      userstate["username"] as string,
      userstate["id"] as string,
      message,
      "1",
      months,
    );
  },
);
