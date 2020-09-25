import axios from "axios";
import {
  TwitchChannel,
  TeamResponse,
  AccessTokenResponse,
  Coders,
} from "./../types";

export default class LiveCoders {
  //TODO: some kind of cache expiry
  //TODO: put channels in cache
  cache: Coders = [];
  accessTokenCache = "";

  async getAccessToken(): Promise<string> {
    if (this.accessTokenCache.length > 0) {
      return this.accessTokenCache;
    }

    try {
      const response = await axios.post<string, AccessTokenResponse>(
        `https://id.twitch.tv/oauth2/token?scope=user:edit&response_type=token&client_secret=${process.env.CLIENT_SECRET}&grant_type=client_credentials&client_id=${process.env.CLIENT_ID}`,
        {
          headers: {
            accept: "application/vnd.twitchtv.v5+json",
          },
        }
      );

      this.accessTokenCache = response.data.access_token;
      return response.data.access_token;
    } catch (error) {
      console.log(error);
    }

    return "";
  }

  public getWelcomeMessage = (channel: TwitchChannel): string => {
    return `whitep30PEWPEW Live Coder team member detected! 
    👋 Hello there, @${channel.broadcaster_name}! 
    Check out their channel here: https://twitch.tv/${channel.broadcaster_name} 
    | They were last seen streaming ${channel.title} in ${channel.game_name} whitep30PEWPEW`;
  };

  async getChannelById(
    broadcasterId: string
  ): Promise<TwitchChannel | undefined> {
    const accessToken = await this.getAccessToken();

    try {
      const response = await axios.get<{ data: TwitchChannel[] }>(
        `https://api.twitch.tv/helix/channels?broadcaster_id=${broadcasterId}`,
        {
          headers: {
            authorization: `Bearer ${accessToken}`,
            "client-id": process.env.CLIENT_ID,
          },
        }
      );

      return response.data.data[0];
    } catch (error) {
      console.log(error);
    }
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
