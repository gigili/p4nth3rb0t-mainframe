import { Badges } from "tmi.js";
export enum TwitchEvent {
  sub = "sub",
  dropUser = "dropuser",
  weather = "weather",
  dropEmotes = "dropemotes",
  raid = "raid",
  cheer = "cheer",
  specialUserJoin = "specialuserjoin",
  weatherTrailEvent = "settrailing",
  teamMemberJoin = "teammemberjoin",
  chatMessage = "chatmessage",
  yeetUser = "yeetuser",
  broadcasterFollow = "follow",
  startGiveaway = "startgiveaway",
  endGiveaway = "endgiveaway",
  enterGiveaway = "entergiveaway",
  drawGiveaway = "drawgiveaway",
}

interface Data {}

interface CheerData extends Data {
  bitCount: string;
  cheererName: string;
  logoUrl: string;
}

interface DropData extends Data {
  logoUrl?: string;
  emoteUrls?: string[];
  dropType?: string;
}

interface SpecialUserJoinData extends Data {
  username: string;
}

interface teamMemberJoinData extends Data {
  logoUrl: string;
}

interface SubData extends Data {
  logoUrl: string;
  subscriberUsername: string;
  subTier: string;
  message: string;
  months: number;
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
  logoUrl: string;
}

interface BroadcasterFollowData extends Data {
  followerName: string;
  logoUrl: string;
  followerUserId: string;
}

export interface ChatMessageData extends Data {
  userId: string;
  username: string;
  displayName: string;
  messageId: string;
  message: string;
  logoUrl: string;
  isMod: boolean;
  isVip: boolean;
  isSubscriber: boolean;
  isBroadcaster: boolean;
  isTeamMember: boolean;
  isMyFavoriteStreamer: boolean;
  emotes?: {
    [emoteid: string]: string[];
  };
  type: string | undefined;
  id: string | undefined;
}

export interface StartGiveawayData {}

export interface EndGiveawayData {}

export interface DrawGiveawayData {
  winner: string;
}

export interface EnterGiveawayData {
  username: string;
  logoUrl: string;
}

export interface TwitchChannel {
  broadcaster_id: string;
  broadcaster_name: string;
  broadcaster_language: string;
  game_id: string;
  game_name: string;
  title: string;
}

export interface TeamMember {
  name: string;
  id: string;
}

export type TeamMembers = TeamMember[];

export interface TeamResponse {
  data: {
    users: [
      {
        name: string;
        _id: string;
      },
    ];
  };
}

export interface AccessTokenResponse {
  access_token: string;
  expires_in: number;
  scope: [];
  token_type: string;
}

export interface UserByIdResponse {
  display_name: string;
  _id: string;
  name: string;
  type: "user";
  bio: string;
  created_at: string;
  updated_at: string;
  logo: string;
}

export interface UserByLoginResponse {
  _total: number;
  users: [
    {
      display_name: string;
      _id: string;
      name: string;
      type: "user";
      bio: string;
      created_at: string;
      updated_at: string;
      logo: string;
    },
  ];
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
    | WeatherTrailData
    | teamMemberJoinData
    | ChatMessageData
    | BroadcasterFollowData
    | EnterGiveawayData
    | StartGiveawayData
    | DrawGiveawayData
    | EndGiveawayData;
}

export interface MyBadges extends Badges {
  founder?: string;
}

export interface GameByIdResponse {
  name: string;
}

export interface VideoByUserIdResponse {
  id: string;
  thumbnail_url: string;
  duration: string;
  title: string;
}

export interface StreamInfo {
  game_id: string;
  id: string;
  language: string;
  started_at: string;
  tag_ids: string[];
  thumbnail_url: string;
  title: string;
  type: string;
  user_id: string;
  user_name: string;
  viewer_count: number;
}

export interface StreamByBroadcasterIdResponse {
  id: string;
  user_id: string;
  user_name: string;
  game_id: string;
  game_name: string;
  type: string;
  title: string;
  viewer_count: number;
  started_at: string;
  language: string;
  thumbnail_url: string;
  tag_ids: string[];
}
