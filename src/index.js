import Todo from "./todo.js";
import Project from "./project.js";  
import TodoList from "./todoList.js";
import renderProjects from "./dom.js";
import "./style.css"
import { loadProjects } from "./storage.js";


const todoList = new TodoList();
const savedProjects = loadProjects();

if (savedProjects.length > 0) {
    savedProjects.forEach(projectData => {
        const project = new Project(projectData.name);

        projectData.todos.forEach(todoData => {
            project.addTodo(
                new Todo(
                    todoData.title,
                    todoData.description,
                    todoData.dueDate,
                    todoData.priority
                )
            );
        });
        todoList.addProject(project);
    });
};

if (savedProjects.length === 0) {

const project1 = new Project("School")
const todo1 = new Todo(
    "Finish Odin",
    "Build Todo App",
    "2025-07-09",
    "Medium"
);

const todo1sub = new Todo(
    "Study JS",
    "Finish modules",
    "2026-06-24",
    "High"
)

const work = new Project("banana work");

const todo2 = new Todo(
    "Send Email",
    "Client follow up",
    "2023-05-30",
    "low"
)

const pray = new Project("Fajr Solat");

const todo3 = new Todo(
    "Observe Fajr Solat",
    "Two rakah of prayer",
    "2026-04-24",
    "High"
);

todoList.addProject(project1);
todoList.addProject(work);
todoList.addProject(pray);


project1.addTodo(todo1);
project1.addTodo(todo1sub);

work.addTodo(todo2);
pray.addTodo(todo3);
};

renderProjects(todoList);

console.log("Hello, this is ilovebanana");