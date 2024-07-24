import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProjectsList from "./pages/ProjectsList";
import AddProject from "./pages/AddProject";
import Layout from "./pages/Layout";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<ProjectsList />} />
                    <Route path="projects/add" element={<AddProject />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
