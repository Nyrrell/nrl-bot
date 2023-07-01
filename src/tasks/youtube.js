import axios from "axios";
import { MessageEmbed } from "discord.js";

import { client } from '../app.js';
import logger from "../services/logger.js";
import { youtube } from "../services/db.js";
import { channels, guildId, youtubeApiKey } from "../config.js";

const youtubeApi = axios.create({
  baseURL: 'https://www.googleapis.com/youtube/v3/',
  params: { 'key': youtubeApiKey }
});

export const youtubeFeed = async () => {
  try {
//    const youtubeChannel = 'UCJaHTyjOkFEcHFPbywErwjg';
//    const uploadPlaylist = 'UUJaHTyjOkFEcHFPbywErwjg';
    const uploadPlaylist = 'UUc67sFEZzCEtKWPfLRFQf5Q';

    const channel = await client.guilds.cache.get(guildId)?.channels.cache.get(channels['social']);

    const videos = [] = await youtubeApi.get(`playlistItems?part=snippet%2CcontentDetails&playlistId=${uploadPlaylist}&order=date`).then(({ data }) => data['items']);
    if (!videos.length) return;

    const storedVideos = await youtube.findAll();

    for await (const video of videos) {

      if (storedVideos?.find(({ id }) => id === video['contentDetails']['videoId'])) continue;

      const videoId = video['contentDetails']['videoId'];
      const videoTitle = video['snippet']['title'];
      const videoDesc = video['snippet']['description'];
      const videoChannel = video['snippet']['channelTitle'];
      const videoThumb = video['snippet']['thumbnails']['high']['url'];

      await channel.send({
        embeds: [
          new MessageEmbed()
            .setColor('#ff0000')
            .setAuthor('Youtube', 'https://www.youtube.com/s/desktop/7b8b5af6/img/favicon_144x144.png')
            .setTitle(`Nouvelle vidéo de ${videoChannel}`)
            .setURL(`https://www.youtube.com/watch?v=${videoId}`)
            .setDescription(`**${videoTitle}** \n\n${videoDesc}`)
            .setThumbnail(videoThumb)
        ]
      });

      await youtube.create({
        "id": videoId,
        "channel": videoChannel,
        "title": videoTitle,
        "descr": videoDesc,
        "thumb": videoThumb,
        "channelId": video['snippet']['channelId'],
        "createdAt": video['snippet']['publishedAt']
      });
    }
  } catch (e) {
    logger.error(e);
  }
}