import axios from "axios";
import { MessageEmbed } from "discord.js";

import { client } from '../app.js';
import logger from "../services/logger.js";
import { youtubeKeyv } from "../services/keyv.js";
import { channels, guildId, youtubeApiKey } from "../config.js";

const youtubeApi = axios.create({
  baseURL: 'https://www.googleapis.com/youtube/v3/',
  params: { 'key': youtubeApiKey }
});

export const youtubeFeed = async () => {
  try {
    const youtubeChannel = 'UCJaHTyjOkFEcHFPbywErwjg';
    const channel = await client.guilds.cache.get(guildId)?.channels.cache.get(channels['social']);

    const videos = [] = await youtubeApi.get(`search?channelId=${youtubeChannel}&part=snippet,id&order=date`).then(({ data }) => data['items'])
    const videosId = videos.map(video => video['id']['videoId']);

    const storedVideos = await youtubeKeyv.get('latestVideos');

    for await (const video of videos) {
      if (storedVideos?.includes(video['id']['videoId'])) continue;

      await channel.send({
        embeds: [
          new MessageEmbed()
            .setColor('#ff0000')
            .setAuthor('Youtube', 'https://www.youtube.com/s/desktop/7b8b5af6/img/favicon_144x144.png')
            .setTitle(`Nouvelle vidéo de ${video['snippet']['channelTitle']}`)
            .setURL(`https://www.youtube.com/watch?v=${video['id']['videoId']}`)
            .setDescription(`**${video['snippet']['title']}** \n\n${video['snippet']['description']}`)
            .setThumbnail(video['snippet']['thumbnails']['high']['url'])
        ]
      });

      await youtubeKeyv.set("latestVideos", videosId);
    }
  } catch (e) {
    logger.error(e);
  }
}