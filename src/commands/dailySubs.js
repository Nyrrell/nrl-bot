import { SlashCommandBuilder } from "@discordjs/builders";
import { dailySub } from "../services/db.js";
import { channels, clientId } from "../config.js";

export const command = {
    data: new SlashCommandBuilder()
        .setName('daily')
        .setDescription('Daily post [Nyrrell]')
        .setDefaultPermission(false)

        .addSubcommand(subcommand =>
            subcommand.setName('add')
                .setDescription('Ajouter des liens dans la base de donnée')
                .addStringOption(option => option.setName("links")
                    .setDescription('Les liens à ajouter séparer par un espace')
                    .setRequired(true)))

        .addSubcommand(subcommand =>
            subcommand.setName('new')
                .setDescription('Y\'a pas eu de daily ?'))

        .addSubcommand(subcommand =>
            subcommand.setName('refresh')
                .setDescription('Le daily est pété :(')),

    async execute(interaction) {

        const channelId = interaction.channel.id
        const command = interaction.options.getSubcommand()

        if (channelId !== channels['debug'] && channelId !== channels['dailySub'])
            return interaction.reply({ content: "Pas le bon channel", ephemeral: true })


        const availableDaily = await dailySub.findAll({ where: { send: false } })
        const random = Math.floor(Math.random() * availableDaily.length)
        const content = availableDaily[random].url

        if (command === "new") {
            await interaction.reply({ content: content, fetchReply: true })
                .then(async res => {
                        await res.react('👍')
                        await res.react('👎')
                        await dailySub.update({ send: true }, { where: { url: content } })
                    }
                ).catch(error => console.log(error))

        } else if (command === "refresh") {
            const lastMessage = await interaction.channel.messages.fetch()
                .then(messages => messages.filter(user => user.author.id === clientId).first())

            await lastMessage.edit({ content: content })
            return interaction.reply({ content: "Le daily à été modifié", ephemeral: true })
                .then(dailySub.update({ send: true }, { where: { url: content } }))
                .catch(error => console.log(error))

        } else if (command === "add") {

            const links = interaction.options.getString('links')
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
        }
    },
};
