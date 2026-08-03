export function saveProjects(todoList) {
    localStorage.setItem(
        "projects",
        JSON.stringify(todoList.projects)
    );
}

export function loadProjects() {
    const data = localStorage.getItem("projects");
    if (!data) return [];
    return JSON.parse(data);
}