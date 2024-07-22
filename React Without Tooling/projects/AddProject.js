const e = React.createElement;

function AddProject() {
    const [id, setId] = React.useState();
    const [name, setName] = React.useState();
    const [budget, setBudget] = React.useState();
    const [timeline, setTimeline] = React.useState();
    const [description, setDescription] = React.useState();

    const handleProjectSubmit = async (e) => {
        e.preventDefault();

        if (!id || !name || !budget || !timeline || !description) {
            alert("All fields are required: true!");
            return;
        }

        const bodyData = {
            ProjectId: id,
            Name: name,
            Budget: budget,
            Timeline: timeline,
            Description: description,
        };

        try {
            let response = await fetch("https://sheetlabs.com/CRES/project_list", {
                headers: {
                    "Content-Type": "application/json",
                },
                method: "POST",
                body: JSON.stringify([bodyData]),
            });

            if (response.status === 204) {
                alert("Project Submitted Successfully!");
                window.location.href = "/";
            } else {
                alert("An error has occured. Please try again.");
            }
        } catch (e) {
            console.log(e);
            alert(`An error has occured! ${e.message}`);
        }
    };

    return e(
        "form",
        { className: "flex flex-col gap-4 items-end bg-gray-100 px-6 py-10 rounded-md" },
        e(
            "div",
            { className: "flex flex-col w-full items-center md:flex-row" },
            e(
                "label",
                { className: "w-full md:w-1/3 text-xl", htmlFor: "project_id" },
                "Project Id"
            ),
            e("input", {
                className: "w-full md:w-2/3 border border-gray-300 rounded-md p-2 outline-none",
                name: "ProjectId",
                id: "project_id",
                type: "number",
                placeholder: "e.g., 1",
                required: true,
                onChange: (e) => setId(parseInt(e.target.value)),
            })
        ),
        e(
            "div",
            { className: "flex flex-col w-full items-center md:flex-row" },
            e(
                "label",
                { className: "w-full md:w-1/3 text-xl", htmlFor: "project_name" },
                "Project Name"
            ),
            e("input", {
                className: "w-full md:w-2/3 border border-gray-300 rounded-md p-2 outline-none",
                name: "Name",
                id: "project_name",
                type: "text",
                placeholder: "e.g., Ecommerce Website",
                required: true,
                onChange: (e) => setName(e.target.value),
            })
        ),
        e(
            "div",
            { className: "flex flex-col w-full items-center md:flex-row" },
            e(
                "label",
                { className: "w-full md:w-1/3 text-xl", htmlFor: "project_budget" },
                "Project Budget"
            ),
            e("input", {
                className: "w-full md:w-2/3 border border-gray-300 rounded-md p-2 outline-none",
                name: "Budget",
                id: "project_budget",
                type: "text",
                placeholder: "e.g., 200 USD",
                required: true,
                onChange: (e) => setBudget(e.target.value),
            })
        ),
        e(
            "div",
            { className: "flex flex-col w-full items-center md:flex-row" },
            e(
                "label",
                { className: "w-full md:w-1/3 text-xl", htmlFor: "project_timeline" },
                "Project Timeline"
            ),
            e("input", {
                className: "w-full md:w-2/3 border border-gray-300 rounded-md p-2 outline-none",
                name: "Timeline",
                id: "project_timeline",
                type: "text",
                placeholder: "e.g., 2 Months",
                required: true,
                onChange: (e) => setTimeline(e.target.value),
            })
        ),
        e(
            "div",
            { className: "flex flex-col w-full items-center md:flex-row" },
            e(
                "label",
                { className: "w-full md:w-1/3 text-xl", htmlFor: "project_description" },
                "Project Description"
            ),
            e("textarea", {
                className: "w-full md:w-2/3 border border-gray-300 rounded-md p-2 outline-none",
                name: "Description",
                id: "project_description",
                placeholder: "e.g., I want you to create an Clothing Ecommerce Store using React",
                required: true,
                onChange: (e) => setDescription(e.target.value),
            })
        ),
        e(
            "button",
            {
                type: "submit",
                className:
                    "bg-green-600 font-semibold text-white text-md px-4 py-2 rounded-md w-full md:w-1/3 mt-4 outline-none",
                onClick: handleProjectSubmit,
            },
            "Submit"
        )
    );
}

window.addEventListener("DOMContentLoaded", function () {
    const domContainer = document.querySelector("#add_form");
    const root = ReactDOM.createRoot(domContainer);
    root.render(e(AddProject));
});
