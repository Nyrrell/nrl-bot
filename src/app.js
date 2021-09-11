import { Client, Collection, Intents } from 'discord.js';
import { token } from './config.js';
import * as fs from 'fs';

export const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS],
    partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
});
client.commands = new Collection();

const commandFiles = fs.readdirSync('./src/commands').filter(file => file.endsWith('.js'));
const eventFiles = fs.readdirSync('./src/events').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const { command } = await import(`./commands/${file}`)
    client.commands.set(command.data.name, command);
}

for (const file of eventFiles) {
    const { event } = await import(`./events/${file}`);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}

await client.login(token);