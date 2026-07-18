const ticketCreator = require("../tickets/createApplication");
const applicationManager = require("../utils/applicationManager");

module.exports = {

    customId: "application_position",

async execute(interaction) {

    console.log("✅ applicationPosition.js executed");

    const position = interaction.values[0];

        console.log("2️⃣ Selected:", position);

        if (applicationManager.exists(interaction.user.id)) {

            console.log("❌ User already has an application");

            return interaction.reply({
                content: "❌ You already have an active application.",
                ephemeral: true
            });

        }

        console.log("3️⃣ Creating application in JSON");

        applicationManager.create(
            interaction.user,
            position
        );

        console.log("4️⃣ Updating interaction...");

        await interaction.update({

            content: "⏳ Creating your private application...",

            components: []

        });

        console.log("5️⃣ Calling ticket creator...");

        const channel = await ticketCreator(
            interaction,
            position
        );

        console.log("6️⃣ Ticket creator finished!");

        await interaction.followUp({

            content: `✅ Your application has been created: ${channel}`,

            ephemeral: true

        });

        console.log("7️⃣ Finished!");

    }

};