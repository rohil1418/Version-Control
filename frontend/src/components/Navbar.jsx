import { Link } from "react-router-dom";
import Logo from "./Logo.jsx";
import { useAuth } from "../context/AuthContext.jsx";

function Navbar() {
    const { logout } = useAuth();

    return (
        <nav className="border-b border-neutral-800/80 bg-neutral-950/80 backdrop-blur sticky top-0 z-10">
            <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
                <Link to="/repos">
                    <Logo size="text-lg" />
                </Link>
                <button
                    onClick={logout}
                    className="text-sm text-neutral-400 hover:text-white border border-neutral-800 hover:border-neutral-700 rounded-lg px-4 py-2 transition"
                >
                    Logout
                </button>
            </div>
        </nav>
    );
}

export default Navbar;