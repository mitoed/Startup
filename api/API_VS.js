const database = require('./database.js')
const classes = require('./classes.js')

function pageSetup(app) {

    // Initialize session instance for backend
    let sessionInstance

    app.get('/api/populate-page/:sessionID', async (req, res) => {
        
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

        res.json(sessionVotesArray)
    })
    
}

function generateTableHTML (sessionVotesArray) {
    for (let option of sessionVotesArray) {
        const tableRowHTML = `<tr><td>${option.name}</td><td>${option.votes}</td></tr>`
        option['tableHTML'] = tableRowHTML
    }
    return sessionVotesArray
}

function generateListHTML (sessionVotesArray) {
    for (let option of sessionVotesArray) {
        const listRowHTML = `<option value="${option.name}"></option>`
        option['listHTML'] = listRowHTML
    }
    return sessionVotesArray
}

module.exports = { pageSetup }