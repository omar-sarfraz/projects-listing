const displayProjects = async (searchTerm) => {
    let data = await fetch("https://sheetlabs.com/CRES/project_list");
    data = await data.json();

    if (searchTerm)
        data = data.filter((project) => {
            let name = project.Name.toLowerCase();
            let regex = new RegExp(searchTerm, "i");

            return name.match(regex) ? true : false;
        });

    let projectListDiv = document.getElementById("list");
    let projectList = "";

    data.forEach((project) => {
        projectList += `
        <li class="relative bg-gray-100 flex flex-col justify-between rounded-md p-4 sm:w-full lg:w-1/4 group">
            <div>
                <h3 class="text-2xl font-medium">${project.ProjectId}: ${project.Name}</h3>
                <p class="my-4"><bold class="font-bold">Description:</bold> ${project.Description}</p>
            </div>
            <div>
                <div class="flex w-full justify-between group-hover:opacity-0 transition duration-500">
                    <div>
                        <h3 class="font-bold">Budget</h3>
                        <p class="bg-cyan-500 rounded-full px-3 mt-1 text-white">${project.Budget}</p>
                    </div>
                    <div>
                        <h3 class="font-bold">Timeline</h3>
                        <p class="bg-emerald-500 rounded-full px-3 mt-1 text-white">${project.Timeline}</p>
                    </div>
                </div>
                <a class="absolute left-0 w-full cursor-pointer bg-gradient-to-r from-cyan-500 to-emerald-500 text-white rounded-md text-center py-2 mt-4 opacity-0 group-hover:-translate-y-full group-hover:opacity-100 transition duration-500 ease-in-out">
                    Apply Now
                </a>
            </div>
        </li>`;
    });

    projectListDiv.innerHTML = projectList;
};

const handleSearch = (e) => {
    e.preventDefault();

    let searchInput = document.getElementById("search_input");
    displayProjects(searchInput.value);
};

const handleLoad = () => {
    displayProjects();

    const form = document.getElementById("search_form");
    form.onsubmit = handleSearch;
};

window.onload = handleLoad;
