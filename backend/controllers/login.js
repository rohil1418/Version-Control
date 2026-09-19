const fs = require("fs").promises;
const path = require("path");
const axios = require("axios");

const API_BASE_URL = "http://localhost:5000/api";
const AUTH_FILE = path.resolve(process.cwd(), ".apnaGit", "auth.json");

async function loginCLI(email, password) {
    try {
        const response = await axios.post(`${API_BASE_URL}/auth/login`, {
            email,
            password,
        });

        const { token } = response.data;

        const repoPath = path.resolve(process.cwd(), ".apnaGit");
        await fs.mkdir(repoPath, { recursive: true });

        await fs.writeFile(AUTH_FILE, JSON.stringify({ token, email }));

        console.log("Login successful! Token saved locally.");
    } catch (err) {
        if (err.response) {
            console.error("Login failed:", err.response.data.message);
        } else {
            console.error("Login error:", err.message);
        }
    }
}

module.exports = { loginCLI, AUTH_FILE };