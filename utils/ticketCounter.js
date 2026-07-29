const fs = require("fs");
const path = require("path");

const filePath = path.join(
    __dirname,
    "../data/ticketCounter.json"
);

function getNextTicketNumber() {

    const data = JSON.parse(
        fs.readFileSync(filePath, "utf8")
    );

    data.lastTicket++;

    fs.writeFileSync(
        filePath,
        JSON.stringify(data, null, 4)
    );

    return String(data.lastTicket).padStart(4, "0");

}

module.exports = {
    getNextTicketNumber,
};