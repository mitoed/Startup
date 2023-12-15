const DB = require('../database.js')

function pageSetup(apiRouter) {

// Populate and display internet recommendation
// Populate recommendation html based on category
    apiRouter.post('/internet-recommendation', async (req, res) => {
        const { category } = req.body
        
// Produce internet recommendation html
        let extraConditions = ''
        let categoryPlural = ''
        switch (category) {
            case 'food':
                categoryPlural = 'restaurants'
                extraConditions = 'near+me'
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

        res.json({
            href: recommendationHREF,
            type: recommendationType,
            plural: categoryPlural,
        })
    })

    apiRouter.post('/session-data', async (req, res) => {
        
        const { sessionID, category } = req.body

        const sessionUserVotes = await DB.getUserVoteData(sessionID)
        const sessionOptions = await DB.getMongoOptions(category)

        res.json({
            sessionData: sessionUserVotes,
            sessionOptions: sessionOptions
        })
    })

// End sesion in Mongo DB and Live Servers
    apiRouter.post('/close-session', async (req, res) => {
        const { sessionID } = req.body

// End session in Mongo DB (after adding any new voting options)
        DB.endSession(sessionID)
    })
}

// Add/update user in LIVE_USERS
async function addUserToMongoUserVotes({ session_id, username, vote }) {
    await DB.changeUserVote(session_id, username, vote)
}

// Upon closing, remove user from LIVE_USERS
function removeUserFromMongoUserVotes({ session_id, username }) {
    DB.removeUserVote(session_id, username)
}

async function checkVotes(msg) {

// Check if all votes are cast
// Retrieve session info for session from LIVE_USERS
    const { session_id } = msg
    const sessionUserVotes = await DB.getUserVoteData(session_id)

// Compare total active users with total votes cast
    const activeUsers = sessionUserVotes.length
    const activeVotes = sessionUserVotes.filter(user => user.vote !== null)
    const totalVotes = activeVotes.length
    let popularVote = ''

// If not all users have voted, exit.
    if (totalVotes !== activeUsers) {
        popularVote = null
    }

    if (totalVotes === activeUsers ) {

// Count the occurrences of each choice
        const voteCounts = {};
        
        for (const voteObj of activeVotes) {
            const vote = voteObj.vote;
            (voteCounts[vote]) ? voteCounts[vote]++ : voteCounts[vote] = 1;
        }

// Find the most common choice(s)
        let highestCount = 0;

        for (const vote in voteCounts) {
            if (voteCounts[vote] > highestCount) {
                highestCount = voteCounts[vote];
                popularVote = vote;
            }
        }

// If there is a tie, randomly choose one of the top choices
        const tiedOptions = Object.keys(voteCounts).filter(vote => voteCounts[vote] === highestCount)
        if (tiedOptions.length > 1) {
            const randomNum = Math.floor(Math.random() * tiedOptions.length)
            popularVote = tiedOptions[randomNum]
        }
    }

    return popularVote
}

// =============================================================================
// Function Exports to Server
// =============================================================================

module.exports = {
    pageSetup,
    addUserToMongoUserVotes,
    removeUserFromMongoUserVotes,
    checkVotes
}