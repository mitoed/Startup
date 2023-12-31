### Run in console to deploy code:

> ./deployReact.sh -k ~/JavaScript/keys/prod.pem -h activityanarchy.click -s startup

# Startup - Activity Anarchy

 For CS 260 - Web Programming

Pressure Point: Deciding on and beginning group activities can be difficult. Group members sometimes do not share actual preferences, they do not fairly make a decision, or one person dominates the conversation.

This application will help to deal with the first part of this pressure point: deciding on a group activity. Further development may address the second part (beginning the activity), but will not be covered during the CS 260 project.

Below are the steps of this project and their descriptions:

## DESIGN

### Elevator Pitch

"Making simple decisions like "where to eat" or "what to watch" can be quite complicated...then you add 2, 5, 10 people to that decision and it can be impossible.

"Introducing: Activity Anarchy! The next time you need to decide what movie to turn on, where to get food, what game to play, or generally pass a fun time with your friends and family, whip out this app to give your group ideas and to mediate a live, civilzed vote. Just login with your name and password, start or join a voting session, choose an option from our pre-added list, or add your own ideas! Plus, for those who like to try new things, you can get a recommendation from Google or based on the vote of a less-selected voter (those whose option isn't chosen very often). With Activity Anarchy, say "Good-bye" to wasting precious time (and sometimes to arguements) with loved ones. Join now for free!"

### Key Features

- [ ] Login to identify voters and track "sessions_won"
- [ ] Create or join a session by Session ID
- [ ] Live voting that shows all available options from database in order of number of votes
- [X] Search (or type) to vote on option; "Finalize Vote" button at bottom
- [X] Timer that counts down before final tally is recorded and displayed
- [X] Database of pre-added suggestions by category (movies, restaurants, games)
- [ ] Add new option to category's database during live vote
- [X] Upon clicking "Finalize Vote" and only 35% of the time, recommends selected option of user with lowest "sessions_won" value (iff below certain amount like 2)

### Technology Uses

**Authentication**: Users must login with username and password to enter vote

**Database Data**: Pre-added options are stored in database with category listed (movie, food, game)

User data also stored (username, password, email, "total_sessions", "sessions_won")

**WebSocket Data**: Users are seeing live results as votes are received.

Live recommendations made based on vote of least sessions_won.

Seperate data for votes finalized?

### Design Sketches

![Sketch of Login page](/all_notes/design_images/Design_login_page.jpg)
Home / login page

![Sketch of Join/Create Session page](/all_notes/design_images/Design_create_join_session_page.jpg)
Users join an existing session or create a new one by category

![Sketch of live voting page](/all_notes/design_images/Design_live_voting_page.jpg)
Votes are seen live to the right of each option. Options are sorted by number of votes. User can search for and add new options at the top.

![Sketch of recommendation popup upon clicking "Finalize Vote" on the live voting page](/all_notes/design_images/Design_recommendation_popup.jpg)
Once the user clicks on "Finalize Vote" (only ~35% of the time), they may receive a recommendation based on the vote of the one "least sessions_won".

![Sketch of about page](/all_notes/design_images/Design_about_page.jpg)
About page

## HTML

### HTML Deliverable

**HTML Pages** - 4 html pages that represent the home/login page, the enter a voting session page, the voting page, and the about page.

**Links** - The login page links to the enter a session page, which in turn links to the voting page. A navigation menu that has links to the login page, the enter a session page, and the about page.

**Text** - There is a textual representation of each voting option, text that displays the winning decision, and text that appears with a voting recommendation.

**Third Party Service Calls** - None will be used.

**Images** - There is an image on the about page.

**Login** - Users create an account (to be stored in a database) and then login with username and password. Username displayed on "enter session" and "voting session" pages.

**Database** - All voting options are stored in a database by category, which are retrieved for each voting session. New options (added within a session) will be immediately added to database at the end of the session. All user login and voting stats are held in a database. The voting option database is currently hardcoded into the voting_session page as a placeholder.

**WebSocket** - Count of real time votes displayed on voting session page.

**Git Commits** - Done

## CSS

### CSS Deliverable

**Header, Footer, Main Content** - Added appropriate color to header/footer (including buttons with contrasting color) and img to background of main.

**Navigation Elements** - Menu at top for navigating to each accessible page. Buttons on pages also navigate to next page.

**Responsive to Window Sizing** - Through Flexblocks, elements remain centered upon resizing and voting page blocks rearrange for better visibility on narrow windows/devices.

**Application Elements** - Styling intended to be simple yet intuitive and eye-catching. Flex blocks maintain good spacing and arrangement.

**Application Text Content** - Imported readable and theme-appropriate font used throughout.

**Application Images** - Background image applied using CSS. Placeholder image (to be updated) positioned on About Page.

**Multiple Git Commits** - Done with (mostly) detailed comments.

## JavaScript

### JavaScript Deliverable

**Support for Future Login** - Dummy database populated that includes set of users, password hashes, and salts. New user data added to dummy database. Login information checks against dummy values.

**Support for Database Data** - Dummy database for past and current voting sessions (current sessions can be accessed and entered). User can enter a session, which maintains list of voting options. Votes for a given voting uption are tallied from the users in the current session and their current voting option. Database is refreshed upon any vote submit. User database information also called to populate a voting recommendation for users with low "agreed-with" rates (AKA their loss rate).

**Support for Future WebSocket** - Prepared to receive WebSocket data, which will add values to the database as it's processed.

**Application Logic** - As users vote on options, the populated table updates. When users vote, they are sometimes given a recommendation based on the votes of users with high "loss rates", which alters the user's vote if they accept the recommendation. When all users have voted, the final group selection is displayed in popup.

**API Preparation** - ~~Logic added that will call the Yelp Fusion API to return a recommendation from Yelp to give users additional ideas for their voting. CORS not yet set up, so webpage currently returns a google.com link to good restaurants nearby.~~ About page will call a random quote generator. For now, there is a placeholder for those random quotes.

## Web Service

### Web Service Deliverable

**HTTP Service with Node.js and Express** - Done. Index.js is loaded first, then calls server.js, which houses all the main code. Various node.js files (in api folder) contain the http request setup for each page.

**Frontend Served Using Express Static** - Done.

**Frontend Calls Third Party Endpoints** - About page posts a random quote as requested from "Quotable".

**Backend Provides Service Sndpoints** - As explained above, the backend holds a lot of the code for each page, particularly the parts that request database information, login validation/creation, or live server information (all to be developed in future deliverable).

**Frondend Calls Backend Service Endpoints** - Each of the pages has a dedicated backend page that is regularly called to retrieve and/or update database or live server information. Frontend takes the requested data and applies it to the webpages.

## Database

### Database Deliverable

**MongoDB Atlas Database Created** - Done. Hostname, username, and password all in dbConfig.json file (which is included in .gitignore)

**Backend Endpoints for Manipulating Application Data** - Endpoints include calling for user/session data and updating the same once a session is completed.

**Stores Application Data in MongoDB** - Startup uses 2 collections: "voting", which holds the session and user info, and "options", which contains the voting options to be called when creating a session

## Login

### Login Deliverable

**New User Registration** - New users are added to Mongo DB after hashing their password using bcrypt. User token is also generated upon user creation.

**Existing User Authentication** - Existing user info stored and retreived from Mongo DB in backend.

**Stores and Retrieves Credentials in Mongo DB** - As stated above, existing user information is stored and retrieved in Mongo DB. When user logs in, user token is stored as cookie for later authentication.

**Restricts Application Functionality Based on Authentication** - Upon page loading, application checks for user token stored as cookie. If token not found in user database, user cannot go to Enter Session page (where their credentials are needed).

## WebSocket

### WebSocket Deliverable

**Backend Listens For WebSocket Connection** - Done in peer_proxy.js file.

**Frontend makes WebSocket Connection** - Done in voting_session.mjs in the modules folder.

**Data sent over WebSocket connection** - Clients send information including "entered session" and "vote cast". Server sends information telling clients to refresh the table html, counting down until the final decision is made, and displaying a winning selection.

**WebSocket Data Displayed in the Application Interface** - WebSockets send the final group decision which is displayed at the end.

## React

### React Deliverable

**Bundled with WebPack and Bable into React app** - Done.

**Multiple React Components** - Components for Login, Entering a Session, the Voting page, and the About page. Within the Voting page, components for the table, the user selection, the internet recommendation, and the group selection. Components pass variables and call server-side apis similar to past itterations of the app.

**React Router** - Routing within the login, enter session, and voting session components

**React Hooks** - Effect hooks that load data on initializing the voting session components, then State hooks that respond to changes in data and update component values.