import { CommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { HONOR100, HONOR150, HONOR200, HONOR90, HONOR95, MEAT150, MEAT200, MEAT90, MEAT95 } from "../constant";
import { isValidInput, minimumMeat } from "../utils";

export const data = new SlashCommandBuilder()
    .setName("meat")
    .setDescription("ngitung meat ke honor")
    .addStringOption((option) => option.setName("meat").setDescription("jumlah meat yang dimiliki").setRequired(true));

export async function execute(interaction: CommandInteraction) {
    const meat = interaction.options.get("meat")?.value?.toString() as string;

    try {
        const isValid = await isValidInput(interaction, meat);

        if (!isValid) {
            return;
        }

        const totalMeat = await minimumMeat(interaction, meat);

        if (totalMeat === 0) {
            return;
        }

        const NM90 = totalMeat / MEAT90;
        const NM95 = totalMeat / MEAT95;
        const NM100 = totalMeat / MEAT150;
        const NM150 = totalMeat / MEAT150;
        const NM200 = totalMeat / MEAT200;

        const embed = new EmbedBuilder()
            .setTitle("Jem-BOT")
            .setThumbnail("https://cdn.discordapp.com/attachments/828790440240087052/1062699739147141160/image.png")
            .addFields({
                name: `Meat Calculator ▫️  ${totalMeat} meats`,
                value: `
                    **${NM90}** NM90 or **${(NM90 * (HONOR90 * 1000)).toLocaleString("id-ID")}** honors
                    **${NM95}** NM95 or **${(NM95 * (HONOR95 * 1000)).toLocaleString("id-ID")}** honors
                    **${NM100}** NM100 or **${(NM100 * (HONOR100 * 1000)).toLocaleString("id-ID")}** honors
                    **${NM150}** NM150 or **${(NM150 * (HONOR150 * 1000)).toLocaleString("id-ID")}** honors
                    **${NM200}** NM200 or **${(NM200 * (HONOR200 * 1000)).toLocaleString("id-ID")}** honors
                `
            })
            .setTimestamp();
        await interaction.reply({ embeds: [embed] });
    } catch (error) {
        console.log(error);
        await interaction.reply("Something went wrong!");
    }
}

