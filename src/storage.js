export function saveProjects(todoList) {
    localStorage.setItem(
        "projects",
        JSON.stringify(todoList.projects)
    );
}

export function loadProjects() {
    try {
        const data = localStorage.getItem("projects");
        const projects = data ? JSON.parse(data) : [];

        if (!Array.isArray(projects)) return [];

        return projects.filter((project) => {
            return project && typeof project.name === "string";
        });
    } catch {
        return [];
    }
}
