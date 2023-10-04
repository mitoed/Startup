// =============================================================================
// PAGE LOADING
// =============================================================================

// Retrieve username from url
const pageURL = window.location.search;
const currentUser = pageURL.split('user=')[1];
if (currentUser !== undefined) {
  document.getElementById('username').innerHTML = `Welcome, ${currentUser}`;
} else {
  document.getElementById('username').innerHTML = `Welcome!`;
}

// Enter session by Session ID and username
function urlWithInfo (currentUser, currentsessionID) {
  `./voting_session.html?user=${currentUser}&session=${currentsessionID}`
}

/* Enter Session Page (Existing Session):
- enter username into document.getElementById('username').innerHTML
- check to see if session (by ID) is active
- pass session ID to document.head.title.innerHTML
*/

/* Enter Session Page (New Session):
- generate session ID and add to DB (marked as active?)
- pass session ID to document.head.title.innerHTML and the category to the table generation
*/