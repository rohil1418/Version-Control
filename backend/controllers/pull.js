const fs = require("fs").promises;
const path = require("path");
const axios = require("axios");

const API_BASE_URL = "http://localhost:5000/api";

async function pullRepo() {
    const repoPath = path.resolve(process.cwd(), ".apnaGit");
    const commitsPath = path.join(repoPath, "commits");

    try {
        const configData = JSON.parse(
            await fs.readFile(path.join(repoPath, "config.json"), "utf-8")
        );
        const authData = JSON.parse(
            await fs.readFile(path.join(repoPath, "auth.json"), "utf-8")
        );

        if (!configData.repoId) {
            console.log("This repo is not linked to a backend repo. Cannot pull.");
            return;
        }

        const response = await axios.get(
            `${API_BASE_URL}/repos/${configData.repoId}/commits`,
            { headers: { Authorization: `Bearer ${authData.token}` } }
        );

        const remoteCommits = response.data.commits;

        for (const commit of remoteCommits) {
            const localCommitDir = path.join(commitsPath, commit.commitID);

            try {
                await fs.access(localCommitDir);
                continue; 
            } catch {
                
            }

            await fs.mkdir(localCommitDir, { recursive: true });
            await fs.writeFile(
                path.join(localCommitDir, "commit.json"),
                JSON.stringify({ message: commit.message, date: commit.date })
            );
            console.log(`Pulled commit metadata: ${commit.commitID}`);
        }

        console.log("Pull complete. (Note: file contents require push/pull via remote-storage for now.)");
    } catch (err) {
        if (err.response) {
            console.error("Pull failed:", err.response.data.message);
        } else {
            console.error("Pull error:", err.message);
        }
    }
}

module.exports = { pullRepo };