import axios from "axios";
import { MessageEmbed } from "discord.js";

import { client } from '../app.js';
import logger from "../services/logger.js";
import { primeGamingKeyv } from "../services/keyv.js";
import { channels, color, guildId } from "../config.js";

const primeGamingApi = axios.create({
  baseURL: 'https://gql.twitch.tv/gql',
  headers: {
    "Accept-Language": "fr-FR",
    "Client-Id": "kimne78kx3ncx6brgo4mv6wki5h1ko"
  }
})

export const primeGames = async () => {
  try {
    const channel = await client.guilds.cache.get(guildId)?.channels.cache.get(channels['tips'])

    const primeOfferContent = [] = await primeGamingApi.post("", {
      "operationName": "Prime_PrimeOfferList_PrimeOffers_Eligibility",
      "variables": {},
      "extensions": {
        "persistedQuery": {
          "version": 1,
          "sha256Hash": "8002dbaac2b59f770515e7aa901484a78d9150e54283c3b21f2229f83eca48cf"
        }
      }
    }).then(({ data }) => data.data?.['primeOffersWithEligibility'])
    const offersId = primeOfferContent.map(offer => offer['id']);

    const storedOffers = await primeGamingKeyv.get('latestOffers');

    for (const offer of primeOfferContent) {
      if (storedOffers?.includes(offer['id'])) continue;

      let description;
      if (offer['deliveryMethod'] === "DIRECT_ENTITLEMENT" || offer['tags'].includes('FGWP')) {
        const config = offer['description'].indexOf('MINIMALE');
        config !== -1 ? description = offer['description'].slice(0, config) : description = offer['description'];
      }

      await channel.send({
        embeds: [
          new MessageEmbed()
            .setColor(color.blue)
            .setAuthor('Prime Gaming', 'https://m.media-amazon.com/images/G/01/sm/shared/crown_animation_loop.gif')
            .setTitle(offer['title'])
            .setURL(offer['content']['externalURL'] || 'https://gaming.amazon.com/loot/')
            .setDescription(description || "")
            .setImage(offer['imageURL'])
            .setFooter(offer['content']['categories'][0])
        ]
      });

      await primeGamingKeyv.set("latestOffers", offersId);
    }
  } catch (e) {
    logger.error(e);
  }
}