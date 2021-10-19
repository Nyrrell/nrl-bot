import { channels, color } from "../config.js";

export const event = {
  name: 'guildMemberAdd',
  description: "When a member join the guild",
  async execute(member) {
    const { user, guild } = member

    if (user.bot) return
    try {
      await user.fetch()
      member.client.channels.cache.get(channels['taverne'])?.send({
        embeds: [
          {
            description: `Vient de débarquer sur le serveur **${guild.name}**, bienvenue <@!${member.id}> 👋`,
            color: user.accentColor ? user.accentColor : color.yellow,
            author: {
              name: member.nickname ? member.nickname : member.displayName,
              icon_url: user.displayAvatarURL()
            },
            // footer: {
            //     text: `✔️ Pense à valider ton status de follower !`
            // }
          }
        ]
      })
    } catch (error) {
      console.error(error);
    }
  },
};