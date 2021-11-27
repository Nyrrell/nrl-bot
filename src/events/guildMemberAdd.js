import logger from "../services/logger.js";
import { channels, guildId } from "../config.js";


export const event = {
  name: 'guildMemberAdd',
  description: "When a member join the guild",
  async execute(member) {
    const { user, guild } = member

    if (member.user.bot || member.guild.id !== guildId) return;

    try {
      member.guild.channels.cache.get(channels['taverne'])?.send({
      content: `<@${user.id}> vient de débarquer sur le serveur **${guild.name}**, bienvenue ${user.username} 👋`,
        allowedMentions: {users: []}
      })
    } catch (error) {
      logger.error(error);
    }
  },
};