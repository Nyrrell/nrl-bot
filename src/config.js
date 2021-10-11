import "dotenv/config";

const {
  DISCORD_TOKEN,
  DISCORD_CLIENT_ID,
  DISCORD_GUILD_ID,
  TWITCH_CLIENT_ID,
  TWITCH_ACCESS_TOKEN,
  NODE_ENV
} = process.env;

export const token = DISCORD_TOKEN;
export const clientId = DISCORD_CLIENT_ID;
export const guildId = DISCORD_GUILD_ID;

export const twitchClientId = TWITCH_CLIENT_ID;
export const twitchAccessToken = TWITCH_ACCESS_TOKEN;
export const env = NODE_ENV;

export const channelPrefix = /.*︱/gm;
export const channels = {
  debug: '871675196560531486',
  dailySub: '429102841534349333',
  clips: '351475175587577866',
  botLogs: '892494572792451072',
  gamesFolder: '516697956712185857',
  archivesFolder: '670645106407112734',
};
if (env === 'dev') Object.keys(channels).forEach(k => channels[k] = "872851017925001227");


export const color = {
  blue: '#2980b9',
  green: '#27ae60',
  yellow: '#f1c40f',
  red: '#c0392b',
}