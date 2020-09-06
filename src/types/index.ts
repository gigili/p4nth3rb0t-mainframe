export enum TwitchEvent {
  sub = "sub",
  dropUser = "dropuser",
  weather = "weather",
}

interface SocketData {}

interface DropSocketData extends SocketData {}

interface SubSocketData extends SocketData {
  logoUrl: string;
}

interface WeatherSocketData extends SocketData {
  weatherEvent: string;
}

export interface SocketPacket {
  broadcaster: string;
  event: TwitchEvent;
  id: string;
  data: DropSocketData | SubSocketData | WeatherSocketData;
}
