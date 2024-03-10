import logger from "../services/logger.js";
import { devId } from "../config.js";

export const filter = {
  name: 'purge',
  prefix: '>',
  description: 'Supprime des messages entre 1 & 99',
  condition(message) {
    return message.content.startsWith(this.prefix + this.name) && message.author.id === devId
  },
  async execute(message) {
    const args = message.content.slice(this.name.length + 1).trim().split(/ +/);
    const amount = args[0] ? parseInt(args[0]) + 1 : 2;

    if (isNaN(amount) && message.channel.type !== "DM") {
      return message.reply('Ce n\'est pas un nombre valide');
    } else if (amount <= 1 || amount > 100) {
      return message.reply('Il faut un nombre entre 1 et 99');
    }

    if (message.channel.type === "DM") {
      message.channel.messages.fetch()
        .then(msg => {
          const botMsg = msg.filter(({ author }) => author.id === message.client.user.id);
          botMsg.forEach(m => m.delete())
        }).catch(err => {
        logger.error(err);
      });
    } else {
      message.channel.bulkDelete(amount, true).catch(err => {
        logger.error(err);
        message.channel.send('Il y\'a eu un problème lors de la tentative de suppression');
      });
    }


  },
};