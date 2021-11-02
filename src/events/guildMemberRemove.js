import { channels, color } from "../config.js";
import logger from "../services/logger.js";
import { MessageEmbed } from "discord.js";

export const event = {
  name: 'guildMemberRemove',
  description: "When a member left the guild",
  async execute(member) {
    if (member.user.bot) return
    try {
      await member.guild.channels.cache.get(channels['botLogs'])?.send({
        embeds:
          [
            new MessageEmbed()
              .setAuthor(`👤  Utilisateur`)
              .setDescription(`${member.user.username} vient de quitter le serveur`)
              .setColor(color.red)
          ]
      })
    } catch (error) {
      logger.error(error);
    }
  },
};