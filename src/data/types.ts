export enum TwitchEvent {
  sub = "sub",
  dropUser = "dropuser",
  weather = "weather",
  dropEmotes = "dropemotes",
  raid = "raid",
  cheer = "cheer",
  specialUserJoin = "specialuserjoin",
  weatherTrailEvent = "settrailing",
  liveCoderJoin = "livecoderjoin",
}

interface Data {}

interface CheerData extends Data {
  bitCount: string;
}

interface DropData extends Data {
  logoUrl?: string;
  emoteUrls?: string[];
  dropType?: string;
}

interface SpecialUserJoinData extends Data {
  username: string;
}

interface LiveCoderJoinData extends Data {
  logoUrl: string;
}

interface SubData extends Data {
  logoUrl: string;
}

interface WeatherData extends Data {
  weatherEvent: string;
}

interface WeatherTrailData extends Data {
  trailing: boolean;
}

interface RaidData extends Data {
  raiderCount: number;
  raider: string;
}

export interface Packet {
  broadcaster: string;
  event: TwitchEvent;
  id: string;
  data:
    | CheerData
    | DropData
    | SpecialUserJoinData
    | RaidData
    | SubData
    | WeatherData
    | WeatherTrailData;
}

export interface TwitchChannel {
  broadcaster_id: string;
  broadcaster_name: string;
  broadcaster_language: string;
  game_id: string;
  game_name: string;
  title: string;
}

export interface Coder {
  name: string;
  id: string;
}

export type Coders = Coder[];

export interface TeamResponse {
  data: {
    users: [
      {
        name: string;
        _id: string;
      }
    ];
  };
}

export interface AccessTokenResponse {
  access_token: string;
  expires_in: number;
  scope: [];
  token_type: string;
}
