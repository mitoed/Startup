const fs = require('fs');

const DB_USERS = []
const DB_SESSIONS = []
const foodIDLetters = 'BCDFGHJ'
const movieIDLetters = 'KLMNPQ'
const gameIDLetters = 'RSTVWXZ'

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

    /** Once voting has finished, increment the user's total count.
     * If group selected what the user did, increment the user's winning count.
     * 
     * @param {string} groupSelection 
     */
    incrementParticipation(groupSelection) {
        if (groupSelection === this.active_vote) {
            this._sessions_won++
        }
        this._sessions_total++
    }

    /** Calculates the loss rate.
     * If user has participated in more than 5 sessions
     * and has lost at least 70% of the time, returns their loss rate
     * 
     * @returns {double}
     */
    significantLossRate() {
        const lossRate = (this.sessions_total - this._sessions_won) / this.sessions_total
        if (this.sessions_total >= 5 && lossRate >= .7) {
            return lossRate
        }
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
        this.category_array = category_array
        this.active_users_array = []
        this.start_time = Date.now()
        this.unpopular_opinion = ''
        this.end_time = ''
        this.group_selection = ''
    }

    /** User joins the session
     * 
     * @param {string} addUser - Username of additional user
     */
    addActiveUser(addUserVote) {
        this.active_users_array.push(addUserVote)
    }

    /** User leaves the session
     * 
     * @param {string} removeUser 
     */
    removeActiveUser(removeUserVote) {
        const userIndex = this.active_users_array.indexOf(removeUserVote)

        if (userIndex > -1) {
            this.active_users_array.splice(userIndex, 1)
        }
    }

    /** Ends the session, recording the final decision and timestamp and clearning the usernames
     * 
     * @param {string} groupSelection 
     */
    endSession(groupSelection) {
        this.active_users_array = []
        this.group_selection = groupSelection
        this.end_time = Date.now()
    }
}

/** Represents any given voting option, which is created from each entry from a session's category_array.
 * 
 * @class
 */
class VotingOption {
    /** Creates a new voting option instance
     * 
     * @param {string} option_name 
     */
    constructor(option_name) {
        this.option_name = option_name
    }
    calculateVotes() {
        const totalVotes = DB_USERS.filter(instance =>
            (instance.active_session === currentSessionID && instance.active_vote === this.option_name)
        ).length
        return totalVotes
    }

    /** Using the option_name and the current votes, create html row for Table
     * 
     * @returns html for for Table
     */
    newHTMLTableRow() {
        return `<tr><td>${this.option_name}</td><td>${this.calculateVotes()}</td></tr>`
    }

    /** Using the option_name and the current votes, create html row for Datalist
     * 
     * @returns html for for Datalist
     */
    newHTMLDatalistRow() {
        return `<option value="${this.option_name}"></option>`
    }

    /** Adds "this" option to the appropriate category database
     * 
     * @param {array} DB_CATEGORY 
     */
    addToCategoryDatabase(DB_CATEGORY) {
        DB_CATEGORY.push({ 'option_name': this.option_name, 'currentVotes': this.calculateVotes() })
    }
}

// =============================================================================
// DUMMY VALUES -- TO BE DELETED WHEN CONNECTED TO PERSISTENT DATABASE
// =============================================================================

function addFakeUser(fakeUserName, fakePassword, fakeSessionID, fakeSelection, fakeTotal, fakeWon) {
    let fakeUser = new User(fakeUserName, fakePassword, fakeTotal, fakeWon)
    DB_USERS.push(fakeUser)
}
addFakeUser("MASAULLS", "1234")
addFakeUser('CHSAULLS', '389d9*', 7, 1)
addFakeUser('RCSAULLS', '303udsd',  7, 0)
addFakeUser('ECSAULLS', '38&jdkf', 3, 0)
addFakeUser('SSAULLS', '7329fd', 3, 3)
addFakeUser('CSAULLS', '39fds', 7, 4)

function addFakeSession(fakeSessionID, fakeCategory, DB_CATEGORY) {
    let fakeSession = new Session(fakeSessionID, fakeCategory, DB_CATEGORY)
    const fakeUserArray = [
        {name: 'CHSAULLS', vote: 'Costa Vida'},
        {name: 'RCSAULLS', vote: 'Five Sushi Bros'},
        {name: 'ECSAULLS', vote: 'Good Move'},
        {name: 'SSAULLS', vote: 'Burger Supreme'},
        {name: 'CSAULLS', vote: "Cubby's"},
    ]
    if (fakeSession.session_id === 'DEFAULT') {
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
    "The Lord of the Rings: The Return of the King",
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

addFakeSession('DEFAULT', 'food', listFOOD)
addFakeSession("F7N7V4", 'food', listFOOD)
addFakeSession("C7T4H9", 'food', listFOOD)
addFakeSession("F2W7Q7", 'food', listFOOD)
addFakeSession("H6Q2N0", 'food', listFOOD)
addFakeSession("D2S4D6", 'food', listFOOD)
addFakeSession("K4X6J2", 'movie', listMOVIE)
addFakeSession("N7T5Q6", 'movie', listMOVIE)
addFakeSession("L3V9B4", 'movie', listMOVIE)
addFakeSession("N2K6M6", 'movie', listMOVIE)
addFakeSession("P7X5C7", 'movie', listMOVIE)
addFakeSession("K5F2K4", 'movie', listMOVIE)
addFakeSession("L2K3N3", 'movie', listMOVIE)
addFakeSession("R7M0X2", 'game', listGAME)
addFakeSession("X7H3J3", 'game', listGAME)
addFakeSession("S4C3Q5", 'game', listGAME)
addFakeSession("T5H9K5", 'game', listGAME)
addFakeSession("S2V2J9", 'game', listGAME)
addFakeSession("Z6L3X3", 'game', listGAME)
addFakeSession("T7F3P7", 'game', listGAME)

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

// =============================================================================
// 
// =============================================================================

function createDummyJSON() {
  const dummyData = {
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
      start_time: session.start_time,
      active_users_array: session.active_users_array,
      unpopular_opinion: session.unpopular_opinion,
      end_time: session.end_time,
      winner: session.winner,
    })),
  };

  // Save the JSON to a file
  const jsonContent = JSON.stringify(dummyData, null, 2);
  fs.writeFileSync('./dummy_values.json', jsonContent);
}

// Call the function to create and save the JSON file
createDummyJSON();
