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

        // Create session object from database data
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
            sessionUsers: sessionUsersArray,
            recommendation: recommendationHTML
        })
    })

    // 3.3 Record votes on page and servers
    app.get('/api/record-vote/:username/:newVote', async (req, res) => {

        // 3.3.1 Gather selection from user input
        const { username, newVote} = req.params

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
        
        try {
            // 3.3.2 Change vote in live server (dummy_data.json)
            await database.refreshLiveData(sessionInstance.session_id, sessionUsersArray, sessionInstance.category, tableListHTML)
            
        } catch (error) {
            res.status(402).send('Something went wrong:', error)
            return
        }

        // 3.4 Check for and declare group selection
        const popularVote = await checkAllVotesCast(sessionInstance)

        res.json({votesArray: tableListHTML, groupSelection: popularVote, category: sessionInstance.category})
        
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

/** Check the session array of active users if all have cast a vote
 * 
 * @param {object} sessionInstance - session data for the check and the session closing
 * @returns which option was voted most?
 */
async function checkAllVotesCast(sessionInstance) {

    // Load live server votes
    const sessionUsersArray = sessionInstance.active_users_array

    // 3.4.1 Check if all votes are cast
    const activeUsers = sessionUsersArray.length
    const activeVotes = sessionUsersArray.filter(user => user.vote !== null)
    const totalVotes = activeVotes.length

    if (totalVotes === activeUsers) {

        // 3.4.2 Calculate the most common vote
        const voteCounts = {};

        // Count the occurrences of each restaurant choice
        for (const voteObj of activeVotes) {
            const vote = voteObj.vote;
            if (voteCounts[vote]) {
                voteCounts[vote]++;
            } else {
                voteCounts[vote] = 1;
            }
        }

        let popularVote;
        let highestCount = 0;

        // Find the most common restaurant choice
        for (const vote in voteCounts) {
            if (voteCounts[vote] > highestCount) {
                highestCount = voteCounts[vote];
                popularVote = vote;
            }
        }

        // 3.4.5 End sesion in database and live server
        closeSession(sessionInstance, popularVote)

        return popularVote

    // If not all votes are cast, do not calculate and display
    } else {
        return 'null'
    }
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
    // 3.4.5.4 Clear session's active_users_array
    sessionInfo.active_users_array = []

    // Refresh the databases with the new data
    await database.refreshDatabase(sessions, users, null)

}

// =============================================================================
// Function Exports to Server
// =============================================================================

module.exports = { pageSetup }