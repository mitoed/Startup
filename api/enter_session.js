const database = require('./database.js')
const classes = require('./classes.js')

function pageSetup(app) {
    
    // Backend function to join a session by ID
    app.get('/api/join-session/:username/:sessionID', async (req, res) => {
        const { username } = req.params
        const { sessionID } = req.params
        
        // Connect to live server
        const data = await database.loadDatabase()
        const DB_SESSIONS = data.sessions

        // Add user data to server, if session is open
        const updatedData = await database.joinSession(username, sessionID, DB_SESSIONS)

        if (!updatedData) {
            console.log('Error: Session Not Found')
            res.status(204).send('Session Not Found')
            return
        }
        
        res.status(200).send('Session found')
    })

    // Backend function to create a session by category
    app.get('/api/create-session/:username/:category', async (req, res) => {
        const { username } = req.params
        const { category } = req.params

        // Connect to sessions database and live server
        const data = await database.loadDatabase()
        const DB_SESSIONS = data.sessions

        // Create new session instance
        const newSessionID = database.createSessionID(category, DB_SESSIONS)
        const newSession = new classes.Session(newSessionID, category)
        console.log('New Session:', newSession)

        // Add this user to the instance
        newSession.addActiveUser(username)
        console.log('Added User:', newSession)
        
        // Add the instance to the sessions array, then update the database
        DB_SESSIONS.push(newSession)
        database.refreshDatabase(DB_SESSIONS, null, null)
        
        res.status(200).json({sessionID: newSessionID})
    })
}

module.exports = { pageSetup }