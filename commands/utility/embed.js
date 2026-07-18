const {
    SlashCommandBuilder,
    EmbedBuilder,
    PermissionFlagsBits,
} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("embed")
        .setDescription("Create a professional embed.")

        .addStringOption(option =>
            option
                .setName("title")
                .setDescription("Embed title")
                .setRequired(true)
        )

        .addStringOption(option =>
            option
                .setName("description")
                .setDescription("Embed description")
                .setRequired(true)
        )

        .addStringOption(option =>
            option
                .setName("color")
                .setDescription("Choose a color")
                .setRequired(false)
                .addChoices(
                    { name: "🔵 Blue", value: "Blue" },
                    { name: "🟢 Green", value: "Green" },
                    { name: "🔴 Red", value: "Red" },
                    { name: "🟡 Yellow", value: "Yellow" },
                    { name: "🟣 Purple", value: "Purple" },
                    { name: "🟠 Orange", value: "Orange" },
                    { name: "⚪ White", value: "White" }
                )
        )

        .addAttachmentOption(option =>
            option
                .setName("image")
                .setDescription("Upload an image")
                .setRequired(false)
        )

        .addAttachmentOption(option =>
            option
                .setName("thumbnail")
                .setDescription("Upload a thumbnail")
                .setRequired(false)
        )

        .addStringOption(option =>
            option
                .setName("footer")
                .setDescription("Footer text")
                .setRequired(false)
        )

        .addBooleanOption(option =>
            option
                .setName("timestamp")
                .setDescription("Display a timestamp")
                .setRequired(false)
        )

        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

    async execute(interaction) {

        try {

            const title = interaction.options.getString("title");
            const description = interaction.options.getString("description");
            const footer = interaction.options.getString("footer");

            const image = interaction.options.getAttachment("image");
            const thumbnail = interaction.options.getAttachment("thumbnail");

            const timestamp = interaction.options.getBoolean("timestamp");

            const colorChoice = interaction.options.getString("color");

            const colors = {
                Blue: 0x5865F2,
                Green: 0x57F287,
                Red: 0xED4245,
                Yellow: 0xFEE75C,
                Purple: 0x9B59B6,
                Orange: 0xE67E22,
                White: 0xFFFFFF,
            };

            const embed = new EmbedBuilder()
                .setTitle(title)
                .setDescription(description)
                .setColor(colors[colorChoice] || colors.Blue);

            if (image) {
                embed.setImage(image.url);
            }

            if (thumbnail) {
                embed.setThumbnail(thumbnail.url);
            }

            if (footer) {
                embed.setFooter({
                    text: footer
                });
            }

            if (timestamp) {
                embed.setTimestamp();
            }

            await interaction.channel.send({
                embeds: [embed],
            });

            await interaction.reply({
                content: "✅ Embed sent successfully!",
                ephemeral: true,
            });

        } catch (err) {

            console.error(err);

            if (interaction.replied || interaction.deferred) {

                await interaction.followUp({
                    content: "❌ Something went wrong while creating the embed.",
                    ephemeral: true,
                });

            } else {

                await interaction.reply({
                    content: "❌ Something went wrong while creating the embed.",
                    ephemeral: true,
                });

            }

        }

    },
};