import { channels } from "../config.js";

export const event = {
    name: 'messageCreate',
    async execute(message) {
        if (message.channel.parentId !== channels['archivesFolder'] || message.author.bot) return;

        const { sortChannel } = await import("../utils/helpers.js")
        const { discordLogger } = await import("../utils/helpers.js")

        try {
        await message.channel.setParent(channels['gamesFolder'])
        const gamesChannelList = await sortChannel(channels['gamesFolder'])
        await message.channel.setPosition(gamesChannelList.indexOf(message.channel.name))
        await discordLogger('info',{
                title: 'Réactivation automatique',
                descr: `Le salon <#${message.channel.id}> a été déplacé dans la catégorie <#${message.channel.parentId}>`
            })
        } catch (error) {
            console.error(error);
        }

    },
};