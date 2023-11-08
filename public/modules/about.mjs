// =============================================================================
// 4 Get quote for about page
// =============================================================================

insertQuote()

async function insertQuote() {

    // Initialize variables
    let quote
    let citation

    try {

// 4.1 ---- Get quote and citation
// 4.1.1 -- Send request through "Quotable" api
        const response = await fetch('/api/get-quote')
        const data = await response.json()

// 4.1.2 -- Parse response
        quote = data.quote
        citation = '- ' + data.citation

// 4.2 ---- Insert quote into page
// 4.2.1 -- If error in loading quote from api, use generic quote
    } catch {
        // Display error message
        console.error('Quote gathering not successful. Inserting generic quote.')

        // Send generic quote
        quote = 'Life is like a box of chocolates. Sometimes worth sharing, sometimes better eaten alone.'
        citation = '- Anonymous'

// 4.2.2 -- Insert quote and citation into Inspirational Quote
    } finally {
        // Add quote to page
        document.getElementById('quote').innerHTML = quote

        // Add citation to page
        document.getElementById('citation').innerHTML = citation
    }

}