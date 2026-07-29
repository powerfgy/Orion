console.log("🔥 buttonHandler.js loaded");

const fs = require("fs");
const path = require("path");

module.exports = async (interaction) => {

    if (!interaction.isButton()) return;

    console.log("🔘 Button clicked:", interaction.customId);

    const buttonsPath = path.join(__dirname, "../buttons");

    const buttonFiles = fs
        .readdirSync(buttonsPath)
        .filter(file => file.endsWith(".js"));

    for (const file of buttonFiles) {

        const button = require(path.join(buttonsPath, file));

        let match = false;

if (!button.customId) continue;

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
    console.error("========== ERROR ==========");
    console.error(err.stack);
    console.error("==========================");

            try {

                if (interaction.deferred) {

                    await interaction.editReply({
                        content: "❌ Something went wrong while processing that button."
                    });

                } else if (!interaction.replied) {

                    await interaction.reply({
                        content: "❌ Something went wrong while processing that button.",
                        flags: 64
                    });

                }

            } catch (e) {
                console.error("Failed to send error reply:", e);
            }

        }

        return;

    }

};