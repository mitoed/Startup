// Remove current data from local storage
localStorage.removeItem('voteSelection')

// Initialize countdown timer
let countdownTimer;
let isCountdownRunning = false

// =============================================================================
// 3.1 Populate page and connect to servers
// =============================================================================

pagePopulation()

async function pagePopulation() {

    try {
// 3.1.1 -- Display current session ID
        const sessionID = localStorage.getItem('currentSessionID')
        document.title = `Voting Session: ${sessionID}`

// 3.1.2 -- Retrieve list of voting options from database
// 3.1.3 -- Connect to live server and add options
// 3.1.4 -- Retrieve list of active users from live server
// 3.1.5 -- Produce table of options and datalist html
// 3.1.6 -- Produce internet recommendation html
        const response = await fetch(`/api/populate-page/${sessionID}`)
        const data = await response.json()
        const optionsArrayHTML = data.optionsHTML

// 3.1.7 -- Display table of options and datalist to be updated with votes
        clearTableAndList()
        populateTableAndList(optionsArrayHTML)

// 3.1.8 -- Display active user count
        const activeUsers = data.activeUsers
        document.getElementById('user_count').innerHTML = `Active Users: ${activeUsers}`

// 3.1.9 -- Display internet recommendation
        const recommendationHTML = data.recommendation
        populateRecommendation(recommendationHTML)

        // Unexpected errors
    } catch (error) {
        console.log('Problem with server. Please try again.', error)
        return
    }
}

// =============================================================================
// 3.2 Record votes and page and servers
// =============================================================================

// Assign the function to the Finalize Vote button
const finalize_vote_button = document.getElementById('finalize_vote')

finalize_vote_button.onclick = function (event) {
    event.preventDefault();

    finalizeVote()
}

async function finalizeVote() {
    try {

// 3.2.1 -- Gather selection from user input
        const sessionID = localStorage.getItem('currentSessionID')
        const currentUser = localStorage.getItem('currentUser')
        const newVote = document.getElementById('vote_selection').value.trim() || 'null'
        const pastVote = localStorage.getItem('voteSelection') || 'null'

        // Just stop if vote has not changed
        if (newVote === pastVote ) {
            return
        }

// 3.2.2 -- Add user vote
        if (newVote !== 'null') {
            
// 3.2.2.1 -- Update the data in the live server (dummy_data.json)
            const response = await fetch(`/api/record-vote/${sessionID}/${currentUser}/${newVote}`)

            if (response.ok) {
                localStorage.setItem('voteSelection', newVote)

// 3.2.2.2 ---- Display updated data on page
                pagePopulation()

// 3.2.2.3 ---- Proceed to 3.3
                checkVotes()

            } else {
                throw new Error('Status code:', response.status)
            }
        }
        
// 3.2.3 -- Clear vote in live server (dummy_data.json)
        if (newVote === 'null') {
            clearVote(sessionID, currentUser)
        }

        // Unexpected errors
    } catch (error) {
        console.log('Problem with server. Please try again.', error)
        return
    }

}

// Assign the function to the Clear Vote button
const clear_vote_button = document.getElementById('clear_vote')

clear_vote_button.onclick = function (event) {
    event.preventDefault();

    clearVote()
}

// 3.2.3 -- Clear user vote
async function clearVote(sessionID = '', currentUser = '') {

    sessionID = sessionID || localStorage.getItem('currentSessionID')
    currentUser = currentUser || localStorage.getItem('currentUser')

// 3.2.3.1 -- Update the data in the live server (dummy_data.json)
    const response = await fetch(`/api/clear-vote/${sessionID}/${currentUser}`)

    if (response.ok) {
        localStorage.removeItem('voteSelection')
        document.getElementById('vote_selection').value = ''

// 3.2.3.2 -- Display updated data on page
        pagePopulation()

// 3.2.3.3 -- Clear any timer started from 3.3.3
        resetCountdown(false)
    }
}

// =============================================================================
// 3.3 Check for group selection
// =============================================================================

async function checkVotes() {

    const sessionID = localStorage.getItem('currentSessionID')

// 3.3.1 -- Check if all votes are cast
// 3.3.2 -- Calculate the most common vote (this is the group selection)
    const response = await fetch(`/api/check-votes/${sessionID}`)
    const { groupSelection } = await response.json()

    // If all votes are cast...
    if (groupSelection !== 'null') { 

// 3.3.3 -- Countdown timer until group selection declared
        const delayInSeconds = 10
        
// 3.3.3.1 -- When timer finishes, proceed to 3.5
        resetCountdown(true, delayInSeconds, closeSession, sessionID, groupSelection);
    }

    if (groupSelection === 'null') {
        
// 3.3.3.2 -- If votes are changed, cancel timer
        resetCountdown(false)
    }

}

// =============================================================================
// 3.4 Close the session
// =============================================================================

async function closeSession(sessionID, groupSelection) {

// 3.4.1 -- End session in database and live server (dummy_data.json)
    const response = await fetch(`/api/close-session/${sessionID}/${groupSelection}`)
    
    if (response.ok) {

// 3.4.2 ---- Display selection on screen from 3.3.2
// 3.4.2.1 -- Select appropriate language for selection display
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
// 3.4.2.2 -- Display html for group selection
        document.getElementById('dark_background').style.visibility = 'visible'
        document.getElementById('final_decision').style.visibility = 'visible'
        document.getElementById('category_verb').innerHTML = categoryVerb
        document.getElementById('group_selection').innerHTML = groupSelection

// 3.4.3 ---- Disable voting functionality
// 3.4.3.1 -- Create html element to hide group selection
        exitFromFinalSelection()

// 3.4.3.2 -- Disable the vote buttons
        disableCastVoteButton()

    } else {
        throw new Error('Status code:', response.status)
    }

}

// =============================================================================
// Supporting Functions
// =============================================================================

/** Creates and prepares html of options to page to be populated
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

/**
 * Clears all table elements after the header
 * Clears all datalist elements
 */
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

    // Disable Finalize button
    const finalize_vote_button = document.getElementById('finalize_vote')
    finalize_vote_button.onclick = function (event) {
        event.preventDefault();
    }

    // Disable Clear button
    const clear_vote_button = document.getElementById('clear_vote')
    clear_vote_button.onclick = function (event) {
        event.preventDefault()
    }
}

/** Function to start the countdown
 * 
 * @param {number} duration - seconds to be delayed
 * @param {function} onCountdownFinished - ran when countdown is complete
 * @param {*} parameter1 - parameter 1 for function
 * @param {*} parameter2 - parameter 2 for function
 */
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

/** Reset and restart the countdown timer
 * 
 * @param {boolean} begin - if true, restarts timer; if false, stops timer
 * @param {number} duration - seconds to be delayed
 * @param {function} onCountdownFinished - ran when countdown is complete
 * @param {*} parameter1 - parameter 1 for function
 * @param {*} parameter2 - parameter 2 for function
 */
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