export default async function castVote(socket, username, userVote, sessionID, category) {
    try {

// 3.3.1 -- Gather selection from user input
        sessionID = sessionID || localStorage.getItem('currentSessionID')
        username = username || localStorage.getItem('currentUser')
        userVote = userVote.trim() || ''
        const pastVote = localStorage.getItem('voteSelection') || ''

        // Stop here if vote has not changed
        if (userVote === pastVote ) {
            return
        }

// 3.3.2 ---- Send vote through WebSocket
        localStorage.setItem('voteSelection', userVote)
        const wsMsg = {
            "type": "userVote",
            "username": username,
            "session_id": sessionID,
            "vote": userVote
        }
        socket.send(JSON.stringify(wsMsg))

    // Unexpected errors
    } catch (error) {
        console.log('Problem with server. Please try again.', error)
        return
    }
}