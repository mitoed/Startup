function pageSetup (app) {

// 4.1 -- Get quote and citation
    app.get('/api/get-quote', async (req, res) => {

// 4.1.1 -- Send request through "Quotable" api
        const response = await fetch('https://api.quotable.io/random')
        const data = await response.json()

// 4.1.2 -- Parse response
        const object = {
            quote: data.content,
            citation: data.author
        }

        res.json(object)

    })
}

module.exports = { pageSetup }