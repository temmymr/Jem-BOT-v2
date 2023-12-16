import { CommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { HONOR150, HONOR200, HONOR95, MEAT150, MEAT200, MEAT95 } from "../constant";
import { convertToInt } from "../utils";

export const data = new SlashCommandBuilder()
    .setName("ppkm")
    .setDescription("ngitung honor berdasarkan ppkm")
    .addStringOption((option) => option.setName("target_honor").setDescription("target honor yang akan dikejar").setRequired(true))
    .addStringOption((option) => option.setName("nm").setDescription("pilih NM yg bakal di spam").addChoices(
        { name: "NM150", value: "NM150" },
        { name: "NM200", value: "NM200" })
        .setRequired(true))
    .addStringOption((option) => option.setName("day1").setDescription("max honor di day 1").setRequired(false))
    .addStringOption((option) => option.setName("day2").setDescription("max honor di day 2").setRequired(false))
    .addStringOption((option) => option.setName("day3").setDescription("max honor di day 3").setRequired(false));

export async function execute(interaction: CommandInteraction) {
    const temp_targetHonor = convertToInt(interaction.options.get("target_honor")?.value?.toString() as string);
    const targetHonor = temp_targetHonor / 1000;

    if (temp_targetHonor < convertToInt("1b")) {
        await interaction.reply("Target honor tidak boleh kurang dari 1b!");
        return;
    }

    const NM = interaction.options.get("nm")?.value?.toString() as string;
    const day1 = convertToInt(interaction.options.get("day1")?.value?.toString() as string ?? "50m");
    const day2 = convertToInt(interaction.options.get("day2")?.value?.toString() as string ?? "100m");
    const day3 = convertToInt(interaction.options.get("day3")?.value?.toString() as string ?? "150m");

    const HONOR_PRELIM = 30000;
    const HONOR_DAY1 = day1 / 1000;
    const HONOR_DAY2 = day2 / 1000;
    const HONOR_DAY3 = day3 / 1000;
    let honorDay4 = 150000;

    const DAY1 = (Math.ceil(HONOR_DAY1 / HONOR95)) * MEAT95;
    const DAY2 = (Math.ceil(HONOR_DAY2 / HONOR150)) * MEAT150;
    const DAY3 = NM === "NM150" ? (Math.ceil(HONOR_DAY3 / HONOR150)) * MEAT150 : (Math.ceil(HONOR_DAY3 / HONOR200)) * MEAT200;
    let day4 = NM === "NM150" ? (Math.ceil(honorDay4 / HONOR150)) * MEAT150 : (Math.ceil(honorDay4 / HONOR200)) * MEAT200;

    const meatTrackInit = DAY1 + DAY2 + DAY3 + day4;
    let meatInterludeInit = meatTrackInit - 3000;

    let honorInterludeInit = meatInterludeInit * 10;
    let honorTotalInit = honorInterludeInit + HONOR_PRELIM + HONOR_DAY1 + HONOR_DAY2 + HONOR_DAY3 + honorDay4;

    const honorGain = NM === "NM150" ? HONOR150 : HONOR200;
    const meatGain = NM === "NM150" ? MEAT150 : MEAT200;

    while (honorTotalInit < targetHonor) {
        honorDay4 += honorGain;
        meatInterludeInit += meatGain;
        honorTotalInit -= honorInterludeInit;
        honorInterludeInit += meatGain * 10;
        honorTotalInit = honorTotalInit + honorInterludeInit + honorGain;
    }

    if (meatInterludeInit < 0) {
        honorTotalInit -= honorInterludeInit;
        honorInterludeInit = 0;
        meatInterludeInit = 0;
    }

    day4 = NM === "NM150" ? Math.ceil(honorDay4 / HONOR150) * MEAT150 : Math.ceil(honorDay4 / HONOR200) * MEAT200;

    const embeds = new EmbedBuilder()
        .setTitle("Jem-BOT")
        .addFields({
            name: `Honor Calculator ▫️  ${targetHonor.toLocaleString("id-ID")} honors`,
            value: `
        \`\`\`Interlude ▫ ${(honorInterludeInit * 1000).toLocaleString("id-ID")} honors, get ${meatInterludeInit.toLocaleString("id-ID")} meats 
Day 1 \t▫ ${(HONOR_DAY1 * 1000).toLocaleString("id-ID")} honors ▫ ${DAY1.toLocaleString("id-ID")} meats
Day 2 \t▫ ${(HONOR_DAY2 * 1000).toLocaleString("id-ID")} honors ▫ ${DAY2.toLocaleString("id-ID")} meats
Day 3 \t▫ ${(HONOR_DAY3 * 1000).toLocaleString("id-ID")} honors ▫ ${DAY3.toLocaleString("id-ID")} meats
Day 4 \t▫ ${(honorDay4 * 1000).toLocaleString("id-ID")} honors ▫ ${day4.toLocaleString("id-ID")} meats\`\`\` 
        **Total** ▫ **${(honorTotalInit * 1000).toLocaleString("id-ID")}** honors ▫ **${(meatInterludeInit + 3000).toLocaleString("id-ID")}** meats"
        `,
        inline : true,
        })
        .setTimestamp()
        .setFooter({
            text: `Assumption get 30m honor and 3k meats in prelim ${meatInterludeInit + 3000 < 10000 ? "\n**Disarankan untuk tetap farm meat lebih dari 10k atau @aimen marah**" : ""}`
        });

    await interaction.reply({ embeds: [embeds] });
}