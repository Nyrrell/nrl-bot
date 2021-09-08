import * as fs from 'fs';
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import { clientId, guildId, token } from "../config.js";

const commands = [];
const commandFiles = fs.readdirSync('./src/commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const { command } = await import(`../commands/${file}`)
    commands.push(command.data.toJSON());
}

const rest = new REST({ version: '9' }).setToken(token);

(async () => {
    try {
        await rest.put(
            Routes.applicationGuildCommands(clientId, guildId),
            { body: commands },
        ).then(res => {
            const permissionNeeded = res.filter(command => command['default_permission'] === false)
            let permissions = []
            permissionNeeded.forEach(command => permissions.push({
                id: command.id,
                permissions: [{
                    id: '343169638336561154',
                    type: '2',
                    permission: true
                }]
            }))
            return permissions
        }).then(async permissions => {
            await rest.put(
                Routes.guildApplicationCommandsPermissions(clientId, guildId),
                { body: permissions }
            )
            console.log('Commandes enregistrer avec succes');
        })
    } catch (error) {
        console.error(error);
    }
})();