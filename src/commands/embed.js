import { MessageActionRow, MessageButton, MessageSelectMenu, MessageEmbed, Collection, } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import logger from "../services/logger.js";
import { color } from "../config.js";

export const command = {
  permissions: {
    id: '343169638336561154',
    type: 'USER',
    permission: true
  },
  data: new SlashCommandBuilder()
    .setName('embed')
    .setDescription('Envoyer un message formater')
    .setDefaultPermission(false),
  defer: new Collection(),
  async execute(interaction) {

    const { user, channel } = interaction
    const { red, blue, green, yellow } = color
    const deferred = this.defer.find((c, u) => u === user.id && c.channelId === channel.id)

    if (deferred) {
      const filter = (filter) => ['yes', 'no'].includes(filter.customId) && interaction.id === filter.message.interaction.id
      await interaction.reply({ embeds: [{title: `❌  ${user.username} utilise déjà cette fonction dans ce channel`, description: 'Voulez vous forcer la fermeture ?', color: red}], ephemeral: true, components: [this.buttonYN] })
       await interaction.channel.awaitMessageComponent({ filter }).then(async res => {
        await res.deferUpdate().then(interaction.editReply({ components: [] }))
        if (res.customId === 'yes') {
          await deferred.stop('stop')
          await interaction.editReply({ embeds: [{ title: '✅  Vous pouvez relancer la fonction', color: green }] })
        }
      })
      return
    }

    const filter = (filter) => !['yes', 'no'].includes(filter.customId) && interaction.id === filter.message.interaction.id
    const collector = channel.createMessageComponentCollector({ filter, idle: (60000 * 15) });
    this.defer.set(user.id, collector)
    const embed = new MessageEmbed();

    interaction.reply({ embeds: [{title: "Commencer par choisir un premier élément à ajouter", color: blue}], ephemeral: true, components: [this.select, this.button] })

    const embedBuidler = async (method) => {

      const throwQuestion = (type, text, info = '') => {
        let icon = ''
        let color = 'DEFAULT'
        switch (type) {
          case 'base' : color = green; icon = '📝️'; break
          case 'question' : color = yellow; icon = '💬'; break
          case 'error' : color = red; icon = '❌'; break
        }
        const question = new MessageEmbed()
          .setTitle(`${icon}  ${text}`)
          .setDescription(`${info ? "```md\n" + info + "```" : ""}`)
          .setColor(color)

        return interaction.editReply({ embeds: [question], components: type === 'question' ? [this.buttonYN] : [] })
      }

      const userResponse = () => {
        const filter = (filter) => filter.author.id === user.id
        return channel.awaitMessages({ max: 1, filter }).then(message => {
          message.first().delete()
          return message.first().content !== '_blank' ? message.first().content : "\u200b"
        })
      }

      const contentChecker = async (type) => {
        let regex = ''
        let url = ''

        switch (type) {
          case 'img': regex = /^https?:\/\/.*\/.*\.(png|gif|webp|jpeg|jpg)\??.*$/gmi; break
          case 'url': regex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()!@:%_+.~#?&\/=]*)/gmi; break
          case 'color': regex = /^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/gm; break
        }

        while (!regex.test(url)) {
          if (url) await throwQuestion('error', `${type === 'color' ? 'La couleur' : 'Le lien'} n'est pas valide, merci de corriger ça !`)
          url = await userResponse()
        }
        return url
      }

      const answer = async () => {
        const filter = (filter) => ['yes', 'no'].includes(filter.customId) && interaction.id === filter.message.interaction.id
        return channel.awaitMessageComponent({ filter }).then(interaction => {
          interaction.deferUpdate()
          return interaction.customId === 'yes'
        })
      }

      if (method === 'setTitle') {
        await throwQuestion('base', "Quel est le titre du message ?")
        embed.setTitle(await userResponse())

        await throwQuestion('question', "Ajouter une url au titre ?")
        const urlNeeded = await answer()
        if (urlNeeded) {
          await throwQuestion('base', "Quel est l'url à ajouter au titre ?")
          embed.setURL(await contentChecker('url'))
        }

      } else if (method === 'setDescription') {
        await throwQuestion('base', "Quel est le corps du message ?", "Hyperlien: [nom](url)")
        embed.setDescription(await userResponse())

      } else if (method === 'setThumbnail') {
        await throwQuestion('base', "Quel est l'url de la miniature à ajouter ?")
        embed.setThumbnail(await contentChecker('img'))

      } else if (method === 'setImage') {
        await throwQuestion('base', "Quel est l'url de l'image à ajouter ?")
        embed.setImage(await contentChecker('img'))

      } else if (method === 'setColor') {
        await throwQuestion('base', "Quel est la couleur du message ?", "Couleur hexadécimal : www.color-hex.com")
        embed.setColor(await contentChecker('color'))

      } else if (method === 'setFooter') {
        let iconURL = ''
        await throwQuestion('base', "Quel est le texte du pied de page ?")
        const text = await userResponse()

        await throwQuestion('question', "Ajouter l'url d'une image comme icône pour le footer ?")
        const iconNeeded = await answer()
        if (iconNeeded) {
          await throwQuestion('base', "Quel est l'url de l'icône ?")
          iconURL = await contentChecker('img')
        }

        embed.setFooter(text, iconURL)

      } else if (method === 'addField') {
        await throwQuestion('base', "Quel est le titre du champ ?", "Champ vide: _blank")
        const name = await userResponse()

        await throwQuestion('base', "Quel est la valeur du champ ?", "Champ vide: _blank\nHyperlien: [nom](url)")
        const value = await userResponse()

        await throwQuestion('question', "Le champ doit-il être afficher à la suite des autres ?", "Au moins 2 champs doivent avoir cette propriétés pour 3 champs maximum côte à côte")
        const inline = await answer()

        embed.addField(name, value, inline)

      } else if (method === 'setAuthor') {
        let iconURL = ''
        let url = ''
        await throwQuestion('base', "Quel est l'auteur du message ?")
        const name = await userResponse()

        await throwQuestion('question', "Ajouter l'avatar de l'auteur ?")
        const avatarNeeded = await answer()
        if (avatarNeeded) {
          await throwQuestion('base', "Quel est l'url de l'avatar ?")
          iconURL = await contentChecker('img')
        }

        await throwQuestion('question', "Ajouter le site de l'auteur ?")
        const urlNeeded = await answer()
        if (urlNeeded) {
          await throwQuestion('base', "Quel est l'url du site à ajouter ?")
          url = await contentChecker('url')
        }

        embed.setAuthor(name, iconURL, url)
      }

      if (collector.total === 1) {
        await this.select.components[0].addOptions([{ label: 'Couleur', value: 'setColor' }])
        await this.button.components[0].setDisabled(false)
      }
      try {
        return await interaction.editReply({ embeds: [embed], components: [this.select, this.button] })
      } catch (e) {
        return await interaction.editReply({ embeds: [{title: `⚠️  Une erreur est survenue : \n${e}`, color: red}], components: []})
      }
    }

    collector.on('collect', async collected => {
      try {
        await collected.deferUpdate()
        if (collected.customId === 'embedBuilder') await embedBuidler(collected['values'][0])
        if (collected.customId === 'quit') collector.stop('stop')
        if (collected.customId === 'send') collector.stop('send')
      } catch (e) {
        logger.error(e)
      }
    });

    collector.on('end', (collected, reason) => {
      try {
        this.defer.delete(user.id)
        if (reason === 'send') return channel.send({ embeds: [embed] }).then(res => interaction.editReply({
          embeds: [{
            title: '✅  Création terminé !',
            description: `\`\`\`L'id du message est : ${res.id} \`\`\``,
            color: green
          }], components: []
        }))
        return interaction.editReply({
          embeds: [{
            title: (reason !== 'stop' ? '🛑  Arret automatique' : '‼️  Annulation de la creation du message'),
            color: red
          }], components: []
        })
      } catch (e) {
        logger.error(e)
      }
    });
  },
  select: new MessageActionRow()
    .addComponents(
      new MessageSelectMenu()
        .setCustomId('embedBuilder')
        .setPlaceholder('Quel type de champ ajouter ?')
        .addOptions([
          {
            label: 'Titre',
            value: 'setTitle',
          },
          {
            label: 'Description',
            value: 'setDescription',
          },
          {
            label: 'Champs',
            value: 'addField',
          },
          {
            label: 'Thumbnail',
            value: 'setThumbnail',
          },
          {
            label: 'Image',
            value: 'setImage',
          },
          {
            label: 'Footer',
            value: 'setFooter',
          },
          {
            label: 'Auteur',
            value: 'setAuthor',
          }
        ]),
    ),
  button: new MessageActionRow()
    .addComponents(
      new MessageButton()
        .setCustomId('send')
        .setLabel('Envoyer')
        .setStyle('SUCCESS')
        .setDisabled(true)
    )
    .addComponents(
      new MessageButton()
        .setCustomId('quit')
        .setLabel('Annuler')
        .setStyle('DANGER')
    ),
  buttonYN: new MessageActionRow()
    .addComponents(
      new MessageButton()
        .setCustomId('yes')
        .setStyle('SUCCESS')
        .setEmoji('✔️')
    )
    .addComponents(
      new MessageButton()
        .setCustomId('no')
        .setStyle('DANGER')
        .setEmoji('✖️')
    )
}