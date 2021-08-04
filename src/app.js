import * as fs from 'fs';
import { Client, Collection, Intents, MessageEmbed } from 'discord.js';
import { token } from './config.js';
import('./services/task.js')

export const client = new Client({intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]});
client.commands = new Collection();
client.slashCommands = [];

const commandFiles = fs.readdirSync('./src/commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const {command} = await import(`./commands/${file}`);
    client.slashCommands.push({name: command.name, description: command.description});
    client.commands.set(command.name, command);
}

client.on('ready', async () => {
    console.log(`Logged in as ${client.user.tag}!`);
    console.log('Logged on', client.guilds.cache.map(guild => guild.name).join(', '));
});

client.on('interactionCreate', async interaction => {

    if (!interaction.isCommand()) return;

    if (!client.commands.has(interaction.commandName)) return;

    try {
        await client.commands.get(interaction.commandName).execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({
            content: 'There was an error while executing this command!',
            ephemeral: true
        });
    }
});

client.on('messageCreate', async message => {
    if (!client.application?.owner) await client.application?.fetch();

    if (message.content.toLowerCase() === '!deploy' && message.author.id === client.application?.owner.id) {
        console.log('hello')
        const command = await client.application?.commands.set(client.slashCommands);
        console.log(command);
    }
});

console.log('Version :',process.env.npm_package_version)
client.login(token);
