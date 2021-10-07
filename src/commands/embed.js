import { SlashCommandBuilder } from "@discordjs/builders";
import { MessageActionRow, MessageButton, MessageSelectMenu, MessageEmbed, } from "discord.js";

export const command = {
  data: new SlashCommandBuilder()
    .setName('embed')
    .setDescription('Envoyer un message formater')
    .setDefaultPermission(false),
  async execute(interaction) {

    const collector = interaction.channel.createMessageComponentCollector();
    const embed = new MessageEmbed();

    interaction.reply({ embeds: [{title: "Commencer par choisir un premier champ à ajouter", color: '#f1c40f'}], ephemeral: true, components: [this.select, this.button] })

    const embedBuidler = async (method) => {

      const filter = (filter) => filter.author.id === interaction.user.id
      const content = (text, info) => `\\📝️ | **${text}** ${info ? "```" + info + "```" : ""}`
      const error = (text) => `\\❌ | **${text}**`

      const contentChecker = async (type) => {
        let regex = ''
        let url = ''

        switch (type) {
          case 'img': regex = /^https?:\/\/.*\/.*\.(png|gif|webp|jpeg|jpg)\??.*$/gmi; break
          case 'url': regex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()!@:%_\+.~#?&\/\/=]*)/gmi; break
          case 'color': regex = /^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/gm; break
        }

        while (!regex.test(url)) {
          await interaction.channel.awaitMessages({ max: 1, filter }).then(message => {
            url = message.first().content
            message.first().delete()
          })
          await interaction.editReply({ content: error(`${type === 'color' ? 'La couleur' : 'Le lien'} n'est pas valide, merci de corriger ça !`) })
        }
        return url
      }

      const answer = async () => {
        let input = ''
        let value = false
        while (!['oui', 'non'].includes(input)) {
          await interaction.channel.awaitMessages({ max: 1, filter }).then(message => {
            input = message.first().content
            value = input === 'oui'
            message.first().delete()
          })
          if (!['oui', 'non'].includes(input))
            await interaction.editReply({ content: error("Les réponses valides sont 'oui' ou 'non' !") })
        }
        return value
      }

      if (method === 'setTitle') {
        await interaction.editReply({ content: content("Quel est le titre du message ?"), embeds: [], components: [] })
        await interaction.channel.awaitMessages({ max: 1, filter }).then(message => {
          embed.setTitle(message.first().content)
          message.first().delete()
        })
        if (!this.select.components[0].options.some(o => o.value === 'setURL'))
          await this.select.components[0].addOptions([{ label: 'URL [Titre]', value: 'setURL' }])

      } else if (method === 'setDescription') {
        await interaction.editReply({ content: content("Quel est le texte principal du message ?", "Hyperlien: [nom](url)"), embeds: [], components: [] })
        await interaction.channel.awaitMessages({ max: 1, filter }).then(message => {
          message.first().delete()
          embed.setDescription(message.first().content)
        })

      } else if (method === 'setThumbnail') {
        await interaction.editReply({ content: content("Quel est l'url de la miniature à ajouter ?"), embeds: [], components: [] })
        embed.setThumbnail(await contentChecker('img'))

      } else if (method === 'setImage') {
        await interaction.editReply({ content: content("Quel est l'url de l'image à ajouter ?"), embeds: [], components: [] })
        embed.setImage(await contentChecker('img'))

      } else if (method === 'setURL') {
        await interaction.editReply({ content: content("Quel est l'url à ajouter au titre ?"), embeds: [], components: [] })
        embed.setURL(await contentChecker('url'))

      } else if (method === 'setColor') {
        await interaction.editReply({ content: content("Quel est la couleur du message ?", "Couleur hexadécimal : www.color-hex.com"), embeds: [], components: [] })
        embed.setColor(await contentChecker('color'))

      } else if (method === 'setFooter') {
        let iconURL = ''
        await interaction.editReply({ content: content("Quel est le texte du pied de page ?"), embeds: [], components: [] })
        const text = await interaction.channel.awaitMessages({ max: 1, filter }).then(message => {
            message.first().delete()
            return message.first().content
        })
        await interaction.editReply({ content: content("Ajouter l'url d'une image comme icône pour le footer ? __(oui/non)__") })
        const iconNeeded = await answer()
        if (iconNeeded) {
            await interaction.editReply({ content: content("Quel est l'url de l'icône ?") })
            iconURL = await contentChecker('img')
        }
        embed.setFooter(text, iconURL)

      } else if (method === 'addField') {
        await interaction.editReply({ content: content("Quel est le titre du champ ?", "Hyperlien: [nom](url) \nChamp vide: _blank"), embeds: [], components: [] })
        const name = await interaction.channel.awaitMessages({ max: 1, filter }).then(message => {
          message.first().delete()
          return message.first().content !== '_blank' ? message.first().content : "\u200b"
        })
        await interaction.editReply({ content: content("Quel est la valeur du champ ?", "Hyperlien: [nom](url) \nChamp vide: _blank") })
        const value = await interaction.channel.awaitMessages({ max: 1, filter }).then(message => {
          console.log(message.first().content)
          return message.first().content !== '_blank' ? message.first().content : "\u200b"
        })
        await interaction.editReply({ content: content("Le champ doit-il être afficher à la suite des autres ? __(oui/non)__", "Au moins 2 champs doivent avoir cette propriétés") })
        const inline = await answer()
        embed.addField(name, value, inline)

      } else if (method === 'setAuthor') {
          let iconURL = ''
          let url = ''
          await interaction.editReply({ content: content("Quel est l'auteur du message ?"), embeds: [], components: [] })
          const name = await interaction.channel.awaitMessages({ max: 1, filter }).then(message => {
            message.first().delete()
            return message.first().content
          })
          await interaction.editReply({ content: content("Ajouter l'avatar de l'auteur ? __(oui/non)__") })
          const avatarNeeded = await answer()
          if (avatarNeeded) {
            await interaction.editReply({ content: content("Quel est l'url de l'avatar ?") })
            iconURL = await contentChecker('img')
          }
          await interaction.editReply({ content: content("Ajouter le site de l'auteur ? __(oui/non)__") })
          const urlNeeded = await answer()
          if (urlNeeded) {
            await interaction.editReply({ content: content("Quel est l'url du site à ajouter ?") })
            url = await contentChecker('url')
          }
          embed.setAuthor(name, iconURL, url)
      }

      if (collector.total === 1) {
        await this.select.components[0].addOptions([{ label: 'Couleur', value: 'setColor' }])
        await this.button.components[0].setDisabled(false)
      }
      try {
        return await interaction.editReply({ content: '**- Embed preview -**', embeds: [embed], components: [this.select, this.button]})
      } catch (e) {
        return await interaction.editReply({ content: `Une erreur est survenue : \n${e}`, embeds: [], components: [this.select, this.button]})
      }
    }

    collector.on('collect', async collected => {
      await collected.deferUpdate()
      if (collected.customId === 'embedBuilder') await embedBuidler(collected['values'][0])
      if (collected.customId === 'quit') collector.stop('stop')
      if (collected.customId === 'send') collector.stop('send')
    });

    collector.on('end', (collected, reason) => {
      if (reason !== 'send') return interaction.editReply({ content: '** Annulation de la creation du message **', embeds: [], components: []})
      return interaction.channel.send({embeds: [embed]}).then(res => interaction.editReply({ content: `** Création terminé ! ** \`\`\`L'id du message est : ${res.id} \`\`\``, embeds: [], components: []}))
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
          }
          ,
          {
              label: 'Footer',
              value: 'setFooter',
          },
          {
              label: 'Auteur',
              value: 'setAuthor',
          },
        ]),
    ),
  button : new MessageActionRow()
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
    )
}