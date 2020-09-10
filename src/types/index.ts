export enum TwitchEvent {
  sub = "sub",
  dropUser = "dropuser",
  weather = "weather",
  dropEmotes = "dropemotes",
  raid = "raid",
  cheer = "cheer",
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

interface SubData extends Data {
  logoUrl: string;
}

interface WeatherData extends Data {
  weatherEvent: string;
}

interface RaidData extends Data {
  raiderCount: number;
  raider: string;
}

export interface Packet {
  broadcaster: string;
  event: TwitchEvent;
  id: string;
  data: CheerData | DropData | RaidData | SubData | WeatherData;
}
