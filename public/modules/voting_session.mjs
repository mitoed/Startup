// Remove current data from local storage
localStorage.removeItem('voteSelection')

// Initialize countdown timer
let countdownTimer;
let isCountdownRunning = false

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

        // 3.1.4 Produce and display table of options and datalist to be updated with votes
        clearTableAndList()
        populateTableAndList(optionsArrayHTML)

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
        const sessionID = localStorage.getItem('currentSessionID')
        const currentUser = localStorage.getItem('currentUser')
        const newVote = document.getElementById('vote_selection').value.trim() || 'null'
        const pastVote = localStorage.getItem('voteSelection') || 'null'

        // If vote has not changed, exit function
        if (newVote === pastVote ) {
            console.log('same as last time')
            return
        }

        if (newVote !== 'null') {
            // 3.3.2 Add vote in live server (dummy_data.json)
            console.log('selection cleared')
            const response = await fetch(`/api/record-vote/${sessionID}/${currentUser}/${newVote}`)

            if (response.ok) {

                // Retain selection in local storage
                localStorage.setItem('voteSelection', newVote)

                // Repopulate the table and list
                pagePopulation()

                // Check if all votes have been cast
                checkVotes()

            } else {
                throw new Error('Status code:', response.status)
            }
        }
        

        if (newVote === 'null') {
            // 3.3.2 Clear vote in live server (dummy_data.json)
            clearVote(sessionID, currentUser)
        }

        // Unexpected errors
    } catch (error) {
        console.log('Problem with server. Please try again.', error)
        return
    }

}

/**
 * Assign the function to the Clear Vote button
 */

const clear_vote_button = document.getElementById('clear_vote')

clear_vote_button.onclick = function (event) {
    event.preventDefault();

    clearVote()
}

async function clearVote(sessionID = '', currentUser = '') {

    // Get values from local storage if needed
    sessionID = sessionID || localStorage.getItem('currentSessionID')
    currentUser = currentUser || localStorage.getItem('currentUser')

    // 3.3.2 Clear vote in live server (dummy_data.json)
    const response = await fetch(`/api/clear-vote/${sessionID}/${currentUser}`)

    if (response.ok) {

        // Remove selection in local storage
        localStorage.removeItem('voteSelection')
        document.getElementById('vote_selection').value = ''

        // Repopulate the table and list
        pagePopulation()

        // Cancel the countdown timer, if any
        resetCountdown(false)
    }
}

// =============================================================================
// 3.4 Declare winning selection
// =============================================================================

/**
 * If all votes have been cast, display the group selection
 */
async function checkVotes() {

    // Get session ID from local storage
    const sessionID = localStorage.getItem('currentSessionID')

    // 3.4.1 Check if all votes are cast
    // 3.4.2 Calculate the most common vote (this is the group selection)
    const response = await fetch(`/api/check-votes/${sessionID}`)
    const { groupSelection } = await response.json()

    // If not all votes are cast, do not proceed
    if (groupSelection !== 'null') {

        // Reset and start the countdown (adjust delay duration as needed)
        const delayInSeconds = 10
        
        // Call closeSession when the countdown is finished
        resetCountdown(true, delayInSeconds, closeSession, sessionID, groupSelection);
    }

    if (groupSelection === 'null') {
        
        // Cancel the countdown timer
        resetCountdown(false)
    }

}

async function closeSession(sessionID, groupSelection) {

    const response = await fetch(`/api/close-session/${sessionID}/${groupSelection}`)
    
    if (response.ok) {

        // If all votes are cast, display the winning vote
        let categoryVerb
        switch (response.category) {
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
    } else {
        throw new Error('Status code:', response.status)
    }

}

// =============================================================================
// Supporting Functions
// =============================================================================

/** Send html of options to page to be populated
 * 
 * @param {array} sessionOptionsArray - Array of option objects (name, votes, tableHTML, listHTML)
 */
function populateTableAndList(optionsArrayHTML) {

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

    // Session concluded message
    document.getElementById('finalize_msg').innerHTML = 'Session has concluded'
    console.log('Session has concluded. Finalize Vote button has been disabled.')

    // Disable buttons
    const finalize_vote_button = document.getElementById('finalize_vote')
    finalize_vote_button.onclick = function (event) {
        event.preventDefault();
    }
    const clear_vote_button = document.getElementById('clear_vote')
    clear_vote_button.onclick = function (event) {
        event.preventDefault()
    }
}

// Function to start the countdown
function startCountdown(duration, onCountdownFinished, parameter1, parameter2) {
    
    isCountdownRunning = true
    let countdown = duration;

    countdownTimer = setInterval(() => {

        // Increment the timer
        countdown--;
        
        // Update countdown on the screen
        const finalizeMsg = document.getElementById('finalize_msg')
        finalizeMsg.innerHTML = `Group selection in ${countdown}`

        if (countdown === 0) {
            clearInterval(countdownTimer); // Stop the timer
            onCountdownFinished(parameter1, parameter2); // Call the provided function when the countdown is finished
        }
    }, 1000); // Update countdown every 1 second
}

// Function to reset and restart the countdown timer
function resetCountdown(begin, duration = '', onCountdownFinished = '', parameter1 = '', parameter2 = '') {
    if (isCountdownRunning) {
        clearInterval(countdownTimer); // Clear the existing timer if it exists
        isCountdownRunning = false
    }

    if (begin) {
        startCountdown(duration, onCountdownFinished, parameter1, parameter2);
    } else {
        // Remove countdown on the screen
        const finalizeMsg = document.getElementById('finalize_msg')
        finalizeMsg.innerHTML = ''
    }
}