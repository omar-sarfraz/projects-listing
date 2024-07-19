const handleSubmit = async (e) => {
    e.preventDefault();

    let formData = new FormData(e.srcElement);

    try {
        let response = await fetch("https://sheetlabs.com/CRES/project_list", {
            headers: {
                "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify([Object.fromEntries(formData)]),
        });

        console.log(response);
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

const handleLoad = () => {
    const form = document.getElementById("add_form");
    form.onsubmit = handleSubmit;
};

window.onload = handleLoad;
