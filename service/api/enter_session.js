const DB = require('../database.js')
const classes = require('./classes.js')

function pageSetup(apiRouter) {
    
// =============================================================================
// 2.1 -- Enter a session with a session ID
// =============================================================================

    apiRouter.post('/join-session', async (req, res) => {
        
// 2.1.1 -- Gather session ID inputted from Enter Session page
        const username = req.body.username
        const sessionID = req.body.sessionID
        
// 2.1.2 ---- Check if session is open in LIVE_SESSIONS
        const sessionInstance = await DB.getMongoSession(sessionID)

// 2.1.3 ---- If session is open, enter the session
        if (sessionInstance && sessionInstance.end_time === 0) {

// 2.1.3.1 ---- User active in Live Server
            DB.changeUserVote(sessionID, username, null)

            res.json({category: sessionInstance.category})
            return
        }

// 2.1.4 -- If session is not available or not open, respond with error message to user
        if (!sessionInstance || sessionInstance.end_time !== 0) {
            res.json({category: null})
            return
        }
    })

// =============================================================================
// 2.2 -- Create a session based on a category
// =============================================================================

    apiRouter.post('/create-session', async (req, res) => {

// 2.2.1 -- Gather category selected by user from Enter Session page
        const username = req.body.username
        const category = req.body.category

// 2.2.2 ---- Create a new session
// 2.2.2.1 -- Create new session using Session class
        const newSessionID = await createSessionID(category)
        const newSessionInstance = new classes.Session(newSessionID, category)

// 2.2.2.2 -- Begin to update the Mongo DB with new session info
        await DB.addMongoSession(newSessionInstance)

// 2.2.2.5 -- User active in Live Server
        await DB.changeUserVote(newSessionID, username, null)

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
async function createSessionID(sessionCategory) {
    let newSessionID
    for (let loopLimit = 0; loopLimit < 10; loopLimit++) {
        
        // Create a new session ID
        newSessionID = randomSessionID(sessionCategory)
        console.log(newSessionID)

        // If it already exists, make a new one
        const existingID = await DB.getMongoSession(newSessionID)
        if (!existingID) {
            return newSessionID
        }
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