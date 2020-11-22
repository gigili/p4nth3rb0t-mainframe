import { config } from "../config";
import { Packet, TwitchEvent, UserByLoginResponse } from "../data/types";
import WebSocketServer from "../websocket";
import UserManager from "../users/UserManager";

export const sendWeatherTrailEvent = async (trailing: boolean) => {
  try {
    const weatherTrailEvent: Packet = {
      broadcaster: config.broadcaster.name,
      event: TwitchEvent.weatherTrailEvent,
      id: "trailing-" + Date.now(),
      data: {
        trailing: trailing,
      },
    };

    WebSocketServer.sendDataOverWebsocket(weatherTrailEvent);
  } catch (error) {
    console.log(Error);
  }
};

export const sendDropUserEvent = async (userId: string, messageId: string) => {
  try {
    const user = await UserManager.getUserById(userId as string);

    const dropUserEvent: Packet = {
      broadcaster: config.broadcaster.name,
      event: TwitchEvent.dropUser,
      id: messageId,
      data: {
        logoUrl: user.logo as string,
      },
    };

    WebSocketServer.sendDataOverWebsocket(dropUserEvent);
  } catch (error) {
    console.log(error);
  }
};

export const sendDropEmotesEvent = (
  emoteIds: [],
  bigEmotes: boolean,
  messageId: string,
  dropType: string,
) => {
  const imgSize = bigEmotes ? config.emotes.sizes[2] : config.emotes.sizes[1];
  try {
    const urls = emoteIds.map(
      (emoteId) => `${config.emotes.baseUrl}${emoteId}/${imgSize}`,
    );

    const emotesEvent: Packet = {
      broadcaster: config.broadcaster.name,
      event: TwitchEvent.dropEmotes,
      id: messageId,
      data: {
        emoteUrls: urls,
        dropType: dropType,
      },
    };

    WebSocketServer.sendDataOverWebsocket(emotesEvent);
  } catch (error) {
    console.log(error);
  }
};

export const sendWeatherEvent = (weatherType: string, messageId: string) => {
  try {
    const weatherEvent: Packet = {
      broadcaster: config.broadcaster.name,
      event: TwitchEvent.weather,
      id: messageId,
      data: {
        weatherEvent: weatherType,
      },
    };

    WebSocketServer.sendDataOverWebsocket(weatherEvent);
  } catch (error) {
    console.log(error);
  }
};

export const sendYeetEvent = async (userName: string, messageId: string) => {
  try {
    const usersResponse: UserByLoginResponse = await UserManager.getUserByLogin(
      userName,
    );

    if (usersResponse.users[0].logo) {
      const yeetUserEvent: Packet = {
        broadcaster: config.broadcaster.name,
        event: TwitchEvent.yeetUser,
        id: messageId,
        data: {
          logoUrl: usersResponse.users[0].logo,
        },
      };

      WebSocketServer.sendDataOverWebsocket(yeetUserEvent);
    }
  } catch (error) {
    console.log(error);
  }
};
