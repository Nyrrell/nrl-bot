import cron from 'node-cron'

import { twitchAPI } from './twitch-api.js';
import { twitchClientId, twitchOAuthAccessToken } from "../config.js";
import { client } from '../app.js'

const api = twitchAPI(twitchClientId, twitchOAuthAccessToken);

const messageEmbed = (streamData, userData) => {
    return {
        type: 'rich',
        color: userData['color'],
        title: userData['title'],
        url: `https://twitch.tv/${streamData['user_login']}`,
        description:
            `${userData['descr']} \nhttps://twitch.tv/${streamData['user_login']}`,
        thumbnail: {
            url: userData['thumb'],
        },
        fields: [
            {
                name: `En train de stream - ${streamData['game_name']}`,
                value: `${streamData['title']}`,
            }
        ],
        image: {
            //url: 'https://cdn.discordapp.com/attachments/703265324937642067/794747634518196234/4190dedcba4e2115e2a2cac6e2cf755f.gif',
            url: `${streamData['thumbnail_url'].replace('{width}', 366).replace('{height}', 220)}`,
        },
        timestamp: new Date(),
        footer: {
            text: ''
        }
    }
}
const usersData = {
    cirka_: {
        color: 0x1f69ff,
        title: 'La Cirka TV est en LIVE !',
        descr: 'Le programme le plus Awéwé de Twitch a commencé \u200b \n\n⬇️ Ramène-toi !',
        thumb: 'https://cdn.discordapp.com/attachments/703265324937642067/794746906639073340/logo2020.png',
        channel: '870308271163052052',
        lastLive: ""
    },
    nyrrell: {
        color: 0x8205B3,
        title: 'La Nyrrell Cooking TV est en LIVE !',
        descr: 'Presque sponso deBuyer \u200b \n\n⬇️ En live maintenant',
        thumb: 'https://static-cdn.jtvnw.net/jtv_user_pictures/4c949a71-d370-41df-8c76-a0aa82f721d3-profile_image-300x300.png',
        channel: '870308411512860732',
        lastLive: ""
    }
}

const checkLive = cron.schedule('* * * * *', async () => {
    const streamers = Object.keys(usersData)

    for (const streamer of streamers) {
        const userData = usersData[streamer]
        const {isLive, ...streamData} = await api.getStream(streamer);

        if (isLive && (userData['lastLive'] !== streamData['started_at'])) {
            const embed = messageEmbed(streamData, userData)
            const channel = await client.channels.cache.get(userData['channel'])
            userData['lastLive'] = streamData['started_at']
            await channel.send({content: '** 💢 Hey ! @everyone **', embeds: [embed]})
        }
    }
});

