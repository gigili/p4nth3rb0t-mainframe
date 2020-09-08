export enum TwitchEvent {
  sub = "sub",
  dropUser = "dropuser",
  weather = "weather",
  dropEmotes = "dropemotes",
}

interface Data {}

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

export interface Packet {
  broadcaster: string;
  event: TwitchEvent;
  id: string;
  data: DropData | SubData | WeatherData;
}
