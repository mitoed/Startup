// Remove current data from local storage
localStorage.removeItem('currentSessionID')

// =============================================================================
// 2.1 Enter a session with a Session ID
// =============================================================================

// Assign the function to the Join Session Button
const join_session_button = document.getElementById('join_session')

    join_session_button.onclick = function (event) {
        event.preventDefault();

        joinSession()
    }

async function joinSession() {

// 2.1.1 -- Gather session ID inputted from enter_session page
    const currentUser = localStorage.getItem('currentUser')
    const sessionID = document.getElementById('join_session_id').value.toUpperCase()

    // Make sure input is filled before continuing
    if (sessionID.trim() === '') {
        document.getElementById('join_session_id').value = ''
        return
    }

    try {
// 2.1.2 -- Check if session is open on live server
        const response = await fetch(`/api/join-session/${currentUser}/${sessionID}`)
        const success = response.status

// 2.1.3 -- If session is open, enter the session
        if (success === 200) {
            localStorage.setItem('currentSessionID', sessionID)
            document.getElementById('session_not_found_error').innerHTML = ''
            window.location.href = `./voting_session.html?user=${currentUser}&session=${sessionID}`
            return

// 2.1.4 -- If session is not open, respond with error message to user
        } else if (success === 204) {
            console.log('Error: Session Not Found')
            document.getElementById('session_not_found_error').innerHTML = 'Session Not Found'
            return
        }

    // Unexpected errors
    } catch (error) {
        console.log('Problem with server. Please try again.', error)
        return
    }
}

// =============================================================================
// 2.2 Create a session based on a category
// =============================================================================

// Assign the function to the Create Session Button
const create_session_button = document.getElementById('create_session')

    create_session_button.onclick = function (event) {
        event.preventDefault();

        createSession()
    }

async function createSession() {

// 2.2.1 -- Gather category selected by user on enter_session page
    const currentUser = localStorage.getItem('currentUser')
    const category = document.querySelector('input[name="category"]:checked').value;

    try {

// 2.2.2 -- Create a new session
        const response = await fetch(`/api/create-session/${currentUser}/${category}`)
        const success = response.status
        const data = await response.json()

// 2.2.3 -- If successful, enter the session
        if (success === 200) {
            window.location.href = `./voting_session.html?user=${currentUser}&session=${data.sessionID}`
        }

    // Unexpected errors
    } catch (error) {
        console.log('Problem with server. Please try again.', error)
        return
    }

}