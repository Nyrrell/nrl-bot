import cron from 'node-cron'

import { client } from '../app.js'
import { channels } from "../config.js";
import { diffDate } from "../utils/helpers.js";

const gamesCategory = await client.channels.cache.find(category => category.id === '870230463241924648')
const gamesChannels = await gamesCategory.children

gamesChannels.each(channel => channel.messages.fetch({ limit: 1 })
    .then(async msg => {
        if (diffDate(msg.first()?.createdAt, 86400000, 3)) {
            await channel.setParent('870230463241924648')

            await channel.setPosition(1)
                .then(res => {
                    client.channels.cache.get(channels.botLogs)?.send({ content: `<#${res.id}> a été déplacé automatiquement dans la catégorie <#${res.parentId}>` })
                })
        }
    })
)

const test = gamesChannels.map(channel => channel.name.replace(/.*︱/gm, '')).sort()
console.log(test.indexOf("debug-bot"))
console.log(test)