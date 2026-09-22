import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../api/axios.js";
import Navbar from "../components/Navbar.jsx";

function RepoDetail() {
    const { repoId } = useParams();
    const [repo, setRepo] = useState(null);
    const [commits, setCommits] = useState([]);
    const [issues, setIssues] = useState([]);
    const [issueTitle, setIssueTitle] = useState("");
    const [issueDesc, setIssueDesc] = useState("");
    const [showIssueForm, setShowIssueForm] = useState(false);
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
            await API.post(`/repos/${repoId}/issues`, { title: issueTitle, description: issueDesc });
            setIssueTitle("");
            setIssueDesc("");
            setShowIssueForm(false);
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

    if (!repo) {
        return (
            <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
                <p className="text-neutral-500 text-sm">Loading...</p>
            </div>
        );
    }

    const openCount = issues.filter((i) => i.status === "open").length;

    return (
        <div className="min-h-screen bg-neutral-950">
            <Navbar />

            <div className="max-w-4xl mx-auto px-4 py-10">
                <Link to="/repos" className="text-sm text-neutral-500 hover:text-white transition inline-flex items-center gap-1.5">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <path d="M19 12H5M12 19l-7-7 7-7"></path>
                    </svg>
                    Repositories
                </Link>

                <div className="mt-4 mb-8">
                    <h1 className="text-2xl font-semibold text-white">{repo.name}</h1>
                    {repo.description && <p className="text-neutral-400 mt-1">{repo.description}</p>}
                </div>

                {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

                <div className="grid sm:grid-cols-2 gap-6">
                    {/* Commits */}
                    <div>
                        <h3 className="text-neutral-300 font-medium mb-3 text-sm uppercase tracking-wide">
                            Commits <span className="text-neutral-600">({commits.length})</span>
                        </h3>
                        <div className="bg-neutral-900 border border-neutral-800 rounded-xl divide-y divide-neutral-800 overflow-hidden">
                            {commits.map((commit) => (
                                <div key={commit.commitID} className="px-4 py-3">
                                    <p className="text-neutral-200 text-sm">{commit.message}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <code className="text-indigo-400 text-xs">{commit.commitID.slice(0, 8)}</code>
                                        <span className="text-neutral-600 text-xs">
                                            {new Date(commit.date).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            ))}
                            {commits.length === 0 && (
                                <p className="text-neutral-500 text-sm text-center py-8">No commits yet.</p>
                            )}
                        </div>
                    </div>

                    {/* Issues */}
                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-neutral-300 font-medium text-sm uppercase tracking-wide">
                                Issues <span className="text-neutral-600">({openCount} open)</span>
                            </h3>
                            <button
                                onClick={() => setShowIssueForm(!showIssueForm)}
                                className="text-xs text-indigo-400 hover:text-indigo-300 font-medium transition"
                            >
                                + New
                            </button>
                        </div>

                        {showIssueForm && (
                            <form
                                onSubmit={handleCreateIssue}
                                className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 mb-3 space-y-2"
                            >
                                <input
                                    type="text"
                                    placeholder="Issue title"
                                    value={issueTitle}
                                    onChange={(e) => setIssueTitle(e.target.value)}
                                    required
                                    autoFocus
                                    className="w-full bg-neutral-800/80 text-white placeholder-neutral-500 rounded-lg px-3 py-2 outline-none border border-neutral-700 focus:border-indigo-500 transition text-sm"
                                />
                                <input
                                    type="text"
                                    placeholder="Description (optional)"
                                    value={issueDesc}
                                    onChange={(e) => setIssueDesc(e.target.value)}
                                    className="w-full bg-neutral-800/80 text-white placeholder-neutral-500 rounded-lg px-3 py-2 outline-none border border-neutral-700 focus:border-indigo-500 transition text-sm"
                                />
                                <button
                                    type="submit"
                                    className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium rounded-lg px-4 py-2 transition"
                                >
                                    Create Issue
                                </button>
                            </form>
                        )}

                        <div className="space-y-2">
                            {issues.map((issue) => (
                                <div key={issue._id} className="bg-neutral-900 border border-neutral-800 rounded-xl p-4">
                                    <div className="flex items-start justify-between gap-2">
                                        <h4 className="text-white text-sm font-medium">{issue.title}</h4>
                                        <span
                                            className={`shrink-0 text-xs rounded-full px-2 py-0.5 border ${
                                                issue.status === "open"
                                                    ? "text-green-400 border-green-800 bg-green-500/10"
                                                    : "text-neutral-500 border-neutral-700"
                                            }`}
                                        >
                                            {issue.status}
                                        </span>
                                    </div>
                                    {issue.description && (
                                        <p className="text-neutral-400 text-xs mt-1.5">{issue.description}</p>
                                    )}
                                    <div className="flex items-center justify-between mt-3">
                                        <span className="text-neutral-600 text-xs">
                                            by {issue.createdBy?.username || "unknown"}
                                        </span>
                                        {issue.status === "open" && (
                                            <button
                                                onClick={() => handleCloseIssue(issue._id)}
                                                className="text-xs text-neutral-400 hover:text-white border border-neutral-700 rounded-lg px-3 py-1 transition"
                                            >
                                                Close
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {issues.length === 0 && (
                                <p className="text-neutral-500 text-sm text-center py-8">No issues yet.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RepoDetail;