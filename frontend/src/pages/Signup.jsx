import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axios.js";
import Logo from "../components/Logo.jsx";

function Signup() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            await API.post("/auth/signup", { username, email, password });
            setSuccess(true);
            setTimeout(() => navigate("/login"), 1500);
        } catch (err) {
            setError(err.response?.data?.message || "Signup failed");
        }
    };

    return (
        <div className="min-h-screen relative flex items-center justify-center bg-neutral-950 px-4 overflow-hidden">
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-violet-600/20 rounded-full blur-3xl pointer-events-none" />

            <div className="relative w-full max-w-sm">
                <div className="flex justify-center mb-8">
                    <Logo />
                </div>

                <div className="bg-neutral-900/80 backdrop-blur border border-neutral-800 rounded-2xl p-8 shadow-2xl">
                    <h2 className="text-2xl font-semibold text-white mb-1">Create account</h2>
                    <p className="text-neutral-400 text-sm mb-6">Start tracking your repositories</p>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="text-xs font-medium text-neutral-400 mb-1.5 block">Username</label>
                            <input
                                type="text"
                                placeholder="yourname"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                className="w-full bg-neutral-800/80 text-white placeholder-neutral-500 rounded-lg px-4 py-2.5 outline-none border border-neutral-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-medium text-neutral-400 mb-1.5 block">Email</label>
                            <input
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full bg-neutral-800/80 text-white placeholder-neutral-500 rounded-lg px-4 py-2.5 outline-none border border-neutral-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition"
                            />
                        </div>
                        <div>
                            <label className="text-xs font-medium text-neutral-400 mb-1.5 block">Password</label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full bg-neutral-800/80 text-white placeholder-neutral-500 rounded-lg px-4 py-2.5 outline-none border border-neutral-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition"
                            />
                        </div>
                        {error && (
                            <p className="text-red-400 text-sm bg-red-500/10 border border-red-900/50 rounded-lg px-3 py-2">
                                {error}
                            </p>
                        )}
                        {success && (
                            <p className="text-green-400 text-sm bg-green-500/10 border border-green-900/50 rounded-lg px-3 py-2">
                                Account created! Redirecting...
                            </p>
                        )}
                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-medium rounded-lg py-2.5 shadow-lg shadow-indigo-500/20 transition"
                        >
                            Sign up
                        </button>
                    </form>
                </div>

                <p className="text-neutral-500 text-sm mt-6 text-center">
                    Already have an account?{" "}
                    <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-medium">
                        Log in
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default Signup;