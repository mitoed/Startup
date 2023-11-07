const database = require('./database.js')
const classes = require('./classes.js')

function pageSetup(app) {

    // Initialize global variables for backend
    let sessionInstance
    let sessionUsersArray
    let sessionOptionsArray
    let recommendationHTML = ''

    // 3.1 Populate page and connect to servers
    // 3.2 Display internet recommendation
    app.get('/api/populate-page/:sessionID', async (req, res) => {
        
        // 3.1 Populate page and connect to servers
        const { sessionID } = req.params

        // Refresh session data from database data
        const { sessions, options } = await database.loadDatabase()
        const data = sessions.find(s => s.session_id === sessionID)
        sessionInstance = new classes.Session(data.session_id, data.category, data.active_users_array)
        sessionUsersArray = sessionInstance.active_users_array

        // 3.1.2 Retrieve list of voting options from database (dummy_data.json)
        const category = sessionInstance.category
        sessionOptionsArray = options[category]

        // 3.1.4 Amend html for table of options
        const tableListHTML = generateTableHTML(sessionOptionsArray, sessionUsersArray)

        // 3.2 Display internet recommendations
        if (!recommendationHTML) {
            recommendationHTML = generateRecommendationHTML(sessionInstance.category)
        }

        res.json({optionsHTML: tableListHTML,
            recommendation: recommendationHTML
        })
    })

    // 3.3 Record votes on page and servers
    app.get('/api/record-vote/:sessionID/:username/:newVote', async (req, res) => {

        // 3.3.1 Gather selection from user input
        let { sessionID, username, newVote } = req.params

        try {
            // Refresh session data from database data
            const { sessions } = await database.loadDatabase()
            const data = sessions.find(s => s.session_id === sessionID)
            sessionInstance = new classes.Session(data.session_id, data.category, data.active_users_array)
            sessionUsersArray = sessionInstance.active_users_array

            // Add user's vote to their object in the session array
            const userInstance = sessionUsersArray.find(user => user.name === username)
            userInstance['vote'] = newVote

            // Create a new option if doesn't exist in the options database
            let newSelection = sessionOptionsArray.find(option => option.name === newVote)
            if (!newSelection) {
                const table = `<tr><td>${newVote}</td><td>optionVotes</td></tr>`
                const list = `<option value="${newVote}"></option>`
                const newOption = { name: newVote, tableHTML: table, listHTML: list }

                sessionOptionsArray.push(newOption)
            }

            // Amend html for table of options and datalist
            const tableListHTML = generateTableHTML(sessionOptionsArray, sessionUsersArray)

            // 3.3.2 Change vote in live server (dummy_data.json)
            await database.refreshLiveData(sessionInstance.session_id, sessionUsersArray, sessionInstance.category, tableListHTML)
            
            res.status(200).send('Everything worked')

        } catch (error){
            console.error('An error occurred:', error)
            res.status(500).send('Internal Server Error')
        }

    })

    // Clear vote
    app.get('/api/clear-vote/:sessionID/:username', async (req, res) => {

        const { sessionID, username } = req.params

        try {
            // Refresh session data from database data
            const { sessions } = await database.loadDatabase()
            const data = sessions.find(s => s.session_id === sessionID)
            sessionInstance = new classes.Session(data.session_id, data.category, data.active_users_array)
            sessionUsersArray = sessionInstance.active_users_array

            // Clear user's vote from array
            const userInstance = sessionUsersArray.find(user => user.name === username)
            userInstance['vote'] = null

            // Amend html for table of options and datalist
            const tableListHTML = generateTableHTML(sessionOptionsArray, sessionUsersArray)

            // 3.3.2 Change vote in live server (dummy_data.json)
            await database.refreshLiveData(sessionInstance.session_id, sessionUsersArray, sessionInstance.category, tableListHTML)

            res.status(200).send('Success')

        } catch (error) {
            console.error('An error occurred:', error)
            res.status(500).send('Internal Server Error')
        }

    })

    // 3.4 Check for and declare group selection
    app.get('/api/check-votes/:sessionID', async (req, res) => {

        const { sessionID } = req.params
            
        // Request refreshed database data
        const { sessions } = await database.loadDatabase()
        const sessionInstance = sessions.find(s => s.session_id === sessionID)
        sessionUsersArray = sessionInstance.active_users_array

        // 3.4.1 Check if all votes are cast
        const activeUsers = sessionUsersArray.length
        const activeVotes = sessionUsersArray.filter(user => user.vote !== null)
        const totalVotes = activeVotes.length
        let popularVote = ''

        if (totalVotes === activeUsers) {
            // 3.4.2 Calculate the most common vote
            const voteCounts = {};

            // Count the occurrences of each restaurant choice
            for (const voteObj of activeVotes) {
                const vote = voteObj.vote;
                (voteCounts[vote]) ? voteCounts[vote]++ : voteCounts[vote] = 1;
            }

            let highestCount = 0;

            // Find the most common restaurant choice
            for (const vote in voteCounts) {
                if (voteCounts[vote] > highestCount) {
                    highestCount = voteCounts[vote];
                    popularVote = vote;
                }
            }

        // If not all votes are cast, do not calculate or display
        } else {
            popularVote = 'null'
        }

        res.json({groupSelection: popularVote})
    })
    
    // 3.4.5 End sesion in database and live server
    app.get('/api/close-session/:sessionID/:groupSelection', async (req, res) => {

        const { sessionID, groupSelection } = req.params

        // Load the database
        const { sessions, users } = await database.loadDatabase();
        const sessionInfo = sessions.find(session => session.session_id === sessionID);

        // 3.4.5.2 Update user database information
        for (let activeUser of sessionInfo.active_users_array) {
            const user = users.find(u => u.username === activeUser.name);
            if (user) {
                user.sessions_total++
                if (activeUser.vote === groupSelection) {
                    user.sessions_won++
                }
            }
        }
            
        // 3.4.5.3 Note the time in session's end_time in database
        sessionInfo.end_time = Date.now()

        // Refresh the databases with the new data
        await database.refreshDatabase(sessions, users, null)

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

    for (let option of sessionOptionsArray) {
        const activeVotes = sessionUsersArray.filter(user => user.vote === option.name).length
        
        // Replace the placeholder if first render
        option.tableHTML = option.tableHTML.replace('optionVotes', activeVotes)
        // Replace the previous submission if after first render
        option.tableHTML = option.tableHTML.replace(/\d+/g, activeVotes)
    }

    return sessionOptionsArray
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

/** Finalizes all database data for session and users
 * 
 * @param {object} sessionInstance - session data for the session closing
 * @param {*} popularVote - which option was voted most to increment sessions_won for users
 */
async function closeSession(sessionInstance, popularVote) {

    // Load the database
    const { sessions, users } = await database.loadDatabase();
    const sessionInfo = sessions.find(session => session.session_id === sessionInstance.session_id);

    // 3.4.5.2 Update user database information
    for (let activeUser of sessionInfo.active_users_array) {
        const user = users.find(u => u.username === activeUser.name);
        if (user) {
            user.sessions_total++
            if (activeUser.vote === popularVote) {
                user.sessions_won++
            }
        }
    }
        
    // 3.4.5.3 Note the time in session's end_time in database
    sessionInfo.end_time = Date.now()

    // Refresh the databases with the new data
    await database.refreshDatabase(sessions, users, null)

}

// =============================================================================
// Function Exports to Server
// =============================================================================

module.exports = { pageSetup }