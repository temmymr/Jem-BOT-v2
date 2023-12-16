import { Client } from "discord.js";
import http from "http";
import { config } from "./config";
import { commands } from "./commands";
import { deployCommands } from "./deploy-commands";


export const client = new Client({
    intents: ["Guilds", "GuildMessages", "DirectMessages", "MessageContent"],
});

client.once("ready", async () => {
    console.log("Discord bot is ready! 🤖");
});

client.on("guildCreate", async (guild) => {
    await deployCommands({ guildId: guild.id });
});

client.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand()) {
        return;
    }
    const { commandName } = interaction;
    if (commands[commandName as keyof typeof commands]) {
        commands[commandName as keyof typeof commands].execute(interaction);
    }
});

client.on("messageCreate", async (message) => {
    if (message.author.bot) return;
    if (message.content.startsWith("!")) {
        const [commandName, ...rest] = message.content.slice(1).split(" ");
        if (commandName === "reload" && message.author.id === config.DISCORD_OWNER_ID && message.guildId) {
            await deployCommands({ guildId: message.guildId });
            await message.reply("Reloaded commands!");
        }
    }
});

client.login(config.DISCORD_TOKEN);

// make the bot keep alive in replit using module javascript

http
    .createServer((_, res) => {
        res.write("jembot");
        res.end();
    }).listen(8080);

console.log("jembot is ready! 🤖");
