const {
    EmbedBuilder,
    PermissionFlagsBits
} = require("discord.js");

const Roles = require("../config/roles");
const Manager = require("../utils/applicationManager");

module.exports = {

    customId: "closeTicket",

    async execute(interaction) {

        if (

            !interaction.member.roles.cache.has(Roles.OWNER) &&
            !interaction.member.roles.cache.has(Roles.COMMUNITY_MANAGER) &&
            !interaction.member.roles.cache.has(Roles.LEAD_DEV)

        ) {

            return interaction.reply({

                content: "❌ You don't have permission.",

                ephemeral: true

            });

        }

        const topic = interaction.channel.topic;

        if (!topic) {

            return interaction.reply({

                content: "❌ This doesn't appear to be an application ticket.",

                ephemeral: true

            });

        }

        const match = topic.match(/\d{17,20}/);

        if (!match) {

            return interaction.reply({

                content: "❌ Couldn't determine the applicant.",

                ephemeral: true

            });

        }

        const userId = match[0];

        Manager.remove(userId);

        await interaction.reply({

            embeds: [

                new EmbedBuilder()

                    .setColor("#ED4245")

                    .setTitle("🗑️ Closing Ticket")

                    .setDescription(

`This ticket will be deleted in **5 seconds**.`

                    )

            ]

        });

        setTimeout(async () => {

            try {

                await interaction.channel.delete();

            } catch (err) {

                console.error(err);

            }

        }, 5000);

    }

};