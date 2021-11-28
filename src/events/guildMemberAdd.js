import logger from "../services/logger.js";
import { channels, guildId } from "../config.js";


export const event = {
  name: 'guildMemberAdd',
  description: "When a member join the guild",
  async execute(member) {
    const { user, guild } = member
    if (user.bot || guild.id !== guildId) return;

    try {
      member.guild.channels.cache.get(channels['taverne'])?.send({
      content: `<@${user.id}> vient de débarquer sur le serveur **${guild.name}**, bienvenue ${user.username} 👋`,
      })
    } catch (error) {
      logger.error(error);
    }
  },
};