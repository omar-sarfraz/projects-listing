import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function Navbar() {
    const { user, setUser } = useAuth();

    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("user");
        setUser(undefined);
        navigate("/", { replace: true });
    };

    return (
        <div className="flex justify-between items-center px-10 py-6">
            <h2 className="text-3xl font-medium">
                <Link className="hover:border-b-4 pb-1 border-cyan-500 transition-all" to="/">
                    Project Listings
                </Link>
            </h2>
            <ul className="flex gap-4 text-xl font-medium">
                <li>
                    <Link
                        className="hover:border-b-4 pb-1 border-emerald-500 transition-all"
                        to="/"
                    >
                        Home
                    </Link>
                </li>
                <li>
                    <Link
                        className="hover:border-b-4 pb-1 border-emerald-500 transition-all"
                        to="/"
                    >
                        Projects
                    </Link>
                </li>
            </ul>
            <ul className="flex gap-4 text-xl font-medium">
                {user ? (
                    <button
                        className="border-2 border-red-500 transition-all px-6 py-1 rounded-md text-red-500 hover:bg-red-500 hover:text-white"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                ) : (
                    <>
                        <li>
                            <Link
                                className="hover:border-b-4 pb-1 border-emerald-500 transition-all"
                                to="/login"
                            >
                                Login
                            </Link>
                        </li>
                        <li>
                            <Link
                                className="hover:border-b-4 pb-1 border-emerald-500 transition-all"
                                to="/sign-up"
                            >
                                Sign Up
                            </Link>
                        </li>
                    </>
                )}
            </ul>
        </div>
    );
}

export default Navbar;
