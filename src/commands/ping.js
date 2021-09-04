import { SlashCommandBuilder } from "@discordjs/builders";
export const command =  {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Répond avec le message pong'),
    async execute(interaction) {
        await interaction.reply('Pong!');
    },
};
