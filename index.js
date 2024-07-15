window.onload = async () => {
    let data = await fetch("https://sheetlabs.com/CRES/project_list");
    data = await data.json();

    let projectListDiv = document.getElementById("list");
    let projectList = "";

    data.forEach((project) => {
        projectList += `
            <li class="bg-gray-100 rounded-md p-4 sm:w-full md:w-2/3 lg:w-1/4">
                <h3>${project.ProjectId}: ${project.Name}</h3>
                <p class="my-4"><bold class="font-bold">Description:</bold> ${project.Description}</p>
                <div class="flex w-full justify-between">
                    <div>
                        <h3 class="font-bold">Budget</h3>
                        <p>${project.Budget}</p>
                    </div>
                    <div>
                        <h3 class="font-bold">Timeline</h3>
                        <p>${project.Timeline}</p>
                    </div>
                </div>
            </li>`;
    });

    projectListDiv.innerHTML = projectList;
};
