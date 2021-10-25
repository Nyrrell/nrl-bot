import * as fs from 'fs';

import { guildId } from "../config.js";
import { client } from "../app.js";
import logger from "./logger.js";

const commandFiles = fs.readdirSync('./src/commands').filter(file => file.endsWith('.js'));
const commands = [];

for (const file of commandFiles) {
  const { command } = await import(`../commands/${file}`)
  commands.push(command.data.toJSON());
}

try {
  if (!client.application?.owner) await client.application?.fetch();

  const guild = await client.guilds.cache.get(guildId)
  const fullPermissions = []

  const permissionNeeded = await guild.commands.set(commands).then(res => {
    logger.info('Commands successfully deploy');
    return res.filter(command => command['defaultPermission'] === false);
  })

  await permissionNeeded.forEach(command => fullPermissions.push({ id: command.id, permissions: [client.commands.get(command.name)['permissions']] }))
  await guild.commands.permissions.set({ fullPermissions }).then(() => logger.info('Permissions register successfully'));

} catch (error) {
  logger.error(error);
}
