 const { EmbedBuilder } = require("discord.js");

const Manager = require("../utils/applicationManager");

module.exports = {

    customId: "application_claim:",

    async execute(interaction) {

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
console.log("JSON CONTENT:");
console.log(Manager.getAll());

console.log("Looking for:", userId);
        const application = Manager.get(userId);

        if (!application) {
            return interaction.followUp({
                content: "❌ Application not found.",
                ephemeral: true
            });
        }

        // Check if already claimed
        if (application.claimedBy) {
            return interaction.followUp({
                content: `❌ This application is already claimed by <@${application.claimedBy}>.`,
                ephemeral: true
            });
        }

        // Save who claimed it
        Manager.setClaim(userId, interaction.user.id);

        const claimedEmbed = EmbedBuilder
            .from(interaction.message.embeds[0])
            .setColor("#FEE75C")
            .addFields({
                name: "Claimed By",
                value: `${interaction.user}`,
                inline: true
            });

const { ActionRowBuilder, ButtonBuilder } = require("discord.js");

const rows = interaction.message.components.map(row => {
    const newRow = new ActionRowBuilder();

    row.components.forEach(component => {
        const button = ButtonBuilder.from(component);

        if (button.data.custom_id?.startsWith("application_claim:")) {
            button
                .setDisabled(true)
                .setLabel(`Claimed by ${interaction.user.username}`);
        }

        newRow.addComponents(button);
    });

    return newRow;
});

await interaction.editReply({
    embeds: [claimedEmbed],
    components: rows
});

await interaction.followUp({
    content: "✅ Application claimed successfully.",
    ephemeral: true
});

    }

};