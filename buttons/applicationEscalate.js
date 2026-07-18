const { EmbedBuilder } = require("discord.js");
const Channels = require("../config/channels");

module.exports = {

    customId: "application_escalate:",

    async execute(interaction) {

        await interaction.deferUpdate();

        const supervisorChannel =
            interaction.guild.channels.cache.get(
                Channels.STAFF_SUPERVISORS
            );

        if (!supervisorChannel)
            return;

        await supervisorChannel.send({

            content: `📢 Escalated by ${interaction.user}`,

            embeds: interaction.message.embeds

        });

        const embed = EmbedBuilder
            .from(interaction.message.embeds[0])
            .setColor("#5865F2")
            .setFooter({
                text: `Escalated by ${interaction.user.tag}`
            });

        await interaction.editReply({

            embeds: [embed],
            components: interaction.message.components

        });

    }

};