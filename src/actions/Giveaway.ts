import WebSocketServer from "../WebSocketServer";
import { Packet, TwitchEvent } from "../data/types";
import { config } from "../config";
import UserManager from "../users/UserManager";

const sendGiveawayStartEvent = async () => {
  try {
    const giveawayStartEvent: Packet = {
      broadcaster: config.broadcaster.name,
      event: TwitchEvent.startGiveaway,
      id: `giveaway-start${Math.random()}`,
      data: {},
    };

    WebSocketServer.sendData(giveawayStartEvent);
  } catch (error) {
    console.log(error);
  }
};

const sendGiveawayEndEvent = async () => {
  try {
    const giveawayEndEvent: Packet = {
      broadcaster: config.broadcaster.name,
      event: TwitchEvent.endGiveaway,
      id: `giveaway-end${Math.random()}`,
      data: {},
    };

    WebSocketServer.sendData(giveawayEndEvent);
  } catch (error) {
    console.log(error);
  }
};

const sendGiveawayEnterEvent = async (username: string) => {
  const user = await UserManager.getUserByLogin(username);

  try {
    const enterGiveawayEvent: Packet = {
      broadcaster: config.broadcaster.name,
      event: TwitchEvent.enterGiveaway,
      id: `giveaway-enter${Math.random()}`,
      data: {
        username,
        logoUrl: user.users[0].logo.replace("300x300", "50x50"),
      },
    };

    WebSocketServer.sendData(enterGiveawayEvent);
  } catch (error) {
    console.log(error);
  }
};

const sendGiveawayDrawEvent = async (winner: string) => {
  try {
    const drawGiveawayEvent: Packet = {
      broadcaster: config.broadcaster.name,
      event: TwitchEvent.drawGiveaway,
      id: `giveaway${Math.random()}`,
      data: {
        winner,
      },
    };

    WebSocketServer.sendData(drawGiveawayEvent);
  } catch (error) {
    console.log(error);
  }
};

export default class Giveaway {
  static isOpen: boolean = false;
  static entrants: Set<string> = new Set();

  static open = () => {
    Giveaway.entrants.clear();
    Giveaway.isOpen = true;
    sendGiveawayStartEvent();
  };

  static close = () => {
    Giveaway.isOpen = false;
    Giveaway.entrants.clear();
    sendGiveawayEndEvent();
  };

  static inProgress = () => {
    return Giveaway.isOpen === true;
  };

  static enter = (username: string) => {
    if (!Giveaway.entrants.has(username)) {
      sendGiveawayEnterEvent(username);
    }

    Giveaway.entrants.add(username);
  };

  static draw = () => {
    const usernamesArray: string[] = Array.from(Giveaway.entrants);
    const winner =
      usernamesArray[Math.floor(Math.random() * usernamesArray.length)];

    sendGiveawayDrawEvent(winner);
    Giveaway.entrants.delete(winner);

    return winner;
  };
}
