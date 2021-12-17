import cron from 'node-cron';

import { getEpicFreeGames } from "./epicFreeGames.js";
import { archiveChannel } from "./archiveChannel.js";
import { postDailySubs } from "./postDailySubs.js";
import { instagramFeed } from "./instagramFeed.js";
import { twitchLive } from "./twitchLive.js";
import { primeGames } from "./primeGames.js";
import { youtubeFeed } from "./youtube.js";

const timezone = "Europe/Paris"

// Twitch Live
cron.schedule('*/2 * * * *', async () => {
  await twitchLive();
}, { timezone: timezone });

// Instagram
cron.schedule('*/10 * * * *', async () => {
  await instagramFeed();
}, { timezone: timezone });

// Epic Free Games // TODO ? THU ONLY
cron.schedule('10 17 * * *', async () => {
  await getEpicFreeGames();
}, { timezone: timezone });

// Archive Channel
cron.schedule('0 2 * * *', async () => {
  await archiveChannel();
}, { timezone: timezone });

// Post daily subs
cron.schedule('0 9 * * *', async () => {
  await postDailySubs();
}, { timezone: timezone });

// Prime Games
cron.schedule('0 * * * *', async () => {
  await primeGames();
  await youtubeFeed();
}, { timezone: timezone });