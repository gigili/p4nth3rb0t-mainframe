interface Config {
  broadcaster: string;
  channel: string;
  drop: {
    minAccountAge: number;
  };
  emotes: {
    baseUrl: string;
    sizes: string[];
  };
  specialUsers: string[];
  botResponses: any;
}

const config: Config = {
  broadcaster: "whitep4nth3r",
  channel: "#whitep4nth3r",
  drop: {
    minAccountAge: 7 * 24 * 60 * 60 * 1000,
  },
  emotes: {
    baseUrl: "https://static-cdn.jtvnw.net/emoticons/v1/",
    sizes: ["1.0", "2.0", "3.0"],
  },
  specialUsers: [
    "thatn00b__",
    "baldbeardedbuilder",
    "codingwithluce",
    "madhousesteve",
    "melkeydev",
    "rawrsatbeards",
  ],
  botResponses: {
    SillyQuestion: (username: string) => {
      return `Hi there ${username}! 
      It looks like you're trying to find out what we're doing!
      Sit back, relax, and watch for a few minutes to see what's going on.
      If you're still not sure, you can use the following commands in chat to find out more: 
      !project, !today, !who`;
    },
  },
};

export { config };
