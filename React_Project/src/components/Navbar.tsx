import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function Navbar() {
    const [isNavOpen, setIsNavOpen] = useState(false);
    const { user, setUser } = useAuth();

    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("user");
        setUser(undefined);
        navigate("/", { replace: true });
    };

    return (
        <nav>
            <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
                <div className="relative flex h-16 items-center justify-between">
                    <div className="flex items-center sm:hidden">
                        <button
                            type="button"
                            className="inline-flex items-center justify-center rounded-md p-2 text-black"
                            onClick={() => setIsNavOpen((prev) => !prev)}
                        >
                            <svg
                                className="block h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke-width="1.5"
                                stroke="currentColor"
                                aria-hidden="true"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                                />
                            </svg>

                            <svg
                                className="hidden h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke-width="1.5"
                                stroke="currentColor"
                                aria-hidden="true"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>
                    <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                        <div className="flex flex-shrink-0 items-center">
                            <h2 className="text-2xl sm:text-3xl font-medium">
                                <Link
                                    className="hover:border-b-4 pb-1 border-cyan-500 transition-all"
                                    to="/"
                                >
                                    Project Listings
                                </Link>
                            </h2>
                        </div>

                        <ul className="hidden sm:ml-6 sm:flex gap-4 text-xl font-medium justify-center items-center w-full">
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
                    </div>
                    <ul className="hidden sm:ml-6 sm:flex gap-4 text-xl font-medium">
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
            </div>

            {isNavOpen ? (
                <div className="sm:hidden bg-gray-100 mx-2 p-4 rounded-lg" id="mobile-menu">
                    <ul className="flex flex-col gap-1 text-xl font-medium items-center">
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
                    <ul className="flex flex-col gap-1 text-xl font-medium mt-4 items-center">
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
            ) : (
                <></>
            )}
        </nav>
    );
}

export default Navbar;
