type TwitchEvent =
  | "raided"
  | "sub"
  | "chat"
  | "hosted"
  | "join"
  | "resub"
  | "subgift";

interface SocketData {
  type: string;
}

interface RaidedSocketData extends SocketData {}

interface SubSocketData extends SocketData {}

export interface SocketPacket {
  broadcaster: string;
  event: TwitchEvent;
  id: string;
  data: RaidedSocketData | SubSocketData;
}
