import { MessageAttachment, MessageEmbed } from "discord.js";
import axios from "axios";

import { client } from '../app.js';
import logger from "../services/logger.js";
import { instagram } from "../services/db.js";
import { channels, guildId, instagramAppID } from "../config.js";

const instagramApi = axios.create({
  baseURL: 'https://i.instagram.com/api/v1/users/web_profile_info/',
  headers: { 'X-IG-App-ID': instagramAppID },
});

const usernames = ["cirkajin", "rainydayfr"];

export const instagramFeed = async () => {
  try {
    for (const username of usernames) {

      const channelId = username === "cirkajin" ? channels['social'] : channels['rainyday'];
      const channel = await client.guilds.cache.get(guildId)?.channels.cache.get(channelId);

      const userData = await instagramApi.get(`?username=${username}`).then(({ data: { data } }) => data['user']);
      const latestPublications = userData?.['edge_owner_to_timeline_media']?.['edges'];

      const userId = userData['id'];
      const fullname = userData['full_name'];

      const storedPublications = await instagram.findAll({ where: { "userId": userId }});

      for (const { node: publication } of latestPublications) {
        const publicationId = publication['id'];
        const shortcode = publication['shortcode'];
        const descr = publication['edge_media_to_caption']['edges'][0]?.['node']['text'] || "";

        if (storedPublications?.find(({ id }) => id === publicationId)) continue;

        const post = await channel.send({
          embeds: [
            new MessageEmbed()
              .setColor('#DD2A7B')
              .setAuthor('Instagram', 'https://www.instagram.com/static/images/ico/favicon-192.png/68d99ba29cc8.png')
              .setTitle(`Nouvelle publication de ${fullname}`)
              .setURL(`https://www.instagram.com/p/${shortcode}/`)
              .setDescription(descr)
              .setThumbnail(`attachment://${shortcode}.webp`)
          ],
          files: [
            new MessageAttachment(
              publication['display_url'],
              `${shortcode}.webp`
            )
          ]
        });

        await instagram.create({
          "id": publicationId,
          "userId": userId,
          "username": username,
          "descr": descr,
          "thumb": post.embeds[0]['thumbnail']['url'],
          "shortcode": shortcode
        });
      }
    }
  } catch (e) {
    logger.error(e);
  }
}