// Remove current data from local storage
localStorage.removeItem('voteSelection')

// Initialize countdown timer
let countdownTimer;
let isCountdownRunning = false

// =============================================================================
// WebSocket Configuration
// =============================================================================

// Adjust the WebSocket protocol to what is being used for HTTP
const protocol = window.location.protocol === 'http:' ? 'ws' : 'wss';
const socket = new WebSocket(`${protocol}://${window.location.host}/ws`);

// 6.1 -- User joins session
socket.onopen = (event) => {
    const username = localStorage.getItem('currentUser')
    const session = localStorage.getItem('currentSessionID')
    const wsMsg = {
        "type": "addUser",
        "session": session,
        "username": username
    }
    socket.send(JSON.stringify(wsMsg))
}

// 6.2 -- User leaves session
socket.onclose = (event) => {
    const username = localStorage.getItem('currentUser')
    const wsMsg = {
     "type": "removeUser",
     "username": username
    }
    socket.send(JSON.stringify(wsMsg))
}

// Direct WebSocket messages received from server
socket.onmessage = async (event) => {
    const text = await event.data
    console.log(text)
    const data = JSON.parse(text)
    const type = data['type']

    switch (type) {
        case 'refreshPage':
            pagePopulation()
            break
        case 'startCountdown':
            resetCountdown(true, data.delay, data.selection);
            break
        case 'stopCountdown':
            resetCountdown(false)
            break
    }
}

// =============================================================================
// 3.1 Populate page and connect to servers
// =============================================================================

pagePopulation()
internetRecommendation()

async function pagePopulation() {

    try {
// 3.1.1 -- Display current session ID
        const sessionID = localStorage.getItem('currentSessionID')
        document.title = `Voting Session: ${sessionID}`
        document.getElementById('session_id').innerHTML = `Session ID: ${sessionID}`;

// 3.1.2 -- Retrieve list of voting options from LIVE_SESSIONS
// 3.1.3 -- Count list of active users in session from LIVE_USERS
// 3.1.4 -- Produce table of options and datalist html
// 3.1.5 -- Produce internet recommendation html
        const response = await fetch(`/api/populate-page/${sessionID}`)
        const data = await response.json()
        const optionsArrayHTML = data.optionsHTML

// 3.1.5 -- Display table of options and datalist to be updated with votes
        clearTableAndList()
        populateTableAndList(optionsArrayHTML)

// 3.1.6 -- Display active user count
        const activeUsers = data.activeUsers
        document.getElementById('user_count').innerHTML = `Active Users: ${activeUsers}`

        // Unexpected errors
    } catch (error) {
        console.log('Problem with server. Please try again.', error)
        return
    }
}

// 3.1.7 -- Populate and display internet recommendation
async function internetRecommendation() {

// 3.1.7.1 -- Populate recommendation html based on category
    const sessionID = localStorage.getItem('currentSessionID')
    const response = await fetch(`/api/internet-recommendation/${sessionID}`)
    const data = await response.json()

// 3.1.7.2 -- Display recommendation
    const recommendationHTML = data.recommendation
    displayRecommendation(recommendationHTML)
}

// =============================================================================
// 3.2 Record votes in page and servers
// =============================================================================

// Assign the function to the Finalize Vote button
const finalize_vote_button = document.getElementById('finalize_vote')

finalize_vote_button.onclick = function (event) {
    event.preventDefault();

    // Record vote in Live Servers
    updateVotes()
}

// Assign the function to the Clear Vote button
const clear_vote_button = document.getElementById('clear_vote')

clear_vote_button.onclick = function (event) {
    event.preventDefault();

    // Clear the input box
    document.getElementById('vote_selection').value = ''
    
    // Clear vote in Live Server
    updateVotes()
}

async function updateVotes() {
    try {

// 3.2.1 -- Gather selection from user input
        const sessionID = localStorage.getItem('currentSessionID')
        const username = localStorage.getItem('currentUser')
        const userVote = document.getElementById('vote_selection').value.trim() || null
        const pastVote = localStorage.getItem('voteSelection') || null

        // Just stop if vote has not changed
        if (userVote === pastVote ) {
            return
        }

// 3.2.2 ---- Record vote through WebSocket
        localStorage.setItem('voteSelection', userVote)
        const wsMsg = {
            "type": "userVote",
            "username": username,
            "session": sessionID,
            "vote": userVote
        }
        socket.send(JSON.stringify(wsMsg))

        // Unexpected errors
    } catch (error) {
        console.log('Problem with server. Please try again.', error)
        return
    }

}

// =============================================================================
// 3.4 Close the session
// =============================================================================

async function displaySelection(groupSelection) {

    const sessionID = localStorage.getItem('currentSessionID')

// 3.4.1 -- End session in Mongo DB and Live Servers
    const response = await fetch(`/api/close-session/${sessionID}/${groupSelection}`)
    const data = await response.json()

    if (response.ok) {

// 3.4.2 ---- Display selection on screen from 3.3.2
// 3.4.2.1 -- Select appropriate language for selection display
        let categoryVerb
        switch (data.category) {
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
    for (let child = 0; child < parentElementSize; child++) {
        parentElement.removeChild(parentElement.children[0])
    }
}

function displayRecommendation(recommendationHTML) {
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
 * @param {string} groupSelection - voting selection to be displayed at end of timer
 */
function triggerCountdown(duration, groupSelection) {
    
    isCountdownRunning = true
    let countdown = duration;

    countdownTimer = setInterval(() => {

        // Increment the timer
        countdown--;
        
        // Update countdown on the screen
        const finalizeMsg = document.getElementById('finalize_msg')
        finalizeMsg.innerHTML = `Group selection in ${countdown}`

        // Stop the timer and display the group selection on screen (3.4.2)
        if (countdown === 0) {
            clearInterval(countdownTimer);
            displaySelection(groupSelection);
        }
    }, 1000); // Update countdown every 1 second
}

/** Reset and restart the countdown timer
 * 
 * @param {boolean} begin - if true, restarts timer; if false, stops timer
 * @param {number} duration - seconds to be delayed
 * @param {string} groupSelection - voting selection to be displayed at end of timer
 */
function resetCountdown(begin, duration = '', groupSelection = '') {

    // Clear the existing timer if it exists
    if (isCountdownRunning) {
        clearInterval(countdownTimer);
        isCountdownRunning = false
    }

    // Start the countdown on screen
    if (begin) {
        triggerCountdown(duration, groupSelection);
    
    // Remove countdown on the screen
    } else {
        const finalizeMsg = document.getElementById('finalize_msg')
        finalizeMsg.innerHTML = ''
    }
}