import axios from "axios";
import { UserByLoginResponse, UserByIdResponse } from "../data/types";

// TODO = AGE CACHE THING!
// currently we can restart the bot to clear the cache
// but right now if someone does not pass age check
// then they will never have a logo shown

const accountIsOlderThanSevenDays = (createdAt: string): boolean => {
  const SEVEN_DAYS = 604800;
  const accountCreated = new Date(createdAt).valueOf();
  const accountCreatedEpoch = accountCreated / 1000;
  const now = new Date().valueOf();
  const epoch = now / 1000;

  return epoch - accountCreatedEpoch > SEVEN_DAYS;
};

export default class UserManager {
  static cache = new Map<string, any>();

  static async getUserByLogin(login: string): Promise<UserByLoginResponse> {
    if (this.cache.has(login)) {
      return this.cache.get(login);
    }

    const response = await axios.get(
      `https://api.twitch.tv/kraken/users?login=${login}`,
      {
        headers: {
          accept: "application/vnd.twitchtv.v5+json",
          "client-id": process.env.CLIENT_ID,
        },
      },
    );

    const passesAgeCheck = accountIsOlderThanSevenDays(
      response.data.created_at,
    );

    if (!passesAgeCheck) {
      response.data.logo = "";
    }

    this.cache.set(login, response.data);

    return response.data;
  }

  static async getUserById(userId: string): Promise<UserByIdResponse> {
    if (this.cache.has(userId)) {
      return this.cache.get(userId);
    }

    const response = await axios.get(
      `https://api.twitch.tv/kraken/users/${userId}`,
      {
        headers: {
          accept: "application/vnd.twitchtv.v5+json",
          "client-id": process.env.CLIENT_ID,
        },
      },
    );

    const passesAgeCheck = accountIsOlderThanSevenDays(
      response.data.created_at,
    );

    if (!passesAgeCheck) {
      response.data.logo = "";
    }

    this.cache.set(userId, response.data);
    return response.data;
  }
}
