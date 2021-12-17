import axios from "axios";

import { epicGameKeyv } from "../services/keyv.js";
import { channels, color } from "../config.js";
import logger from "../services/logger.js";
import { MessageEmbed } from "discord.js";
import { client } from '../app.js';

const epicApi = axios.create({
  baseURL: 'https://store-site-backend-static.ak.epicgames.com/',
  params: { 'locale': 'fr' }
});

export const getEpicFreeGames = async () => {
  try {
    const freeGames = await epicApi.get('freeGamesPromotions')
      .then(({ data }) => data['data']['Catalog']['searchStore']['elements']
        .filter(game => game['promotions']?.['promotionalOffers']['0']?.['promotionalOffers']['0']?.['discountSetting']['discountPercentage'] === 0));

    const freeGamesId = freeGames.map(game => game['id']);
    const offerInDb = await epicGameKeyv.get('latestOffer');

    for (const game of freeGames) {
      if (offerInDb?.includes(game['id'])) continue;

      let thumbnail, cover
      for (const image of game['keyImages']) {
        if (['OfferImageWide', 'DieselStoreFrontWide'].includes(image['type'])) cover = image['url']
        if (image['type'] === 'Thumbnail') thumbnail = image['url']
      }

      const promotionEnd = game['promotions']?.['promotionalOffers']['0']?.['promotionalOffers']['0']['endDate']

      await client.channels.cache.get(channels['tips'])
        ?.send({
          embeds: [
            new MessageEmbed()
              .setAuthor('Epic Games Store', 'https://cdn2.unrealengine.com/Unreal+Engine%2Feg-logo-filled-1255x1272-0eb9d144a0f981d1cbaaa1eb957de7a3207b31bb.png')
              .setColor(color.blue)
              .setTitle(`${game['title']} est gratuit sur epic !`)
              .setURL(`https://www.epicgames.com/store/p/${game['urlSlug']}`)
              .setDescription(game['description'])
              .setImage(cover || thumbnail)
              .setFooter(`La promotion se termine le ${new Date(promotionEnd).toLocaleString('fr-FR', {
                timeZone: 'Europe/Paris',
                dateStyle: 'short',
                timeStyle: 'short'
              }).replace(' ', ' à ')}`)
          ]
        })

      await epicGameKeyv.set("latestOffer", freeGamesId);
    }
  } catch (e) {
    logger.error(e)
  }
}