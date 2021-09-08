import cron from 'node-cron'

import { client } from '../app.js'
import { dailySub } from "../services/db.js";
import { env, channel } from "../config.js";

cron.schedule('0 9 * * *', async () => {

    const availableDaily = await dailySub.findAll({ where: { send: false } })
    const random = Math.floor(Math.random() * availableDaily.length)
    const content = availableDaily[random].url

    await client.channels.cache.get(env === 'dev' ? channel['debug'] : channel['dailySub'])
        ?.send({ content: content, fetchReply: true })
        .then(async res => {
            await res.react('👍')
            await res.react('👎')
            await dailySub.update({ send: true }, { where: { url: content } })
        }).catch(reason => console.log(reason))
})