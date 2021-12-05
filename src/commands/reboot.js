import { SlashCommandBuilder } from "@discordjs/builders";
import logger from "../services/logger.js";

export const command = {
  permissions: {
    id: '343169638336561154',
    type: 'USER',
    permission: true
  },
  data: new SlashCommandBuilder()
    .setName('reboot')
    .setDescription('Redémarre le bot [Nyrrell]')
    .setDefaultPermission(false),
  async execute(interaction) {
    await logger.log('Reboot incoming');
    await interaction.reply({ content: 'Reboot incoming', ephemeral: true });
    process.exit();
  },
};
