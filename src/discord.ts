import Discord, { MessageEmbed } from "discord.js";
import type { Channel, TextChannel } from "discord.js";
import { config } from "./config";
import UserManager from "./users/UserManager";
import { fetchGameById } from "./utils/twitchUtils";

export const discord = new Discord.Client();
let announcementsChannel: TextChannel;

discord.on("ready", async () => {
  console.log(`🤖 Logged in to Discord as ${discord.user?.username}!`);

  announcementsChannel = (await discord.channels.fetch(
    config.discord.liveAnnouncementsChannelId
  )) as TextChannel;
});

interface StreamInfo {
  "game_id": string,
  "id": string,
  "language": string,
  "started_at": string,
  "tag_ids": string[],
  "thumbnail_url": string,
  "title": string,
  "type": string,
  "user_id": string,
  "user_name": string,
  "viewer_count": number
};

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
    embed.setColor(config.discord.liveAnnouncementColor);
    const started_at = new Date(streamInfo.started_at);
    embed.setFooter(`Started streaming • Today at ${started_at.toTimeString()}`);

    announcementsChannel.send({
      content: `<@&${config.discord.liveAnnouncementsRoleId}> ${streamInfo.user_name} is now live on Twitch! https://twitch.tv/${streamInfo.user_name}`,
      embed
    });
  }
};
