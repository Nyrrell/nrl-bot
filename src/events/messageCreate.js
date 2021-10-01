export const event = {
    name: 'messageCreate',
    async execute(message) {
        if (message.author.bot) return
        const filter = message.client.filters.find(filter => filter.condition(message))
        if (!filter) return;
        try {
            filter.execute(message);
        } catch (error) {
            console.error(error);
        }
    },
};