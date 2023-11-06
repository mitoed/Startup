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
     * @param {array} active_users_array - {user: <username>, vote: <current_vote>}
     * @param {integer} start_time 
     */
    constructor(session_id, category, active_users_array = [], start_time = Date.now()) {
        this.session_id = session_id
        this.category = category
        this.active_users_array = active_users_array
        this.start_time = start_time
        this.unpopular_opinion = ''
        this.end_time = ''
        this.group_selection = ''
    }

    /** User joins the session
     * 
     * @param {string} addUser - Username of additional user
     */
    addActiveUser(addUsername) {
        const addUserObject = {name: addUsername, vote: null}
        this.active_users_array.push(addUserObject)
    }

    /** User leaves the session
     * 
     * @param {string} removeUser 
     */
    removeActiveUser(removeUsername) {
        const removeUserObject = {name: removeUsername, vote: null}
        const removeUserIndex = this.active_users_array.indexOf(removeUserObject)

        if (removeUserIndex > -1) {
            this.active_users_array.splice(removeUserIndex, 1)
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
// Supporting Functions
// =============================================================================

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

module.exports = {
    User,
    Session,
    VotingOption,
    hashPassword,
    randomDigit
}