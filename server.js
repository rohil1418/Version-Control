require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

const authRoutes = require("./routes/authRoutes.js");
const repoRoutes = require("./routes/repoRoutes.js");

const app = express();
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/repos", repoRoutes);

const PORT = process.env.PORT || 5000;

console.log("MONGO_URI is:", process.env.MONGO_URI);

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected");
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error("MongoDB connection error:", err);
    });

module.exports = app;