const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
    {
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        text: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

const issueSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            default: "",
        },
        status: {
            type: String,
            enum: ["open", "closed"],
            default: "open",
        },
        repo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Repo",
            required: true,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        comments: [commentSchema],
    },
    { timestamps: true }
);

module.exports = mongoose.model("Issue", issueSchema);