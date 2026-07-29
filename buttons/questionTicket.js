const createSupportTicket = require("../utils/createSupportTicket");

module.exports = {

    customId: "ticket_question",

    async execute(interaction) {

        await createSupportTicket(interaction, "question");

    },

};