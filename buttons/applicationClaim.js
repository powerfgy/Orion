const { EmbedBuilder } = require("discord.js");

const Roles = require("../config/roles");
const Manager = require("../utils/applicationManager");

module.exports = {

    customId: "application_claim:",

    async execute(interaction) {

        await interaction.deferUpdate();

        if (
            !interaction.member.roles.cache.has(Roles.OWNER) &&
            !interaction.member.roles.cache.has(Roles.COMMUNITY_MANAGER) &&
            !interaction.member.roles.cache.has(Roles.LEAD_DEV)
        ) {
            return interaction.followUp({
                content: "❌ You can't claim applications.",
                ephemeral: true
            });
        }

        const userId = interaction.customId.split(":")[1];

        // Get the application
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

        await interaction.editReply({
            embeds: [claimedEmbed],
            components: interaction.message.components
        });

        await interaction.followUp({
            content: `✅ ${interaction.user} claimed this application.`,
            ephemeral: false
        });

    }

};