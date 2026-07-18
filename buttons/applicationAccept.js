const {
    EmbedBuilder,
    PermissionsBitField
} = require("discord.js");

const Roles = require("../config/roles");
const Channels = require("../config/channels");
const Manager = require("../utils/applicationManager");

module.exports = {

   customId: "application_accept:",

async execute(interaction) {

    await interaction.deferUpdate();

    if (

            !interaction.member.roles.cache.has(Roles.OWNER) &&
            !interaction.member.roles.cache.has(Roles.COMMUNITY_MANAGER) &&
            !interaction.member.roles.cache.has(Roles.LEAD_DEV)

        ) {

return interaction.editReply({
    content: "❌ You cannot use this button.",
    embeds: [],
    components: []
});
        }

       const userId = interaction.customId.split(":")[1];
       console.log("========== BUTTON ==========");
console.log("Button:", interaction.customId);
console.log("User ID:", userId);

const application = Manager.get(userId);

console.log("Application:", application);

if (!application) {
    console.log("❌ Manager.get() returned undefined");
return interaction.editReply({
    content: "❌ Application not found.",
    embeds: [],
    components: []
});
}

console.log("✅ Application found");

        Manager.setStatus(userId, "Accepted");

        const member = await interaction.guild.members.fetch(userId).catch(() => null);
        

        if (member) {

            try {

                await member.send({

                    embeds: [

                        new EmbedBuilder()

                            .setColor("#57F287")

                            .setTitle("🎉 Application Accepted")

                            .setDescription(

`Congratulations!

Your **${application.position}** application has been accepted.

A member of the Orion staff team will contact you shortly.`

                            )

                    ]

                });

            } catch {}

        }

        const acceptedChannel = interaction.guild.channels.cache.get(
            Channels.ACCEPTED
        );

        await acceptedChannel.send({

            embeds: [

                new EmbedBuilder()

                    .setColor("#57F287")

                    .setTitle("✅ Applicant Accepted")

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

        if (application.ticketId) {

            const ticket = interaction.guild.channels.cache.get(application.ticketId);

            if (ticket) {

                await ticket.setName(
                    `accepted-${application.username.toLowerCase()}`
                );

                await ticket.permissionOverwrites.edit(

                    userId,

                    {

                        SendMessages: false

                    }

                );

                await ticket.send({

                    embeds: [

                        new EmbedBuilder()

                            .setColor("#57F287")

                            .setTitle("🎉 Accepted")

                            .setDescription(

`${member ?? `<@${userId}>`}

Congratulations!

Your application has been accepted.`

                            )

                    ]

                });

            }

        }

await interaction.editReply({

    embeds: [

        EmbedBuilder.from(interaction.message.embeds[0])

            .setColor("#57F287")

            .setFooter({
                text: `Accepted by ${interaction.user.tag}`
            })

    ],

    components: []

});

    }

};