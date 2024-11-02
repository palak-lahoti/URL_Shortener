const shortid = require("shortid");
const URL = require('../models/url');

async function handlegenerateNewShortURL(req, res) {
    const body = req.body;

    if (!body.url) {
        return res.status(400).json({ error: 'URL is required' });
    }

    const shortID = shortid();

    
    await URL.create({
        shortId: shortID,
        redirectURL: body.url,
        visitHistory: [],
    });


    const allUrls = await URL.find({});

    
    return res.render('home', {
        id: shortID,
        urls: allUrls,
    });
}

async function handlegetAnalytics(req, res) {
    const shortId = req.params.shortId;
    const result = await URL.findOne({ shortId });

    return res.json({
        totalClicks: result.visitHistory.length,
        analytics: result.visitHistory,
    });
}

module.exports = {
    handlegenerateNewShortURL,
    handlegetAnalytics
};
