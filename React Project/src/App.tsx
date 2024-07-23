import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProjectsList from "./pages/ProjectsList";
import AddProject from "./pages/AddProject";
import Layout from "./pages/Layout";
import NotFound from "./components/NotFound";
import Login from "./pages/Login";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<ProjectsList />} />
                    <Route path="projects/add" element={<AddProject />} />
                    <Route path="login" element={<Login />} />
                    <Route path="*" element={<NotFound />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
