/**
 * Remove current data from local storage
 */
localStorage.removeItem('voteSelection')

// =============================================================================
// 3.1 Populate page and connect to servers
// 3.2 Display internet recommendations
// =============================================================================

pagePopulation()

async function pagePopulation() {

    try {
        // Get session ID from local storage and set page title
        const sessionID = localStorage.getItem('currentSessionID')
        document.title = `Voting Session: ${sessionID}`

        // 3.1.2 Retrieve list of voting options from database
        const response = await fetch(`/api/populate-page/${sessionID}`)
        const data = await response.json()
        const optionsArrayHTML = data.optionsHTML
        const sessionUsersArray = data.sessionUsers
        
        // 3.1.4 Produce and display table of options and datalist to be updated with votes
        clearTableAndList()
        populateTableAndList(optionsArrayHTML, sessionUsersArray)

        // 3.2.1 Display internet recommendations
        const recommendationHTML = data.recommendation
        populateRecommendation(recommendationHTML)

    // Unexpected errors
    } catch (error) {
        console.log('Problem with server. Please try again.', error)
        return
    }
}

// =============================================================================
// 3.3 Record Votes and page and servers
// 3.4 Check for winning selection
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
    try {

        // 3.3.2 Gather selection from user input
        const currentUser = localStorage.getItem('currentUser')
        const newVote = document.getElementById('vote_selection').value.trim()

        // If something is not entered, clear the box and exit function
        if (newVote === '') {
            document.getElementById('vote_selection').value = ''
            return
        }

        // 3.3.3 Change vote in live server for user (dummy_data.json)
        const response = await fetch(`api/record-vote/${currentUser}/${newVote}`)
        const data = await response.json()

        if (!response.ok) {
            throw new Error('Status code:',response.status)
        }

        // Retain selection in local storage
        localStorage.setItem('voteSelection', newVote)

        // Repopulate the table and list
        pagePopulation()

        // Check if winner is declared
        const groupSelection = data.groupSelection
        const sessionCategory = data.category
        if (groupSelection !== 'null') {
            declareWinner(groupSelection, sessionCategory)
        }

        // Unexpected errors
    } catch (error) {
        console.log('Problem with server. Please try again.', error)
        return
    }

}

// =============================================================================
// 3.4 Declare winning selection
// =============================================================================

/** If all votes have been cast, display the group selection
 * 
 * @param {string} groupSelection - option calculated to have the most votes
 */
function declareWinner(groupSelection, sessionCategory) {

    // Display the winning vote
    let categoryVerb
    switch (sessionCategory) {
        case 'food':
            categoryVerb = 'eating at'
            break
        case 'movie':
            categoryVerb = 'watching'
            break
        case 'game':
            categoryVerb = 'playing'
            break
    }
    document.getElementById('dark_background').style.visibility = 'visible'
    document.getElementById('final_decision').style.visibility = 'visible'
    document.getElementById('category_verb').innerHTML = categoryVerb
    document.getElementById('group_selection').innerHTML = groupSelection

    exitFromFinalSelection()
    disableCastVoteButton()

}

// =============================================================================
// Supporting Functions
// =============================================================================

/** Send html of options to page to be populated
 * 
 * @param {array} sessionOptionsArray - Array of option objects (name, votes, tableHTML, listHTML)
 */
function populateTableAndList(optionsArrayHTML, sessionUsersArray) {

    let sortedOptions = optionsArrayHTML
    
    // Sort by names (ascending), then by votes (descending)
    sortedOptions = sortedOptions.sort((a, b) => a.name.localeCompare(b.name));
    sortedOptions = sortedOptions.sort((a, b) => {
        const numberA = parseInt(a.tableHTML.match(/<td>(\d+)<\/td><\/tr>/)[1]);
        const numberB = parseInt(b.tableHTML.match(/<td>(\d+)<\/td><\/tr>/)[1]);
      
        return numberB - numberA;
      });

    // Initialize element variables
    const tableElement = document.getElementById('count_table')
    const datalistElement = document.getElementById('voting_options')

    // Iterate through array and send html to page
    for (let option of sortedOptions) {
        tableElement.insertAdjacentHTML('beforeend', option['tableHTML'])
        datalistElement.insertAdjacentHTML('beforeend', option['listHTML'])
    }
}

function clearTableAndList() {

    // Clear table elements
    let parentElement = document.getElementById('count_table')
    let parentElementSize = parentElement.childElementCount
    for (let child = 1; child < parentElementSize; child++) {
        parentElement.removeChild(parentElement.children[1])
    }

    // Clear list elements
    parentElement = document.getElementById('voting_options')
    parentElementSize = parentElement.childElementCount
    for (let child = 1; child < parentElementSize; child++) {
        parentElement.removeChild(parentElement.children[1])
    }
}

function populateRecommendation(recommendationHTML) {
    const recommendationBubble = document.getElementById('recommendation_bubble')
    recommendationBubble.innerHTML = recommendationHTML
}

/**
 * Add way out of final selection display
 */
function exitFromFinalSelection() {
    const dark_background_button = document.getElementById('dark_background')

    dark_background_button.onclick = function () {
        document.getElementById('dark_background').style.visibility = 'hidden'
        document.getElementById('final_decision').style.visibility = 'hidden'
        document.getElementById('category_verb').innerHTML = ""
        document.getElementById('group_selection').innerHTML = ""
    }
}

/**
 * Disable further voting code and display message if user tries to continue
 */
function disableCastVoteButton() {
    const finalize_vote_button = document.getElementById('finalize_vote')
    finalize_vote_button.onclick = function (event) {
        event.preventDefault();
        document.getElementById('disabled_finalize').innerHTML = 'Session has concluded'
        console.log('Session has concluded. Finalize Vote button has been disabled.')
    }
}