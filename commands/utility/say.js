const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("say")
        .setDescription("Make Orion send a message.")
        .addStringOption(option =>
            option
                .setName("message")
                .setDescription("The message Orion will send.")
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

    async execute(interaction) {
        const message = interaction.options.getString("message");

        await interaction.reply({
            content: "✅ Message sent!",
            ephemeral: true,
        });

        await interaction.channel.send(message);
    },
};