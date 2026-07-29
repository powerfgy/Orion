const { EmbedBuilder } = require("discord.js");
const channels = require("../config/channels");

module.exports = {
    name: "guildMemberRemove",

    async execute(member) {

        const guildChannels = channels[member.guild.id];
        if (!guildChannels) return;

        const channel = member.guild.channels.cache.get(guildChannels.GOODBYE);
        if (!channel) return;

        const embed = new EmbedBuilder()
            .setColor("Red")
            .setTitle("👋 Goodbye!")
            .setDescription(
`**${member.user.tag}** has left the server.

We'll miss you!`
            )
            .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
            .setTimestamp();

        await channel.send({
            embeds: [embed],
        });

    },
};