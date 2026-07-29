const createInterviewTicket = require("../utils/createInterviewTicket");
const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
} = require("discord.js");

const Manager = require("../utils/applicationManager");

module.exports = {

    customId: "application_interview:",

    async execute(interaction) {

        console.log("🔥 Interview button pressed");
        console.log(interaction.customId);
        console.log(interaction.user.id);

const allowedUsers = [
    "1302435407681687613",
    "1417278826609901678",
    "1220824256032804924",
    "1485437436208087070",
    "1531222917462102177"
];

if (!allowedUsers.includes(interaction.user.id)) {
    return interaction.reply({
        content: "❌ You cannot use this button.",
        ephemeral: true
    });
}

await interaction.deferUpdate();

        const userId = interaction.customId.split(":")[1];

        console.log("========== BUTTON ==========");
        console.log("Button:", interaction.customId);
        console.log("User ID:", userId);
        console.log("JSON CONTENT:");
        console.log(Manager.getAll());

        console.log("Looking for:", userId);

        const application = Manager.get(userId);

        console.log("Application:", application);
        console.log("✅ Application found");

        if (!application) {
            return interaction.editReply({
                content: "❌ Application not found."
            });
        }

        Manager.setStatus(userId, "Interview");

        await createInterviewTicket(
            interaction,
            application,
            userId
        );

        // Keep all buttons, only disable Interview
        const rows = interaction.message.components.map(row => {

            const newRow = new ActionRowBuilder();

            row.components.forEach(component => {

                const button = ButtonBuilder.from(component);

                if (button.data.custom_id?.startsWith("application_interview:")) {
                    button.setDisabled(true);
                }

                newRow.addComponents(button);

            });

            return newRow;

        });

        await interaction.editReply({

            embeds: [

                EmbedBuilder.from(interaction.message.embeds[0])

                    .setColor("#FEE75C")

                    .setFooter({
                        text: `Interview requested by ${interaction.user.tag}`
                    })

            ],

            components: rows

        });

    }

};