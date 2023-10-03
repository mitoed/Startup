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