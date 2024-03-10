import { MessageActionRow, MessageButton } from "discord.js";
import { channels, dailySubsEmbedUrl, devId } from "../config.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import logger from "../services/logger.js";

export const command = {
  permissions: {
    id: devId,
    type: 'USER',
    permission: true
  },
  data: new SlashCommandBuilder()
    .setName('daily')
    .setDescription('Daily post [Nyrrell]')
    .setDefaultPermission(false)
    .addSubcommand(subcommand =>
      subcommand.setName('new').setDescription('Y\'a pas eu de daily ?')),

  async execute(interaction) {
    const channelId = interaction.channel.id
    const command = interaction.options.getSubcommand()

    if (channelId !== channels['debug'] && channelId !== channels['dailySub'])
      return interaction.reply({ content: "Pas le bon channel", ephemeral: true })


    if (command === "new") {
      if (!interaction.client.dailySubs?.size) {
        const { getGifs } = await import("../tasks/postDailySubs.js");
        await getGifs();
      }

      const dailySubs = interaction.client.dailySubs;
      dailySubs.get("gifs")
      await interaction.reply({
        content: dailySubsEmbedUrl + dailySubs.get("gifs")[dailySubs.get("index")], ephemeral: true, components: this.components
      });

      const collector = interaction.channel.createMessageComponentCollector();
      collector.on('collect', async (collected) => {
        await collected.deferUpdate();
        if (collected.customId === "valid") {
          interaction.editReply({ content: "Envoyé", components: [] }).catch(error => logger.error(error))
          interaction.channel.send({ content: dailySubsEmbedUrl + dailySubs.get("gifs")[dailySubs.get("index")] })
              .then(async res => {
                await res.react('👍')
                await res.react('👎')
              })
            .catch(error => logger.error(error));
          interaction.client.dailySubs = null;
          return collector.stop();
        } else if (collected.customId === "quit") {
          interaction.client.dailySubs = null;
          collector.stop();
          return interaction.editReply({ content: "Annulation", components: [] }).catch(error => logger.error(error))
        }

        dailySubs.set("index", (collected.customId === "next" ? dailySubs.get("index")+1 : dailySubs.get("index")-1));

        dailySubs.get("index") >= 1
          ? collected.message.components[0].components[0].setDisabled(false)
          : collected.message.components[0].components[0].setDisabled(true);

        interaction.editReply({ content: dailySubsEmbedUrl + dailySubs.get("gifs")[dailySubs.get("index")], components: collected.message.components })
            .catch(error => logger.error(error))
      });
    } else if (command === "refresh") {
      return interaction.reply({ content: "DEPRECATED", ephemeral: true });
    } else if (command === "add") {
      return interaction.reply({ content: "DEPRECATED", ephemeral: true });
    }
  },
  components: [
    new MessageActionRow()
      .addComponents(new MessageButton().setCustomId('previous').setLabel('Précédent').setStyle('PRIMARY').setDisabled(true))
      .addComponents(new MessageButton().setCustomId('next').setLabel('Suivant').setStyle('PRIMARY')),
    new MessageActionRow()
      .addComponents(new MessageButton().setCustomId('quit').setLabel('Quitter').setStyle('DANGER'))
      .addComponents(new MessageButton().setCustomId('valid').setLabel('Envoyer').setStyle('SUCCESS'))
  ],
};
