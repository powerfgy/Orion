const {
    EmbedBuilder,
} = require("discord.js");

const Channels = require("../config/channels");
const Manager = require("../utils/applicationManager");

module.exports = {
    customId: "application_accept:",

    async execute(interaction) {

        const allowedUsers = [
            "1302435407681687613",
            "1417278826609901678",
            "1220824256032804924",
            "1485437436208087070",
            "1531222917462102177"
        ];

        // Permission check FIRST
        if (!allowedUsers.includes(interaction.user.id)) {
            return interaction.reply({
                content: "❌ You cannot use this button.",
                ephemeral: true,
            });
        }

        // Only defer after we know they're allowed
        await interaction.deferUpdate();

        const userId = interaction.customId.split(":")[1];

        console.log("========== BUTTON ==========");
        console.log("Button:", interaction.customId);
        console.log("User ID:", userId);
        console.log("JSON CONTENT:");
        console.log(Manager.getAll());

        console.log("Looking for:", userId);
        const application = Manager.get(userId);

        console.log("Application:", application);

        if (!application) {
            console.log("❌ Manager.get() returned undefined");

            return interaction.followUp({
                content: "❌ Application not found.",
                ephemeral: true,
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
const guildChannels = Channels[interaction.guild.id];

const acceptedChannel = interaction.guild.channels.cache.get(
    guildChannels.ACCEPTED
);

console.log("Guild channels:", guildChannels);
console.log("Accepted ID:", guildChannels.ACCEPTED);
console.log("Accepted channel:", acceptedChannel?.name);
console.log("Sending to accepted channel...");
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

console.log("Member:", member?.user?.tag);

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