import axios from "axios";
import AccessToken from "../classes/AccessToken";
import { TwitchChannel, TeamResponse, Coders } from "../data/types";
import { config } from "../config";

const accessTokenUtil = new AccessToken();

export default class Team {
  //TODO: some kind of cache expiry
  //TODO: put channels in cache
  static cache: Coders = [];

  static getWelcomeMessage = (channel: TwitchChannel): string => {
    return config.teamWelcomeMessage(channel);
  };

  static async getChannelById(
    broadcasterId: string
  ): Promise<TwitchChannel | undefined> {
    const accessTokenData = await accessTokenUtil.get();

    if (accessTokenData) {
      try {
        const response = await axios.get<{ data: TwitchChannel[] }>(
          `https://api.twitch.tv/helix/channels?broadcaster_id=${broadcasterId}`,
          {
            headers: {
              authorization: `Bearer ${accessTokenData.accessToken}`,
              "client-id": process.env.CLIENT_ID,
            },
          }
        );

        return response.data.data[0];
      } catch (error) {
        console.log(error);
      }
    }

    return undefined;
  }

  static async getUserNames(): Promise<Coders> {
    if (Team.cache.length > 0) {
      return Team.cache;
    }

    try {
      const response = await axios.get<any, TeamResponse>(
        `https://api.twitch.tv/kraken/teams/${config.teamName}`,
        {
          headers: {
            accept: "application/vnd.twitchtv.v5+json",
            "client-id": process.env.CLIENT_ID,
          },
        }
      );

      const users = response.data.users.map((user) => ({
        name: user.name,
        id: user._id,
      }));

      Team.cache = users;

      return users;
    } catch (error) {
      console.log(error);
    }

    return [];
  }
}
