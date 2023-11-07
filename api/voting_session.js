const database = require('./database.js')
const classes = require('./classes.js')

function pageSetup(app) {

    // Initialize global variables for backend
    let sessionInstance
    let sessionUsersArray
    let sessionOptionsArray
    let recommendationHTML = ''

// 3.1 -- Populate page and connect to servers
    app.get('/api/populate-page/:sessionID', async (req, res) => {
        
        const { sessionID } = req.params

// 3.1.2 -- Retrieve list of voting options from database (dummy_data.json)
        const { sessions, options } = await database.loadDatabase()
        const data = sessions.find(s => s.session_id === sessionID)
        sessionInstance = new classes.Session(data.session_id, data.category, data.active_users_array)

        const category = sessionInstance.category
        sessionOptionsArray = options[category]

// 3.1.3 -- Connect to live server and add options
        // something with this function -> database.refreshLiveData()

// 3.1.4 -- Retrieve list of active users from live server (dummy_data.json)
        sessionUsersArray = sessionInstance.active_users_array

// 3.1.5 -- Produce table of options and datalist html
        const tableListHTML = generateTableHTML(sessionOptionsArray, sessionUsersArray)

// 3.1.6 -- Produce internet recommendation html
        if (!recommendationHTML) {

            try {

// 3.1.6.1 ---- [For food sessions] Retrieve and produce Yelp recommendation and url
                // Something with Yelp API, if it ever works
                throw new Error('yelp API not connected')
            
            } catch {

// 3.1.6.2 ---- [For movie and game sessions] Display link to google search
                // Until Yelp API works, use this always
                recommendationHTML = generateRecommendationHTML(sessionInstance.category)
            }
        }

        res.json({optionsHTML: tableListHTML,
            recommendation: recommendationHTML,
            activeUsers: sessionUsersArray.length
        })
    })

// 3.2 ---- Record votes on page and servers
// 3.2.2 -- Add user vote
    app.get('/api/record-vote/:sessionID/:username/:newVote', async (req, res) => {

        let { sessionID, username, newVote } = req.params

// 3.2.2.1 -- Update the data in the live server
        try {

// 3.2.2.1.1 -- Connect to live server and database (dummy_data.json)
            const { sessions } = await database.loadDatabase()
            const data = sessions.find(s => s.session_id === sessionID)
            sessionInstance = new classes.Session(data.session_id, data.category, data.active_users_array)
            sessionUsersArray = sessionInstance.active_users_array

// 3.2.2.1.2 -- Add user's vote to their object in the session array
            const userInstance = sessionUsersArray.find(user => user.name === username)
            userInstance['vote'] = newVote

// 3.2.2.1.3 -- Create a new option if doesn't exist in the options database
            let newSelection = sessionOptionsArray.find(option => option.name === newVote)
            if (!newSelection) {
                const table = `<tr><td>${newVote}</td><td>optionVotes</td></tr>`
                const list = `<option value="${newVote}"></option>`
                const newOption = { name: newVote, tableHTML: table, listHTML: list }

                sessionOptionsArray.push(newOption)
            }

// 3.2.2.1.4 -- Create updated html for table of options and datalist
            const tableListHTML = generateTableHTML(sessionOptionsArray, sessionUsersArray)

// 3.2.2.1.5 -- Update the live server (dummy_data.json) with the new session info
            await database.refreshLiveData(sessionInstance.session_id, sessionUsersArray, sessionInstance.category, tableListHTML)
            
            res.status(200).send('Everything worked')

        } catch (error){
            console.error('An error occurred:', error)
            res.status(500).send('Internal Server Error')
        }

    })

// 3.2.3 -- Clear user vote
    app.get('/api/clear-vote/:sessionID/:username', async (req, res) => {

        const { sessionID, username } = req.params

// 3.2.3.1 -- Update the data in the live server
        try {

// 3.2.3.1.1 -- Connect to live server and database (dummy_data.json)
            const { sessions } = await database.loadDatabase()
            const data = sessions.find(s => s.session_id === sessionID)
            sessionInstance = new classes.Session(data.session_id, data.category, data.active_users_array)
            sessionUsersArray = sessionInstance.active_users_array

// 3.2.3.1.2 -- Clear user's vote in their object in the session array
            const userInstance = sessionUsersArray.find(user => user.name === username)
            userInstance['vote'] = null

// 3.2.3.1.3 -- Create updated html for table of options
            const tableListHTML = generateTableHTML(sessionOptionsArray, sessionUsersArray)

// 3.2.3.1.4 -- Update the live server (dummy_data.json) with the new session info
            await database.refreshLiveData(sessionInstance.session_id, sessionUsersArray, sessionInstance.category, tableListHTML)

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
// 3.3.1.1 -- Connect to live server (dummy_data.json)
        const { sessions } = await database.loadDatabase()
        const sessionInstance = sessions.find(s => s.session_id === sessionID)
        sessionUsersArray = sessionInstance.active_users_array

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
                console.log('randomNum:', randomNum)
                popularVote = tiedOptions[randomNum]
            }

        }

        res.json({groupSelection: popularVote})
    })
    
// 3.4.1 -- End sesion in database and live server
    app.get('/api/close-session/:sessionID/:groupSelection', async (req, res) => {

        const { sessionID, groupSelection } = req.params

// 3.4.1.1 -- End live server for session
        // something with this function -> database.refreshLiveData()

// 3.4.1.2 -- Update user database information
        const { sessions, users } = await database.loadDatabase();
        const sessionInfo = sessions.find(session => session.session_id === sessionID);

// 3.4.1.3 -- Mark user as completed and, if picked selection, won
        for (let activeUser of sessionInfo.active_users_array) {
            const user = users.find(u => u.username === activeUser.name);
            if (user) {
                user.sessions_total++
                if (activeUser.vote === groupSelection) {
                    user.sessions_won++
                }
            }
        }
            
// 3.4.1.4 -- Note the time in session's end_time in database
        sessionInfo.end_time = Date.now()

// 3.4.1.5 -- Update the database (dummy_data.json) with the updated session info
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
        option.tableHTML = option.tableHTML.replace(/<\/td><td>(\d+)<\/td>/, '</td><td>' + activeVotes + '</td>')
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