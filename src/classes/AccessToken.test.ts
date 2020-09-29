import { AccessTokenDoc } from "./../data/models/AccessToken";
import AccessToken from "./AccessToken";

const validAccessToken = {
  accessToken: "test_access_token",
  tokenType: "bearer",
  expiresIn: 1000,
  updatedAt: Math.floor(Date.now() / 1000),
};

const invalidAccessToken = {
  accessToken: "test_access_token",
  tokenType: "bearer",
  expiresIn: 1,
  updatedAt: 0,
};

describe("AccessToken.checkExistsAndValid", () => {
  it("returns true for a valid access token", async () => {
    const accessToken = new AccessToken();
    const check = await accessToken.checkExistsAndValid(validAccessToken);
    expect(check).toBe(true);
  });

  it("returns false for an invalid access token", async () => {
    const accessToken = new AccessToken();
    const check = await accessToken.checkExistsAndValid(invalidAccessToken);
    expect(check).toBe(false);
  });
});
