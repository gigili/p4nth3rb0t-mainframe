interface Config {
  broadcaster: string;
  emotes: {
    baseUrl: string;
    sizes: string[];
  };
}

const config: Config = {
  broadcaster: "whitep4nth3r",
  emotes: {
    baseUrl: "https://static-cdn.jtvnw.net/emoticons/v1/",
    sizes: ["1.0", "2.0", "3.0"],
  },
};

export { config };
