const buttonHandler = require("../handlers/buttonHandler");
const selectMenuHandler = require("../handlers/selectMenuHandler");

module.exports = {
    name: "interactionCreate",

    async execute(interaction) {
console.log("📩 Interaction:", interaction.type);
        // Slash Commands
        if (interaction.isChatInputCommand()) {

            const command = interaction.client.commands.get(interaction.commandName);

            if (!command) return;

            try {

                await command.execute(interaction);

            } catch (error) {

                console.error(error);

                if (interaction.replied || interaction.deferred) {

                    await interaction.followUp({
                        content: "❌ There was an error while executing this command.",
                        ephemeral: true
                    });

                } else {

                    await interaction.reply({
                        content: "❌ There was an error while executing this command.",
                        ephemeral: true
                    });

                }

            }

            return;
        }

// Buttons
if (interaction.isButton()) {

    console.log("🔘 Button interaction detected!");

    return buttonHandler(interaction);

}

        // Select Menus
        if (interaction.isStringSelectMenu()) {
            return selectMenuHandler(interaction);
        }

    },
};