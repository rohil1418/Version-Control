const fs = require("fs").promises;
const path = require("path");

const REMOTE_PATH = path.resolve(process.cwd(), "remote-storage");

async function pushRepo() {
    const repoPath = path.resolve(process.cwd(), ".apnaGit");
    const commitsPath = path.join(repoPath, "commits");

    try {
        const commitDirs = await fs.readdir(commitsPath);

        for (const commitDir of commitDirs) {
            const commitPath = path.join(commitsPath, commitDir);
            const files = await fs.readdir(commitPath);

            const remoteCommitPath = path.join(REMOTE_PATH, "commits", commitDir);
            await fs.mkdir(remoteCommitPath, { recursive: true });

            for (const file of files) {
                const sourceFile = path.join(commitPath, file);
                const destFile = path.join(remoteCommitPath, file);
                await fs.copyFile(sourceFile, destFile);
            }
        }

        console.log("All commits pushed to remote storage");
    } catch (err) {
        console.error("Error pushing to remote: ", err);
    }
}

module.exports = { pushRepo };