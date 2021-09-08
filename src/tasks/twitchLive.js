import cron from 'node-cron'

import { twitchClientId, twitchAccessToken, env, channel } from "../config.js";
import { client } from '../app.js'
import { checkUptime } from "../utils/helpers.js";

import { StaticAuthProvider } from '@twurple/auth';
const authProvider = new StaticAuthProvider(twitchClientId, twitchAccessToken);

import { ApiClient } from '@twurple/api';
import { getRawData } from '@twurple/common'

const apiClient = new ApiClient({ authProvider });

import { streamer } from "../services/db.js";

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

const messageEmbed = (streamData, userData) => {
    return {
        type: 'rich',
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
                name: `En train de stream ${streamData['game_name'].length ? '- ' + streamData['game_name'] : ""}`,
                value: streamData['title'].length ? streamData['title'] : "Et c'est en direct sur les internets !", //
            }
        ],
        image: {
            url: `${streamData['thumbnail_url'].replace('{width}', 366).replace('{height}', 220)}&${streamData['id']}`,
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

        const {isLive, ...streamData} = await isStreamLive(streamer);

        if (isLive && checkUptime(streamer['uptime'])) {

            await streamer.update({
                uptime: new Date(),
                lastLive: new Date(streamData['started_at'])
            }, { where: { name: streamer['name'] } })

            const embed = messageEmbed(streamData, streamer)
            await client.channels.cache
                .get(env === 'dev' ? channel["debug"] : streamer['channel'])
                ?.send({
                    content: `Hey ! ${streamData['user_name']} lance son live @everyone`,
                    embeds: [embed]
                })

        } else if (isLive) {
            await streamer.update({ uptime: new Date() }, { where: { name: streamer['name'] } })
        }
    }
});