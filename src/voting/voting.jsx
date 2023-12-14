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
        pageSetup()
    }, [])

    async function pageSetup() {
        await getSessionDataFromMongo(sessionID)

        const port = window.location.port
        const protocol = window.location.protocol === 'http:' ? 'ws' : 'wss';
        socketRef.current = new WebSocket(`${protocol}://${window.location.hostname}:${port}/ws`);
    
        socketRef.current.onopen = (event) => {
            const username = localStorage.getItem('currentUser')
            const session = localStorage.getItem('currentSessionID')
            const wsMsg = {
                "type": 'addUser',
                "session": session,
                "username": username,
                "vote": '',
            }
            socketRef.current.send(JSON.stringify(wsMsg))
        }
        
        socketRef.current.addEventListener('message', (e) => {
            const msg = JSON.parse(e.data)
    
            if (msg.type === 'userVote') {
                const updatedVote = {name: msg.username, session: msg.session, vote: msg.vote}
                const voteIndex = sessionUserVotes.findIndex((vote) => {
                    return vote.name === updatedVote.name && vote.session === updatedVote.session
                })
                const updatedVotes = [...sessionUserVotes]
                updatedVotes[voteIndex] = updatedVote
                console.log('Old Votes: ', sessionUserVotes)
                console.log('New Votes: ', updatedVotes)
                setSessionUserVotes(updatedVotes)
            
                if (!sessionOptions.includes(msg.vote)) {
                    setSessionOptions((pastOptions) => [...pastOptions, msg.vote])
                }
                
            } else if (msg.type === 'addUser') {
                setSessionUserVotes(prevVotes => [...prevVotes, { name: msg.username, session: msg.session, vote: msg.vote }]);
            }
        })
    }

    async function getSessionDataFromMongo(sessionID) {
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
                    <VotingTable options={sessionOptions} userVotes={sessionUserVotes}/>
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