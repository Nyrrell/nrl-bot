import { client } from '../app.js'
import logger from "../services/logger.js";
import { channels, dailySubsEmbedUrl, dailySubsGifsUrl, dailySubsTokenUrl, devId } from "../config.js";
import axios from "axios";
import { Collection } from "discord.js";

export const postDailySubs = async () => {
  if (!client.dailySubs?.size) {
    await getGifs();
  }

  const dailySubsCollection = client.dailySubs;
  if (!dailySubsCollection?.size) return

  const components = client.commands.get("daily").components
  const gifs = dailySubsCollection.get("gifs");
  const msg = await client.users.cache.get(devId)
    ?.send({
      content: dailySubsEmbedUrl + gifs[dailySubsCollection.get("index")],
      components
    });

  const collector = msg.channel.createMessageComponentCollector();
  collector.on('collect', async (collected) => {
    await collected.deferUpdate();
    if (collected.customId === "valid") {
      msg.delete();
      await client.channels.cache.get(channels['dailySub'])
        ?.send({ content: dailySubsEmbedUrl + gifs[dailySubsCollection.get("index")], fetchReply: true })
        .then(async res => {
          await res.react('👍')
          await res.react('👎')
        }).catch(reason => logger.error(reason))
      client.dailySubs = null;
      return collector.stop();
    } else if (collected.customId === "quit") {
      client.dailySubs = null;
      collector.stop();
      return msg.edit({ content: "Annulation", components: [] }).catch(error => logger.error(error))
    }

    dailySubsCollection.set("index", (collected.customId === "next" ? dailySubsCollection.get("index")+1 : dailySubsCollection.get("index")-1));

    dailySubsCollection.get("index") >= 1
      ? collected.message.components[0].components[0].setDisabled(false)
      : collected.message.components[0].components[0].setDisabled(true);

    msg.edit({ content: dailySubsEmbedUrl + gifs[dailySubsCollection.get("index")], components: collected.message.components })
      .catch(error => logger.error(error))
  });
}

export const getGifs = async () => {
  const token = await axios.get(dailySubsTokenUrl)
    .then(({ data }) => data['token'])
    .catch(reason => logger.error(reason))

  const gifs = await axios.get(dailySubsGifsUrl, { headers: { "Authorization": `Bearer ${token}` }})
    .then(({ data }) => data['gifs'])
    .catch(reason => logger.error(reason))

  if (!gifs) return;
  client.dailySubs = new Collection()
    .set("gifs", gifs.map(g => g.id))
    .set("index", 0);
}