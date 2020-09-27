import AccessTokenModel, {
  AccessTokenDoc,
  AccessTokenData,
} from "../data/models/AccessToken";
import { AccessTokenResponse } from "../data/types";

export default class AccessToken {
  async get(): Promise<string | Error> {
    const getAccessToken = await AccessTokenModel.findOne();

    if (getAccessToken) {
      this.checkExistsAndValid(getAccessToken);
    }

    return new Error("something went wrong");
  }

  async set({ data }: AccessTokenResponse): Promise<AccessTokenDoc> {
    const { access_token, expires_in, token_type } = data;

    const setAccessToken = await AccessTokenModel.create({
      accessToken: access_token,
      tokenType: token_type,
      expiresIn: expires_in,
      updatedAt: Math.floor(Date.now() / 1000),
    });

    return setAccessToken;
  }

  async checkExistsAndValid(accessToken: AccessTokenData): Promise<boolean> {
    const { updatedAt, expiresIn } = accessToken;
    const timeNow = Math.floor(Date.now() / 1000);

    return updatedAt + expiresIn > timeNow;
  }
}
