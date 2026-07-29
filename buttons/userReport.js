const createSupportTicket = require("../utils/createSupportTicket");

module.exports = {

    customId: "ticket_user_report",

    async execute(interaction) {

        await createSupportTicket(interaction, "user_report");

    },

};