const {
    ChannelType,
    PermissionFlagsBits,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
} = require("discord.js");

// =========================
// Config imports
// =========================
const channels = require("../config/channels");
const roles = require("../config/roles");

// =========================
// Utils imports
// =========================
const applicationManager = require("../utils/applicationManager");
const applicationQuestions = require("../utils/applicationQuestions");

module.exports = async (interaction, position) => {

    // 1. Create the ticket
    const ticket = await createTicket(interaction, position);
console.log("✅ Ticket created");
    // 2. Check if it was created
    if (!ticket) {
        return interaction.followUp({
            content: "❌ Failed to create your application ticket.",
            ephemeral: true,
        });
    }

    // 3. Save the ticket
    applicationManager.setTicket(interaction.user.id, ticket.id);

    // 4. Send welcome
    await sendWelcomeEmbed(ticket, interaction.user, position);

    // 5. Load questions
    const questions = applicationQuestions[position];
console.log("Questions:", questions);

    if (!questions || !questions.length) {
        await ticket.send({
            content: "❌ No questions are configured for this position."
        });
        return ticket;
    }

console.log("Starting first question...");
await askFirstQuestion(ticket, interaction.user, questions);
console.log("First question sent");

    return ticket;
};
async function createTicket(interaction, position) {

    const guild = interaction.guild;

const guildChannels = channels[guild.id];

if (!guildChannels) {
    throw new Error(`No channel config found for guild ${guild.id}`);
}

const category = guild.channels.cache.get(
    guildChannels.RECRUITMENT_CATEGORY
);

        console.log("Guild:", guild.name);

console.log(
    "1417278826609901678:",
    guild.members.cache.has("1417278826609901678")
);

console.log(
    guild.members.cache.get("1485437436208087070")
);

console.log(
    "1302435407681687613:",
    guild.members.cache.has("1302435407681687613")
);

    const channel = await guild.channels.create({

        name: `application-${interaction.user.username}`,

        type: ChannelType.GuildText,

        parent: category?.id,
        

permissionOverwrites: [
{
    id: guild.roles.everyone.id,
    deny: [PermissionFlagsBits.ViewChannel],
},
{
    id: guild.members.me.id,
    allow: [
        PermissionFlagsBits.ViewChannel,
        PermissionFlagsBits.SendMessages,
        PermissionFlagsBits.ReadMessageHistory,
        PermissionFlagsBits.ManageChannels,
    ],
},
{
    id: interaction.user.id,
    allow: [
        PermissionFlagsBits.ViewChannel,
        PermissionFlagsBits.SendMessages,
        PermissionFlagsBits.ReadMessageHistory,
    ],
},
]

    });
    console.log(
    "Bot perms:",
    channel.permissionsFor(guild.members.me)?.toArray()

);
console.log(
    "Bot can view:",
    channel.permissionsFor(guild.members.me).has(PermissionFlagsBits.ViewChannel)
);

console.log(
    "Bot can send:",
    channel.permissionsFor(guild.members.me).has(PermissionFlagsBits.SendMessages)
);

console.log(
    "Bot perms:",
    channel.permissionsFor(guild.members.me).toArray()
);

    return channel;

}

async function sendWelcomeEmbed(ticket, user, position) {

    const embed = new EmbedBuilder()

        .setColor("#5865F2")

        .setTitle("Application Started")

        .setDescription(
            [
                `Welcome ${user}!`,
                "",
                `You are applying for **${position}**.`,
                "",
                "Please answer every question honestly.",
                "You may attach screenshots or images whenever needed.",
                "",
                "**Let's begin!**",
            ].join("\n")
        )

        .setFooter({
            text: "Application System",
        })

        .setTimestamp();

    await ticket.send({

        content: `${user}`,

        embeds: [embed],

    });

}
async function askFirstQuestion(ticket, user, questions) {

const application = {
    userId: user.id,
    ticketId: ticket.id,
    currentQuestion: 0,
    questions,
    answers: [],
    position: questions.position ?? "Unknown",
};

    const embed = new EmbedBuilder()

        .setColor("#5865F2")

        .setTitle(`Question 1/${questions.length}`)

        .setDescription(questions[0].placeholder)

        .setFooter({
            text: "Reply with your answer below.",
        });

await ticket.send({
    embeds: [embed],
});

    startCollector(ticket, user, application);

}

async function startCollector(ticket, user, application) {

    console.log("🎣 Collector started");

    const collector = ticket.createMessageCollector({

        filter: (m) => {
            console.log("📨 Saw message:", m.author.tag, "-", m.content);
            return m.author.id === user.id;
        },

        idle: 1000 * 60 * 10,

    });

    collector.on("collect", async (message) => {

        console.log("✅ Collected:", message.content);

        await saveAnswer(application, message);

        application.currentQuestion++;

        if (application.currentQuestion >= application.questions.length) {

            console.log("🏁 Finished application");

            collector.stop("finished");

            return finishApplication(ticket, user, application);
        }

        const embed = new EmbedBuilder()
            .setColor("#5865F2")
            .setTitle(`Question ${application.currentQuestion + 1}/${application.questions.length}`)
            .setDescription(application.questions[application.currentQuestion].placeholder)
            .setFooter({ text: "Reply below." });

await ticket.send({
    embeds: [embed],
});

});

    collector.on("end", (_, reason) => {
        console.log("🛑 Collector ended:", reason);
    });

}

async function saveAnswer(application, message) {

    const answer = {

question:
    application.questions[
        application.currentQuestion
    ].label,

        answer:
            message.content?.trim() || "No text provided",

        attachments: [],

    };

    if (message.attachments.size) {

        message.attachments.forEach((attachment) => {

            answer.attachments.push(
                attachment.url
            );

        });

    }

    application.answers.push(answer);
    applicationManager.addAnswer(
    application.userId,
    answer.question,
    answer.answer,
    answer.attachments
);

}
async function finishApplication(ticket, user, application) {

    const embeds = buildSummaryEmbeds(user, application);

    const buttons = buildReviewButtons(user.id);

const guildChannels = channels[ticket.guild.id];

const reviewChannel =
    ticket.guild.channels.cache.get(guildChannels.SUBMITTED);

    if (reviewChannel) {

        await reviewChannel.send({
            content: `📨 New application from ${user}`,
            embeds: embeds,
            components: [buttons],
        });

    }

    const embed = new EmbedBuilder()
        .setColor(0x57F287)
        .setTitle("Application Submitted")
        .setDescription(
            "Thank you for your application!\n\nOur Recruitment Team will review it shortly."
        )
        .setTimestamp();

    await ticket.send({
        embeds: [embed],
    });

    await ticket.send(
        "✅ Your application has been submitted!\n\n" +
        "Type **done** or **im done** when you're finished reading to close this ticket.\n\n" +
        "If you don't, this ticket will automatically close in **10 minutes**."
    );

    const closeCollector = ticket.createMessageCollector({
        filter: m =>
            m.author.id === user.id &&
            ["done", "im done", "i'm done"].includes(
                m.content.toLowerCase().trim()
            ),
        max: 1,
        time: 10 * 60 * 1000,
    });

closeCollector.on("collect", async () => {

    await ticket.permissionOverwrites.edit(user.id, {
        SendMessages: false,
    });

    try {
        await ticket.setName(`submitted-${user.username}`);
    } catch {}

    await ticket.send("🗑️ Closing ticket in **5 seconds**...");

    setTimeout(() => ticket.delete().catch(console.error), 5000);

});

    closeCollector.on("end", async (_, reason) => {

        if (reason === "time") {

            await ticket.send("⏰ Ticket inactive. Closing in **5 seconds**...");

            setTimeout(() => ticket.delete().catch(console.error), 5000);

        }

    });

}

function buildSummaryEmbeds(user, application) {

    const embeds = [];

    let page = 1;

    let embed = new EmbedBuilder()
        .setColor("#5865F2")
        .setTitle(`New Application • Page ${page}`)
        .setThumbnail(user.displayAvatarURL())
        .addFields(
            {
                name: "Applicant",
                value: `${user.tag}\n(${user.id})`,
            },
            {
                name: "Position",
                value: application.position || "Unknown",
                inline: true,
            },
            {
                name: "Questions",
                value: `${application.answers.length}`,
                inline: true,
            }
        )
        .setTimestamp();

    let fields = 3;

    for (let i = 0; i < application.answers.length; i++) {

        const answer = application.answers[i];

        let value = answer.answer || "No answer.";

        if (answer.attachments.length) {
            value +=
                "\n\n**Attachments:**\n" +
                answer.attachments.join("\n");
        }

        if (value.length > 1024) {
            value = value.slice(0, 1021) + "...";
        }

        if (fields >= 25) {

            embeds.push(embed);

            page++;

            embed = new EmbedBuilder()
                .setColor("#5865F2")
                .setTitle(`Application Continued • Page ${page}`)
                .setTimestamp();

            fields = 0;

        }

        embed.addFields({
            name: `${i + 1}. ${answer.question}`,
            value,
        });

        fields++;

    }

    embeds.push(embed);

    return embeds;

}


function buildReviewButtons(userId) {

    return new ActionRowBuilder().addComponents(

        new ButtonBuilder()
            .setCustomId(`application_claim:${userId}`)
            .setLabel("Claim")
            .setStyle(ButtonStyle.Secondary),

        new ButtonBuilder()
            .setCustomId(`application_accept:${userId}`)
            .setLabel("Accept")
            .setStyle(ButtonStyle.Success),

        new ButtonBuilder()
            .setCustomId(`application_deny:${userId}`)
            .setLabel("Deny")
            .setStyle(ButtonStyle.Danger),

        new ButtonBuilder()
            .setCustomId(`application_interview:${userId}`)
            .setLabel("Interview")
            .setStyle(ButtonStyle.Primary),

    );
}