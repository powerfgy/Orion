const fs = require("fs");
const path = require("path");

const file = path.join(__dirname, "../data/tickets.json");

function load() {
    return JSON.parse(fs.readFileSync(file, "utf8"));
}

function save(data) {
    fs.writeFileSync(file, JSON.stringify(data, null, 4));
}

function create(ticketNumber, info) {

    const data = load();

    data[ticketNumber] = info;

    save(data);

}

function remove(ticketNumber) {

    const data = load();

    delete data[ticketNumber];

    save(data);

}
function update(ticketNumber, updates) {

    const data = load();

    if (!data[ticketNumber]) return;

    data[ticketNumber] = {
        ...data[ticketNumber],
        ...updates,
    };

    save(data);

}
function get(ticketNumber) {

    const data = load();

    return data[ticketNumber];

}

function getAll() {

    return load();

}

module.exports = {
    create,
    remove,
    update,
    get,
    getAll,
};