import { SlashCommandBuilder } from "@discordjs/builders";
import { dailySub } from "../services/db.js";

export const command = {
    data: new SlashCommandBuilder()
        .setName('add_daily_subs')
        .setDescription('Ajouter des liens dans la base de données')
        .setDefaultPermission(false)
        .addStringOption(option => option.setName('liens')
            .setDescription('Les liens à ajouter séparer par un espace')
            .setRequired(true)),

    async execute(interaction) {

        const links = interaction.options.getString('liens')
            .split(' ').map(entries => Object.assign({ url: entries }))

        try {
            await dailySub.bulkCreate(links, { ignoreDuplicates: true })
                .then(async res => {
                    const row = await dailySub.findAll({ where: { createdAt: res[0]?.dataValues.createdAt } });
                    const content = row.length === 1 ? `${row.length} lien a été ajouté` : `${row.length} liens ont été ajoutés`;
                    return interaction.reply({ content: content, ephemeral: true });
                });
        } catch (error) {
            console.log(error)
            return interaction.reply({ content: 'Un problème est survenu', ephemeral: true });
        }
    },
};
