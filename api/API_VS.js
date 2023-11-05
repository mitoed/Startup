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
        const response = await database.loadDatabase()
        const data = response['sessions'].filter((session) => session.session_id === sessionID)[0]
        sessionInstance = new classes.Session(data.session_id, data.category, data.active_users_array)
        sessionUsersArray = sessionInstance.active_users_array

        // 3.1.2 Retrieve list of voting options from database (dummy_data.json)
        const category = sessionInstance.category
        sessionOptionsArray = response['live_servers']['server' + category.toUpperCase()]

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
        const userInstance = sessionUsersArray.filter(user => user.user === username)[0]
        userInstance['vote'] = newVote

        // Create a new option if doesn't exist in the options database
        let newSelection = sessionOptionsArray.filter(option => option.name === newVote)[0]
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

        // Check for and declare group selection
        const popularVote = 'null'//checkAllVotesCast()

        res.json({votesArray: tableListHTML, groupSelection: popularVote})
        
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

function checkAllVotesCast() {

    // Load user data

    // Load live server votes

    // Total Votes === Active Users
    const totalVotes = ''
    const activeUsers = ''

    if (totalVotes === activeUsers) {
        popularVote = ''

        return popularVote
    } else {
        return 'null'
    }


}

// =============================================================================
// Function Exports to Server
// =============================================================================

module.exports = { pageSetup }