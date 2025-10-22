require('dotenv').config()
const NodeCache = require('node-cache')
const express = require('express')

const currencyCache = new NodeCache({stdTTL: 3600})
const app = express()
app.use(express.json())
const api_key = process.env.API_KEY
const port = process.env.PORT

async function fetchAndCache(key, url) {
    const cached = currencyCache.get(key)
    if(cached) {
        console.log(`Cache hit: ${key}, fetching from Cache`)
        return cached
    }
    console.log(`Cache miss: ${key}, fetching ${url}, set into Cache`)
    const res = await fetch(url)
    const data = await res.json()
    currencyCache.set(key, data)
    return data
}

const API_LINK = 'https://v6.exchangerate-api.com/v6'

app.get('/convert', async (req, res) => {
    const choice1 = req.query.choice1
    const choice2 = req.query.choice2
    const amount = req.query.amount

    const pair = `${choice1}_${choice2}`
    const cacheKey = `pair_convert_${pair}_${amount}`
    
    const url = `${API_LINK}/${api_key}/pair/${choice1}/${choice2}/${amount}`
    const data = await fetchAndCache(cacheKey, url)
    res.json(data)   
})

app.get('/codes', async (req, res) => {
    const cacheKey = `codes`
    const url = `${API_LINK}/${api_key}/codes`
    const data = await fetchAndCache(cacheKey, url)
    res.json(data)
})

app.get('/symbol', async(req, res) => {
    const cacheKey = `symbol`
    const url = `${API_LINK}/${api_key}/enriched/${choice1}/${choice2}`
    const data = await fetchAndCache(cacheKey, url)
    res.json(data)
})

app.use(express.static('public'))
app.listen(port, () => console.log(`Server is running on Port ${port}`))