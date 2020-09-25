import axios from "axios";

export default class UserManager {
  cache = new Map<string, any>();

  async getUser(userId: string) {
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
