import logger from "../services/logger.js";

export const event = {
  name: 'messageCreate',
  description: "when a message is fired",
  async execute(message) {
    if (message.author.bot) return

    try {
      const filter = message.client.filters.find(filter => filter.condition(message));
      if (!filter) return;
      filter.execute(message);
    } catch (e) {
      logger.error(e);
    }
  },
};