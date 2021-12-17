import axios from "axios";

import { channels, color, guildId } from "../config.js";
import { primeGamingKeyv } from "../services/keyv.js";
import logger from "../services/logger.js";
import { MessageEmbed } from "discord.js";
import { client } from '../app.js';

export const primeGames = async () => {
  try {
    const channel = await client.guilds.cache.get(guildId)?.channels.cache.get(channels['tips'])
    const storeURL = 'https://gaming.amazon.com/loot/'
    const currentOffer = []

    const primeOfferContent = await axios.post("https://gql.twitch.tv/gql", {
      "operationName": "Prime_PrimeOfferList_PrimeOffers_Eligibility",
      "variables": {},
      "extensions": {
        "persistedQuery": {
          "version": 1,
          "sha256Hash": "8002dbaac2b59f770515e7aa901484a78d9150e54283c3b21f2229f83eca48cf"
        }
      }
    }, {
      headers: {
        "Accept-Language": "fr-FR",
        "Client-Id": "kimne78kx3ncx6brgo4mv6wki5h1ko"
      }
    }).then(({ data }) => data.data?.['primeOffersWithEligibility'])

    for (const offer of primeOfferContent) {
      currentOffer.push(offer['id'])

      if (!await primeGamingKeyv.has(offer['id'])) {
        await primeGamingKeyv.set(offer['id'], true)

        let description = ""
        if (offer['deliveryMethod'] === "DIRECT_ENTITLEMENT" || offer['tags'].includes('FGWP')) {
          const config = offer['description'].indexOf('MINIMALE')
          config !== -1 ? description = offer['description'].slice(0, config) : description = offer['description']
        }

        await channel?.send({
          embeds:
            [
              new MessageEmbed()
                .setColor(color.blue)
                .setAuthor('Prime Gaming', 'https://m.media-amazon.com/images/G/01/sm/shared/crown_animation_loop.gif')
                .setTitle(offer['title'])
                .setURL(offer['content']['externalURL'] || storeURL)
                .setDescription(description)
                .setImage(offer['imageURL'])
                .setFooter(offer['content']['categories'][0])
            ]
        })
      }
    }

    const storedOffer = await primeGamingKeyv.iterator()
    for await(const offer of storedOffer) {
      if (!currentOffer.includes(offer[0])) await primeGamingKeyv.delete(offer[0])
    }

  } catch (e) {
    logger.error(e)
  }
}