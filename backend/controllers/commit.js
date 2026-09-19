const fs = require("fs").promises;
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const axios = require("axios");

const API_BASE_URL = "http://localhost:5000/api";

async function commitRepo(message) {
    const repoPath = path.resolve(process.cwd(), ".apnaGit");
    const stagedPath = path.join(repoPath, "staging");
    const commitPath = path.join(repoPath, "commits");

    try {
        const commitID = uuidv4();
        const commitDir = path.join(commitPath, commitID);
        await fs.mkdir(commitDir, { recursive: true });

        const files = await fs.readdir(stagedPath);
        for (const file of files) {
            await fs.copyFile(
                path.join(stagedPath, file),
                path.join(commitDir, file)
            );
        }

        await fs.writeFile(
            path.join(commitDir, "commit.json"),
            JSON.stringify({ message, date: new Date().toISOString() })
        );

        console.log(`Commit ${commitID} created with message : ${message}`);

        await syncCommitToBackend(commitID, message, files, repoPath);
    } catch (err) {
        console.error("Error committing files", err);
    }
}

async function syncCommitToBackend(commitID, message, files, repoPath) {
    try {
        const configData = JSON.parse(
            await fs.readFile(path.join(repoPath, "config.json"), "utf-8")
        );
        const authData = JSON.parse(
            await fs.readFile(path.join(repoPath, "auth.json"), "utf-8")
        );

        if (!configData.repoId) {
            console.log("Note: Repo not linked to backend — commit saved locally only.");
            return;
        }

        await axios.post(
            `${API_BASE_URL}/repos/${configData.repoId}/commits`,
            { commitID, message, files },
            { headers: { Authorization: `Bearer ${authData.token}` } }
        );

        console.log("Commit synced to backend.");
    } catch (err) {
        if (err.response) {
            console.error("Backend sync failed:", err.response.data.message);
        } else {
            console.log("Note: Backend unavailable — commit saved locally only.");
        }
    }
}

module.exports = { commitRepo };