import { MessageAttachment, MessageEmbed } from "discord.js";
import axios from "axios";

import { client } from '../app.js';
import logger from "../services/logger.js";
import { channels, guildId } from "../config.js";
import { instagramKeyv } from "../services/keyv.js";

const instagramApi = axios.create({
  baseURL: 'https://www.instagram.com/'
});

export const instagramFeed = async () => {
  try {
    const channel = await client.guilds.cache.get(guildId)?.channels.cache.get(channels['social']);

    const userData = await instagramApi.get('cirkajin/feed/?__a=1').then(({ data }) => data['graphql']?.['user']);
    const latestPublications = userData['edge_owner_to_timeline_media']?.['edges'];
    const publicationsId = latestPublications.map(({ node }) => node['id']);

    const storedPublications = await instagramKeyv.get('latestPublications');

    for (const { node: publication } of latestPublications) {
      if (storedPublications?.includes(publication['id'])) continue;

      await channel.send({
        embeds: [
          new MessageEmbed()
            .setColor('#DD2A7B')
            .setAuthor('Instagram', 'https://www.instagram.com/static/images/ico/favicon-192.png/68d99ba29cc8.png')
            .setTitle(`Nouvelle publication de ${userData['full_name']}`)
            .setURL(`https://www.instagram.com/p/${publication['shortcode']}/`)
            .setDescription(publication['edge_media_to_caption']['edges'][0]?.['node']['text'] || "")
            .setThumbnail(`attachment://${publication['shortcode']}.webp`)
        ],
        files: [
          new MessageAttachment(
            publication['display_url'],
            `${publication['shortcode']}.webp`
          )
        ]
      })

      await instagramKeyv.set('latestPublications', publicationsId);
    }
  } catch (e) {
    logger.error(e);
  }
}