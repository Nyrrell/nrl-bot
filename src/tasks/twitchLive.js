import { StaticAuthProvider } from '@twurple/auth';
import { getRawData } from '@twurple/common'
import { ApiClient } from '@twurple/api';
import cron from 'node-cron'

import { twitchClientId, twitchAccessToken, env, channels } from "../config.js";
import { diffDate } from "../utils/helpers.js";
import { streamer } from "../services/db.js";
import logger from "../services/logger.js";
import { MessageEmbed } from "discord.js";
import { client } from '../app.js'

const authProvider = new StaticAuthProvider(twitchClientId, twitchAccessToken);
const apiClient = new ApiClient({ authProvider });

let recentTitle = []
let clipSend = []
let channel = await client.channels.cache

const isStreamLive = async (userName) => {
  const user = await apiClient.users.getUserByName(userName);
  if (!user) return false;
  let streamData = await user.getStream();
  streamData !== null ? streamData = getRawData(streamData) : streamData = false;
  return {
    isLive: Object.keys(streamData).length > 0 && streamData.type === 'live',
    ...streamData
  }
}

const checkClip = async (streamData) => {
  const clips = await apiClient.clips.getClipsForBroadcasterPaginated(streamData['user_id'], { startDate: streamData['started_at'] }).getAll()

  for (const clip of clips) {
    if (!recentTitle.includes(streamData['title'])) recentTitle.push(streamData['title'])
    if (!recentTitle.includes(clip['title']) && !clipSend.includes(clip['url'])) {
      try {
        const channelClip = channel.get(channels["clips"])
        await channelClip.send({
          embeds: [
            new MessageEmbed()
              .setColor('#a970ff')
              .setTitle('Nouveau clip'.concat("\u2800".repeat(25)))
              .setDescription(clip['title'])
              .setFooter(`Créer par ${clip['creatorDisplayName']}`)
              .setTimestamp(clip['creationDate'])
          ]
        }).then(clipSend.push(clip['url']));
        await channelClip.send({ content: `> ${clip['url']}` })
      } catch (e) {
        logger.error(e)
      }
    }
  }
}

const messageEmbed = (streamData, userData) => {
  return new MessageEmbed()
    .setColor(userData['color'])
    .setTitle(userData['title'])
    .setURL(`https://twitch.tv/${streamData['user_login']}`)
    .setDescription(`${userData['descr']} \n[twitch.tv/${streamData['user_login']}](https://twitch.tv/${streamData['user_login']})`)
    .setThumbnail(userData['thumb'])
    .addField(
      `En train de stream ${streamData['game_name'].length ? '- ' + streamData['game_name'] : ''}`,
      streamData['title'].length ? streamData['title'] : "Et c'est en direct sur les internets !"
    )
    .setImage(`attachment://${streamData['id']}.webp`)
    .setTimestamp(new Date())
}

cron.schedule('*/2 * * * *', async () => {
  try {
    const streamers = await streamer.findAll()

    for (const streamer of streamers) {
      const { isLive, ...streamData } = await isStreamLive(streamer);

      if (isLive && diffDate(streamer['uptime'], 'minute', 30)) {
        if (streamer['name'] === 'cirka_') {
          recentTitle = []
          clipSend = []
        }
        await streamer.update({
          uptime: new Date(),
          lastLive: new Date(streamData['started_at'])
        }, { where: { name: streamer['name'] } })

        await channel.get(env === 'dev' ? channels["debug"] : streamer['channel'])?.send({
          content: `Hey ! ${streamData['user_name']} lance son live @everyone`,
          embeds: [messageEmbed(streamData, streamer)],
          files: [{
            attachment: streamData['thumbnail_url'].replace('{width}', 366).replace('{height}', 220),
            name: `${streamData['id']}.webp`
          }]
        })
      } else if (isLive) {
        await streamer.update({ uptime: new Date() }, { where: { name: streamer['name'] } })
        if (streamer['name'] === 'cirka_') await checkClip(streamData)
      }
    }
  } catch (e) {
    logger.error(e)
  }
}, { scheduled: true, timezone: "Europe/Paris" });