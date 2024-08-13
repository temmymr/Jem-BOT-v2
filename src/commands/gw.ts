import { CommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { GBFData } from "../utils";


export const data = new SlashCommandBuilder()
    .setName("gw")
    .setDescription("for guild war in granblue fantasy")
    .addSubcommand((subcommand) =>
        subcommand
            .setName("ranking")
            .setDescription("get the cut off ranking for the current gw")
    )
    .addSubcommandGroup((subcommandGroup) =>
        subcommandGroup
            .setName("track")
            .setDescription("track the honor of a player or a crew")
            .addSubcommand((subcommand) =>
                subcommand
                    .setName("player")
                    .setDescription("track the honor of a player")
                    .addIntegerOption((option) =>
                        option
                            .setName("id")
                            .setDescription("the id of the player")
                            .setRequired(true)
                    )
            )
            .addSubcommand((subcommand) =>
                subcommand
                    .setName("crew")
                    .setDescription("track the honor of a crew")
                    .addIntegerOption((option) =>
                        option
                            .setName("id")
                            .setDescription("the id of the crew")
                            .setRequired(true)
                    )
            )
    );

async function getPlayerRangking(interaction: CommandInteraction) {
    // @ts-ignore discordjs cacad
    const id: number = interaction.options.getInteger("id");

    const gbfData = new GBFData();
    await gbfData.getRankingUser(id);

    await interaction.reply(`track player ${id}`);
    return;
}

async function getCrewRangking(interaction: CommandInteraction) {
    // @ts-ignore discordjs cacad
    const id: number = interaction.options.getInteger("id");

    const gbfData = new GBFData();
    await gbfData.getRankingCrew(id);

    await interaction.reply(`track crew ${id}`);
    return;
}

async function getRanking(interaction: CommandInteraction) {
    const gbfData = new GBFData(74);
    const rankingUser = await gbfData.getRanking();
    rankingUser.sort((a, b) => {
        return a.rank - b.rank;
    });

    const embed = new EmbedBuilder()
        .setTitle("**Player Ranking**")
        .addFields({
            name: " ",
            value: `
\`#${rankingUser[0].rank} - ${rankingUser[0].latest.toLocaleString()} - ${rankingUser[0].speed.toLocaleString()}\`
\`#${rankingUser[1].rank} - ${rankingUser[1].latest.toLocaleString()} - ${rankingUser[1].speed.toLocaleString()}\`
\`#${rankingUser[2].rank} - ${rankingUser[2].latest.toLocaleString()} - ${rankingUser[2].speed.toLocaleString()}\`
\`#${rankingUser[3].rank} - ${rankingUser[3].latest.toLocaleString()} - ${rankingUser[3].speed.toLocaleString()}\`
                    `,
            inline: false,
        })
        .setFooter({ text: " Rank - Latest - Speed/hour" })
        .setTimestamp();
    await interaction.reply({ embeds: [embed] });
    return;
}


export async function execute(interaction: CommandInteraction) {
    // @ts-ignore discordjs cacad
    const subCommandsGroup: string = interaction.options.getSubcommandGroup();
    // @ts-ignore discordjs cacad
    const subCommands: string = interaction.options.getSubcommand();

    if (subCommandsGroup === "track") {
        if (subCommands === "player") {
            getPlayerRangking(interaction);
            return;
        }

        if (subCommands === "crew") {
            getCrewRangking(interaction);
            return;
        }
    }

    if (subCommands === "ranking") {
        getRanking(interaction);
        return;
    }
}