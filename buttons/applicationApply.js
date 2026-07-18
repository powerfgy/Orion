const {
    ActionRowBuilder,
    StringSelectMenuBuilder
} = require("discord.js");

const applicationManager = require("../utils/applicationManager");

module.exports = {

    customId: "application_apply",

    async execute(interaction) {

        // Prevent duplicate applications
        if (applicationManager.exists(interaction.user.id)) {
            return interaction.reply({
                content: "❌ You already have an active application.",
                ephemeral: true
            });
        }

        const menu = new StringSelectMenuBuilder()
            .setCustomId("application_position")
            .setPlaceholder("Choose the position you're applying for...")
.addOptions([
    {
        label: "Scripter",
        value: "Scripter",
        emoji: "💻"
    },
    {
        label: "Builder",
        value: "Builder",
        emoji: "🏗️"
    },
    {
        label: "GUI Designer",
        value: "GUI Designer",
        emoji: "🖥️"
    },
    {
        label: "Lead Artist",
        value: "Lead Artist",
        emoji: "🎨"
    },
    {
        label: "Artist",
        value: "Artist",
        emoji: "🖌️"
    },
    {
        label: "Video Editor",
        value: "Video Editor",
        emoji: "🎬"
    },
    {
        label: "Tester",
        value: "Tester",
        emoji: "🧪"
    },
    {
        label: "Voice Actor",
        value: "Voice Actor",
        emoji: "🎙️"
    },
    {
        label: "Sound Designer",
        value: "Sound Designer",
        emoji: "🎵"
    },
    {
        label: "VFX Artist",
        value: "VFX Artist",
        emoji: "✨"
    },
    {
        label: "Gameplay Designer",
        value: "Gameplay Designer",
        emoji: "🎮"
    },
    {
        label: "Animator",
        value: "Animator",
        emoji: "🎥"
    },
    {
        label: "Staff Supervisor",
        value: "Staff Supervisor",
        emoji: "🛡️"
    },
    {
        label: "Community Manager",
        value: "Community Manager",
        emoji: "🌍"
    },
    {
        label: "Event Manager",
        value: "Event Manager",
        emoji: "🎉"
    },
    {
        label: "Media Manager",
        value: "Media Manager",
        emoji: "📢"
    }
]);

const row = new ActionRowBuilder().addComponents(menu);

await interaction.reply({
    content: "📋 Select the position you'd like to apply for.",
    components: [row],
    ephemeral: true
});

    }

};