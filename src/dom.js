import Todo from "./todo.js";
import Project from "./project.js";
import TodoList  from "./todoList.js";
import {format} from "date-fns";
import { saveProjects } from "./storage.js";

export default function renderProjects(todoList) {
    const content = document.querySelector("#content");

    const newProjectBtn = document.createElement("button");
    newProjectBtn.textContent = "+ New Project";
    content.appendChild(newProjectBtn);

    newProjectBtn.addEventListener("click", () => {
        const name = prompt("Project name");
        if (!name) return;

        todoList.addProject(new Project(name));
        saveProjects(todoList);
        content.textContent = "";
        renderProjects(todoList);
    });
    
    todoList.projects.forEach(project => {
        const div = document.createElement("div");

        const deleteProjectBtn = document.createElement("button");
        deleteProjectBtn.textContent = "X";

        deleteProjectBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            todoList.removeProject(project.name);
            saveProjects(todoList);
            content.textContent = "";
            renderProjects(todoList);
        });

        div.append(project.name, deleteProjectBtn);

        div.addEventListener("click", () => {
            content.querySelectorAll(".todo-container").forEach(el => el.remove());

            const todoContainer = document.createElement("div");
            todoContainer.classList.add("todo-container");

            content.appendChild(todoContainer);
            
            const newTodoBtn = document.createElement("button");
            newTodoBtn.textContent = "+ New Todo";
            newTodoBtn.addEventListener("click", () => {
                const form = document.createElement("form");

                const titleInput = document.createElement("input");
                titleInput.placeholder = "Title";

                const descriptionInput = document.createElement("input");
                descriptionInput.placeholder = "Description";

                const dueDateInput = document.createElement("input");
                dueDateInput.type = "date";

                const priorityInput = document.createElement("select");
                ["High", "Medium", "Low"].forEach(priority => {
                    const option = document.createElement("option");
                    option.value = priority;
                    option.textContent = priority;

                    priorityInput.appendChild(option);
                });

                const submitBtn = document.createElement("button");
                submitBtn.textContent = "Create Todo";
                submitBtn.type = "submit";

                form.addEventListener("submit", e => {
                    e.preventDefault();

                    const todo = new Todo(
                        titleInput.value,
                        descriptionInput.value,
                        dueDateInput.value,
                        priorityInput.value
                    );
                    project.addTodo(todo);
                    saveProjects(todoList);
                    todoContainer.remove();
                    div.click();
                });

                form.append(titleInput, descriptionInput, dueDateInput, priorityInput, submitBtn);
                todoContainer.appendChild(form);
                
            });

            todoContainer.appendChild(newTodoBtn);

            project.todos.forEach(todo => {
                const todoDiv = document.createElement("div");

                const titleDiv = document.createElement("div");
                titleDiv.textContent = todo.title;

                const dueDateDiv = document.createElement("div");
                dueDateDiv.textContent = format(
                    new Date(todo.dueDate),
                    "MMM d, yyyy"
                )

                const deleteBtn = document.createElement("button");
                deleteBtn.textContent = "Delete";

                const detailsDiv = document.createElement("div");
                detailsDiv.classList.add("hidden");

                const descriptionDiv = document.createElement("div");
                descriptionDiv.textContent = todo.description;

                const priorityDiv = document.createElement("div");
                priorityDiv.textContent = `Priority: ${todo.priority}`;
                priorityDiv.classList.add(todo.priority.toLowerCase());

                detailsDiv.append(descriptionDiv, priorityDiv);

                todoDiv.addEventListener("click", () => {
                    detailsDiv.classList.toggle("hidden")
                })

                deleteBtn.addEventListener("click", () => {
                    project.todos = project.todos.filter(
                        currentTodo => currentTodo !== todo
                    );
                    saveProjects(todoList);
                    div.click();
                });

                const editBtn = document.createElement("button");
                editBtn.textContent = "Edit";

                editBtn.addEventListener("click", () => {
                    const newTitle = prompt("Title", todo.title);
                    const newDescription = prompt("Description", todo.description);
                    const newDueDate = prompt("Due Date", todo.dueDate);
                    const newPriority = prompt("Priority", todo.priority);

                    todo.update({
                        title: newTitle,
                        description: newDescription,
                        dueDate: newDueDate,
                        priority: newPriority
                    });
                    saveProjects(todoList);
                    todoContainer.remove();
                    div.click();
                });

                todoDiv.append(titleDiv, dueDateDiv, detailsDiv, editBtn, deleteBtn);
                todoContainer.appendChild(todoDiv);
            });           
        });

        content.appendChild(div);
    });
}


