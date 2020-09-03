export const getCommandFromMessage = (message: string) => message.split(" ")[0];

export const getRestOfMessage = (message: string) =>
  message.split(" ").slice(1);

export const ChatCommands = ["!drop"];
