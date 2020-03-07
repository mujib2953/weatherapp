const express = require("express");
const axios = require("axios");
const config = require("config");

const router = express.Router();

router.get("/", async (req, res) => {
    
    const city = req.query.city || "mumbai";

    const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${config.get("OPEN_WEATHER_API_TOKEN")}&units=metric`;

    try {
        const api_call = await axios.get(url);
        res.status(200).json(api_call.data);
    } catch(e) {
        console.log(e);
        res.status(500).json({ "error": "Server Error." });
    }
});

module.exports = router;
