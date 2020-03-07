const express = require("express");
const path = require("path");

const PORT = process.env.PORT || 5000;

const app = express();

// --- init middlewares
app.use(express.json({ extended: false }));

// --- weather routes
app.use("/api/weather", require("./routes/api/weather"));

// --- serve static assets in production
if (process.env.NODE_ENV === "production") {
    // --- set static folder
    app.use(express.static("client/build"));

    app.use("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
    });
}

app.listen(PORT, () => {
    console.log(`Express Server started on ${PORT}`);
});
