import { tmi } from "./../tmi";
import WebSocketServer from "../WebSocketServer";
import { config } from "../config";
import UserManager from "../users/UserManager";
import { MainframeEvent, RaidPacket } from "@whitep4nth3r/p4nth3rb0t-types";
import Moods, { sendMoodChangeEvent } from "./moods";
import { sendTimerEvent } from "./timer";
import { sendShoutoutEvent } from "./shoutout";

const getRaidShoutout = (username: string, viewers: number): string => {
  return `p4nth3rPEWPEW Welcome to ${viewers} raiders! Thank you for the raid @${username}! Check out their channel at https://twitch.tv/${username} p4nth3rPEWPEW`;
};

const sendRaidEvent = async (raiderCount: number, username: string) => {
  await sendTimerEvent(5, "follower-only chat disabled");

  const user = await UserManager.getUserByLogin(username as string);

  try {
    const raidEvent: RaidPacket = {
      event: MainframeEvent.raid,
      id: username + "-" + raiderCount,
      data: {
        raiderCount: raiderCount,
        raider: username,
        logoUrl: user.users[0].logo,
      },
    };

    WebSocketServer.sendData(raidEvent);

    setTimeout(async () => {
      const newRandomMood: string = Moods.getRandomNewMood();
      await sendMoodChangeEvent(newRandomMood, Date.now().toString());
    }, 3500);

    setTimeout(async () => {
      sendShoutoutEvent(user.users[0]._id, `!so ${user.users[0].name}`);
    }, 7000);

    setTimeout(() => {
      tmi.say(
        config.channel,
        "p4nth3rPEWPEW Engaging followers only chat! p4nth3rPEWPEW ",
      );
      tmi.say(config.channel, "/followers 0");
    }, 300000);
  } catch (error) {
    console.log(error);
  }
};

tmi.on("raided", (channel: string, username: string, viewers: number) => {
  tmi.say(config.channel, getRaidShoutout(username, viewers));
  sendRaidEvent(viewers, username);
  tmi.say(
    config.channel,
    "p4nth3rPEWPEW Disengaging followers only chat! Welcome in everyone! p4nth3rPEWPEW ",
  );
  tmi.say(config.channel, "/followersoff");
});
