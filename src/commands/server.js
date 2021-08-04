export const command = {
    name: 'server',
    description: 'Affiche les informations du serveur',
    async execute(interaction) {
        return interaction.reply(`Nom du server: ${interaction.guild.name}\nMembre total: ${interaction.guild.memberCount}`);
    },
};