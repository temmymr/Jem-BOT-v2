import { CommandInteraction } from "discord.js";
import { convertToInt } from "./convert-to-int";

export async function minimumMeat(interaction: CommandInteraction, meat: string): Promise<number> {
    const totalMeat = convertToInt(meat);

    if (totalMeat < 5) {
        await interaction.reply({
            content: "minimal mikir kontol, minimal 5 meat",
            allowedMentions: { repliedUser: false }
        });
        return 0;
    }

    return totalMeat;
}
