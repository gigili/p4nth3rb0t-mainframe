import Discord from "discord.js";
import type { Channel, TextChannel } from "discord.js";
import { config } from "./config";

export const discord = new Discord.Client();
let announcementsChannel: TextChannel;

discord.on("ready", async () => {
  console.log(`🤖 Logged in to Discord as ${discord.user?.username}!`);

  announcementsChannel = (await discord.channels.fetch(
    config.discord.liveAnnouncementsChannelId
  )) as TextChannel;
});

export const sendLiveAnnouncement = (streamerName: string) => {
  if (announcementsChannel) {
    announcementsChannel.send(`${streamerName} is live!`);
  }
};
