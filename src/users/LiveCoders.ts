import axios from "axios";

export type Coder = {
  name: string;
  id: string;
};

export type Coders = Coder[];

type TeamResponse = {
  data: {
    users: [
      {
        name: string;
        _id: string;
      }
    ];
  };
};

export default class LiveCoders {
  //TODO: some kind of cache expiry
  cache: Coders = [];

  async getUserNames(): Promise<Coders> {
    if (this.cache.length > 0) {
      return this.cache;
    }

    const response = await axios.get<any, TeamResponse>(
      "https://api.twitch.tv/kraken/teams/livecoders",
      {
        headers: {
          "client-id": process.env.CLIENT_ID,
          accept: "application/vnd.twitchtv.v5+json",
        },
      }
    );

    const users = response.data.users.map((user) => ({
      name: user.name,
      id: user._id,
    }));

    this.cache = users;

    return users;
  }
}
