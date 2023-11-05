const database = require('./database.js')
const classes = require('./classes.js')

function pageSetup(app) {

    // Initialize session instance for backend
    let sessionInstance

    app.get('/api/populate-page/:sessionID', async (req, res) => {
        
        // 3.1 Populate page and connect to servers
        const { sessionID } = req.params

        // Create session object from database data
        const response = await database.loadDatabase()
        const data = response['sessions'].filter((session) => session.session_id === sessionID)[0]
        sessionInstance = new classes.Session(data.session_id, data.category)

        // 3.1.2 Retrieve list of voting options from database (dummy_data.json)
        const sessionCategory = sessionInstance.category
        let sessionVotesArray = response['live_servers']['server' + sessionCategory.toUpperCase()]

        // 3.1.4 Produce html for table of options
        sessionVotesArray = generateTableHTML(sessionVotesArray)

        // 3.1.5 Produce html for datalist
        sessionVotesArray = generateListHTML(sessionVotesArray)

        // 3.2 Display internet recommendations
        const recommendationHTML = generateRecommendationHTML(sessionInstance.category)

        res.json({votesArray: sessionVotesArray, recommendation: recommendationHTML})
    })

    app.get('/api/record-vote/:votingOption', async (req, res) => {

        // 3.3 Record votes on page and servers
        const { votingOption } = req.params
    })
    
}

// =============================================================================
// Supporting Functions
// =============================================================================

/** Update or add the table html for each voting option object
 * 
 * @param {array} sessionVotesArray - Array of voting option objects
 * @returns Updated array
 */
function generateTableHTML (sessionVotesArray) {
    for (let option of sessionVotesArray) {
        const tableRowHTML = `<tr><td>${option.name}</td><td>${option.votes}</td></tr>`
        option['tableHTML'] = tableRowHTML
    }
    return sessionVotesArray
}

/** Update or add the list html for each voting option object
 * 
 * @param {array} sessionVotesArray - Array of voting option objects
 * @returns Updated array
 */
function generateListHTML (sessionVotesArray) {
    for (let option of sessionVotesArray) {
        const listRowHTML = `<option value="${option.name}"></option>`
        option['listHTML'] = listRowHTML
    }
    return sessionVotesArray
}

/**
 * 
 * @returns html for recommendation bubble
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

module.exports = { pageSetup }