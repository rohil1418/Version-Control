import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../api/axios.js";

function RepoDetail() {
    const { repoId } = useParams();
    const [repo, setRepo] = useState(null);
    const [commits, setCommits] = useState([]);
    const [issues, setIssues] = useState([]);
    const [issueTitle, setIssueTitle] = useState("");
    const [issueDesc, setIssueDesc] = useState("");
    const [error, setError] = useState("");

    const fetchAll = async () => {
        try {
            const repoRes = await API.get(`/repos/${repoId}`);
            setRepo(repoRes.data.repo);

            const commitsRes = await API.get(`/repos/${repoId}/commits`);
            setCommits(commitsRes.data.commits);

            const issuesRes = await API.get(`/repos/${repoId}/issues`);
            setIssues(issuesRes.data.issues);
        } catch (err) {
            setError("Failed to load repo details");
        }
    };

    useEffect(() => {
        fetchAll();
    }, [repoId]);

    const handleCreateIssue = async (e) => {
        e.preventDefault();
        try {
            await API.post(`/repos/${repoId}/issues`, {
                title: issueTitle,
                description: issueDesc,
            });
            setIssueTitle("");
            setIssueDesc("");
            fetchAll();
        } catch (err) {
            setError("Failed to create issue");
        }
    };

    const handleCloseIssue = async (issueId) => {
        try {
            await API.patch(`/issues/${issueId}/close`);
            fetchAll();
        } catch (err) {
            setError("Failed to close issue");
        }
    };

    if (!repo) return <p>Loading...</p>;

    return (
        <div style={{ maxWidth: "700px", margin: "50px auto" }}>
            <Link to="/repos">&larr; Back to repos</Link>
            <h2>{repo.name}</h2>
            <p>{repo.description}</p>

            {error && <p style={{ color: "red" }}>{error}</p>}

            <h3>Commit History ({commits.length})</h3>
            <ul>
                {commits.map((commit) => (
                    <li key={commit.commitID}>
                        <code>{commit.commitID.slice(0, 8)}</code> — {commit.message}{" "}
                        <small>({new Date(commit.date).toLocaleString()})</small>
                    </li>
                ))}
            </ul>

            <h3>Issues ({issues.length})</h3>

            <form onSubmit={handleCreateIssue} style={{ marginBottom: "20px" }}>
                <input
                    type="text"
                    placeholder="Issue title"
                    value={issueTitle}
                    onChange={(e) => setIssueTitle(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Description (optional)"
                    value={issueDesc}
                    onChange={(e) => setIssueDesc(e.target.value)}
                />
                <button type="submit">Create Issue</button>
            </form>

            <ul style={{ listStyle: "none", padding: 0 }}>
                {issues.map((issue) => (
                    <li
                        key={issue._id}
                        style={{
                            border: "1px solid #ccc",
                            padding: "10px",
                            marginBottom: "10px",
                            borderRadius: "5px",
                        }}
                    >
                        <strong>{issue.title}</strong>{" "}
                        <span style={{ color: issue.status === "open" ? "green" : "gray" }}>
                            [{issue.status}]
                        </span>
                        <p>{issue.description}</p>
                        <small>by {issue.createdBy?.username || "unknown"}</small>
                        {issue.status === "open" && (
                            <button onClick={() => handleCloseIssue(issue._id)} style={{ marginLeft: "10px" }}>
                                Close
                            </button>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default RepoDetail;