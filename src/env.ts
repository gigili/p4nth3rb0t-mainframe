import { config } from "dotenv";
config();

export const CHANNELS = process.env.CHANNELS?.split(",");
