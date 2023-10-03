/* Classes */

class User {
  constructor (username, password) {
    this._username = username
    this._password = password
    this._sessions_total = 0
    this._sessions_won = 0
  }
  get username() {return this._username}
  get password() {return this._password}
  get sessions_total() {return this._sessions_total}
  participateSession() {
    this._sessions_total++
  }
  get sessions_won() {return this._sessions_won}
  winSession() {
    this._sessions_won++
  }
}


/* Common Protocols (to be functions)
- check if information exists in DB like a username or session ID (databaseName/Location, checkField, checkValue, errorArray)
- validate information in DB like a password (databaseName/Location, checkField, checkValue, checkField2, checkValue2, errorArray)
*/

/* Login Page (Existing User):
- check to see if username exists in DB
- if username exists, validate password
- if username doesn't exist or password does not match, unhide error message.
*/



/* Login Page (Create User):
- check to see if username exists in DB
- check to see if password fits requirements
- if passwords does not fit requirements or passwords don't match, unhide error message.
*/

/* Enter Session Page (Existing Session):
- enter username into document.getElementById('username').innerHTML
- check to see if session (by ID) is active
- pass session ID to document.head.title.innerHTML
*/

/* Enter Session Page (New Session):
- generate session ID and add to DB (marked as active?)
- pass session ID to document.head.title.innerHTML and the category to the table generation
*/

/* Voting Page:
- enter username into document.getElementById('username').innerHTML
- pass session ID to document.head.title.innerHTML
- generate table from DB using handlebars
- upon clicking "finalize vote":
    - [based on users and chance] generate and display unpopular user's vote:
        - check all users for most unpopular user
        - pass that user's vote to document.getElementById('recommendation_opinion').innerHTML
        - wait for user response
        - if 'yes', replace their selection with recommended opinion
    - add value to DB/table if not in DB/table
    - increment vote count
    - sort table by votes (then alphabetically)
- using user physical location:
    - scrape google for top nearby restaurants
    - pass website url to document.getElementById('recommendation_link').href
    - add restaurant name to document.getElementById('recommendation_internet').innerHTML
- when all users have clicked "finalize vote":
    - pass appropriate category verb (e.g., "eating at") to document.getElementById('category_verb')
    - pass winning selection to document.getElementById('group_selection)
    - change the message and background's hidden property to false
*/

/* About Page:
- none

*/

