const fs = require('fs');
const bcrypt = require('bcrypt')
const uuid = require('uuid')

const DB_USERS = []
const DB_SESSIONS = []

// =============================================================================
// CLASSES
// =============================================================================

/** Represents a user with username, password hash, salt, current session details, and totals
 * 
 * @class
 */
class User {
    /** Creates a user instance
     * 
     * @constructor
     * @param {string} username - username (always capitalized in DB)
     * @param {string} password - never maintained but is used (with salt) to generate the password_hash
     * @param {number} sessions_total - how many sessions has this user participated in?
     * @param {number} sessions_won - how many times was this user's vote selected by the group?
     */
    constructor(username, password_hash, sessions_total = 0, sessions_won = 0) {
        this.username = username
        this.password_hash = password_hash
        this.token = uuid.v4()
        this.sessions_total = sessions_total
        this.sessions_won = sessions_won
    }

}

/** Represents a session with the sesssion id, the category, the list of options, when it started/ended,
 * what was an unpopular opinion (if any), and what was the winning vote.
 * 
 * @class
 */
class Session {
    /** Creates a new session instance.
     * 
     * @param {string} session_id 
     * @param {string} category 
     * @param {string} category_array 
     * @param {integer} start_time 
     */
    constructor(session_id, category, category_array) {
        this.session_id = session_id
        this.category = category
        this.options = category_array
        this.start_time = Date.now()
        this.unpopular_opinion = ''
        this.end_time = 0
        this.group_selection = ''
    }

    addActiveUser (userObject) {
        this.active_users_array.push({ name: userObject, vote: null })
    }
}

// =============================================================================
// DUMMY VALUES -- TO BE DELETED WHEN CONNECTED TO PERSISTENT DATABASE
// =============================================================================

async function addFakeUser(fakeUserName, fakePassword, fakeTotal, fakeWon) {
    const fakeHash = await bcrypt.hash(fakePassword, 10)
    let fakeUser = new User(fakeUserName, fakeHash, fakeTotal, fakeWon)
    DB_USERS.push(fakeUser)

}

async function addUsers() {
    await addFakeUser("ADMIN", "1234", 100000, 100000)
    await addFakeUser('BILLY', '389dd9*w', 7, 1)
    await addFakeUser('JOE', '303udsdf', 7, 0)
    await addFakeUser('SAMMY', '38&sjdkf', 3, 0)
    await addFakeUser('KATIE', '732df9fd', 3, 3)
    await addFakeUser('BOB', '39fdsdf', 7, 4)
}

function addFakeSession(fakeSessionID, fakeCategory, DB_CATEGORY) {
    let fakeSession = new Session(fakeSessionID, fakeCategory, DB_CATEGORY)
    DB_SESSIONS.push(fakeSession)
}

let listFOOD = [
    "Wendy's",
    "McDonald's",
    "Chick-fil-A",
    "Bumblebees",
    "Se Llama Peru",
    "India Palace",
    "Burger Supreme",
    "Cubby's",
    "Good Move",
    "Brick Oven",
    "Costa Vida",
    "Five Sushi Bros",
    "Black Sheep Cafe",
];

let listMOVIE = [
    "The Shawshank Redemption",
    "The Godfather",
    "The Dark Knight",
    "Pulp Fiction",
    "Schindler's List",
    "The Return of the King",
    "Fight Club",
    "Forrest Gump",
    "Inception",
    "The Matrix",
    "Gladiator",
    "The Silence of the Lambs"
];

let listGAME = [
    "Settlers of Catan",
    "Ticket to Ride",
    "Carcassonne",
    "Pandemic",
    "Dominion",
    "Codenames",
    "7 Wonders",
    "Twilight Struggle",
    "Agricola",
    "Scythe",
    "Splendor",
    "Betrayal at Baldur's Gate"]

addFakeSession('SAMPLE', 'food', listFOOD)
addFakeSession("F7N7V4", 'food', listFOOD)
addFakeSession("C7T4H9", 'food', listFOOD)
addFakeSession("TEST", 'movie', listMOVIE)
addFakeSession("N7T5Q6", 'movie', listMOVIE)
addFakeSession("L3V9B4", 'movie', listMOVIE)
addFakeSession("R7M0X2", 'game', listGAME)
addFakeSession("X7H3J3", 'game', listGAME)
addFakeSession("S4C3Q5", 'game', listGAME)

/** Convert the lists to objects with the proper table and list html structures */
function convertArrayToObjects(list) {

    let objectsArray = []

    for (let option of list) {
        objectsArray.push({ name: option })
    }

    return objectsArray
}

const DB_LIVE_USERS = [
    { name: 'BILLY', session: 'SAMPLE', vote: 'Costa Vida' },
    { name: 'JOE', session: 'SAMPLE', vote: 'Five Sushi Bros' },
    { name: 'SAMMY', session: 'SAMPLE', vote: 'Good Move' },
    { name: 'KATIE', session: 'SAMPLE', vote: 'Burger Supreme' },
    { name: 'BOB', session: 'TEST', vote: "Cubby's" },
]

// =============================================================================
// 
// =============================================================================

async function createDummyJSON() {

    await addUsers()

    const sampleData = {
        Mongo_USERS: DB_USERS.map(user => ({
            username: user.username,
            password_hash: user.password_hash,
            token: user.token,
            sessions_total: user.sessions_total,
            sessions_won: user.sessions_won,
        })),
        Mongo_LIVE_SESSIONS: DB_SESSIONS.map(session => ({
            session_id: session.session_id,
            category: session.category,
            options: session.options,
            start_time: session.start_time,
            active_users_array: session.active_users_array,
            unpopular_opinion: session.unpopular_opinion,
            end_time: session.end_time,
            group_selection: session.group_selection,
        })),
        LIVE_USERS: DB_LIVE_USERS,
        Mongo_OPTIONS: {
            food: convertArrayToObjects(listFOOD),
            game: convertArrayToObjects(listGAME),
            movie: convertArrayToObjects(listMOVIE)
        }
    }

    // Save the JSON to a file
    const jsonContent = JSON.stringify(sampleData, null, 2);
    fs.writeFileSync('./sample_values.json', jsonContent);
}

// Call the function to create and save the JSON file
createDummyJSON();
