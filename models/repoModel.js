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
                type: String, // filenames included in this commit
            },
        ],
        date: {
            type: Date,
            default: Date.now,
        },
    },
    { _id: false } // commitID hi humara identifier hai, alag se _id ki zaroorat nahi
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