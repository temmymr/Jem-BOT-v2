import { CommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { HONOR150, HONOR200, MEAT150, MEAT200 } from "../constant";
import { convertToSecond } from "../utils";

export const data = new SlashCommandBuilder()
    .setName("toko_sebelah")
    .setDescription("main 17 jam")
    .addStringOption((option) =>
        option
            .setName("nightmare")
            .setDescription("pilih NM yg bakal di spam")
            .addChoices(
                { name: "NM150", value: "NM150" },
                { name: "NM200", value: "NM200" })
            .setRequired(true))
    .addIntegerOption((option) =>
        option
            .setName("nm_time")
            .setDescription("lama nm")
            .setRequired(true))
    .addIntegerOption((option) =>
        option
            .setName("main_berapa_jam")
            .setDescription("main brp jam perhari")
            .setRequired(true));

export async function execute(interaction: CommandInteraction) {
    const nightmare = interaction.options.get("nightmare")?.value?.toString() as string;
    const nmTime = parseInt(interaction.options.get("nm_time")?.value?.toString() as string);
    const mainJam = parseInt(interaction.options.get("main_berapa_jam")?.value?.toString() as string);
    const jam = convertToSecond(mainJam);

    const totalBattlerPerDay = Math.ceil(jam / nmTime);
    const honorGain = nightmare === "NM150" ? HONOR150 : HONOR200;
    const meatGain = nightmare === "NM150" ? MEAT150 : MEAT200;

    const totalHonorGain = (honorGain * totalBattlerPerDay) * 1000;
    const totalMeatUsed = meatGain * totalBattlerPerDay;

    const embed = new EmbedBuilder()
        .setTitle("Toko Sebelah")
        .addFields({
            name: `Main ${mainJam} jam`,
            value: `NM: **${nightmare}**\nWaktu clear: **${nmTime}s**\nHonor yang didapet: **${totalHonorGain.toLocaleString()}**\nMeat yang dibutuhin: **${totalMeatUsed.toLocaleString()}**`,
            inline: true,
        });
    await interaction.reply({ embeds: [embed] });
}