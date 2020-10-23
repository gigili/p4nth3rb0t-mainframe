import Discord, { MessageEmbed } from "discord.js";
import type { TextChannel } from "discord.js";
import { config } from "./config";
import UserManager from "./users/UserManager";
import { fetchGameById, fetchVideoByUserId } from "./utils/twitchUtils";
import DiscordAnnouncementModel from "./data/models/DiscordAnnouncement";
import type { StreamInfo } from './data/types';

export const discord = new Discord.Client();
let announcementsChannel: TextChannel;

discord.on("ready", async () => {
  console.log(`🤖 Logged in to Discord as ${discord.user?.username}!`);

  announcementsChannel = (await discord.channels.fetch(
    config.discord.liveAnnouncementsChannelId
  )) as TextChannel;
});



export const sendLiveAnnouncement = async (streamInfo: StreamInfo) => {
  if (announcementsChannel) {
    const user = await UserManager.getUserById(streamInfo.user_id);

    const embed = new MessageEmbed();
    embed.setAuthor(user.display_name, user.logo);
    embed.setTitle(`${streamInfo.title}`);
    embed.setURL(`https://twitch.tv/${streamInfo.user_name}`);
    embed.setThumbnail(user.logo);
    embed.setDescription(`Category\n**${(await fetchGameById(streamInfo.game_id))?.name}**`);
    embed.setImage(streamInfo.thumbnail_url.replace("{width}x{height}", config.discord.liveAnnouncementImageSize));
    embed.setColor(config.discord.liveAnnouncementColorOnline);
    const started_at = new Date(streamInfo.started_at);
    embed.setFooter(`Started streaming • Today at ${started_at.toTimeString()}`);

    const message = await announcementsChannel.send({
      content: ` ${streamInfo.user_name} is now live on Twitch! https://twitch.tv/${streamInfo.user_name}`,
      embed
    });
    // <@&${config.discord.liveAnnouncementsRoleId}>
    await DiscordAnnouncementModel.create({
      memberId: streamInfo.user_id,
      messageId: message.id
    });
  }
};

export const sendOfflineAnnouncement = async (member_id: string) => {

  const video = await fetchVideoByUserId(member_id);
  if (!video) {
    return;
  }
  const saved_message = (await DiscordAnnouncementModel.findOne({ "memberId": member_id }));
  if (!saved_message) {
    return;
  }
  const message = await announcementsChannel.messages.fetch(`${saved_message.messageId}`);

  const user = await UserManager.getUserById(member_id);

  const embed = new MessageEmbed();
  embed.setAuthor(user.display_name, user.logo);
  embed.setTitle(video.title);
  embed.setURL(`https://twitch.tv/videos/${video.id}`);
  embed.setThumbnail(user.logo);    
  embed.setImage(video.thumbnail_url.replace("%{width}x%{height}", config.discord.liveAnnouncementImageSize));
  embed.setColor(config.discord.liveAnnouncementColorOffline);
  embed.setFooter(`Finished streaming • Streamed for ${video.duration}`);

  await message.edit({
    content: `${user.display_name} was online!`,
    embed
  });
}