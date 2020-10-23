import Discord from "discord.js";

export const discord = new Discord.Client();

discord.on("ready", () => {
  console.log(`Logged in as ${discord.user?.username}!`);
});

discord.on("message", (msg) => {
  if (msg.content === "ping") {
    msg.reply("pong");
  }
});
