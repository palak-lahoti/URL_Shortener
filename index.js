
const express = require('express');
const { connectToMongoDB } = require("./connect");
const urlRoute = require('./routes/url');
const URL = require('./models/url');
const staticRoute = require('./routes/staticRouter');
const app = express();
const PORT = 8001;
const path = require('path');

// Connect to MongoDB
connectToMongoDB('mongodb://localhost:27017/short-url')
    .then(() => console.log("MongoDB Connected"))
    .catch((err) => console.error("MongoDB connection error:", err));

// Set view engine and views path
app.set("view engine", "ejs");
app.set('views', path.resolve("./views"));

// Middleware to serve static files and parse request bodies
app.use("/", staticRoute);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Route to render all URLs on a test page
app.get("/test", async (req, res) => {
    try {
        const allUrls = await URL.find({});
        return res.render("home", { urls: allUrls }); // Pass all URLs to the home.ejs view
    } catch (error) {
        console.error("Error fetching URLs:", error);
        return res.status(500).send("Internal Server Error");
    }
});

// Route for shortened URLs
app.use("/url", urlRoute);

// Route to handle redirection based on shortId
app.get('/url/:shortId', async (req, res) => {
    const shortId = req.params.shortId;
    try {
        const entry = await URL.findOneAndUpdate(
            { shortId },
            { 
                $push: { 
                    visitHistory: { timestamp: Date.now() } 
                } 
            },
            { new: true } // Return the updated document
        );

        // If no entry is found, respond with a 404 error
        if (!entry) {
            return res.status(404).send('URL not found');
        }

        res.redirect(entry.redirectURL); // Redirect to the original URL
    } catch (error) {
        console.error("Error finding short URL:", error);
        return res.status(500).send("Internal Server Error");
    }
});

// Start the server
app.listen(PORT, () => console.log('Server Started at PORT:', PORT));

