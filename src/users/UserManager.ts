const axios = require('axios').default;

export default class UserManager {
  cache = new Map<string, any>();

  constructor() {}

  async getUser(userId: string) {
    if (this.cache.has(userId)) {
      return this.cache.get(userId);
    }

    const user = (async () => {
      const response = await axios.get(
        `https://api.twitch.tv/kraken/users/${userId}`,
        {
          headers: {
            accept: 'application/vnd.twitchtv.v5+json',
            'client-id': process.env.CLIENT_ID,
          },
        }
      );

      return response.data;
    })();

    this.cache.set(userId, user);
    return user;
  }
}
