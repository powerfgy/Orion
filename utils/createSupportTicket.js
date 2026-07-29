const { getNextTicketNumber } = require("./ticketCounter");
const {
    ChannelType,
    PermissionFlagsBits,
    EmbedBuilder,
} = require("discord.js");

const channels = require("../config/channels");
const ticketManager = require("./ticketManager");
module.exports = async (interaction, type) => {

    const guild = interaction.guild;
    const supportUsers = [
    "1302435407681687613",
    "1417278826609901678",
    "1220824256032804924",
    "1485437436208087070",
    "1531222917462102177"
];

const guildChannels = channels[guild.id];

const category =
    guild.channels.cache.get(guildChannels.RECRUITMENT_CATEGORY);

const ticketId = getNextTicketNumber();

const permissionOverwrites = [
    {
        id: guild.roles.everyone.id,
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
{
    id: guild.roles.cache.get("1531117591765061832").id,
    allow: [
        PermissionFlagsBits.ViewChannel,
        PermissionFlagsBits.SendMessages,
        PermissionFlagsBits.ReadMessageHistory,
        PermissionFlagsBits.ManageMessages,
    ],
},
{
    id: guild.roles.cache.get("1531117450840641556").id,
    allow: [
        PermissionFlagsBits.ViewChannel,
        PermissionFlagsBits.SendMessages,
        PermissionFlagsBits.ReadMessageHistory,
        PermissionFlagsBits.ManageMessages,
    ],
},
];
for (const id of supportUsers) {
    const member = await guild.members.fetch(id).catch(() => null);

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

console.log(permissionOverwrites); 
console.log("Role 1:", guild.roles.cache.get("1531117591765061832"));
console.log("Role 2:", guild.roles.cache.get("1531117450840641556"));
for (const overwrite of permissionOverwrites) {
    console.log(
        overwrite.id,
        guild.roles.cache.has(overwrite.id),
        guild.members.cache.has(overwrite.id)
    );
}
console.log("Creating channel...");
console.log("Category:", category?.id);
console.log("Guild:", guild.id);
const ticket = await guild.channels.create({
    name: `ticket-${interaction.user.username}-${ticketId}`,
    type: ChannelType.GuildText,
    parent: category?.id,
    permissionOverwrites,
});
ticketManager.create(ticketId, {

    ticketNumber: ticketId,

    creator: interaction.user.id,

    creatorTag: interaction.user.tag,

    channelId: ticket.id,

    type,

    createdAt: Date.now(),

    claimedBy: null,

    closed: false,

});
    let title;
    let description;

    switch (type) {

        case "user_report":

            title = "🚨 User Report";

            description =
`Welcome ${interaction.user}!

Please include the following information:

• Your Discord Username
• The User's Discord Username
• Reason for the report
• Date & Time of the incident
• Any evidence (screenshots, videos, etc.)

A staff member will review your report as soon as possible.`;

            break;

        case "staff_report":

            title = "🛡️ Staff Report";

            description =
`Welcome ${interaction.user}!

Please include the following information:

• Your Discord Username
• The Staff Member's Discord Username
• Reason for the report
• Date & Time of the incident
• Any evidence (screenshots, videos, etc.)

A management team member will review your report as soon as possible.`;

            break;

        default:

            title = "❓ Question";

            description =
`Welcome ${interaction.user}!

Please describe your question in as much detail as possible.

A staff member will assist you shortly.`;

    }

    const embed = new EmbedBuilder()
        .setColor("#5865F2")
        .setTitle(title)
        .setDescription(description);

const pingMessage = await ticket.send({
    content:
`<@1302435407681687613>
<@1417278826609901678>
<@1220824256032804924>
<@1485437436208087070>
<@1531222917462102177>
<@&1531117526719922317>`,
    allowedMentions: {
        users: [
            "1302435407681687613",
            "1417278826609901678",
            "1220824256032804924",
            "1485437436208087070",
            "1531222917462102177"
        ],
        roles: [
            "1531117591765061832",
            "1531117450840641556"
        ]
    }
});

setTimeout(() => {
    pingMessage.delete().catch(() => {});
}, 1000);

    await ticket.send({
        embeds: [embed],
    });

const { MessageFlags } = require("discord.js");

await interaction.reply({
    content: `✅ Your ticket has been created: ${ticket}`,
    flags: MessageFlags.Ephemeral,
});
await ticket.send(
`✅ When your issue has been resolved, type **done** to close this ticket.

If no one types **done**, the ticket will automatically close after **24 hours** of inactivity.`
);

const closeCollector = ticket.createMessageCollector({
    filter: m =>
        m.author.id === interaction.user.id &&
        ["done", "im done", "i'm done"].includes(
            m.content.toLowerCase().trim()
        ),
    max: 1,
    time: 24 * 60 * 60 * 1000,
});

closeCollector.on("collect", async () => {

    await ticket.send("🗑️ Closing ticket in **5 seconds**...");

    ticketManager.remove(ticketId);

    setTimeout(() => {
        ticket.delete().catch(console.error);
    }, 5000);

});

closeCollector.on("end", async (_, reason) => {

    if (reason === "time") {

        await ticket.send("⏰ Ticket inactive for 24 hours. Closing in **5 seconds**...");

        ticketManager.remove(ticketId);

        setTimeout(() => {
            ticket.delete().catch(console.error);
        }, 5000);

    }

});
};