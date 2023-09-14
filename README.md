# Startup - Activity Anarchy
 For CS 260 - Web Programming

Pressure Point: Deciding on and beginning group activities can be difficult. Group members sometimes do not share actual preferences, they do not fairly make a decision, or one person dominates the conversation.

This application will help to deal with the first part of this pressure point: deciding on a group activity. Further development may address the second part (beginning the activity), but will not be covered during the CS 260 project.

Below are the steps of this project and their descriptions:

## DESIGN
### Elevator Pitch
"Making simple decisions like "where to eat" or "what to watch" can be quite complicated...then you add 2, 5, 10 people to that decision and it can be impossible.

"Introducing: Activity Anarchy! The next time you need to decide what movie to turn on, where to get food, what game to play, or generally pass a fun time with your friends and family, whip out this app to give your group ideas and to mediate a live, civilzed vote. Just login with your name and email, start or join a voting session, choose an option from our pre-added list, or add your own ideas! Plus, for those who like to try new things, you can get a recommendation based on the vote of a less-selected voter (those whose option isn't chosen very often). With Activity Anarchy, say "Good-bye" to wasting precious time (and sometimes to arguements) with loved ones. Join now for free!"

### Key Features
- [ ] Login to identify voters and track "times agreed-with"
- [ ] Create or join a session by Session ID
- [ ] Live voting that shows all available options from database in order of votes received
- [ ] Click (or tap) to vote on option; "Finalize Vote" button at bottom
- [ ] Timer to limit duration of live vote??
- [ ] Database of pre-added suggestions by category (movies, restaurants, games)
- [ ] Add new option to category's database during live vote
- [ ] Upon clicking "Finalize Vote" and only 35% of the time, recommends selected option of user with lowest "times agreed-with" value (iff below certain amount like 2)

### Technology Uses
**Authentication**: Users must login with username and password to enter vote

**Database Data**: Pre-added options are stored in database with category listed (movie, food, game)

User data also stored (username, password, email, "times participated", "times agreed-with")

**WebSocket Data**: Users are seeing live results as votes are received.

Live recommendations made based on vote of least times agreed-with.

Seperate data for votes finalized?

### Design Sketches
![Sketch of Login page](/images/Design_login_page.jpg)
Home / login page

![Sketch of Join/Create Session page](/images/Design_create_join_session_page.jpg)
Users join an existing session or create a new one by category

![Sketch of live voting page](/images/Design_live_voting_page.jpg)
Votes are seen live to the right of each option. Options are sorted by number of votes. User can search for and add new options at the top.

![Sketch of recommendation popup upon clicking "Finalize Vote" on the live voting page](/images/Design_recommendation_popup.jpg)
Once the user clicks on "Finalize Vote" (only ~35% of the time), they may receive a recommendation based on the vote of the one "least times agreed-with".

![Sketch of about page](/images/Design_about_page.jpg)
About page 

## HTML
* Create html files for each page. All pages will be accessible via hyperlinks in the header except the "hidden" page that users will use when participating in a live vote.
* 

## CSS
* 

## JavaScript
* 

## Web service
* 

## Database
* 

## Login
* 

## WebSocket
* 

## React
* 
