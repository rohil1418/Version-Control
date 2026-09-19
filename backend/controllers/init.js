const fs = require("fs").promises;
const path = require("path");
const axios = require("axios");

const API_BASE_URL = "http://localhost:5000/api";

async function initRepo(repoName) {
    const repoPath = path.resolve(process.cwd(), ".apnaGit");
    const commitsPath = path.join(repoPath, "commits");
    const authFile = path.join(repoPath, "auth.json");

    try {
        await fs.mkdir(repoPath, { recursive: true });
        await fs.mkdir(commitsPath, { recursive: true });

        let backendRepoId = null;
        
        try {
            const authData = JSON.parse(await fs.readFile(authFile, "utf-8"));
            const token = authData.token;

            const folderName = repoName || path.basename(process.cwd());

            const response = await axios.post(
                `${API_BASE_URL}/repos`,
                { name: folderName, description: "", visibility: "public" },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            backendRepoId = response.data.repo._id;
            console.log(`Backend repo created with ID: ${backendRepoId}`);
        } catch (err) {
            console.log("Note: Not logged in or backend unavailable — initializing local-only repo.");
        }

        await fs.writeFile(
            path.join(repoPath, "config.json"),
            JSON.stringify({ bucket: process.env.S3_BUCKET, repoId: backendRepoId })
        );

        console.log("Repository initialised");
    } catch (err) {
        console.error("Error initialising repository", err);
    }
}

module.exports = { initRepo };