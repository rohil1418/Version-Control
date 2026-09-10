const fs = require("fs").promises;
const path = require("path");

const REMOTE_PATH = path.resolve(process.cwd(), "remote-storage");

async function pullRepo() {
    const repoPath = path.resolve(process.cwd(), ".apnaGit");
    const commitsPath = path.join(repoPath, "commits");

    try {
        const remoteCommitsPath = path.join(REMOTE_PATH, "commits");
        const commitDirs = await fs.readdir(remoteCommitsPath);

        for (const commitDir of commitDirs) {
            const remoteCommitPath = path.join(remoteCommitsPath, commitDir);
            const files = await fs.readdir(remoteCommitPath);

            const localCommitPath = path.join(commitsPath, commitDir);
            await fs.mkdir(localCommitPath, { recursive: true });

            for (const file of files) {
                const sourceFile = path.join(remoteCommitPath, file);
                const destFile = path.join(localCommitPath, file);
                await fs.copyFile(sourceFile, destFile);
            }
        }

        console.log("All commits pulled from remote storage");
    } catch (err) {
        console.error("Error pulling from remote: ", err);
    }
}

module.exports = { pullRepo };