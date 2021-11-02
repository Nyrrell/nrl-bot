import cron from 'node-cron';
import axios from "axios";

import { client } from '../app.js';
import { MessageEmbed } from "discord.js";
import logger from "../services/logger.js";
import { instagram } from "../services/keyv.js";
import { channels, guildId } from "../config.js";

const baseURL = 'https://www.instagram.com/cirkajin/feed/?__a=1'

cron.schedule('* * * * *', async () => {
    try {
      const channel = await client.guilds.cache.get(guildId)?.channels.cache.get(channels['social'])

      const data = await axios.get(baseURL).then(res => res.data['graphql']?.['user'])
      const lastPublication = data['edge_owner_to_timeline_media']['edges'][0]['node']
      const userName = data['full_name']

      const lastPhotoUrl = lastPublication['display_url']
      const lastPublicationCode = lastPublication['shortcode']
      const descriptionPhoto = lastPublication['edge_media_to_caption']['edges'][0]['node']['text']

      if (await instagram.get('lastPublication') !== lastPublicationCode) {
        await instagram.set('lastPublication', lastPublicationCode)
        await channel?.send({
          embeds: [
            new MessageEmbed()
              .setColor('#DD2A7B')
              .setAuthor('Instagram', 'https://www.instagram.com/static/images/ico/favicon-192.png/68d99ba29cc8.png')
              .setTitle(`Nouvelle publication de ${userName}`)
              .setURL(`https://www.instagram.com/p/${lastPublicationCode}/`)
              .setDescription(descriptionPhoto)
              .setThumbnail(`attachment://${lastPublicationCode}.webp`)
          ],
          files: [{
            attachment: lastPhotoUrl,
            name: `${lastPublicationCode}.webp`
          }]
        })
      }
    } catch (e) {
      logger.error(e)
    }
  },
  {
    timezone: 'Europe/Paris'
  })