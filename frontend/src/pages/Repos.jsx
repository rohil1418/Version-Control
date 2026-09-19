import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";

function Repos() {
    const [repos, setRepos] = useState([]);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [error, setError] = useState("");
    const { logout } = useAuth();

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
            fetchRepos();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to create repo");
        }
    };

    return (
        <div style={{ maxWidth: "600px", margin: "50px auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
                <h2>Your Repositories</h2>
                <button onClick={logout}>Logout</button>
            </div>

            <form onSubmit={handleCreate} style={{ marginBottom: "20px" }}>
                <input
                    type="text"
                    placeholder="Repo name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Description (optional)"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <button type="submit">Create Repo</button>
            </form>

            {error && <p style={{ color: "red" }}>{error}</p>}

            <ul style={{ listStyle: "none", padding: 0 }}>
                {repos.map((repo) => (
                    <li
                        key={repo._id}
                        style={{
                            border: "1px solid #ccc",
                            padding: "10px",
                            marginBottom: "10px",
                            borderRadius: "5px",
                        }}
                    >
                        <Link to={`/repos/${repo._id}`}>
                            <strong>{repo.name}</strong>
                        </Link>
                        <p>{repo.description}</p>
                        <small>{repo.visibility}</small>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Repos;