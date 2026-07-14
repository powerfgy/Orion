const express = require("express");

const app = express();

app.use(express.json());

// Test route
app.get("/", (req, res) => {
    res.send("DiscordSyncBot API is online!");
});

// Roblox test endpoint
app.post("/roblox/ping", (req, res) => {
    console.log("📩 Request received from Roblox!");
    console.log(req.body);

    res.json({
        success: true,
        message: "Hello Roblox!"
    });
});

module.exports = app;