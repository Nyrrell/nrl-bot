import { Client } from 'discord.js'
import {token, prefix} from './config.js'

const client = new Client()

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

// Create an event listener for messages
client.on('message', message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;
    // If the message is "ping"
    if (message.content === `${prefix}ping`) {
        // Send "pong" to the same channel
        message.channel.send('pong');
    }
});

client.login(token);