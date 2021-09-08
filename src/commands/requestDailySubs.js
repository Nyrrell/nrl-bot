import { SlashCommandBuilder } from "@discordjs/builders";
import { dailySub } from "../services/db.js";
import { channel, clientId } from "../config.js";

export const command = {
    data: new SlashCommandBuilder()
        .setName('new-daily')
        .setDescription('Demande un nouveau daily post !')
        .setDefaultPermission(false)
        .addBooleanOption(option => option
            .setName('nouveau')
            .setDescription('Le daily n\'a pas été envoyé ?')),

    async execute(interaction) {

        if (interaction.channel.id !== channel['debug'] && interaction.channel.id !== channel['dailySub'])
            return interaction.reply({ content: "Pas le bon channel", ephemeral: true })

        const newDailyNeeded = interaction.options.getBoolean('nouveau')

        const availableDaily = await dailySub.findAll({ where: { send: false } })
        const random = Math.floor(Math.random() * availableDaily.length)
        const content = availableDaily[random].url

        if (newDailyNeeded) {
            return interaction.reply({ content: content })
                .then(dailySub.update({ send: true }, { where : { url : content }}))
                .catch(reason => console.log(reason))

        } else {
            const lastMessage = await interaction.channel.messages.fetch()
                .then(messages => messages.filter(user => user.author.id === clientId).first())

            await lastMessage.edit({ content: content })
            return interaction.reply({ content: "Le daily à été modifié", ephemeral: true })
                .then(dailySub.update({ send: true }, { where : { url : content }}))
                .catch(reason => console.log(reason))

        }

    },
};
