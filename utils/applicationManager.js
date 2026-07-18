const fs = require("fs");
const path = require("path");

const DATA_PATH = path.join(__dirname, "../data/applications.json");

// Create file if it doesn't exist
if (!fs.existsSync(DATA_PATH)) {
    fs.writeFileSync(DATA_PATH, JSON.stringify({}, null, 4));
}
function setClaim(userId, staffId) {
    const data = load();
    if (!data[userId]) return;

    data[userId].claimedBy = staffId;

    save(data);
}

function clearClaim(userId) {
    const data = load();
    if (!data[userId]) return;

    data[userId].claimedBy = null;

    save(data);
}
function load() {
    return JSON.parse(fs.readFileSync(DATA_PATH, "utf8"));
}

function save(data) {
    fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 4));
}

function create(user, position) {

    const data = load();

    if (data[user.id]) return false;

    data[user.id] = {

        id: user.id,
        tag: user.tag,
        username: user.username,
        avatar: user.displayAvatarURL(),

        created: Date.now(),

status: "Pending",

claimedBy: null,

position,

page: 1,

        currentQuestion: 0,

        ticketId: null,

        submitted: false,

        answers: []

    };

    save(data);

    return true;

}

function exists(userId) {

    return !!load()[userId];

}

function get(userId) {

    return load()[userId];

}

function getAll() {

    return load();

}

function setPage(userId, page) {

    const data = load();

    if (!data[userId]) return;

    data[userId].page = page;

    save(data);

}

function setCurrentQuestion(userId, index) {

    const data = load();

    if (!data[userId]) return;

    data[userId].currentQuestion = index;

    save(data);

}

function setTicket(userId, channelId) {

    const data = load();

    if (!data[userId]) return;

    data[userId].ticketId = channelId;

    save(data);

}

function markSubmitted(userId) {

    const data = load();

    if (!data[userId]) return;

    data[userId].submitted = true;

    save(data);

}

function addAnswer(userId, question, answer, attachments = []) {

    const data = load();

    if (!data[userId]) return;

    data[userId].answers.push({

        question,

        answer,

        attachments

    });

    save(data);

}

function setStatus(userId, status) {

    const data = load();

    if (!data[userId]) return;

    data[userId].status = status;

    save(data);

}

function remove(userId) {

    const data = load();

    delete data[userId];

    save(data);

}
function setClaim(userId, staffId) {

    const data = load();

    if (!data[userId]) return;

    data[userId].claimedBy = staffId;

    save(data);

}
module.exports = {
    
    setClaim,

    create,

    exists,

    get,

    getAll,

    setPage,

    setCurrentQuestion,

    setTicket,

    markSubmitted,

    addAnswer,

    setStatus,

    remove

};