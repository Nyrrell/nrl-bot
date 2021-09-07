import * as fs from 'fs';
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import { clientId, guildId, token } from "../config.js";

const commands = [];
const commandFiles = fs.readdirSync('./src/commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const {command} = await import(`../commands/${file}`)
    commands.push(command.data.toJSON());
}

const rest = new REST({version: '9'}).setToken(token);

(async () => {
    try {
        await rest.put(
            Routes.applicationGuildCommands(clientId, guildId),
            { body: commands },
        )

        await rest.put(
            Routes.guildApplicationCommandsPermissions(clientId, guildId),
            { body: [{
                        id: '884461503015706685',
                        permissions: [{
                            id: '343169638336561154',
                            type: '2',
                            permission: true
                        }]
                    }]
            }
        )
        console.log('Commandes enregistrer avec succes');


    } catch (error) {
        console.error(error);
    }
})();