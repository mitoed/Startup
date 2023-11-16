const DB = require('./database.js')
const classes = require('./classes.js')

function pageSetup(app) {

// 3.1 -- Populate page and connect to servers
    app.get('/api/populate-page/:sessionID', async (req, res) => {
        
        const { sessionID } = req.params

// 3.1.2 -- Retrieve session info from LIVE_SESSIONS
        const sessionInstance = DB.LIVE_SESSIONS.find(s => s.session_id === sessionID)

// 3.1.3 -- Get list of users in session from LIVE_USERS
        const sessionUsersArray = DB.LIVE_USERS.filter(u => u.session === sessionID)
        const numSessionUsers = sessionUsersArray.length

// 3.1.4 -- Produce table of options and datalist html
        const sessionOptionsArray = sessionInstance['options']
        const optionsHTML = generateTableHTML(sessionOptionsArray, sessionUsersArray)

        res.json({optionsHTML: optionsHTML,
            activeUsers: numSessionUsers
        })
    })

// 3.1.7.1 -- Populate recommendation html based on category
    app.get('/api/internet-recommendation/:sessionID', async (req, res) => {
        const { sessionID } = req.params

// 3.1.7.1.1 -- Retrieve session info from from LIVE SERVER
        const sessionInstance = DB.LIVE_SESSIONS.find(s => s.session_id === sessionID)

// 3.1.7.1.2 -- Produce internet recommendation html
        const recommendationHTML = generateRecommendationHTML(sessionInstance.category)

        res.json({recommendation: recommendationHTML})
    })

// 3.2 ---- Record votes on page and servers
// 3.2.2 -- Add user vote
    app.get('/api/record-vote/:sessionID/:username/:userVote', async (req, res) => {

        let { sessionID, username, userVote } = req.params

        try {
// 3.2.2.1 -- Retrieve session info from from LIVE SERVER
            const sessionInstance = DB.LIVE_SESSIONS.find(s => s.session_id === sessionID)

// 3.2.2.2 ---- Update the session info
// 3.2.2.2.1 -- Add/update user's vote in their object in LIVE_USERS
            const sessionUsersArray = DB.LIVE_USERS.filter(u => u.session === sessionID)
            const userInstance = sessionUsersArray.find(u => u.name === username)
            userInstance['vote'] = userVote

// 3.2.2.2.2 -- Create a new option in LIVE_SESSIONS if new
            const sessionOptionsArray = sessionInstance.options
            const optionExists = sessionOptionsArray.find(option => option === userVote)
            if (!optionExists) {
                sessionOptionsArray.push(userVote)
            }
            
            res.status(200).send('Everything worked')

        } catch (error) {
            console.error('An error occurred:', error)
            res.status(500).send('Internal Server Error')
        }

    })

// 3.2.3 -- Clear user vote
    app.get('/api/clear-vote/:sessionID/:username', async (req, res) => {

        const { sessionID, username } = req.params

        try {
// 3.2.3.1 -- Retrieve session info for session from LIVE_USERS
            const sessionUsersArray = DB.LIVE_USERS.filter(u => u.session === sessionID)

// 3.2.3.2 -- Clear user's vote in their object in LIVE_USERS
            const userInstance = sessionUsersArray.find(u => u.name === username)
            userInstance['vote'] = null

            res.status(200).send('Success')

        } catch (error) {
            console.error('An error occurred:', error)
            res.status(500).send('Internal Server Error')
        }

    })

// 3.3 -- Check for group selection
    app.get('/api/check-votes/:sessionID', async (req, res) => {

        const { sessionID } = req.params

// 3.3.1 ---- Check if all votes are cast
// 3.3.1.1 -- Retrieve session info for session from LIVE_USERS
        const sessionUsersArray = DB.LIVE_USERS.filter(u => u.session === sessionID)

// 3.3.1.2 -- Compare total active users with total votes cast
        const activeUsers = sessionUsersArray.length
        const activeVotes = sessionUsersArray.filter(user => user.vote !== null)
        const totalVotes = activeVotes.length
        let popularVote = ''

// 3.3.1.3 -- If not all users have voted, exit.
        if (totalVotes !== activeUsers) {
            popularVote = 'null'
        }

        if (totalVotes === activeUsers ) {

// 3.3.2 ---- Calculate the most common vote (this is the group selection)
// 3.3.2.1 -- Count the occurrences of each choice
            const voteCounts = {};
            
            for (const voteObj of activeVotes) {
                const vote = voteObj.vote;
                (voteCounts[vote]) ? voteCounts[vote]++ : voteCounts[vote] = 1;
            }

// 3.3.2.2 -- Find the most common choice(s)
            let highestCount = 0;

            for (const vote in voteCounts) {
                if (voteCounts[vote] > highestCount) {
                    highestCount = voteCounts[vote];
                    popularVote = vote;
                }
            }

// 3.3.2.3 -- If there is a tie, randomly choose one of the top choices
            const tiedOptions = Object.keys(voteCounts).filter(vote => voteCounts[vote] === highestCount)
            if (tiedOptions.length > 1) {
                const randomNum = Math.floor(Math.random() * tiedOptions.length)
                popularVote = tiedOptions[randomNum]
            }

        }

        res.json({groupSelection: popularVote})
    })
    
// 3.4.1 -- End sesion in Mongo DB and Live Servers
    app.get('/api/close-session/:sessionID/:groupSelection', async (req, res) => {

        const { sessionID, groupSelection } = req.params

// 3.4.1.1 -- End session in LIVE_SESSIONS (unless it's the sample session)
        const sessionInstance = DB.LIVE_SESSIONS.find(s => s.session_id === sessionID)
        if (sessionID !== 'SAMPLE') {
            sessionInstance.end_time = Date.now()
        }

// 3.4.1.2 -- Remove users in session from LIVE_USERS (unless it's the sample session)
        if (sessionID !== 'SAMPLE') {
            let iUser = 0
            do {
                if (DB.LIVE_USERS[iUser]['session'] === sessionID) {
                    DB.LIVE_USERS.splice(iUser, 1)
                } else {
                    iUser++
                }
            } while (iUser < DB.LIVE_USERS.length)
        }

// 3.4.1.3 -- End session in Mongo DB (after adding any new voting options)
        DB.endSession(sessionID, sessionInstance.category, sessionInstance.options)

// 3.4.1.4 -- Update user information in Mongo DB
// 3.4.1.4.1 -- Increment user's total sessions
        const sessionUsersArray = DB.LIVE_USERS.filter(u => u.session === sessionID)
        const allUsers = sessionUsersArray.map(obj => obj.name)

// 3.4.1.4.2 -- If user picked group selection, increment user's sessions won
        const winUsers = sessionUsersArray.filter(u => u.vote === groupSelection).map(obj => obj.name)

        DB.updateUsers(allUsers, winUsers)

        res.json({category: sessionInstance.category})
    })

}

// =============================================================================
// Supporting Functions
// =============================================================================

/** Update or add the table html for each voting option object
 * 
 * @param {array} sessionOptionsArray - Array of voting option objects
 * @returns Updated array
 */
function generateTableHTML (sessionOptionsArray, sessionUsersArray) {

    const optionsHTML = []

    for (let option of sessionOptionsArray) {
        const activeVotes = sessionUsersArray.filter(user => user.vote === option).length
        
        const table = `<tr><td>${option}</td><td>${activeVotes}</td></tr>`
        const list = `<option value="${option}"></option>`

        let obj = { name: option, tableHTML: table, listHTML: list }

        optionsHTML.push(obj)

    }

    return optionsHTML
}


/** Create the html for the internet recommendation bubble
 * 
 * @returns html to be displayed
 */
function generateRecommendationHTML(category) {
    let extraConditions = ''
    let categoryPlural = ''
    switch (category) {
        case 'food':
            categoryPlural = 'restaurants'
            extraConditions = 'near me'
            break
        case 'game':
            categoryPlural = 'board games'
            break
        case 'movie':
            categoryPlural = 'movies'
            break
    }

    const recommendationTypeArray = ['classic', 'new', 'underrated']
    const randomNum = Math.floor(Math.random() * recommendationTypeArray.length)
    const recommendationType = recommendationTypeArray[randomNum]

    const recommendationHREF = `https://www.google.com/search?q=top+${recommendationType}+${categoryPlural}+${extraConditions}`
    const recommendationHTML = `<p>Click <a href="${recommendationHREF}" target="_blank">here</a> to see some of the top <span>${recommendationType}</span> ${categoryPlural}<br>on Google.com</p>`
    return recommendationHTML
    
}

// =============================================================================
// Function Exports to Server
// =============================================================================

module.exports = { pageSetup }