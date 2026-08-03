export default function renderProjects(projects) {
    const content = document.querySelector("#content");

    const newProjectBtn = document.createElement("button");
    newProjectBtn.textContent = "+ New Project";
    content.appendChild(newProjectBtn);

    newProjectBtn.addEventListener("click", () => {
        console.log("clicked");
    })
    
    projects.forEach(project => {
        const div = document.createElement("div");
        div.textContent = project.name;

        content.appendChild(div);
    });
}


