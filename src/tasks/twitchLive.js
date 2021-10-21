import { StaticAuthProvider } from '@twurple/auth';
import { getRawData } from '@twurple/common'
import { ApiClient } from '@twurple/api';
import cron from 'node-cron'

import { twitchClientId, twitchAccessToken, env, channels } from "../config.js";
import { diffDate } from "../utils/helpers.js";
import { streamer } from "../services/db.js";
import logger from "../services/logger.js";
import { client } from '../app.js'

const authProvider = new StaticAuthProvider(twitchClientId, twitchAccessToken);
const apiClient = new ApiClient({ authProvider });

let title = []
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
        if (!title.includes(streamData['title'])) title.push(streamData['title'])
        if (!title.includes(clip['title']) && !clipSend.includes(clip['url'])) {
            try {
                channel = channel.get(channels["clips"])
                await channel.send({
                    embeds: [{
                        color: '#a970ff',
                        title: 'Nouveau clip'.concat("\u2800".repeat(25)),
                        description: clip['title'],
                        footer: {
                            text: `Créer par ${clip['creatorDisplayName']}`
                        },
                        timestamp: clip['creationDate'],
                    }]
                }).then(clipSend.push(clip['url']));
                await channel.send({ content: `> ${clip['url']}` })
            } catch (e) {
                logger.error(e)
            }
        }
    }
}

const messageEmbed = (streamData, userData) => {
    return {
        color: userData['color'],
        title: userData['title'],
        url: `https://twitch.tv/${streamData['user_login']}`,
        description:
            `${userData['descr']} \n[twitch.tv/${streamData['user_login']}](https://twitch.tv/${streamData['user_login']})`,
        thumbnail: {
            url: userData['thumb'],
        },
        fields: [
            {
                name: `En train de stream ${streamData['game_name'].length ? '- ' + streamData['game_name'] : ''}`,
                value: streamData['title'].length ? streamData['title'] : "Et c'est en direct sur les internets !", //
            }
        ],
        image: {
            url: `attachment://${streamData['user_login']}.webp`,
        },
        timestamp: new Date(),
        footer: {
            text: ''
        }
    }
}

cron.schedule('*/2 * * * *', async () => {
    const streamers = await streamer.findAll()

    for (const streamer of streamers) {
        const { isLive, ...streamData } = await isStreamLive(streamer);

        if (isLive && diffDate(streamer['uptime'], 'minute', 30)) {
            if (streamer['name'] === 'cirka_') {
                title = []
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
                        name: `${streamData['user_login']}.webp`
                    }]
                })
        } else if (isLive) {
            await streamer.update({ uptime: new Date() }, { where: { name: streamer['name'] } })
            if (streamer['name'] === 'cirka_') await checkClip(streamData)
        }
    }
}, { scheduled: true, timezone: "Europe/Paris" });