const fs = require('fs');
const bcrypt = require('bcrypt')
const sampleDirectory = './sample_values.json'
const { MongoClient } = require('mongodb')
const config = require('./dbConfig.json')
const classes = require('../api/classes.js')

// Access Mongo Database
const url = `mongodb+srv://${config.username}:${config.password}@${config.hostname}`
const client = new MongoClient(url)
const sessionsCollection = client.db('voting').collection('sessions')
const usersCollection = client.db('voting').collection('users')

const DB_USERS = []
const DB_SESSIONS = []

// =============================================================================
// Mongo Database Setup Functions -- Development Only
// =============================================================================

// START ME TO RESET MONGO DB TO DEFAULT VALUES
resetMongo()

async function resetMongo() {
    try {

        // This will completely clear user and session collections
        await clearMongoDB()

        // This will add sample values to user and session collections
        await addSampleData()
        
    } catch (ex) {
        console.log('\nSomething went wrong:', ex.message)
    }
}

async function clearMongoDB() {
    try {
        await usersCollection.deleteMany()
        await sessionsCollection.deleteMany()
        console.log('\nCleared all Mongo collections')

    } catch (err) {
        console.error(`\nError clearing the database: ${err}`)
    }
}

async function addSampleData() {
    try {
        const { Mongo_USERS, Mongo_LIVE_SESSIONS } = await loadSampleData()

        let result = await usersCollection.insertMany(Mongo_USERS)
        console.log('\nSuccessfully added ', result.insertedCount, 'users')

        result = await sessionsCollection.insertMany(Mongo_LIVE_SESSIONS)
        console.log('\nSuccessfully added ', result.insertedCount, 'sessions')

        console.log('\nMongo DB has been reset to sample values.')

    } catch (err) {
        console.error(`Error adding options to the database: ${err}`)
    }
}

function loadSampleData() {
    return new Promise(async (resolve, reject) => {
        try {
            // Access sample data
            const jsonData = await fs.promises.readFile(sampleDirectory, 'utf8');
            const data = JSON.parse(jsonData);
            resolve(data); // Resolve the promise with the data.

        } catch (error) {
            console.log('Internal Server Error: cannot connect to database');
            reject(error); // Reject the promise in case of an error.
        }
    });
}

// =============================================================================
// DUMMY VALUES -- TO BE DELETED WHEN CONNECTED TO PERSISTENT DATABASE
// =============================================================================

async function addFakeUser(fakeUserName, fakePassword, fakeTotal, fakeWon) {
    const fakeHash = await bcrypt.hash(fakePassword, 10)
    let fakeUser = new classes.User(fakeUserName, fakeHash, fakeTotal, fakeWon)
    DB_USERS.push(fakeUser)
}

async function addUsers() {
    await addFakeUser("ADMIN", "1234", 100000, 100000)
    await addFakeUser('BILLY', '389dd9*w', 7, 1)
    await addFakeUser('JOE', '303udsdf', 7, 0)
    await addFakeUser('SAMMY', '38&sjdkf', 3, 0)
    await addFakeUser('KATIE', '732df9fd', 3, 3)
    await addFakeUser('BOB', '39fdsdf', 7, 4)
}

function addFakeSession(fakeSessionID, fakeCategory, DB_CATEGORY) {
    let fakeSession = new classes.Session(fakeSessionID, fakeCategory, DB_CATEGORY)
    DB_SESSIONS.push(fakeSession)
}

let listFOOD = [
    "Wendy's",
    "McDonald's",
    "Chick-fil-A",
    "Bumblebees",
    "Se Llama Peru",
    "India Palace",
    "Burger Supreme",
    "Cubby's",
    "Good Move",
    "Brick Oven",
    "Costa Vida",
    "Five Sushi Bros",
    "Black Sheep Cafe",
];

let listMOVIE = [
    "The Shawshank Redemption",
    "The Godfather",
    "The Dark Knight",
    "Pulp Fiction",
    "Schindler's List",
    "The Return of the King",
    "Fight Club",
    "Forrest Gump",
    "Inception",
    "The Matrix",
    "Gladiator",
    "The Silence of the Lambs"
];

let listGAME = [
    "Settlers of Catan",
    "Ticket to Ride",
    "Carcassonne",
    "Pandemic",
    "Dominion",
    "Codenames",
    "7 Wonders",
    "Twilight Struggle",
    "Agricola",
    "Scythe",
    "Splendor",
    "Betrayal at Baldur's Gate"]

addFakeSession('SAMPLE', 'food', listFOOD)
addFakeSession("F7N7V4", 'food', listFOOD)
addFakeSession("C7T4H9", 'food', listFOOD)
addFakeSession("TEST", 'movie', listMOVIE)
addFakeSession("N7T5Q6", 'movie', listMOVIE)
addFakeSession("L3V9B4", 'movie', listMOVIE)
addFakeSession("R7M0X2", 'game', listGAME)
addFakeSession("X7H3J3", 'game', listGAME)
addFakeSession("S4C3Q5", 'game', listGAME)

/** Convert the lists to objects with the proper table and list html structures */
function convertArrayToObjects(list) {

    let objectsArray = []

    for (let option of list) {
        objectsArray.push({ name: option })
    }

    return objectsArray
}

const DB_LIVE_USERS = [
    { name: 'BILLY', session: 'SAMPLE', vote: 'Costa Vida' },
    { name: 'JOE', session: 'SAMPLE', vote: 'Five Sushi Bros' },
    { name: 'SAMMY', session: 'SAMPLE', vote: 'Good Move' },
    { name: 'KATIE', session: 'SAMPLE', vote: 'Burger Supreme' },
    { name: 'BOB', session: 'TEST', vote: "Inception" },
]

// =============================================================================
// 
// =============================================================================

// Call the function to create and save the JSON file
createSampleJSON();

async function createSampleJSON() {

    await addUsers()

    const sampleData = {
        Mongo_USERS: DB_USERS.map(user => ({
            username: user.username,
            password_hash: user.password_hash,
            token: user.token,
            sessions_total: user.sessions_total,
            sessions_won: user.sessions_won,
        })),
        Mongo_LIVE_SESSIONS: DB_SESSIONS.map(session => ({
            session_id: session.session_id,
            category: session.category,
            options: session.options,
            start_time: session.start_time,
            active_users_array: session.active_users_array,
            unpopular_opinion: session.unpopular_opinion,
            end_time: session.end_time,
            group_selection: session.group_selection,
        })),
        LIVE_USERS: DB_LIVE_USERS,
        Mongo_OPTIONS: {
            food: convertArrayToObjects(listFOOD),
            game: convertArrayToObjects(listGAME),
            movie: convertArrayToObjects(listMOVIE)
        }
    }

    // Save the JSON to a file
    const jsonContent = JSON.stringify(sampleData, null, 2);
    fs.writeFileSync('./sample_values.json', jsonContent);
}