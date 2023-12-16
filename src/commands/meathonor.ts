import { CommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { HONOR_MEAT } from "../constant";
import { convertToInt } from "../utils";

export const data = new SlashCommandBuilder()
    .setName("meathonor")
    .setDescription("ngitung meat dari honor")
    .addStringOption((option) =>
        option.setName("honor").setDescription("Honor to meat").setRequired(true)
    );

export async function execute(interaction: CommandInteraction) {
    const honor = convertToInt(interaction.options.get("honor")?.value?.toString() as string);

    let kill_mob = Math.ceil(honor / HONOR_MEAT);

    let meat = 0;
    while (kill_mob > 0) {
        meat += Math.floor(Math.random() * 10);
        kill_mob -= 1;
    }

    const embed = new EmbedBuilder()
        .addFields({
        name: "Calculate meat from honor",
        value: `${honor.toLocaleString("id-ID")} honors approximately get ${meat.toLocaleString("id-ID")} meats`,
    }).setTimestamp();
    await interaction.reply({ embeds: [embed] });
}