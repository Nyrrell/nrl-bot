import "dotenv/config";
const { DISCORD_TOKEN, DISCORD_CLIENT_ID, DISCORD_GUILD_ID, TWITCH_CLIENT_ID, TWITCH_ACCESS_TOKEN, NODE_ENV } = process.env

export const token = DISCORD_TOKEN;
export const clientId = DISCORD_CLIENT_ID;
export const guildId = DISCORD_GUILD_ID;

export const twitchClientId = TWITCH_CLIENT_ID;
export const twitchAccessToken = TWITCH_ACCESS_TOKEN;
export const env = NODE_ENV

export const channels = {
    debug: '872851017925001227',
    dailySub: '429102841534349333',
    clips: '351475175587577866'
}

if (env === 'dev') Object.keys(channels).forEach(k => channels[k] = "872851017925001227")