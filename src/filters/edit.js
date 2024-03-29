import logger from "../services/logger.js";
import { clientId, devId } from "../config.js";

export const filter = {
    name: 'edit',
    condition(message) {
        return message.content.startsWith('>edit') && message.author.id === devId
    },
    async execute(message) {
        try {
            const newContent = message.content.replace('>edit', '')
            const lastMessage = await message.channel.messages.fetch()
                .then(messages => messages.filter(user => user.author.id === clientId).first())

            await lastMessage.edit({ content: newContent })
            await message.delete()
        } catch (e) {
            logger.error(e)
        }
    }
}
