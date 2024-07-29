import { Routes, Route } from "react-router-dom";
import ProjectsList from "../pages/ProjectsList/ProjectList";
import AddProject from "../pages/AddProject/AddProject";
import Layout from "../pages/Layout";
import NotFound from "../pages/NotFound";
import Login from "../pages/Login/Login";
import SignUp, { User } from "../pages/SignUp/SignUp";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";

export default function MainNavigator() {
    const { user, setUser } = useContext(AuthContext);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const localUser = localStorage.getItem("user");

        if (localUser) {
            const userData: User | undefined = JSON.parse(localUser);
            setUser(userData);
        }

        setLoading(false);
    }, []);

    if (loading) return <div>Loading</div>;

    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                {user ? (
                    <>
                        <Route index element={<ProjectsList />} />
                        <Route path="projects/add" element={<AddProject />} />
                    </>
                ) : (
                    <>
                        <Route index element={<Login />} />
                        <Route path="login" element={<Login />} />
                        <Route path="sign-up" element={<SignUp />} />
                    </>
                )}
                <Route path="*" element={<NotFound />} />
            </Route>
        </Routes>
    );
}
