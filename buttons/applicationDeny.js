const { EmbedBuilder } = require("discord.js");

const Roles = require("../config/roles");
const Channels = require("../config/channels");
const Manager = require("../utils/applicationManager");

module.exports = {

   customId: "application_deny:",

async execute(interaction) {

    await interaction.deferUpdate();

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

       const userId = interaction.customId.split(":")[1];
       console.log("========== BUTTON ==========");
console.log("Button:", interaction.customId);
console.log("User ID:", userId);

const application = Manager.get(userId);

console.log("Application:", application);

console.log("✅ Application found");



        if (!application) {

            return interaction.reply({

                content: "❌ Application not found.",

                ephemeral: true

            });

        }

        Manager.setStatus(userId, "Denied");

        const member = await interaction.guild.members.fetch(userId).catch(() => null);

        if (member) {

            try {

                await member.send({

                    embeds: [

                        new EmbedBuilder()

                            .setColor("#ED4245")

                            .setTitle("Application Denied")

                            .setDescription(

`Unfortunately your **${application.position}** application has been denied.

Thank you for taking the time to apply.

You are welcome to apply again in the future.`

                            )

                    ]

                });

            } catch {}

        }

        const deniedChannel = interaction.guild.channels.cache.get(
            Channels.DENIED
        );

        if (deniedChannel) {

            await deniedChannel.send({

                embeds: [

                    new EmbedBuilder()

                        .setColor("#ED4245")

                        .setTitle("❌ Applicant Denied")

                        .addFields(

                            {
                                name: "Applicant",
                                value: `<@${userId}>`,
                                inline: true
                            },

                            {
                                name: "Position",
                                value: application.position,
                                inline: true
                            },

                            {
                                name: "Reviewed By",
                                value: interaction.user.tag,
                                inline: true
                            }

                        )

                        .setTimestamp()

                ]

            });

        }

        if (application.ticketId) {

            const ticket = interaction.guild.channels.cache.get(application.ticketId);

            if (ticket) {

                await ticket.setName(`denied-${application.username.toLowerCase()}`);

                await ticket.permissionOverwrites.edit(userId, {

                    SendMessages: false

                });

            }

        }

await interaction.editReply({

    embeds: [

        EmbedBuilder.from(interaction.message.embeds[0])

            .setColor("#ED4245")

            .setFooter({
                text: `Denied by ${interaction.user.tag}`
            })

    ],

    components: []

});

    }

};