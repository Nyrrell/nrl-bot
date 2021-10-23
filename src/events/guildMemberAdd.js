import { channels } from "../config.js";

export const event = {
  name: 'guildMemberAdd',
  description: "When a member join the guild",
  async execute(member) {
    const { user, guild } = member

    if (user.bot) return
    try {
      await user.fetch()
      member.client.channels.cache.get(channels['taverne'])?.send({
      content: `${member} vient de débarquer sur le serveur **${guild.name}**, bienvenue 👋`
      })
    } catch (error) {
      console.error(error);
    }
  },
};