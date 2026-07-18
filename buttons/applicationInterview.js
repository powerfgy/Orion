
const { EmbedBuilder } = require("discord.js");

const Roles = require("../config/roles");
const Manager = require("../utils/applicationManager");

module.exports = {

   customId: "application_interview:",

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

        Manager.setStatus(userId, "Interview");

        const member = await interaction.guild.members.fetch(userId).catch(() => null);

        if (member) {

            try {

                await member.send({

                    embeds: [

                        new EmbedBuilder()

                            .setColor("#FEE75C")

                            .setTitle("Interview Required")

                            .setDescription(

`Congratulations!

Your application has passed the first stage.

A staff member will contact you soon to schedule an interview.`

                            )

                    ]

                });

            } catch {}

        }

await interaction.editReply({

    embeds: [

        EmbedBuilder.from(interaction.message.embeds[0])

            .setColor("#FEE75C")

            .setFooter({
                text: `Interview requested by ${interaction.user.tag}`
            })

    ],

    components: []

});

    }

};