const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authmiddleware.js");
const { createRepo, getMyRepos, getRepoById, addCommit, getCommits } = require("../controllers/repoController.js");

router.post("/", authMiddleware, createRepo);
router.get("/", authMiddleware, getMyRepos);
router.get("/:repoId", authMiddleware, getRepoById);
router.post("/:repoId/commits", authMiddleware, addCommit);
router.get("/:repoId/commits", authMiddleware, getCommits);

module.exports = router;