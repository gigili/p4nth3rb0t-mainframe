import { Badges } from "tmi.js";

export interface TwitchChannel {
  broadcaster_id: string;
  broadcaster_name: string;
  broadcaster_language: string;
  game_id: string;
  game_name: string;
  title: string;
}

export interface TeamMember {
  user_id: string;
  user_name: string;
  user_login: string;
}

export type TeamMembers = TeamMember[];

export interface TeamResponse {
  data: [
    {
      users: TeamMember[];
      background_image_url: string;
      banner: string;
      created_at: string;
      updated_at: string;
      info: string;
      thumbnail_url: string;
      team_name: string;
      team_display_name: string;
      id: string;
    },
  ];
}

export interface AccessTokenResponse {
  access_token: string;
  expires_in: number;
  scope: [];
  token_type: string;
}

export interface EventSubscriptionReseponse {
  data: EventSubscription[];
  total: number;
  total_cost: number;
  max_total_cost: number;
  pagination: any;
}

export const enum EventSubType {
  StreamOnline = "stream.online",
  StreamOffline = "stream.offline",
  ChannelFollow = "channel.follow",
}

export interface EventSubDefinition {
  userId: string;
  eventType: EventSubType;
  callbackUrl: string;
}

export interface EventSubscription {
  id: string;
  status: string;
  type: string;
  version: string;
  cost: number;
  condition: Condition;
  created_at: string;
  transport: Transport;
}

export interface Condition {
  broadcaster_user_id: string;
}

export interface Transport {
  method: string;
  callback: string;
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
  id: string;
  started_at: string;
  type: string;
  broadcaster_user_id: string;
  broadcaster_user_login: string;
  broadcaster_user_name: string;
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

export enum ImageDrops {
  Contentful = "contentful",
  Partner = "partner",
  Battlesnake = "battlesnake",
  TheClaw = "theclaw",
}

export interface DiscordReactionRole {
  role_id: string;
  emoji_tag: string;
  message_id: string;
}

export type MoodEmotes = { [key: string]: string };
