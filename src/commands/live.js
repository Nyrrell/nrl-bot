import { twitchAPI } from "../services/twitch-api.js";
import { twitchClientId, twitchOAuthAccessToken } from "../config.js";

const api = twitchAPI(twitchClientId, twitchOAuthAccessToken);

export const command = {
    name: 'live',
    description: 'Verifie si le stream d\'un utilisateur est en cours',
    options: [
        {
            name: 'target',
            description: 'Le stream de qui ?',
            type: 'STRING',
            required: true,
        }
    ],
    async execute(interaction) {
        const user = interaction.options.getString('target');
        const {isLive, ...streamData} = await api.getStream(user);
        let text
        isLive ? text = `${user} est en live` : text = `${user} n'est pas en live`
        interaction.reply(text);
    },
};