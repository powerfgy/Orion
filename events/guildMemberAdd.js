const { EmbedBuilder } = require("discord.js");
const channels = require("../config/channels");

const UNVERIFIED_ROLE = "1531482901944729693";

module.exports = {
    name: "guildMemberAdd",

    async execute(member) {

        // Give Unverified role
        await member.roles.add(UNVERIFIED_ROLE).catch(console.error);

        const guildChannels = channels[member.guild.id];
        if (!guildChannels) return;

        const channel = member.guild.channels.cache.get(guildChannels.WELCOME);
        if (!channel) return;

        const embed = new EmbedBuilder()
            .setColor("Green")
            .setTitle("🎉 Welcome!")
            .setDescription(
`Welcome ${member}!

PHEW you made it! Thank you for joining **${member.guild.name}**,Its really nice of you!`
            )
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
            .setTimestamp();

        await channel.send({
            embeds: [embed],
        });
    },
};