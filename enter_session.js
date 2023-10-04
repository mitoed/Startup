// =============================================================================
// PAGE LOADING
// =============================================================================

let databaseSESSION = []

export function createSessionID () {
  let newSessionID
  let problem = false
  do {
    newSessionID = randomSessionID()
    problem = validateSessionID(newSessionID)
  } while (problem)
  return newSessionID
}

function randomSessionID() {
  let sessionString = []
  let digit
  let digitArray1 = 'BCDFGHJKLMNPQRSTVWXZ'.split('')
  let digitArray2 = '0123456789'.split('')
  do {
    digit = digitArray1[Math.floor(Math.random() * digitArray1.length)]
    sessionString.push(digit)
    digit = digitArray2[Math.floor(Math.random() * digitArray2.length)]
    sessionString.push(digit)
  } while (sessionString.length < 6)
  sessionString = sessionString.join('')
  return sessionString
}


function validateSessionID (checkSessionID) {
  for (let session in databaseSESSION) {
    if (databaseSESSION[session]['sessionID'] === checkSessionID) {
      return true
    }
  }
  return false
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