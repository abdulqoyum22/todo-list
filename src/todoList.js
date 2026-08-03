class TodoList {
    constructor() {
        this.projects = [];
    }

    addProject(project) {
        this.projects.push(project);
    }

    removeProject(name) {
        this.projects = this.projects.filter((project) => project.name !== name);
    }
}

export default TodoList;
