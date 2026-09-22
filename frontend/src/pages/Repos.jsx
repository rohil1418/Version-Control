import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios.js";
import Navbar from "../components/Navbar.jsx";

function Repos() {
    const [repos, setRepos] = useState([]);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [error, setError] = useState("");
    const [showForm, setShowForm] = useState(false);

    const fetchRepos = async () => {
        try {
            const response = await API.get("/repos");
            setRepos(response.data.repos);
        } catch (err) {
            setError("Failed to load repos");
        }
    };

    useEffect(() => {
        fetchRepos();
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        setError("");
        try {
            await API.post("/repos", { name, description, visibility: "public" });
            setName("");
            setDescription("");
            setShowForm(false);
            fetchRepos();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to create repo");
        }
    };

    return (
        <div className="min-h-screen bg-neutral-950">
            <Navbar />

            <div className="max-w-4xl mx-auto px-4 py-10">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-semibold text-white">Repositories</h1>
                        <p className="text-neutral-500 text-sm mt-1">{repos.length} total</p>
                    </div>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-sm font-medium rounded-lg px-4 py-2.5 shadow-lg shadow-indigo-500/20 transition"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                        </svg>
                        New Repository
                    </button>
                </div>

                {showForm && (
                    <form
                        onSubmit={handleCreate}
                        className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 mb-8 space-y-3"
                    >
                        <input
                            type="text"
                            placeholder="Repository name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            autoFocus
                            className="w-full bg-neutral-800/80 text-white placeholder-neutral-500 rounded-lg px-4 py-2.5 outline-none border border-neutral-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition"
                        />
                        <input
                            type="text"
                            placeholder="Description (optional)"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full bg-neutral-800/80 text-white placeholder-neutral-500 rounded-lg px-4 py-2.5 outline-none border border-neutral-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition"
                        />
                        <div className="flex gap-3">
                            <button
                                type="submit"
                                className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg px-5 py-2.5 transition"
                            >
                                Create
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowForm(false)}
                                className="text-neutral-400 hover:text-white text-sm px-5 py-2.5 transition"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                )}

                {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

                <div className="space-y-3">
                    {repos.map((repo) => (
                        <Link
                            key={repo._id}
                            to={`/repos/${repo._id}`}
                            className="group block bg-neutral-900 border border-neutral-800 hover:border-indigo-600/60 rounded-xl p-5 transition"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2.5">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-neutral-500 group-hover:text-indigo-400 transition">
                                        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                                        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                                    </svg>
                                    <h3 className="text-white font-medium group-hover:text-indigo-400 transition">{repo.name}</h3>
                                </div>
                                <span className="text-xs text-neutral-500 border border-neutral-700 rounded-full px-2.5 py-0.5">
                                    {repo.visibility}
                                </span>
                            </div>
                            {repo.description && (
                                <p className="text-neutral-400 text-sm mt-2 ml-6.5">{repo.description}</p>
                            )}
                        </Link>
                    ))}

                    {repos.length === 0 && (
                        <div className="text-center py-16 border border-dashed border-neutral-800 rounded-xl">
                            <p className="text-neutral-500 text-sm">No repositories yet</p>
                            <p className="text-neutral-600 text-xs mt-1">Create your first repository to get started</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Repos;