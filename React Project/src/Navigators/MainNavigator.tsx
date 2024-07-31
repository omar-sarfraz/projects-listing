import { Routes, Route } from "react-router-dom";
import ProjectsList from "../pages/ProjectsList/ProjectList";
import AddProject from "../pages/AddProject/AddProject";
import Layout from "../pages/Layout";
import NotFound from "../pages/NotFound";
import Login from "../pages/Login/Login";
import SignUp from "../pages/SignUp/SignUp";
import { useAuth } from "../contexts/AuthContext";
import ProjectPage from "../pages/ProjectPage/ProjectPage";

export default function MainNavigator() {
    const { user, loading } = useAuth();

    if (loading) return <div>Loading</div>;

    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                {user ? (
                    <>
                        <Route index element={<ProjectsList />} />
                        <Route path="projects/add" element={<AddProject />} />
                        <Route path="projects/:id" element={<ProjectPage />} />
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
