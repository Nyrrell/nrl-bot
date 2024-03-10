import { SlashCommandBuilder } from "@discordjs/builders";
import logger from "../services/logger.js";
import { devId } from "../config.js";

export const command = {
  permissions: {
    id: devId,
    type: 'USER',
    permission: true
  },
  data: new SlashCommandBuilder()
    .setName('reboot')
    .setDescription('Redémarre le bot [Nyrrell]')
    .setDefaultPermission(false),
  async execute(interaction) {
    logger.info('Reboot incoming');
    await interaction.reply({ content: 'Reboot incoming', ephemeral: true });
    process.exit();
  },
};
