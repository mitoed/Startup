// Initialize Module
const uuid = require('uuid')

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
     * @param {array} active_users_array - {user: <username>, vote: <current_vote>}
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
}

module.exports = {
    User,
    Session
}