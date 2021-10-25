import logger from "../services/logger.js";

export const event = {
  name: 'guildMemberRemove',
  description: "When a member left the guild",
  async execute(member) {
    if (member.user.bot) return
    try {
      const { discordLogger } = await import('../utils/helpers.js')
      await discordLogger('error', {
        title: `👤  Utilisateur - ${member.user.username}`,
        descr: `${member} vient de quitter le serveur`
      })
    } catch (error) {
      logger.error(error);
    }
  },
};