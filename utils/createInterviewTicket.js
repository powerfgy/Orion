const {
    ChannelType,
    PermissionFlagsBits,
    EmbedBuilder,
} = require("discord.js");

const channels = require("../config/channels");
const { getNextTicketNumber } = require("./ticketCounter");
const ticketManager = require("./ticketManager");

module.exports = async (interaction, application, userId) => {

    const guild = interaction.guild;

    const member = await guild.members.fetch(userId).catch(() => null);

    if (!member) {
        return interaction.followUp({
            content: "❌ Couldn't find the applicant.",
            ephemeral: true,
        });
    }

    const tickets = ticketManager.getAll();

    const existingInterview = Object.values(tickets).find(ticket =>
        ticket.type === "interview" &&
        ticket.creator === member.id &&
        !ticket.closed
    );

    if (existingInterview) {
        return interaction.followUp({
            content: `❌ ${member} already has an active interview ticket.`,
            ephemeral: true,
        });
    }

    const ticketNumber = getNextTicketNumber();

    const guildChannels = channels[guild.id];

    const category = guild.channels.cache.get(
        guildChannels.RECRUITMENT_CATEGORY
    );

const managers = [
    "1302435407681687613",
    "1417278826609901678",
    "1220824256032804924",
    "1485437436208087070",
    "1531222917462102177"
];
console.log("Managers:");
for (const id of managers) {
    console.log(id, guild.members.cache.has(id));
}

console.log("Permission overwrites:");
console.log([
    {
        id: guild.roles.everyone.id,
        deny: [PermissionFlagsBits.ViewChannel],
    },
    {
        id: member.id,
        allow: [
            PermissionFlagsBits.ViewChannel,
            PermissionFlagsBits.SendMessages,
            PermissionFlagsBits.ReadMessageHistory,
            PermissionFlagsBits.AttachFiles,
        ],
    },

    ...managers.map(id => ({
        id,
        allow: [
            PermissionFlagsBits.ViewChannel,
            PermissionFlagsBits.SendMessages,
            PermissionFlagsBits.ManageMessages,
        ],
    })),
]);
console.log("Guild:", guild.name, guild.id);

for (const id of managers) {
    console.log("Checking:", id);

    console.log("Role:", guild.roles.cache.has(id));

    const member = await guild.members.fetch(id).catch(() => null);

    console.log("Member:", member?.user.tag ?? "NOT FOUND");
}
    const ticket = await guild.channels.create({
        name: `interview-${member.user.username}-${ticketNumber}`,
        type: ChannelType.GuildText,
        parent: category?.id,

        permissionOverwrites: [
            {
                id: guild.roles.everyone.id,
                deny: [PermissionFlagsBits.ViewChannel],
            },

            {
                id: member.id,
                allow: [
                    PermissionFlagsBits.ViewChannel,
                    PermissionFlagsBits.SendMessages,
                    PermissionFlagsBits.ReadMessageHistory,
                    PermissionFlagsBits.AttachFiles,
                ],
            },

            ...managers.map(id => ({
                id,
                allow: [
                    PermissionFlagsBits.ViewChannel,
                    PermissionFlagsBits.SendMessages,
                    PermissionFlagsBits.ManageMessages,
                ],
            })),
        ],
    });

    ticketManager.create(ticketNumber, {
        ticketNumber,
        creator: member.id,
        creatorTag: member.user.tag,
        channelId: ticket.id,
        type: "interview",
        createdAt: Date.now(),
        claimedBy: interaction.user.id,
        closed: false,
    });

    const ping = await ticket.send({
content:
`<@1302435407681687613>
<@1417278826609901678>
<@1220824256032804924>
<@1485437436208087070>
<@1531222917462102177>`
    });

    setTimeout(() => ping.delete().catch(() => {}), 1000);

    const embed = new EmbedBuilder()
        .setColor("#FEE75C")
        .setTitle("🎤 Application Interview")
        .setDescription(
`Welcome ${member}!

Congratulations on passing the first stage of your application.

A manager will conduct your interview here shortly.

━━━━━━━━━━━━━━━━━━━━

When the interview is finished, either you or the interviewer can type **done** to close this ticket.

If nobody responds for **24 hours**, this ticket will automatically close.`
        )
        .setFooter({
            text: `Interview opened by ${interaction.user.tag}`,
        })
        .setTimestamp();

    await ticket.send({
        embeds: [embed],
    });

    await member.send({
        embeds: [
            new EmbedBuilder()
                .setColor("#FEE75C")
                .setTitle("Interview Required")
                .setDescription(
`Congratulations!

Your application has advanced to the interview stage.

Please head to ${ticket} when you're available.`
                ),
        ],
    }).catch(() => {});

await interaction.editReply({
    embeds: [
        EmbedBuilder
            .from(interaction.message.embeds[0])
            .setColor("#FEE75C")
            .setFooter({
                text: `Interview opened by ${interaction.user.tag}`,
            }),
    ]
});

    let closedBy = null;

    const collector = ticket.createMessageCollector({
        time: 24 * 60 * 60 * 1000,

        filter: message => {
            if (message.author.id === member.id) return true;

            return managers.includes(message.author.id);
        },
    });

    collector.on("collect", async message => {

        const content = message.content.toLowerCase().trim();

        if (
            content !== "done" &&
            content !== "im done" &&
            content !== "i'm done"
        ) return;

        closedBy = message.author.id;

        collector.stop("done");
    });

    collector.on("end", async (_, reason) => {

        if (reason === "done") {

            await ticket.send(
                "🗑️ Interview completed.\nClosing in **5 seconds**..."
            );

        } else {

            await ticket.send(
                "⏰ Interview ticket expired after **24 hours**.\nClosing in **5 seconds**..."
            );

        }

        ticketManager.update(ticketNumber, {
            closed: true,
            closedBy,
            closedAt: Date.now(),
        });

        setTimeout(() => {
            ticket.delete().catch(console.error);
        }, 5000);
    });

};