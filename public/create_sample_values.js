const fs = require('fs');

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
    constructor(username, password, sessions_total = 0, sessions_won = 0) {
        this.username = username
        this.salt = generateSalt()
        this.password_hash = hashPassword(password, this.salt)
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
     * @param {array} active_users_array - {user: <username>, vote: <current_vote>}
     * @param {integer} start_time 
     */
    constructor(session_id, category, category_array) {
        this.session_id = session_id
        this.category = category
        this.options = category_array
        this.active_users_array = []
        this.start_time = Date.now()
        this.unpopular_opinion = ''
        this.end_time = 0
        this.group_selection = ''
    }

    addActiveUser (userObject) {
        this.active_users_array.push(userObject)
    }
}

// =============================================================================
// DUMMY VALUES -- TO BE DELETED WHEN CONNECTED TO PERSISTENT DATABASE
// =============================================================================

function addFakeUser(fakeUserName, fakePassword, fakeTotal, fakeWon) {
    let fakeUser = new User(fakeUserName, fakePassword, fakeTotal, fakeWon)
    DB_USERS.push(fakeUser)
}
addFakeUser("ADMIN", "1234", 100000, 100000)
addFakeUser('BILLY', '389d9*', 7, 1)
addFakeUser('JOE', '303udsd', 7, 0)
addFakeUser('SAMMY', '38&jdkf', 3, 0)
addFakeUser('KATIE', '7329fd', 3, 3)
addFakeUser('BOB', '39fds', 7, 4)

function addFakeSession(fakeSessionID, fakeCategory, DB_CATEGORY) {
    let fakeSession = new Session(fakeSessionID, fakeCategory, DB_CATEGORY)
    const fakeUserArray = [
        { name: 'BILLY', vote: 'Costa Vida' },
        { name: 'JOE', vote: 'Five Sushi Bros' },
        { name: 'SAMMY', vote: 'Good Move' },
        { name: 'KATIE', vote: 'Burger Supreme' },
        { name: 'BOB', vote: "Cubby's" },
    ]
    if (fakeSession.session_id === 'SAMPLE') {
        for (let newUser of fakeUserArray) {
            fakeSession.addActiveUser(newUser)
        }
    }
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
addFakeSession("K4X6J2", 'movie', listMOVIE)
addFakeSession("N7T5Q6", 'movie', listMOVIE)
addFakeSession("L3V9B4", 'movie', listMOVIE)
addFakeSession("R7M0X2", 'game', listGAME)
addFakeSession("X7H3J3", 'game', listGAME)
addFakeSession("S4C3Q5", 'game', listGAME)

/** Creates a salt to be appended to password--used for password hashing
 * 
 * @returns salt for user
 */
function generateSalt() {
    const saltArray = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.split('')
    let newSalt = []
    for (let digit = 0; digit < 6; digit++) {
        newSalt.push(randomDigit(saltArray))
    }
    return newSalt.join('')
}

/** Creates a hash of a salt + password combination
 * 
 * @param {string} password - what did the user enter as a password?
 * @param {string} salt - what salt should be used for hash?
 * @returns the final hash
 */
function hashPassword(password, salt) {
    let hash = 0
    const saltyPassword = salt + password
    if (saltyPassword.length === 0) return hash;
    for (let i = 0; i < saltyPassword.length; i++) {
        let chr = saltyPassword.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
}

/** Get random digit from an array */
function randomDigit(digitArray) {
    return digitArray[Math.floor(Math.random() * digitArray.length)]
}

/** Convert the lists to objects with the proper table and list html structures */
function convertArrayToObjects(list) {

    let objectsArray = []

    for (let option of list) {
        objectsArray.push({ name: option })
    }

    return objectsArray
}

// =============================================================================
// 
// =============================================================================

function createDummyJSON() {
    const sampleData = {
        users: DB_USERS.map(user => ({
            username: user.username,
            password_hash: user.password_hash,
            salt: user.salt,
            sessions_total: user.sessions_total,
            sessions_won: user.sessions_won,
        })),
        sessions: DB_SESSIONS.map(session => ({
            session_id: session.session_id,
            category: session.category,
            options: session.options,
            start_time: session.start_time,
            active_users_array: session.active_users_array,
            unpopular_opinion: session.unpopular_opinion,
            end_time: session.end_time,
            winner: session.winner,
        })),
        options: {
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