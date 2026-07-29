const {
    SlashCommandBuilder,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
} = require("discord.js");

module.exports = {

    data: new SlashCommandBuilder()
        .setName("help")
        .setDescription("Open the support ticket panel."),

    async execute(interaction) {

        const allChannels = require("../config/channels");
        const channels = allChannels[interaction.guild.id];

        if (!channels) {
            return interaction.reply({
                content: "❌ This server is not configured.",
                ephemeral: true,
            });
        }

        const allowedChannels = [
            channels.HELP,
            channels.HELP2, // Add HELP2 to your config if you have another help channel
        ].filter(Boolean);

        if (!allowedChannels.includes(interaction.channelId)) {
            return interaction.reply({
                content: `❌ This command can only be used in the help channels.`,
                ephemeral: true,
            });
        }

        const embed = new EmbedBuilder()
            .setColor("#5865F2")
            .setTitle("🎫 Support Center")
            .setDescription(
`Need assistance?

Choose one of the options below and Orion will create a private support ticket for you.

## Available Tickets

🚨 **User Report**
Report a member of the community.

🛡️ **Staff Report**
Report a staff member.

❓ **Question**
Ask the staff team a question.`
            )
            .setFooter({
                text: "Orion Support System",
            });

        const row = new ActionRowBuilder().addComponents(

            new ButtonBuilder()
                .setCustomId("ticket_user_report")
                .setLabel("User Report")
                .setEmoji("🚨")
                .setStyle(ButtonStyle.Danger),

            new ButtonBuilder()
                .setCustomId("ticket_staff_report")
                .setLabel("Staff Report")
                .setEmoji("🛡️")
                .setStyle(ButtonStyle.Secondary),

            new ButtonBuilder()
                .setCustomId("ticket_question")
                .setLabel("Question")
                .setEmoji("❓")
                .setStyle(ButtonStyle.Primary),

        );

        await interaction.reply({
            embeds: [embed],
            components: [row],
        });

    },

};