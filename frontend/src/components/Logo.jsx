function Logo({ size = "text-xl" }) {
    return (
        <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="6" cy="6" r="3"></circle>
                    <path d="M6 9v6a3 3 0 0 0 3 3h6"></path>
                    <circle cx="18" cy="18" r="3"></circle>
                </svg>
            </div>
            <span className={`${size} font-bold text-white tracking-tight`}>Apna Git</span>
        </div>
    );
}

export default Logo;