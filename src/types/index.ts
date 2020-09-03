export enum TwitchEvent {
  sub = "sub",
  dropUser = "dropUser",
}

interface SocketData {}

interface RaidedSocketData extends SocketData {}

interface SubSocketData extends SocketData {
  logoUrl: string;
}

export interface SocketPacket {
  broadcaster: string;
  event: TwitchEvent;
  id: string;
  data: RaidedSocketData | SubSocketData;
}
