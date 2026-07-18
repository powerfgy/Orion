require("dotenv").config();

const fs = require("fs");
const path = require("path");
const { Client, Collection, GatewayIntentBits } = require("discord.js");
const app = require("./server");

const PORT = process.env.PORT || 3000;

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

client.commands = new Collection();

const commandsPath = path.join(__dirname, "commands");

const commandFolders = fs.readdirSync(commandsPath);

for (const folder of commandFolders) {

    const folderPath = path.join(commandsPath, folder);

    // Folder (commands/utility)
    if (fs.lstatSync(folderPath).isDirectory()) {

        const commandFiles = fs
            .readdirSync(folderPath)
            .filter(file => file.endsWith(".js"));

        for (const file of commandFiles) {

            const filePath = path.join(folderPath, file);
            const command = require(filePath);

            if ("data" in command && "execute" in command) {

                client.commands.set(command.data.name, command);
                console.log(`✅ Loaded command: ${command.data.name}`);

            } else {

                console.log(`⚠️ ${file} is missing data or execute.`);

            }
        }

    }

    // JS directly inside commands/
    else if (folder.endsWith(".js")) {

        const command = require(folderPath);

        if ("data" in command && "execute" in command) {

            client.commands.set(command.data.name, command);
            console.log(`✅ Loaded command: ${command.data.name}`);

        } else {

            console.log(`⚠️ ${folder} is missing data or execute.`);

        }

    }

}
const eventsPath = path.join(__dirname, "events");
const eventFiles = fs
    .readdirSync(eventsPath)
    .filter(file => file.endsWith(".js"));

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);

    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }

    console.log(`📌 Loaded event: ${event.name}`);
}

app.listen(PORT, () => {
    console.log(`🌐 API running on port ${PORT}`);
});

client.login(process.env.TOKEN);