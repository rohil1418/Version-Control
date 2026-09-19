const mongoose = require("mongoose");

const commitSchema = new mongoose.Schema(
    {
        commitID: {
            type: String,
            required: true,
        },
        message: {
            type: String,
            required: true,
        },
        files: [
            {
                type: String, 
            },
        ],
        date: {
            type: Date,
            default: Date.now,
        },
    },
    { _id: false } 
);

const repoSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            default: "",
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        visibility: {
            type: String,
            enum: ["public", "private"],
            default: "public",
        },
        commits: [commitSchema],
        issues: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Issue",
            },
        ],
    },
    { timestamps: true }
);

module.exports = mongoose.model("Repo", repoSchema);