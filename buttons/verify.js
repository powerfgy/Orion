const Roles = require("../config/roles");

module.exports = {
    customId: "verify",

    async execute(interaction) {
        const member = interaction.member;

        await member.roles.add(Roles.VERIFIED);
        await member.roles.add(Roles.PLAYER);
        await member.roles.remove(Roles.UNVERIFIED);

        await interaction.reply({
            content: "✅ You have been verified!",
            flags: 64
        });
    }
};