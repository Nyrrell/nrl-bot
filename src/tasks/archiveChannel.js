import cron from 'node-cron'

import { client } from '../app.js'
import { channels, channelPrefix } from "../config.js";
import { diffDate, discordLogger, sortChannel } from "../utils/helpers.js";

cron.schedule('0 2 * * *', async () => {
    const gamesChannels = await client.channels.cache.get(channels['gamesFolder'])?.children

    gamesChannels.each(channel => channel.messages.fetch({ limit: 1 })
        .then(async msg => {
            if (!diffDate((msg.first()?.createdAt || new Date()), 'day', 90)) return;

            await channel.setParent(channels['archivesFolder'])
            const archivedList = await sortChannel(channels['archivesFolder'])
            await channel.setPosition(archivedList.indexOf(channel.name.replace(channelPrefix, '')))
                .then(res => discordLogger('info', {
                        title: 'Archivage automatique',
                        descr: `Le salon <#${res.id}> a été déplacé dans la catégorie <#${res.parentId}> pour cause d'inactivité depuis 90 jours`
                    })
                )
        })
    )
}, { scheduled: true, timezone: "Europe/Paris" });