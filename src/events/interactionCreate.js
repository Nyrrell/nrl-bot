export const event = {
    name: 'interactionCreate',
    execute(interaction) {
        if (!interaction.isCommand()) return;

        const command = interaction.client.commands.get(interaction.commandName);
        console.log(interaction.client.commands)
        if (!command) return;
        try {
            command.execute(interaction);
        } catch (error) {
            console.error(error);
            return interaction.reply({
                content: 'Une erreur est survenue lors de l\'exécution de l\'interaction',
                ephemeral: true
            });
        }
    },
};