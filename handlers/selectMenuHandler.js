const fs = require("fs");
const path = require("path");

module.exports = async (interaction) => {

    console.log("🔵 SelectMenuHandler received:", interaction.customId);

    if (!interaction.isStringSelectMenu()) return;

const menusPath = path.join(__dirname, "../selectmenu");

    console.log("📂 Looking in:", menusPath);

    if (!fs.existsSync(menusPath)) {
        console.log("❌ selectMenus folder doesn't exist!");
        return;
    }

    const menuFiles = fs
        .readdirSync(menusPath)
        .filter(file => file.endsWith(".js"));

    console.log("📄 Menu files:", menuFiles);

    for (const file of menuFiles) {

        console.log("➡️ Loading:", file);

        const menu = require(path.join(menusPath, file));

        console.log("   customId =", menu.customId);

        if (menu.customId !== interaction.customId) continue;

        console.log("✅ MATCH FOUND!");

        try {

            await menu.execute(interaction);

            console.log("✅ Menu executed successfully.");

        } catch (error) {

            console.error("❌ Menu execution error:");
            console.error(error);

            if (!interaction.replied && !interaction.deferred) {

                await interaction.reply({
                    content: "❌ An error occurred while processing that menu.",
                    ephemeral: true,
                });

            }

        }

        return;

    }

    console.log("❌ No matching menu found for:", interaction.customId);

};