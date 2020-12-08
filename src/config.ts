import { TwitchChannel, TeamMember } from "./data/types";

interface Config {
  broadcaster: TeamMember;
  channel: string;
  drop: {
    minAccountAge: number;
  };
  emotes: {
    baseUrl: string;
    sizes: string[];
  };
  specialUsers: string[];
  ignoredUsers: string[];
  ignoredCharacters: string[];
  ignoredWords: string[];
  ignoredMessages: string[];
  botResponses: any;
  teamShoutoutEnabled: boolean;
  teamName: string;
  teamMembers: TeamMember[];
  teamWelcomeMessage: (channel: TwitchChannel) => string;
  discord: {
    liveAnnouncementsChannelId: string;
    liveAnnouncementsRoleId: string;
    liveAnnouncementColorOnline: string;
    liveAnnouncementColorOffline: string;
    liveAnnouncementImageSize: string;
  };
}

const config: Config = {
  broadcaster: { name: "whitep4nth3r", id: "469006291" },
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
    "rawwwrs",
    "laylacodesit",
  ],
  ignoredUsers: ["nightbot", "pretzelrocks", "p4nth3rb0t"],
  ignoredCharacters: ["a̞", "s̾", "ȯ", "a̹", "u͖"],
  ignoredWords: ["bigfollows"],
  ignoredMessages: [
    "Twitch Themer is ready to go. Listening for commands beginning with !theme",
    "Twitch Highlighter in the house!",
  ],
  botResponses: {
    SillyQuestion: (username: string) => {
      return `Hi there ${username}! You can use the following commands in chat to find out more: !project, !today, !who`;
    },
  },
  teamShoutoutEnabled: true,
  teamName: "The Claw",
  teamMembers: [
    {
      name: "baldbeardedbuilder",
      id: "279965339",
    },
    {
      name: "cadillacjack1",
      id: "501793804",
    },
    {
      name: "canhorn",
      id: "60218113",
    },
    {
      name: "codejuration",
      id: "25116716",
    },
    {
      name: "codingwithluce",
      id: "199566394",
    },
    {
      name: "contentfuldevs",
      id: "576507866",
    },
    {
      name: "cowboy_salmon",
      id: "113485816",
    },
    {
      name: "exegete46",
      id: "40856022",
    },
    {
      name: "gacbl",
      id: "120572949",
    },
    {
      name: "jwalter",
      id: "50911906",
    },
    {
      name: "laylacodesit",
      id: "260151116",
    },
    {
      name: "madhousesteve",
      id: "76884091",
    },
    {
      name: "rawwwrs",
      id: "166942660",
    },
    {
      name: "ryantupo",
      id: "158165150",
    },
    {
      name: "ryan_the_rhg",
      id: "154364425",
    },
    {
      name: "sadmoody",
      id: "28493092",
    },
    {
      name: "sketchni",
      id: "64115778",
    },
    {
      name: "thatn00b__",
      id: "235952406",
    },
    {
      name: "greg_holmes",
      id: "93948214",
    },
  ],
  teamWelcomeMessage: (channel: TwitchChannel): string => {
    return `whitep30PEWPEW ${config.teamName} team member detected! 
    PEW PEW, @${channel.broadcaster_name}! 
    Check out their channel here: https://twitch.tv/${channel.broadcaster_name} 
    | They were last seen streaming ${channel.title} in ${channel.game_name} whitep30PEWPEW`;
  },
  discord: {
    liveAnnouncementsChannelId: "770041334534635520",
    liveAnnouncementsRoleId: "756956508234842145",
    liveAnnouncementColorOnline: "#84AE39",
    liveAnnouncementColorOffline: "#AE8439",
    liveAnnouncementImageSize: "1280x720",
  },
};

export { config };
