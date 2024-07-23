import { Link } from "react-router-dom";

function Navbar() {
    return (
        <div className="flex justify-between items-center px-10 py-6">
            <h2 className="text-3xl font-medium">
                <Link
                    className="hover:border-b-4 pb-1 border-cyan-500 transition-all rounded-b-sm"
                    to="/"
                >
                    Project Listings
                </Link>
            </h2>
            <ul className="flex gap-4 text-xl font-medium">
                <li>
                    <Link
                        className="hover:border-b-4 pb-1 border-emerald-500 transition-all rounded-b-sm"
                        to="/"
                    >
                        Home
                    </Link>
                </li>
                <li>
                    <Link
                        className="hover:border-b-4 pb-1 border-emerald-500 transition-all rounded-b-sm"
                        to="/"
                    >
                        Projects
                    </Link>
                </li>
            </ul>
            <ul className="flex gap-4 text-xl font-medium">
                <li>
                    <Link
                        className="hover:border-b-4 pb-1 border-emerald-500 transition-all rounded-b-sm"
                        to="/login"
                    >
                        Login
                    </Link>
                </li>
                <li>
                    <Link
                        className="hover:border-b-4 pb-1 border-emerald-500 transition-all rounded-b-sm"
                        to="/sign-up"
                    >
                        Sign Up
                    </Link>
                </li>
            </ul>
        </div>
    );
}

export default Navbar;
