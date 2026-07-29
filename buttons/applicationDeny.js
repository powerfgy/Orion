const { EmbedBuilder } = require("discord.js");

const Channels = require("../config/channels");
const Manager = require("../utils/applicationManager");

module.exports = {

   customId: "application_deny:",

async execute(interaction) {

    await interaction.deferUpdate();

const allowedUsers = [
    "1302435407681687613",
    "1417278826609901678",
    "1220824256032804924",
    "1485437436208087070",
    "1531222917462102177"
];

if (!allowedUsers.includes(interaction.user.id)) {
    return interaction.reply({
        content: "❌ You cannot use this button.",
        ephemeral: true,
    });
}

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

console.log("✅ Application found");


if (!application) {
    return interaction.followUp({
        content: "❌ Application not found.",
        ephemeral: true,
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

const guildChannels = Channels[interaction.guild.id];

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