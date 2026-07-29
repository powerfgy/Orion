const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
} = require("discord.js");

const channels = require("../../config/channels");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("verifysetup")
        .setDescription("Send the verification panel.")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

    async execute(interaction) {

        const guildChannels = channels[interaction.guild.id];

        const verifyChannel =
            interaction.guild.channels.cache.get(
                guildChannels.VERIFY_CHANNEL
            );

        if (!verifyChannel) {
            return interaction.reply({
                content: "❌ Verify channel not found.",
                ephemeral: true,
            });
        }

        const embed = new EmbedBuilder()
            .setColor("#57F287")
            .setTitle("✅ Verify")
            .setDescription(
`Welcome to **${interaction.guild.name}**!

Click the button below to verify.

After verifying you'll unlock the rest of the server.`
            );

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId("verify")
                .setLabel("Verify")
                .setEmoji("✅")
                .setStyle(ButtonStyle.Success)
        );

        await verifyChannel.send({
            embeds: [embed],
            components: [row],
        });

        await interaction.reply({
            content: "✅ Verification panel sent.",
            ephemeral: true,
        });
    },
};