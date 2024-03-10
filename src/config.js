import "dotenv/config";

export const {
  DISCORD_TOKEN: token,
  DISCORD_CLIENT_ID: clientId,
  DISCORD_GUILD_ID: guildId,
  TWITCH_CLIENT_ID: twitchClientId,
  TWITCH_ACCESS_TOKEN: twitchAccessToken,
  YOUTUBE_API_KEY: youtubeApiKey,
  INSTAGRAM_APP_ID: instagramAppID,
  DAILY_SUBS_TOKEN_URL: dailySubsTokenUrl,
  DAILY_SUBS_GIFS_URL: dailySubsGifsUrl,
  DAILY_SUBS_EMBED_URL: dailySubsEmbedUrl,
  DEV_ID: devId,
  NODE_ENV: env
} = process.env;

export const channelPrefix = /.*︱/gm;
const CHANNELS = Object.fromEntries(Object.entries(process.env).filter(([key]) => key.startsWith("CHANNEL")))
export const channels = {
  debug: CHANNELS.CHANNEL_DEBUG,
  dailySub: CHANNELS.CHANNEL_DAILYSUB,
  clips: CHANNELS.CHANNEL_CLIPS,
  botLogs: CHANNELS.CHANNEL_BOTLOGS,
  gamesFolder: CHANNELS.CHANNEL_GAMESFOLDER,
  archivesFolder: CHANNELS.CHANNEL_ARCHIVESFOLDER,
  taverne: CHANNELS.CHANNEL_TAVERNE,
  tips: CHANNELS.CHANNEL_TIPS,
  social: CHANNELS.CHANNEL_SOCIAL,
  rainyday: CHANNELS.CHANNEL_RAINYDAY,
  devDebug: CHANNELS.CHANNEL_DEV_DEBUG
};
if (env === 'dev') Object.keys(channels).forEach(k => channels[k] = channels.devDebug);


export const color = {
  blue: '#2980b9',
  green: '#27ae60',
  yellow: '#f1c40f',
  red: '#c0392b',
};