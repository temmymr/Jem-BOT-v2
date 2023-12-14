import { CommandInteraction } from "discord.js";

export async function isValidInput(interaction: CommandInteraction, meat: string): Promise<boolean> {
    if (!meat?.toString().match(/^\d+(?:[bmkBKM])?$/)) {
        await interaction.reply({
            content: "https://media.discordapp.net/attachments/908974505773396021/1062868409936785509/FB_IMG_1673465472297.jpg?width=456&height=480",
            allowedMentions: { repliedUser: false }
        });

        return false;
    }

    return true;
}
