require("dotenv").config();

const { Client, GatewayIntentBits } = require("discord.js");
const readyEvent = require("./events/ready");
const app = require("./server");

const PORT = process.env.PORT || 3000;

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

// Ready event
client.once(readyEvent.name, () => {
    readyEvent.execute(client);
});

// Start the API
app.listen(PORT, () => {
    console.log(`🌐 API running on port ${PORT}`);
});

// Login to Discord
client.login(process.env.TOKEN);