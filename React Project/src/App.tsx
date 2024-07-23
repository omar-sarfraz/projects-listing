import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProjectsList from "./pages/ProjectsList/ProjectList";
import AddProject from "./pages/AddProject/AddProject";
import Layout from "./pages/Layout";
import NotFound from "./components/NotFound";
import Login from "./pages/Login/Login";
import SignUp from "./pages/SignUp/SignUp";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<ProjectsList />} />
                    <Route path="projects/add" element={<AddProject />} />
                    <Route path="login" element={<Login />} />
                    <Route path="sign-up" element={<SignUp />} />
                    <Route path="*" element={<NotFound />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
