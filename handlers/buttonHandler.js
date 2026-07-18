console.log("🔥 buttonHandler.js loaded");

const fs = require("fs");
const path = require("path");

module.exports = async (interaction) => {

    console.log("🔘 Button clicked:", interaction.customId);

    if (!interaction.isButton()) return;

    const buttonsPath = path.join(__dirname, "../buttons");

    const buttonFiles = fs
        .readdirSync(buttonsPath)
        .filter(file => file.endsWith(".js"));

    for (const file of buttonFiles) {

        const button = require(path.join(buttonsPath, file));

        let match = false;

        if (
    button.customId.endsWith("_") ||
    button.customId.endsWith(":")
) {
            match = interaction.customId.startsWith(button.customId);
        } else {
            match = interaction.customId === button.customId;
        }
console.log(
    "Checking",
    button.customId,
    "against",
    interaction.customId
);
        if (!match) continue;

        try {
console.log("✅ Executing", button.customId);
            await button.execute(interaction);

        } catch (err) {

            console.error(err);

            if (!interaction.replied && !interaction.deferred) {

                await interaction.reply({

                    content: "❌ Something went wrong while processing that button.",

                    ephemeral: true

                });

            }

        }

        return;

    }

};