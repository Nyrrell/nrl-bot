import {} from "dotenv/config";
const { DISCORD_TOKEN, DISCORD_TOKEN_DEV,TWITCH_CLIENT_ID, TWITCH_ACCESS_TOKEN, NODE_ENV } = process.env

export const token = NODE_ENV === 'dev' ? DISCORD_TOKEN_DEV : DISCORD_TOKEN; // bot token
export const twitchClientId = TWITCH_CLIENT_ID;
export const twitchOAuthAccessToken = TWITCH_ACCESS_TOKEN;
