import cron from 'node-cron';
import axios from "axios";

import { client } from '../app.js';
import { MessageEmbed } from "discord.js";
import logger from "../services/logger.js";
import { instagram } from "../services/keyv.js";
import { channels, guildId } from "../config.js";

const baseURL = 'https://www.instagram.com/cirkajin/feed/?__a=1'
const userName = (html) => html['graphql']['user']['full_name']
const totalPhotos = (html) => html['graphql']['user']['edge_owner_to_timeline_media']['count']
const userPhoto = (html) => html['graphql']['user']['profile_pic_url']
const lastPublication = (html) => html['graphql']['user']['edge_owner_to_timeline_media']['edges'][0]['node']['shortcode']
const lastPhotoUrl = (html) => html['graphql']['user']['edge_owner_to_timeline_media']['edges'][0]['node']['display_url']
const lastThumbUrl = (html) => html['graphql']['user']['edge_owner_to_timeline_media']['edges'][0]['node']['thumbnail_src']
const timestamp = (html) => html['graphql']['user']['edge_owner_to_timeline_media']['edges'][0]['node']['taken_at_timestamp']
const descriptionPhoto = (html) => html['graphql']['user']['edge_owner_to_timeline_media']['edges'][0]['node']['edge_media_to_caption']['edges'][0]['node']['text']

cron.schedule('* * * * *', async () => {
    try {
      const channel = client.guilds.cache.get(guildId)?.channels.cache.get(channels['social'])

      const html = await axios.get(baseURL).then(res => res.data)
      if (await instagram.get('lastPublication') !== lastPublication(html)) {
        await instagram.set('lastPublication', lastPublication(html))
        await channel?.send({
          embeds: [
            new MessageEmbed()
              .setColor('#DD2A7B')
              .setAuthor('Instagram', 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Instagram_logo_2016.svg/langfr-1024px-Instagram_logo_2016.svg.png')
              .setTitle(`Nouvelle publication de ${userName(html)}`)
              .setURL(`https://www.instagram.com/p/${lastPublication(html)}/`)
              .setDescription(descriptionPhoto(html))
              .setThumbnail(lastPhotoUrl(html))
          ]
        })
      }
    } catch (e) {
      logger.error(e)
    }
  },
  {
    timezone: 'Europe/Paris'
  })