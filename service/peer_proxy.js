// Initialize modules
const { WebSocketServer } = require('ws')
const uuid = require('uuid')
const VS = require('./api/voting_session.js');

// WebSocket Messages
const stopCountdown = { "type": "stopCountdown" }

class userVote {
    constructor (username, session_id, vote) {
        this.username = username,
        this.session_id = session_id,
        this.vote = vote
    }
}

function peerProxy(httpServer) {
    // Create a websocket object
    const wss = new WebSocketServer({ noServer: true, perMessageDeflate: false })

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

        ws.on('message', async function message(data) {
            const msg = JSON.parse(data)

            if (msg.type === 'addUser' || msg.type === 'userVote') {
                const newVote = new userVote(msg.username, msg.session_id, msg.vote || null)

                await VS.addUserToMongoUserVotes(newVote)
            } else if (msg.type === 'removeUser') {
                const oldUser = new userVote(msg.username, msg.session_id, null)
                VS.removeUserFromMongoUserVotes(oldUser)
            }

            // Forward message to each client
            msgToAllClients(connections, msg)
            msgToAllClients(connections, stopCountdown)
            
            // 3.3 -- Check for group selection
            const groupSelection = await VS.checkVotes(msg)
            if (groupSelection) {
                // If there's a group selection, tell all clients to start their countdowns
                const startCountdown = { "type": "startCountdown", "selection": groupSelection, "delay": "10" }
                msgToAllClients(connections, startCountdown)
            } else {
                //msgToAllClients(connections, stopCountdown)
            }
        })

        // Remove the closed connection so we don't try to forward anymore
        ws.on('close', () => {
            connections.findIndex((o, i) => {
                if (o.id === connections[i].id) {
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
    }, 5000)
}


function msgToAllClients(connections, msg) {
    connections.forEach((c) => {
        c.ws.send(JSON.stringify(msg))
    })
}


module.exports = { peerProxy }