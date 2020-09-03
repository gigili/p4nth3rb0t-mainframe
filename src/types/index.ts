export enum TwitchEvent {
  sub = "sub",
  dropUser = "dropuser",
}

interface SocketData {}

interface DropSocketData extends SocketData {}

interface SubSocketData extends SocketData {
  logoUrl: string;
}

export interface SocketPacket {
  broadcaster: string;
  event: TwitchEvent;
  id: string;
  data: DropSocketData | SubSocketData;
}
