import cron from 'node-cron';
import axios from "axios";

import { client } from '../app.js';
import logger from "../services/logger.js";
import { channels, color } from "../config.js";

const apiEpic = 'https://store-site-backend-static.ak.epicgames.com/freeGamesPromotions?locale=fr'
const embedFreeNow = []
// const embedUpcoming = [{
//   color: color.yellow,
//   title: 'Prochain jeu gratuit sur epic !',
//   description: ''
// }]

cron.schedule('1 17 * * THU', async () => {
    try {
      const freeGames = await axios.get(apiEpic).then(({ data }) => data['data']['Catalog']['searchStore']['elements'])

      for (const game of freeGames) {

        const baseURL = 'https://www.epicgames.com/store/p/'

        let thumbnail
        for (const image of game['keyImages']) {
          if (image['type'] === 'Thumbnail') thumbnail = image['url']
        }

        const gamePromotions = game['promotions']?.['promotionalOffers']['0']?.['promotionalOffers']['0']
        const upcomingPromotions = game['promotions']?.['upcomingPromotionalOffers']

        if (gamePromotions?.['discountSetting']['discountPercentage'] === 0) {
          embedFreeNow.push({
            color: color.blue,
            title: `${game['title']} est gratuit sur epic !`,
            url: baseURL + game['urlSlug'],
            description: game['description'],
            thumbnail: {
              url: thumbnail,
            },
            footer: {
              text: `La promotion se termine le ${new Date(gamePromotions['endDate']).toLocaleString('fr-FR', {
                dateStyle: 'short',
                timeStyle: 'short'
              }).replace(' ', ' à ')}`
            }
          })
        } /*else if (upcomingPromotions?.length) {
          embedUpcoming[0]['description'] += `[${game['title']}](${baseURL}), le ${new Date(game['effectiveDate']).toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' }).replace(' ', ' à ')}\n`
      }*/
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