import React, { useEffect, useRef } from "react";
import InternetLink from "./internet_link";
import UserSelection from "./user_selection";
import GroupSelection from "./group_selection";
import SuggestionLink from "./suggestion_link";
import VotingTable from "./voting_table";

export function Voting() {

    const sessionID = localStorage.getItem('currentSessionID')
    const category = localStorage.getItem('currentCategory')
    const [ sessionOptions, setSessionOptions ] = React.useState([])
    const [ sessionUserVotes, setSessionUserVotes ] = React.useState([])
    const [ decision, setDecision ] = React.useState('')
    const [ suggestion, setSuggestion ] = React.useState('')

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

            await fetchData()
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
                    <UserSelection options={sessionOptions} sessionID={sessionID} category={category} socket={socketRef.current}/>
                    <InternetLink category={category}/>
                </section>
            </main>
            <section>
                <GroupSelection decision={decision}/>
                <SuggestionLink suggestion={suggestion}/>
            </section>
        </>
    )
}