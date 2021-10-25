import { channelPrefix, channels, color } from "../config.js";
import logger from "../services/logger.js";
import { MessageEmbed } from "discord.js";

export const filter = {
  name: 'isArchived',
  condition(message) {
    return message.channel.parentId === channels['archivesFolder']
  },
  async execute(message) {
    const { sortChannel } = await import("../utils/helpers.js")

    const channelName = message.channel.name.replace(channelPrefix, '')

    try {
      await message.channel.setParent(channels['gamesFolder'])
      const gamesChannelList = await sortChannel(channels['gamesFolder'])
      await message.channel.setPosition(gamesChannelList.indexOf(channelName))
      await message.guild.channels.cache.get(channels['botLogs'])?.send({
        embeds:
          [
            new MessageEmbed()
              .setAuthor('Réactivation automatique')
              .setDescription(`Le salon <#${message.channel.id}> a été déplacé dans la catégorie <#${message.channel.parentId}>`)
              .setColor(color.green)
          ]
      })
    } catch (error) {
      logger.error(error);
    }
  },
};