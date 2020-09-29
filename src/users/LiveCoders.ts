import axios from "axios";
import AccessToken from "../classes/AccessToken";
import { TwitchChannel, TeamResponse, Coders } from "../data/types";

const accessTokenUtil = new AccessToken();

export default class LiveCoders {
  //TODO: some kind of cache expiry
  //TODO: put channels in cache
  cache: Coders = [];

  public getWelcomeMessage = (channel: TwitchChannel): string => {
    return `whitep30PEWPEW Live Coder team member detected! 
    PEW PEW, @${channel.broadcaster_name}! 
    Check out their channel here: https://twitch.tv/${channel.broadcaster_name} 
    | They were last seen streaming ${channel.title} in ${channel.game_name} whitep30PEWPEW`;
  };

  async getChannelById(
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

  async getUserNames(): Promise<Coders> {
    if (this.cache.length > 0) {
      return this.cache;
    }

    try {
      const response = await axios.get<any, TeamResponse>(
        "https://api.twitch.tv/kraken/teams/livecoders",
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

      this.cache = users;

      return users;
    } catch (error) {
      console.log(error);
    }

    return [];
  }
}
