const Issue = require("../models/issueModel.js");
const Repo = require("../models/repoModel.js");

async function createIssue(req, res) {
    try {
        const { repoId } = req.params;
        const { title, description } = req.body;
        const userId = req.user.id;

        if (!title) {
            return res.status(400).json({ message: "Issue title is required" });
        }

        const repo = await Repo.findById(repoId);
        if (!repo) {
            return res.status(404).json({ message: "Repo not found" });
        }

        const newIssue = new Issue({
            title,
            description,
            repo: repoId,
            createdBy: userId,
        });

        await newIssue.save();

        // repo ke issues array mein reference daal do
        repo.issues.push(newIssue._id);
        await repo.save();

        res.status(201).json({ message: "Issue created successfully", issue: newIssue });
    } catch (err) {
        console.error("Create issue error:", err);
        res.status(500).json({ message: "Server error while creating issue" });
    }
}

async function getIssuesForRepo(req, res) {
    try {
        const { repoId } = req.params;

        const issues = await Issue.find({ repo: repoId })
            .populate("createdBy", "username")
            .sort({ createdAt: -1 });

        res.status(200).json({ issues });
    } catch (err) {
        console.error("Get issues error:", err);
        res.status(500).json({ message: "Server error while fetching issues" });
    }
}

async function addComment(req, res) {
    try {
        const { issueId } = req.params;
        const { text } = req.body;
        const userId = req.user.id;

        if (!text) {
            return res.status(400).json({ message: "Comment text is required" });
        }

        const issue = await Issue.findById(issueId);
        if (!issue) {
            return res.status(404).json({ message: "Issue not found" });
        }

        issue.comments.push({ author: userId, text });
        await issue.save();

        res.status(201).json({ message: "Comment added", issue });
    } catch (err) {
        console.error("Add comment error:", err);
        res.status(500).json({ message: "Server error while adding comment" });
    }
}

async function closeIssue(req, res) {
    try {
        const { issueId } = req.params;
        const userId = req.user.id;

        const issue = await Issue.findById(issueId);
        if (!issue) {
            return res.status(404).json({ message: "Issue not found" });
        }

        const repo = await Repo.findById(issue.repo);
        if (repo.owner.toString() !== userId && issue.createdBy.toString() !== userId) {
            return res.status(403).json({ message: "Only the repo owner or issue creator can close this issue" });
        }

        issue.status = "closed";
        await issue.save();

        res.status(200).json({ message: "Issue closed", issue });
    } catch (err) {
        console.error("Close issue error:", err);
        res.status(500).json({ message: "Server error while closing issue" });
    }
}

module.exports = { createIssue, getIssuesForRepo, addComment, closeIssue };