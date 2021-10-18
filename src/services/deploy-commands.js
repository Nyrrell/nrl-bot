import * as fs from 'fs';
import { guildId } from "../config.js";
import { client } from "../app.js";

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
    console.log('Commandes enregistrer avec succès');
    return res.filter(command => command['defaultPermission'] === false);
  })

  await permissionNeeded.forEach(command => fullPermissions.push({ id: command.id, permissions: [client.commands.get(command.name)['permissions']]}))
  await guild.commands.permissions.set({ fullPermissions }).then(() => console.log('Permissions enregistrer avec succès'));

} catch (error) {
  console.error(error);
}
