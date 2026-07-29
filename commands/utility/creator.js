const {
    SlashCommandBuilder,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
} = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("creator")
        .setDescription("Send the Content Creator application panel"),

    async execute(interaction) {

        const embed = new EmbedBuilder()
            .setColor("#F28C6F")
            .setTitle("🎥 Content Creator Program")
            .setDescription(
                "Become an official **Content Creator** for our community!"
            )
            .addFields(
                {
                    name: "📋 Requirements",
                    value:
                        "🎵 **TikTok**\n" +
                        "> **900 Followers** *(5,000 Average Views)*\n\n" +
                        "▶️ **YouTube**\n" +
                        "> **2,500 Subscribers** *(3,000 Average Views)*\n\n",
                },
                {
                    name: "📌 Before Applying",
                    value:
                        "• Your social account **must be linked** to your Discord.\n" +
                        "• You only need to meet **one** platform's requirements.\n" +
                        "• Staff may request proof of ownership.\n" +
                        "• Applications not meeting the requirements will be denied.",
                },
                {
                    name: "🎁 Benefits",
                    value:
                        "• Exclusive Creator Role\n" +
                        "• Early Sneak Peeks\n" +
                        "• Private Creator Chat\n" +
                        "• Partnership Opportunities",
                }
            );

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId("creator_apply")
                .setLabel("Apply for Creator")
                .setEmoji("🎫")
                .setStyle(ButtonStyle.Primary)
        );

        await interaction.reply({
            embeds: [embed],
            components: [row],
        });
    },
};