// Initialize modules
const { WebSocketServer } = require('ws')
const uuid = require('uuid')
const VS = require('./api/voting_session.js');
const { BulkOperationBase } = require('mongodb');

// WebSocket Messages
const refreshPageMsg = `{ "type": "refreshPage" }`
const voteReceivedMsg = `{ "type": "Vote Received" }`
const checkVotesMsg = `{ "type": "checkVotes" }`
const stopCountdown = `{ "type": "stopCountdown" }`

function peerProxy(httpServer) {
    // Create a websocket object
    const wss = new WebSocketServer({ noServer: true })

    // Handle the protocol upgrade from HTTP to WebSocket
    httpServer.on('upgrade', (request, socket, head) => {
        wss.handleUpgrade(request, socket, head, function done(ws) {
            wss.emit('connection', ws, request);
        });
    });

    // Keep track of all connections to forward messages
    let connections = []

    wss.on('connection', (ws) => {
        const connection = { id: uuid.v4(), alive: true, ws: ws }
        connections.push(connection)

        ws.on('message', function message(data) {
            const msg = JSON.parse(data)

            // Tell each client to refresh their page and stop any countdown
            msgToAllClients(connections, refreshPageMsg)
            msgToAllClients(connections, stopCountdown)

            // Run function based on message
            if (msg.type === 'userVote') {
                VS.userVote(msg)

            } else if (msg.type === 'addUser') {
                VS.userToLiveUsers(msg.session, msg.username)

            } else if (msg.type === 'removeUser') {
                VS.userFromLiveUsers(msg.username)
            }

            // 3.3 -- Check for group selection
            const groupSelection = VS.checkVotes(msg)
            if (groupSelection) {
                // If there's a group selection, tell all clients to start their countdowns
                const startCountdown = `{ "type": "startCountdown", "selection": "${groupSelection}", "delay": "10" }`
                msgToAllClients(connections, startCountdown)
            } else {
                // If there's no group selection, tell all clients to stop their countdowns
                msgToAllClients(connections, stopCountdown)
            }

        })

        // Remove the closed connection so we don't try to forward anymore
        ws.on('close', () => {
            connections.findIndex((o, i) => {
                if (o.id === connections.id) {
                    connections.splice(i, 1)
                    return true
                }
            })
        })

        // Respond to pong messages by marking the connection alive
        ws.on('pong', () => {
            connection.alive = true
        })
    })

    setInterval(() => {
        connections.forEach((c) => {
            // Kill any connection that didn't respond to the ping last time
            if (!c.alive) {
                c.ws.terminate()
            } else {
                c.alive = false
                c.ws.ping()
            }
        })
    }, 10000)
}


function msgToAllClients(connections, msg) {
    connections.forEach((c) => {
        c.ws.send(msg)
    })
}


module.exports = { peerProxy }