import { createRoot } from "react-dom/client";

import ProjectsList from "./components/ProjectList";
// import AddProject from "./components/AddProject";

const root = createRoot(document.getElementById("list"));
root.render(<ProjectsList />);

// const addForm = createRoot(document.getElementById("add_form"));
// addForm.render(<AddProject />);
