const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authmiddleware.js");
const {
    createIssue,
    getIssuesForRepo,
    addComment,
    closeIssue,
} = require("../controllers/issueController.js");

router.post("/repos/:repoId/issues", authMiddleware, createIssue);
router.get("/repos/:repoId/issues", authMiddleware, getIssuesForRepo);
router.post("/issues/:issueId/comments", authMiddleware, addComment);
router.patch("/issues/:issueId/close", authMiddleware, closeIssue);

module.exports = router;