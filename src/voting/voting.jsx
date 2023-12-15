import React, { useEffect, useRef } from "react";
import InternetLink from "./internet_link";
import UserSelection from "./user_selection";
import GroupSelection from "./group_selection";
import VotingTable from "./voting_table";

export function Voting() {

    const sessionID = localStorage.getItem('currentSessionID')
    const category = localStorage.getItem('currentCategory')
    const [ sessionOptions, setSessionOptions ] = React.useState([])
    const [ sessionUserVotes, setSessionUserVotes ] = React.useState([])
    const [ decision, setDecision ] = React.useState('')
    const [ buttonEnable, setButtonEnable ] = React.useState(true)

    const socketRef = useRef(null)

    React.useEffect(() => {
        fetchData();
    }, [sessionID]);

    React.useEffect(() => {
        // Only setup the WebSocket when the component mounts
        setupWebSocket();

        // Cleanup function to close the WebSocket when the component unmounts
        return () => {
            if (socketRef.current) {
                // Send a message indicating that the user is leaving
                const username = localStorage.getItem('currentUser');
                const session_id = localStorage.getItem('currentSessionID');
                const wsMsg = {
                    "type": 'removeUser',
                    "session_id": session_id,
                    "username": username,
                };
                if (socketRef.current.readyState === WebSocket.OPEN) {
                    socketRef.current.send(JSON.stringify(wsMsg));
                }
                // Close the WebSocket
                socketRef.current.close();
            }
        };
    }, []);

    async function setupWebSocket() {

        const port = window.location.port
        const protocol = window.location.protocol === 'http:' ? 'ws' : 'wss';
        socketRef.current = new WebSocket(`${protocol}://${window.location.hostname}:${port}/ws`);
    
        socketRef.current.onopen = (event) => {
            const username = localStorage.getItem('currentUser')
            const session_id = localStorage.getItem('currentSessionID')
            const wsMsg = {
                "type": 'addUser',
                "session_id": session_id,
                "username": username,
                "vote": '',
            }
            socketRef.current.send(JSON.stringify(wsMsg))
        }
        
        socketRef.current.addEventListener('message', async (e) => {
            const msg = JSON.parse(e.data)

            // Run code depending on the msg type
            switch (msg.type) {
                case 'addUser':
                    await fetchData()
                    break
                case 'removeUser':
                    await fetchData()
                    break
                case 'userVote':
                    await fetchData()
                    break
                case 'stopCountdown':
                    resetCountdown(false);
                    break
                case 'startCountdown':
                    resetCountdown(true, msg.delay, msg.selection)
                    break
            }
            
        })

        // Setup the beforeunload event to send a message before the user leaves the page
        window.addEventListener('beforeunload', () => {
            const username = localStorage.getItem('currentUser');
            const session_id = localStorage.getItem('currentSessionID');
            const wsMsg = {
                "type": 'removeUser',
                "session_id": session_id,
                "username": username,
            };
            if (socketRef.current.readyState === WebSocket.OPEN) {
                socketRef.current.send(JSON.stringify(wsMsg));
            }
        });
    }

    const fetchData = async () => {
        const response = await fetch('/api/session-data', {
            method: 'post',
            body: JSON.stringify({
                sessionID: sessionID,
                category: category
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8'
            },
        })
        
        const data = await response.json()
        setSessionOptions(data.sessionOptions)
        setSessionUserVotes(data.sessionData)
    }

    let isCountdownRunning = false
    let countdownTimer

    // Countdown timer until group selection displayed
    function triggerCountdown(duration, groupSelection) {
        
        isCountdownRunning = true
        let countdown = duration;

        countdownTimer = setInterval(() => {

            // Increment the timer
            countdown--;
            
            // Update countdown on the screen
            const finalizeMsg = document.getElementById('finalize_msg')
            finalizeMsg.innerHTML = `Group selection in ${countdown}`

    // 3.4.3.1 -- When timer finished, proceed to 3.5
            if (countdown === 0) {
                clearInterval(countdownTimer);
                setDecision(groupSelection);
                closeSession()
            }
        }, 1000); // Update countdown every 1 second
    }

    // 3.4.3.2 -- If votes are changed, cancel timer
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

    async function closeSession() {
        const finalizeMsg = document.getElementById('finalize_msg')
        finalizeMsg.innerHTML = 'Session has ended'
        setButtonEnable(false)
        await fetch('/api/close-session', {
            method: 'post',
            body: JSON.stringify({
                sessionID: sessionID,
            }),
            headers: {
                'Content-type': 'application/json; charset=UTF-8'
            },
        })
    }

    return (
        <>
            <main className="ALL-l-main ALL-container ALL-verticle">
                <section className="VOT-session VOT-info">
                    <h1 id="session_id">Session ID: {sessionID}</h1>
                </section>
                <section className="VOT-session VOT-user-count">
                    <h1 id="user_count">Active Users: {sessionUserVotes.length}</h1>
                </section>
                <section className="VOT-count_selection VOT-container">
                    <VotingTable options={sessionOptions} sessionUserVotes={sessionUserVotes}/>
                    <UserSelection options={sessionOptions} sessionID={sessionID} category={category} socket={socketRef.current} buttonEnable={buttonEnable}/>
                    <InternetLink category={category}/>
                </section>
            </main>
            <section>
                <GroupSelection decision={decision} category={category}/>
            </section>
        </>
    )
}