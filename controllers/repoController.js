const Repo = require("../models/repoModel.js");
const User = require("../models/userModel.js");

async function createRepo(req, res) {
    try {
        const { name, description, visibility } = req.body;
        const userId = req.user.id; // authMiddleware se aayega

        if (!name) {
            return res.status(400).json({ message: "Repo name is required" });
        }

        const existingRepo = await Repo.findOne({ name, owner: userId });
        if (existingRepo) {
            return res.status(409).json({ message: "You already have a repo with this name" });
        }

        const newRepo = new Repo({
            name,
            description,
            visibility: visibility || "public",
            owner: userId,
            commits: [],
        });

        await newRepo.save();

        // user ke repositories array mein bhi reference daal do
        await User.findByIdAndUpdate(userId, {
            $push: { repositories: newRepo._id },
        });

        res.status(201).json({ message: "Repo created successfully", repo: newRepo });
    } catch (err) {
        console.error("Create repo error:", err);
        res.status(500).json({ message: "Server error while creating repo" });
    }
}

async function getMyRepos(req, res) {
    try {
        const userId = req.user.id;

        const repos = await Repo.find({ owner: userId }).select("-commits");
        // commits exclude kiya list view mein, kyunki wo bade ho sakte hain

        res.status(200).json({ repos });
    } catch (err) {
        console.error("Get repos error:", err);
        res.status(500).json({ message: "Server error while fetching repos" });
    }
}

async function getRepoById(req, res) {
    try {
        const { repoId } = req.params;
        const userId = req.user.id;

        const repo = await Repo.findById(repoId);

        if (!repo) {
            return res.status(404).json({ message: "Repo not found" });
        }

        if (repo.visibility === "private" && repo.owner.toString() !== userId) {
            return res.status(403).json({ message: "Access denied to private repo" });
        }

        res.status(200).json({ repo });
    } catch (err) {
        console.error("Get repo error:", err);
        res.status(500).json({ message: "Server error while fetching repo" });
    }
}

async function addCommit(req, res) {
    try {
        const { repoId } = req.params;
        const { commitID, message, files } = req.body;
        const userId = req.user.id;

        const repo = await Repo.findById(repoId);

        if (!repo) {
            return res.status(404).json({ message: "Repo not found" });
        }

        if (repo.owner.toString() !== userId) {
            return res.status(403).json({ message: "Only the owner can commit to this repo" });
        }

        repo.commits.push({ commitID, message, files, date: new Date() });
        await repo.save();

        res.status(201).json({ message: "Commit synced successfully" });
    } catch (err) {
        console.error("Add commit error:", err);
        res.status(500).json({ message: "Server error while adding commit" });
    }
}

async function getCommits(req, res) {
    try {
        const { repoId } = req.params;
        const userId = req.user.id;

        const repo = await Repo.findById(repoId);

        if (!repo) {
            return res.status(404).json({ message: "Repo not found" });
        }

        if (repo.visibility === "private" && repo.owner.toString() !== userId) {
            return res.status(403).json({ message: "Access denied" });
        }

        res.status(200).json({ commits: repo.commits });
    } catch (err) {
        console.error("Get commits error:", err);
        res.status(500).json({ message: "Server error while fetching commits" });
    }
}

module.exports = { createRepo, getMyRepos, getRepoById, addCommit, getCommits };
