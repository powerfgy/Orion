const {
    ChannelType,
    PermissionFlagsBits,
    EmbedBuilder,
} = require("discord.js");

const channels = require("../config/channels");


module.exports = {
    customId: "creator_apply",

    async execute(interaction) {

    await interaction.deferReply({
    flags: 64 // ephemeral
});

    console.log("Creator button pressed!");

    const guildChannels = channels[interaction.guild.id];
    

        const category =
            interaction.guild.channels.cache.get(guildChannels.RECRUITMENT_CATEGORY);
const staffIds = [
    "1302435407681687613",
    "1417278826609901678",
    "1220824256032804924",
    "1485437436208087070",
    "1531222917462102177"
];



const permissionOverwrites = [
    {
        id: interaction.guild.roles.everyone.id,
        deny: [PermissionFlagsBits.ViewChannel],
    },
    {
        id: interaction.user.id,
        allow: [
            PermissionFlagsBits.ViewChannel,
            PermissionFlagsBits.SendMessages,
            PermissionFlagsBits.ReadMessageHistory,
            PermissionFlagsBits.AttachFiles,
        ],
    },
];



for (const id of staffIds) {
    const member = await interaction.guild.members
        .fetch(id)
        .catch(() => null);

    console.log(`${id}: ${member ? "FOUND" : "NOT FOUND"}`);

    if (!member) continue;

    permissionOverwrites.push({
        id: member.id,
        allow: [
            PermissionFlagsBits.ViewChannel,
            PermissionFlagsBits.SendMessages,
            PermissionFlagsBits.ReadMessageHistory,
            PermissionFlagsBits.ManageMessages,
        ],
    });
}

const ticket = await interaction.guild.channels.create({
    name: `creator-${interaction.user.username}`,
    type: ChannelType.GuildText,
    parent: category?.id,
    permissionOverwrites,
});

        const embed = new EmbedBuilder()

            .setColor("#F28C6F")

            .setTitle("🎥 Content Creator Application")

            .setDescription(
`Welcome ${interaction.user}!

Thank you for applying!

Please answer **all** of these in **ONE MESSAGE**.

## 📋 Information

• Platform

• Username

• Followers / Subscribers

• Average Views

• Profile Link

• Anything else you'd like us to know?

━━━━━━━━━━━━━━━━━━━━

✅ When you're finished, type **done** to close this ticket.

If you don't, the ticket will automatically close after **10 minutes**.

A manager will review your application shortly.`
            );

const pingUsers = [
    "1302435407681687613",
    "1417278826609901678",
    "1220824256032804924",
    "1485437436208087070",
    "1531222917462102177"
];

const pingMessage = await ticket.send({
    content: pingUsers.map(id => `<@${id}>`).join("\n"),
    allowedMentions: {
        users: pingUsers
    }
});

setTimeout(() => {
    pingMessage.delete().catch(() => {});
}, 1000);

// Send the actual ticket embed
await ticket.send({
    embeds: [embed]
});

        // Close ticket when user types "done"
        const collector = ticket.createMessageCollector({
            filter: m =>
                m.author.id === interaction.user.id &&
                ["done", "im done", "i'm done"].includes(
                    m.content.toLowerCase().trim()
                ),
            max: 1,
            time: 10 * 60 * 1000,
        });

        collector.on("collect", async () => {
            await ticket.send("🗑️ Closing ticket in **5 seconds**...");
            setTimeout(() => ticket.delete().catch(console.error), 5000);
        });

        collector.on("end", async (_, reason) => {
            if (reason === "time") {
                await ticket.send("⏰ Ticket inactive. Closing in **5 seconds**...");
                setTimeout(() => ticket.delete().catch(console.error), 5000);
            }
        });

await interaction.editReply({
    content: `✅ Your creator ticket has been created: ${ticket}`,
});

    },

};