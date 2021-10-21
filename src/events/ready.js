import logger from "../services/logger.js";

export const event = {
  name: 'ready',
  once: true,
  execute(client) {
    logger.info(`Logged in as ${client.user.tag} in ver. ${process.env.npm_package_version}`);
    logger.info(`Logged on ${client.guilds.cache.map(guild => guild.name).join(', ')}`);
    try {
      import('../services/deploy-commands.js');
      import('../tasks/index.js');
    } catch (e) {
      logger.error(e)
    }
  },
};
