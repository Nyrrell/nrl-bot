import cron from 'node-cron';
import axios from "axios";

import { channels, color } from "../config.js";
import logger from "../services/logger.js";
import { MessageEmbed } from "discord.js";
import { client } from '../app.js';

const apiEpic = 'https://store-site-backend-static.ak.epicgames.com/freeGamesPromotions?locale=fr'
const embedFreeNow = []

cron.schedule('1 17 * * THU', async () => {
    try {
      const freeGames = await axios.get(apiEpic).then(({ data }) => data['data']['Catalog']['searchStore']['elements'])

      for (const game of freeGames) {

        const baseURL = 'https://www.epicgames.com/store/p/'

        let thumbnail, cover
        for (const image of game['keyImages']) {
          if (['OfferImageWide', 'DieselStoreFrontWide'].includes(image['type'])) cover = image['url']
          if (image['type'] === 'Thumbnail') thumbnail = image['url']
        }

        const gamePromotions = game['promotions']?.['promotionalOffers']['0']?.['promotionalOffers']['0']

        if (gamePromotions?.['discountSetting']['discountPercentage'] === 0) {
          embedFreeNow.push(
            new MessageEmbed()
              .setAuthor('Epic Games Store', 'https://cdn2.unrealengine.com/Unreal+Engine%2Feg-logo-filled-1255x1272-0eb9d144a0f981d1cbaaa1eb957de7a3207b31bb.png')
              .setColor(color.blue)
              .setTitle(`${game['title']} est gratuit sur epic !`)
              .setURL(baseURL + game['urlSlug'])
              .setDescription(game['description'])
              .setImage(cover || thumbnail)
              .setFooter(`La promotion se termine le ${new Date(gamePromotions['endDate']).toLocaleString('fr-FR', {
                timeZone: 'Europe/Paris',
                dateStyle: 'short',
                timeStyle: 'short'
              }).replace(' ', ' à ')}`)
          )
        }
      }

      await client.channels.cache.get(channels['tips'])
        ?.send({ embeds: embedFreeNow })

    } catch (e) {
      logger.error(e)
    }
  },
  {
    timezone: "Europe/Paris"
  })