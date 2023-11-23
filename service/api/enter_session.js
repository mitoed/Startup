const DB = require('../database.js')
const classes = require('./classes.js')

function pageSetup(app) {
    
// =============================================================================
// 2.1 -- Enter a session with a session ID
// =============================================================================

    app.get('/api/join-session/:username/:sessionID', async (req, res) => {
        
// 2.1.1 -- Gather session ID inputted from Enter Session page
        const { username } = req.params
        const { sessionID } = req.params
        
// 2.1.2 ---- Check if session is open in LIVE_SESSIONS
        const sessionInstance = DB.LIVE_SESSIONS.find(s => s.session_id === sessionID)

// 2.1.3 ---- If session is open, enter the session
        if (sessionInstance && sessionInstance.end_time === 0) {

// 2.1.3.1 ---- User active in Live Server
            userToLiveUsers(sessionID, username)

            res.status(200).send('Session found')
            return
        }

// 2.1.4 -- If session is not available or not open, respond with error message to user
        if (!sessionInstance || sessionInstance.end_time !== 0) {
            console.log('Error: Session Not Found')
            res.status(204).send('Session Not Found')
            return
        }
    })

// =============================================================================
// 2.2 -- Create a session based on a category
// =============================================================================

    app.get('/api/create-session/:username/:category', async (req, res) => {

// 2.2.1 -- Gather category selected by user from Enter Session page
        const { username } = req.params
        const { category } = req.params

// 2.2.2 ---- Create a new session
// 2.2.2.1 -- Create new session using Session class
        const newSessionID = createSessionID(category)
        const newSessionInstance = new classes.Session(newSessionID, category)

// 2.2.2.2 -- Begin to update the Mongo DB with new session info
        DB.addMongoSession(newSessionInstance)

// 2.2.2.3 -- Request options list from Mongo DB
        const sessionOptions = await DB.getMongoOptions(category)

// 2.2.2.4 -- Add the new session to LIVE_SESSIONS (including options list)
        newSessionInstance['options'] = sessionOptions
        DB.LIVE_SESSIONS.push(newSessionInstance)

        res.status(200).json({sessionID: newSessionID})

    })
}

// =============================================================================
// Supporting Functions
// =============================================================================

function userToLiveUsers(sessionID, username) {

    // Check if user is already in LIVE USERS
    const userActive = DB.LIVE_USERS.find(u => u.name === username)

    // If not, add user LIVE_USERS
    if (!userActive) {
        // Add user to the active users array
        DB.LIVE_USERS.push({name: username, session: sessionID, vote: null})
        return
    }
        
    // If so, change session and remove user's previous vote in LIVE_USERS
    if (userActive) {
        userActive['session'] = sessionID
        userActive['vote'] = null
        return
    }
}

/** Create a session id and verify that it doesn't already exist
 * 
 * @param {string} sessionCategory - the category (movie, game, food) to send to randomSessionID()
 * @param {array} DB_SESSIONS - array of sessions to check for duplicates
 * @returns the new session id
 */
function createSessionID(sessionCategory) {
    let newSessionID
    for (let loopLimit = 0; loopLimit < 10; loopLimit++) {
        
        // Create a new session ID
        newSessionID = randomSessionID(sessionCategory)

        // If it already exists, make a new one
        const existingID = DB.LIVE_SESSIONS.some(s => s.session_id === newSessionID)
        if (!existingID) {return newSessionID}
    }
    console.log('Something went wrong while creating a session ID.')
    return null
}

/** Create a random session id using the category
 * 
 * @param {string} sessionCategory - the category (movie, game, food) for which a session will be created
 * @returns the created session id
 */
function randomSessionID(sessionCategory) {
    let sessionString = []
    let digitArray1

    switch (true) {
        case sessionCategory === 'food':
            digitArray1 = ['B', 'C', 'D', 'F', 'G', 'H', 'J']
            break
        case sessionCategory === 'movie':
            digitArray1 = ['K', 'L', 'M', 'N', 'P', 'Q']
            break
        case sessionCategory === 'game':
            digitArray1 = ['R', 'S', 'T', 'V', 'W', 'X', 'Z']
            break
    }
    let digitArray2 = 'BCDFGHJKLMNPQRSTVWXZ'.split('')
    let digitArray3 = '23456789'.split('')

    sessionString.push(randomDigit(digitArray1))
    sessionString.push(randomDigit(digitArray3))
    sessionString.push(randomDigit(digitArray2))
    sessionString.push(randomDigit(digitArray3))
    sessionString.push(randomDigit(digitArray2))
    sessionString.push(randomDigit(digitArray3))

    sessionString = sessionString.join('')
    return sessionString
}

/** Get random digit from an array */
function randomDigit(digitArray) {
    return digitArray[Math.floor(Math.random() * digitArray.length)]
}

module.exports = { pageSetup }