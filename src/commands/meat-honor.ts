import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { utils } from "../utils";

export const data = new SlashCommandBuilder()
.setName("meathonor")
.setDescription("ngitung meat ke honor")
.addStringOption((option) =>
                 option
                 .setName("meat")
                 .setDescription("Jumlah meat yang mau dihitung")
                 .setRequired(true)
                );

export async function execute(interaction: CommandInteraction) {
    const meat = interaction.options.get("meat", true ).value;

    if (typeof meat !== "string") {
        return interaction.reply("Meat harus berupa angka");
    }
}

