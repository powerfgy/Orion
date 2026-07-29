const createSupportTicket = require("../utils/createSupportTicket");

module.exports = {

    customId: "ticket_staff_report",

    async execute(interaction) {

        await createSupportTicket(interaction, "staff_report");

    },

};