// =============================================================================
// 3.1 Populate page and connect to servers
// 3.2 Display internet recommendations
// =============================================================================

async function pagePopulation() {

    try {
        // Get session ID from local storage and set page title
        const sessionID = localStorage.getItem('currentSessionID')
        document.title = `Voting Session: ${sessionID}`

        console.log(sessionID)

        // 3.1.2 Retrieve list of voting options from database
        const response = await fetch(`/api/populate-page/${sessionID}`)
        const data = await response.json()
        const sessionVotesArray = data.votesArray
        //localStorage.setItem('currentSessionVotes', JSON.stringify(sessionVotesArray))
        
        // 3.1.4 Produce and display table of options and datalist to be updated with votes
        populateTableAndList(sessionVotesArray)
        console.log(`Data populated correctly. Proceed with voting.`)

        // 3.2.1 Display internet recommendations
        const recommendationHTML = data.recommendation
        populateRecommendation(recommendationHTML)

    // Unexpected errors
    } catch (error) {
        console.log('Problem with server. Please try again.', error)
        return
    }
}

pagePopulation()

// =============================================================================
// 3.3 Record Votes and page and servers
// =============================================================================

/**
 * Assign the function to the Finalize Vote button
 */
const finalize_vote_button = document.getElementById('finalize_vote')

finalize_vote_button.onclick = function (event) {
        event.preventDefault();

        finalizeVote()
    }

async function finalizeVote() {


}

// =============================================================================
// 3.4 Display "unpopular vote" recommendation (35% of time)
// =============================================================================

async function unpopularRecommendation() {


}



// =============================================================================
// 3.5 Declare group selection
// =============================================================================



// =============================================================================
// Supporting Functions
// =============================================================================

/** Send html of options to page to be populated
 * 
 * @param {array} sessionVotesArray - Array of option objects (name, votes, tableHTML, listHTML)
 */
function populateTableAndList(sessionVotesArray) {
    
    // Sort by votes (descending)
    sessionVotesArray = sessionVotesArray.sort((a, b) => b.votes - a.votes)

    // Initialize element variables
    const tableElement = document.getElementById('count_table')
    const datalistElement = document.getElementById('voting_options')

    // Iterate through array and send html to page
    for (let option of sessionVotesArray) {
        tableElement.insertAdjacentHTML('beforeend', option['tableHTML'])
        datalistElement.insertAdjacentHTML('beforeend', option['listHTML'])
    }
}

function populateRecommendation(recommendationHTML) {
    const recommendationBubble = document.getElementById('recommendation_bubble')
    recommendationBubble.innerHTML = recommendationHTML
}