import { CommandInteraction, SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
.setName("reload")
.setDescription("Reload a commands")
.addStringOption((option) =>
                 option.setName("command")
                 .setDescription("Command yang mau di reload")
                 .setRequired(true)
                );

export async function execute(interaction: CommandInteraction) {
    const commandName = interaction.options.get("command", true);
    const command = interaction.client.commands.get(commandName);
}



