import mongoose, { Document, Schema } from "mongoose";

export interface DiscordAnnouncementData {
  memberId: string;
  messageId: string;
}

export interface DiscordAnnouncementDoc extends Document, DiscordAnnouncementData {}

export const DiscordAnnouncementSchema: Schema = new mongoose.Schema({
  memberId: { type: String, required: true },
  messageId: { type: String, required: true }
});

export default mongoose.model<DiscordAnnouncementDoc>("DiscordAnnouncement", DiscordAnnouncementSchema);
