require("dotenv").config();

const { REST, Routes } = require("discord.js");
const fs = require("fs");
const path = require("path");

const commands = [];

function loadCommands(dir) {
    const files = fs.readdirSync(dir);

    for (const file of files) {
        const filePath = path.join(dir, file);

        if (fs.statSync(filePath).isDirectory()) {
            loadCommands(filePath);
            continue;
        }

        if (!file.endsWith(".js")) continue;

        const command = require(filePath);

        if ("data" in command && "execute" in command) {
            commands.push(command.data.toJSON());
            console.log(`✅ Loaded ${command.data.name}`);
        }
    }
}

loadCommands(path.join(__dirname, "commands"));

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

(async () => {
    try {
        console.log("🚀 Registering slash commands...");

        const guilds = [
            process.env.GUILD_ID,
            process.env.GUILD_ID2
        ];

        for (const guildId of guilds) {
            if (!guildId) continue;

            await rest.put(
                Routes.applicationGuildCommands(
                    process.env.CLIENT_ID,
                    guildId
                ),
                { body: commands }
            );

            console.log(`✅ Registered commands in ${guildId}`);
        }

        console.log("🎉 Done!");
    } catch (err) {
        console.error(err);
    }
})();