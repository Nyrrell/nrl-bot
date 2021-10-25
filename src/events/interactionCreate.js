import logger from "../services/logger.js";

export const event = {
    name: 'interactionCreate',
    execute(interaction) {
        if (!interaction.isCommand()) return;
        const command = interaction.client.commands.get(interaction.commandName);
        if (!command) return;
        try {
            command.execute(interaction);
        } catch (error) {
            logger.error(error);
            return interaction.reply({
                content: 'Une erreur est survenue lors de l\'exécution de l\'interaction',
                ephemeral: true
            });
        }
    },
};