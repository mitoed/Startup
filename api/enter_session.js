const database = require('./database.js')
const classes = require('./classes.js')

function pageSetup(app) {
    
// 2.1 -- Enter a session with a session ID
    app.get('/api/join-session/:username/:sessionID', async (req, res) => {
        
// 2.1.1 -- Gather session ID inputted from enter_session page
        const { username } = req.params
        const { sessionID } = req.params
        
// 2.1.2 ---- Check if session is open on live server
// 2.1.2.1 -- Connect to live server (dummy_data.json)
        const { sessions } = await database.loadDatabase()

// 2.1.2.2 -- Check Session ID against open sessions
        const sessionInstance = sessions.find(s => s.session_id === sessionID)

// 2.1.3 ---- If session is open, enter the session
        if (sessionInstance && sessionInstance.end_time === '') {

// 2.1.3.1 -- Check if user is already added
            const sessionUsersArray = sessionInstance.active_users_array
            const userInSession = sessionUsersArray.find(user => user.name === username)

// 2.1.3.2 -- If not already in session, add user to active_users_array
            if (!userInSession) {
                // Add user to the active users array
                sessionUsersArray.push({name: username, vote: null})
            }
    
// 2.1.3.3 -- If already in session, remove user's previous vote
            if (userInSession) {
                // Remove the user's vote from the array
                userInSession['vote'] = null
            }
    
// 2.1.3.4 -- Update the live server (dummy_data.json) with the new session info
            const response = await database.refreshDatabase(sessions, null, null)
            
            res.status(200).send('Session found')

        }

// 2.1.4 -- If session is not available or not open, respond with error message to user
        if (!sessionInstance || sessionInstance.end_time !== '') {
            console.log('Error: Session Not Found')
            res.status(204).send('Session Not Found')
            return
        }
    })

// 2.2 -- Create a session based on a category
    app.get('/api/create-session/:username/:category', async (req, res) => {

// 2.2.1 -- Gather category selected by user from enter_session page
        const { username } = req.params
        const { category } = req.params

// 2.2.2 ---- Create a new session
// 2.2.2.1 -- Connect to live server (dummy_data.json)
        const data = await database.loadDatabase()
        const DB_SESSIONS = data.sessions

// 2.2.2.2 -- Create new session using Session class
        const newSessionID = createSessionID(category, DB_SESSIONS)
        const newSession = new classes.Session(newSessionID, category)

// 2.2.2.3 -- Add the user to this new session
        newSession.addActiveUser(username)
        
// 2.2.2.4 -- Send to live server (or dummy_data.json)
        DB_SESSIONS.push(newSession)
        const response = await database.refreshDatabase(DB_SESSIONS, null, null)

        res.status(200).json({sessionID: newSessionID})

    })
}

// =============================================================================
// Supporting Functions
// =============================================================================


/** Create a session id and verify that it doesn't already exist
 * 
 * @param {string} sessionCategory - the category (movie, game, food) to send to randomSessionID()
 * @param {array} DB_SESSIONS - array of sessions to check for duplicates
 * @returns the new session id
 */
function createSessionID(sessionCategory, sessions) {
    let newSessionID
    for (let loopLimit = 0; loopLimit < 10; loopLimit++) {
        
        // Create a new session ID
        newSessionID = randomSessionID(sessionCategory)

        // If it already exists, make a new one
        const existingID = sessions.some(session => session.session_id === newSessionID)
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

    sessionString.push(classes.randomDigit(digitArray1))
    sessionString.push(classes.randomDigit(digitArray3))
    sessionString.push(classes.randomDigit(digitArray2))
    sessionString.push(classes.randomDigit(digitArray3))
    sessionString.push(classes.randomDigit(digitArray2))
    sessionString.push(classes.randomDigit(digitArray3))

    sessionString = sessionString.join('')
    return sessionString
}

module.exports = { pageSetup }