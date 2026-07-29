const express = require("express");

const app = express();

app.use(express.json());

// =========================
// Health Check
// =========================
app.get("/", (req, res) => {
    res.send("Orion API is online!");
});

// =========================
// Roblox Ping Test
// =========================
app.post("/roblox/ping", (req, res) => {

    console.log("========== ROBLOX PING ==========");
    console.log(req.body);
    console.log("================================");

    res.status(200).json({
        success: true,
        message: "Orion received your request!"
    });

});

module.exports = app;