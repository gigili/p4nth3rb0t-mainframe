interface Config {
  broadcaster: string;
  drop: {
    minAccountAge: number;
  };
  emotes: {
    baseUrl: string;
    sizes: string[];
  };
  specialUsers: string[];
}

const config: Config = {
  broadcaster: "whitep4nth3r",
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
  ],
};

export { config };
