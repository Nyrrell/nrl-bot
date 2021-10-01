import { channelPrefix, channels } from "../config.js";

export const filter = {
    name: 'isArchived',
    condition(message) {
        return message.channel.parentId === channels['archivesFolder']
    },
    async execute(message) {
        const { sortChannel, discordLogger } = await import("../utils/helpers.js")

        const channelName = message.channel.name.replace(channelPrefix, '')

        try {
        await message.channel.setParent(channels['gamesFolder'])
        const gamesChannelList = await sortChannel(channels['gamesFolder'])
        await message.channel.setPosition(gamesChannelList.indexOf(channelName))
        await discordLogger('info',{
                title: 'Réactivation automatique',
                descr: `Le salon <#${message.channel.id}> a été déplacé dans la catégorie <#${message.channel.parentId}>`
            })
        } catch (error) {
            console.error(error);
        }
    },
};