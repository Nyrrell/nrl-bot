import "dotenv/config";
const { DISCORD_TOKEN, DISCORD_CLIENT_ID, DISCORD_GUILD_ID, TWITCH_CLIENT_ID, TWITCH_ACCESS_TOKEN, NODE_ENV } = process.env

export const token = NODE_ENV === 'dev' ? process.env.DISCORD_TOKEN_DEV : DISCORD_TOKEN;
export const clientId = NODE_ENV === 'dev' ? process.env.DISCORD_CLIENT_ID_DEV : DISCORD_CLIENT_ID;
export const guildId = NODE_ENV === 'dev' ? process.env.DISCORD_GUILD_ID_DEV : DISCORD_GUILD_ID;

export const twitchClientId = TWITCH_CLIENT_ID;
export const twitchAccessToken = TWITCH_ACCESS_TOKEN;
export const env = NODE_ENV