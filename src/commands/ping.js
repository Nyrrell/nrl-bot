export const command = {
    name: 'ping',
    description: 'Répond avec le message pong',
    async execute(interaction) {
        return interaction.reply('pong');
    },
};