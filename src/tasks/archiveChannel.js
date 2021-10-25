import cron from 'node-cron'

import { channels, channelPrefix, guildId, color } from "../config.js";
import { diffDate, sortChannel } from "../utils/helpers.js";
import logger from "../services/logger.js";
import { MessageEmbed } from "discord.js";
import { client } from '../app.js'

cron.schedule('0 2 * * *', async () => {
  try {
    const guild = await client.guilds.cache.get(guildId)
    const gamesChannels = await guild?.channels.cache.get(channels['gamesFolder'])?.children

    gamesChannels.each(async channel => await channel.messages.fetch({ limit: 1 })
      .then(async msg => {
        if (!diffDate((msg.first()?.createdAt || new Date()), 'day', 90)) return;

        await channel.setParent(channels['archivesFolder'])
        const archivedList = await sortChannel(channels['archivesFolder'])
        await channel.setPosition(archivedList.indexOf(channel.name.replace(channelPrefix, '')))
          .then(async res => await guild.channels.cache.get(channels['botLogs'])?.send({
              embeds: [
                new MessageEmbed()
                  .setAuthor('Archivage automatique')
                  .setDescription(`Le salon <#${res.id}> a été déplacé dans la catégorie <#${res.parentId}> pour cause d'inactivité depuis 90 jours`)
                  .setColor(color.green)
              ]
            })
          )
      })
    )
  } catch (e) {
    logger.error(e)
  }
}, { scheduled: true, timezone: "Europe/Paris" });