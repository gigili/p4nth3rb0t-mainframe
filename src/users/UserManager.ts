import axios from "axios";

export default class UserManager {
  static cache = new Map<string, any>();

  static async getUserByLogin(login: string) {
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
      }
    );

    this.cache.set(login, response.data);

    return response.data;
  }

  static async getUserById(userId: string) {
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
      }
    );

    this.cache.set(userId, response.data);

    return response.data;
  }
}
