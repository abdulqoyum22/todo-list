import Todo from "./todo.js";
import Project from "./project.js";
import { format, isValid, parseISO } from "date-fns";
import { saveProjects } from "./storage.js";

const make = (tag, className, text) => {
    const element = document.createElement(tag);

    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;

    return element;
};

const dateLabel = (date) => {
    if (!date) return "No due date";

    const parsed = parseISO(date);

    return isValid(parsed) ? format(parsed, "MMM d, yyyy") : "No due date";
};

const normalizeChecklist = (todo) => {
    if (!Array.isArray(todo.checklist)) {
        todo.checklist = [];
        return;
    }

    todo.checklist = todo.checklist
        .map((item) => {
            if (typeof item === "string") {
                return { text: item, completed: false };
            }

            return item;
        })
        .filter((item) => item && item.text);
};

function formField(label, input) {
    const wrapper = make("label", "field");
    const fieldLabel = make("span", "field-label", label);

    wrapper.append(fieldLabel, input);

    return wrapper;
}

function todoForm(todo, onSubmit, onCancel) {
    const form = make("form", "todo-form");
    const title = document.createElement("input");
    const description = document.createElement("textarea");
    const notes = document.createElement("textarea");
    const dueDate = document.createElement("input");
    const priority = document.createElement("select");
    const actions = make("div", "form-actions");
    const cancel = make("button", "button button-quiet", "Cancel");
    const submitText = todo ? "Save changes" : "Add task";
    const submit = make("button", "button button-primary", submitText);

    title.required = true;
    title.placeholder = "e.g. Plan weekly review";
    title.value = todo?.title || "";

    description.placeholder = "What needs to be done?";
    description.value = todo?.description || "";

    notes.placeholder = "Optional notes, links, or context";
    notes.value = todo?.notes || "";

    dueDate.type = "date";
    dueDate.value = todo?.dueDate || "";

    ["High", "Medium", "Low"].forEach((value) => {
        const isSelected = (todo?.priority || "Medium").toLowerCase() === value.toLowerCase();
        const option = new Option(value, value, false, isSelected);

        priority.add(option);
    });

    cancel.type = "button";
    submit.type = "submit";

    cancel.addEventListener("click", onCancel);

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        onSubmit({
            title: title.value.trim(),
            description: description.value.trim(),
            notes: notes.value.trim(),
            dueDate: dueDate.value,
            priority: priority.value,
        });
    });

    actions.append(cancel, submit);
    form.append(
        formField("Task title", title),
        formField("Description", description),
        formField("Notes", notes),
        formField("Due date", dueDate),
        formField("Priority", priority),
        actions,
    );

    return form;
}

export default function renderProjects(todoList) {
    const content = document.querySelector("#content");
    let selectedProject = todoList.projects[0] || null;

    const render = () => {
        if (!todoList.projects.includes(selectedProject)) {
            selectedProject = todoList.projects[0] || null;
        }

        content.replaceChildren();

        const app = make("main", "app-shell");
        const sidebar = make("aside", "sidebar");
        const newProject = make(
            "button",
            "button button-primary new-project",
            "+ New project",
        );
        const projectList = make("nav", "project-list");
        const workspace = make("section", "workspace");

        newProject.addEventListener("click", () => {
            const name = prompt("Name your project");

            if (!name?.trim()) return;

            const project = new Project(name.trim());

            todoList.addProject(project);
            selectedProject = project;
            saveProjects(todoList);
            render();
        });

        todoList.projects.forEach((project) => {
            const activeClass = project === selectedProject ? " active" : "";
            const item = make("button", `project-item${activeClass}`);
            const count = project.todos.filter((todo) => !todo.completed).length;
            const name = make("span", "project-name", project.name);
            const taskCount = make("span", "project-count", count);

            item.append(name, taskCount);

            item.addEventListener("click", () => {
                selectedProject = project;
                render();
            });

            projectList.appendChild(item);
        });

        sidebar.append(
            newProject,
            make("p", "sidebar-label", "PROJECTS"),
            projectList,
        );

        if (!selectedProject) {
            const empty = make("div", "empty-state");
            const icon = make("div", "empty-icon", "✦");
            const title = make("h2", null, "Start with a project");
            const description = make(
                "p",
                null,
                "Projects keep related tasks together and your list calm.",
            );

            empty.append(icon, title, description);
            workspace.appendChild(empty);
        } else {
            renderProjectWorkspace(selectedProject, todoList, workspace, render);
        }

        app.append(sidebar, workspace);
        content.appendChild(app);
    };

    render();
}

function renderProjectWorkspace(project, todoList, workspace, render) {
    const header = make("header", "project-header");
    const heading = make("div");
    const projectActions = make("div", "project-actions");
    const deleteProject = make("button", "icon-button", "×");
    const summary = make("div", "summary");
    const addArea = make("div", "add-area");
    const addTodo = make("button", "button button-primary", "+ Add task");
    const tasks = make("div", "task-list");
    const incompleteTodos = project.todos.filter((todo) => !todo.completed);
    const completedTodos = project.todos.filter((todo) => todo.completed);
    const progress = project.todos.length
        ? Math.round((completedTodos.length / project.todos.length) * 100)
        : 0;
    const tasksLeft = make("span");
    const taskCount = make("strong", null, incompleteTodos.length);
    const completion = make("span", null, `${progress}% complete`);
    const progressBar = make("div", "progress");
    const progressValue = make("i");

    heading.append(
        make("p", "eyebrow", "CURRENT PROJECT"),
        make("h2", "project-title", project.name),
    );

    deleteProject.title = "Delete project";
    deleteProject.addEventListener("click", () => {
        if (!confirm(`Delete “${project.name}” and its tasks?`)) return;

        todoList.removeProject(project.name);
        saveProjects(todoList);
        render();
    });

    projectActions.appendChild(deleteProject);
    header.append(heading, projectActions);

    tasksLeft.append(taskCount, document.createTextNode(" tasks left"));
    progressValue.style.width = `${progress}%`;
    progressBar.appendChild(progressValue);
    summary.append(tasksLeft, completion, progressBar);

    addTodo.addEventListener("click", () => {
        const form = todoForm(
            null,
            (data) => {
                const todo = new Todo(
                    data.title,
                    data.description,
                    data.dueDate,
                    data.priority,
                    data.notes,
                    [],
                );

                project.addTodo(todo);
                saveProjects(todoList);
                render();
            },
            render,
        );

        addArea.replaceChildren(form);
        addArea.querySelector("input")?.focus();
    });

    addArea.appendChild(addTodo);

    if (!project.todos.length) {
        const emptyTasks = make(
            "div",
            "tasks-empty",
            "No tasks yet. Add one small next step.",
        );

        tasks.appendChild(emptyTasks);
    }

    project.todos.forEach((todo) => {
        tasks.appendChild(renderTodo(todo, project, todoList, render));
    });

    workspace.append(header, summary, addArea, tasks);
}

function renderTodo(todo, project, todoList, render) {
    normalizeChecklist(todo);

    const completedClass = todo.completed ? " completed" : "";
    const priorityName = (todo.priority || "medium").toLowerCase();
    const card = make("article", `task-card${completedClass}`);
    const top = make("div", "task-top");
    const check = document.createElement("input");
    const taskMain = make("button", "task-main");
    const priority = make(
        "span",
        `priority priority-${priorityName}`,
        todo.priority || "Medium",
    );
    const edit = make("button", "icon-button edit", "Edit");
    const remove = make("button", "icon-button danger", "×");
    const details = make("div", "task-details");

    check.type = "checkbox";
    check.checked = Boolean(todo.completed);
    check.ariaLabel = `Mark ${todo.title} complete`;

    check.addEventListener("change", () => {
        todo.completed = check.checked;
        saveProjects(todoList);
        render();
    });

    taskMain.type = "button";
    taskMain.append(
        make("strong", "task-title", todo.title),
        make("span", "task-date", dateLabel(todo.dueDate)),
    );

    taskMain.addEventListener("click", () => {
        card.classList.toggle("expanded");
    });

    edit.addEventListener("click", () => {
        const form = todoForm(
            todo,
            (data) => {
                todo.update(data);
                saveProjects(todoList);
                render();
            },
            render,
        );

        card.replaceChildren(form);
    });

    remove.title = "Delete task";
    remove.addEventListener("click", () => {
        project.todos = project.todos.filter((item) => item !== todo);
        saveProjects(todoList);
        render();
    });

    top.append(check, taskMain, priority, edit, remove);

    if (todo.description) {
        details.appendChild(make("p", "description", todo.description));
    }

    if (todo.notes) {
        const notes = make("p", "notes", todo.notes);

        notes.prepend(make("strong", null, "Notes: "));
        details.appendChild(notes);
    }

    details.appendChild(renderChecklist(todo, todoList, render));
    card.append(top, details);

    return card;
}

function renderChecklist(todo, todoList, render) {
    const checklist = make("div", "checklist");
    const addCheck = make("button", "add-check", "+ Add checklist item");

    todo.checklist.forEach((item) => {
        const row = make("label", "checklist-item");
        const itemCheck = document.createElement("input");
        const text = make("span", null, item.text);
        const deleteItem = make("button", "remove-check", "×");

        itemCheck.type = "checkbox";
        itemCheck.checked = item.completed;
        itemCheck.addEventListener("change", () => {
            item.completed = itemCheck.checked;
            saveProjects(todoList);
        });

        deleteItem.type = "button";
        deleteItem.addEventListener("click", () => {
            todo.checklist = todo.checklist.filter((current) => current !== item);
            saveProjects(todoList);
            render();
        });

        row.append(itemCheck, text, deleteItem);
        checklist.appendChild(row);
    });

    addCheck.addEventListener("click", () => {
        const text = prompt("Checklist item");

        if (!text?.trim()) return;

        todo.checklist.push({
            text: text.trim(),
            completed: false,
        });
        saveProjects(todoList);
        render();
    });

    checklist.appendChild(addCheck);

    return checklist;
}
