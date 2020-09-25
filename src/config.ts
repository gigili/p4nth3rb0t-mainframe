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
      return `!today >> Hi there ${username}! You can use the following commands in chat to find out more: !project, !today, !who`;
    },
  },
};

export { config };
