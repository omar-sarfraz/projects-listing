const e = React.createElement;

function ProjectsList() {
    const [projects, setProjects] = React.useState();

    React.useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        const response = await fetch("https://sheetlabs.com/CRES/project_list");
        const projects = await response.json();
        setProjects(projects);
    };

    return e(
        "ul",
        { id: "list", className: "flex flex-wrap justify-start gap-2" },
        projects?.length &&
            projects.map((project, index) =>
                e(
                    "li",
                    {
                        className:
                            "relative bg-gray-100 flex flex-col grow justify-between rounded-md p-4 sm:w-full lg:w-1/4 group",
                        key: index,
                    },
                    e(
                        "div",
                        null,
                        e(
                            "h3",
                            { className: "text-2xl font-medium" },
                            `${project.ProjectId}: ${project.Name}`
                        ),
                        e("div", { className: "my-4" }, project.Description)
                    ),
                    e(
                        "div",
                        null,
                        e(
                            "div",
                            {
                                className:
                                    "flex w-full justify-between group-hover:opacity-0 transition duration-500",
                            },
                            e(
                                "div",
                                null,
                                e("h3", { className: "font-bold" }, "Budget"),
                                e(
                                    "div",
                                    { className: "bg-cyan-500 rounded-full px-3 mt-1 text-white" },
                                    project.Budget
                                )
                            ),
                            e(
                                "div",
                                null,
                                e("h3", { className: "font-bold" }, "Timeline"),
                                e(
                                    "div",
                                    {
                                        className:
                                            "bg-emerald-500 rounded-full px-3 mt-1 text-white",
                                    },
                                    project.Timeline
                                )
                            )
                        ),
                        e(
                            "a",
                            {
                                className:
                                    "absolute left-0 w-full cursor-pointer bg-gradient-to-r from-cyan-500 to-emerald-500 text-white rounded-md text-center py-2 mt-4 opacity-0 group-hover:-translate-y-full group-hover:opacity-100 transition duration-500 ease-in-out",
                            },
                            "Apply Now"
                        )
                    )
                )
            )
    );
}

window.addEventListener("DOMContentLoaded", function () {
    const domContainer = document.querySelector("#list");
    const root = ReactDOM.createRoot(domContainer);
    root.render(e(ProjectsList));
});
