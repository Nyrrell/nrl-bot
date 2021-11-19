import { client } from '../app.js'
import { channels } from "../config.js";
import logger from "../services/logger.js";
import { dailySub } from "../services/db.js";

export const postDailySubs = async () => {
  const availableDaily = await dailySub.findAll({ where: { send: false } })
  const random = Math.floor(Math.random() * availableDaily.length)
  const content = availableDaily[random].url

  await client.channels.cache.get(channels['dailySub'])
    ?.send({ content: content, fetchReply: true })
    .then(async res => {
      await res.react('👍')
      await res.react('👎')
      await dailySub.update({ send: true }, { where: { url: content } })
    }).catch(reason => logger.error(reason))
}