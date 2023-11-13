const db = require('./database.js')
const classes = require('./classes.js')

function pageSetup(app) {

    // Initialize global variables for backend
    let recommendationHTML = ''

// 3.1 -- Populate page and connect to servers
    app.get('/api/populate-page/:sessionID', async (req, res) => {
        
        const { sessionID } = req.params

// 3.1.2 -- Retrieve session info from from LIVE SERVER
        const sessionInstance = db.LIVE_SERVER.find(s => s.session_id === sessionID)

// 3.1.3 -- Count list of active users in session
        const numSessionUsers = sessionInstance.active_users_array.length

// 3.1.4 -- Produce table of options and datalist html
        const sessionOptionsArray = sessionInstance['options']
        const sessionUsersArray = sessionInstance['active_users_array']
        const optionsHTML = generateTableHTML(sessionOptionsArray, sessionUsersArray)

// 3.1.5 -- Produce internet recommendation html
        if (!recommendationHTML) {

            try {

// 3.1.5.1 ---- [For food sessions] Retrieve and produce Yelp recommendation and url
                // Something with Yelp API, if it ever works
                throw new Error('yelp API not connected')
            
            } catch {

// 3.1.5.2 ---- [For movie and game sessions] Display link to google search
                // Until Yelp API works, use this always
                recommendationHTML = generateRecommendationHTML(sessionInstance.category)
            }
        }

        res.json({optionsHTML: optionsHTML,
            recommendation: recommendationHTML,
            activeUsers: numSessionUsers
        })
    })

// 3.2 ---- Record votes on page and servers
// 3.2.2 -- Add user vote
    app.get('/api/record-vote/:sessionID/:username/:userVote', async (req, res) => {

        let { sessionID, username, userVote } = req.params

        try {
// 3.2.2.1 -- Retrieve session info from from LIVE SERVER
            const sessionInstance = db.LIVE_SERVER.find(s => s.session_id === sessionID)

// 3.2.2.2 ---- Update the session info
// 3.2.2.2.1 -- Add user's vote to their object in LIVE SERVER
            const sessionUsersArray = sessionInstance.active_users_array
            const userInstance = sessionUsersArray.find(u => u.name === username)
            userInstance['vote'] = userVote

// 3.2.2.2.2 -- Create a new option in LIVE SERVER if new
            const sessionOptionsArray = sessionInstance.options
            const newSelection = sessionOptionsArray.find(option => option === userVote)
            if (!newSelection) {
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
// 3.2.3.1 -- Retrieve session info from from LIVE SERVER
            const sessionInstance = db.LIVE_SERVER.find(s => s.session_id === sessionID)

// 3.2.3.2 -- Clear user's vote to their object in LIVE SERVER
            const sessionUsersArray = sessionInstance.active_users_array
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
// 3.3.1.1 -- Retrieve session info from LIVE SERVER
        const sessionInstance = db.LIVE_SERVER.find(s => s.session_id === sessionID)
        const sessionUsersArray = sessionInstance.active_users_array

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

// 3.3.2 -- Calculate the most common vote (this is the group selection)
// 3.3.2.1 -- Count the occurrences of each restaurant choice
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
    
// 3.4.1 -- End sesion in database and live server
    app.get('/api/close-session/:sessionID/:groupSelection', async (req, res) => {

        const { sessionID, groupSelection } = req.params

// 3.4.1.1 -- End session in LIVE SERVER
        const sessionInstance = db.LIVE_SERVER.find(s => s.session_id === sessionID)
        sessionInstance.end_time = Date.now()

// 3.4.1.2 -- End session in Mongo DB (including adding any new voting options)
        db.endSession(sessionID, sessionInstance.category, sessionInstance.options)

// 3.4.1.3 ---- Update user information in Mongo DB
        const users = sessionInstance.active_users_array

// 3.4.1.3.1 -- Increment user total sessions
        const allUsers = users.map(obj => obj.name)

// 3.4.1.3.2 -- If user picked group selection, increment user sessions won
        const winUsers = users.filter(u => u.vote === groupSelection).map(obj => obj.name)

        db.updateUsers(allUsers, winUsers)

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
    switch (category) {
        case 'food':
            /*This will try to call the yelp api.
             Upon error, uses same method as the other categories.*/
            try {
                displayYelpData()
                callYelpAPI()
                return
            } catch {
                categoryPlural = 'restaurants'
                extraConditions = 'near me'
                break
            }
        case 'game':
            categoryPlural = 'board games'
            break
        case 'movie':
            categoryPlural = 'movies'
            break
    }

    const recommendationTypeArray = ['classic', 'new', 'underrated']
    const randomNum = Math.floor(Math.random() * 3)
    let recommendationType = recommendationTypeArray[randomNum]

    const recommendationHREF = `https://www.google.com/search?q=top+${recommendationType}+${categoryPlural}+${extraConditions}`
    const recommendationHTML = `<p>Click <a href="${recommendationHREF}" target="_blank">here</a> to see some of the top <span>${recommendationType}</span> ${categoryPlural}<br>from Google.com</p>`
    
    return recommendationHTML
    
}

// =============================================================================
// Function Exports to Server
// =============================================================================

module.exports = { pageSetup }