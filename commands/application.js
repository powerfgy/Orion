const {
    SlashCommandBuilder,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    PermissionFlagsBits
} = require("discord.js");

module.exports = {
data: new SlashCommandBuilder()
    .setName("applications")
    .setDescription("Send the staff application panel.")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
   
    async execute(interaction) {


        console.log("A");

        const embed = new EmbedBuilder()
            .setColor("#5865F2")
            .setTitle("🚀 Orion Staff Recruitment")
            .setDescription(
`Interested in joining **Orion Development**?

We're currently looking for talented people to join our team.

Available positions include:
💻Scripter
🏗 Builder
🖥 GUI Designer
🎨 Artist
🖌 Lead Artist
🎬 Video Editor
🎙 Voice Actor
🎵 Sound Designer
✨ VFX Artist
🎮 Gameplay Designer
🎥 Animator
📢 Media Manager
🧪 Tester
🛡 Trial Staff

Click **Apply** below to start your application.

Good luck! 🍀`
            )
            .setFooter({
                text: "Orion Recruitment"
            });

        console.log("B");

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId("application_apply")
                .setLabel("Apply")
                .setEmoji("📋")
                .setStyle(ButtonStyle.Primary)
        );

        console.log("C");

        await interaction.reply({
            embeds: [embed],
            components: [row]
        });

        console.log("D");
    }
};