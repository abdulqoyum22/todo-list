import Todo from "./todo.js";
import Project from "./project.js";  
import TodoList from "./todoList.js";
import renderProjects from "./dom.js";



const project1 = new Project("School")


const todo1 = new Todo(
    "Finish Odin",
    "Build Todo App",
    "Tomorrow",
    "High"
);

const todo1sub = new Todo(
    "Study JS",
    "Finish modules",
    "Tonight",
    "High"
)

const work = new Project("banana work");

const todo2 = new Todo(
    "Send Email",
    "Client follow up",
    "Today",
    "Medium"
)

const pray = new Project("Fajr Solat");

const todo3 = new Todo(
    "Observe Fajr Solat",
    "Two rakah of prayer",
    "Before 6:30AM daily",
    "Very High"
)

const todoList = new TodoList();

todoList.addProject(project1);
todoList.addProject(work);
todoList.addProject(pray);


project1.addTodo(todo1);
project1.addTodo(todo1sub);
project1.removeTodo("Finish Odin")
work.addTodo(todo2);
pray.addTodo(todo3);


console.log(project1, work, pray);
console.log(todoList.projects)

renderProjects(todoList.projects)


console.log("Hello, this is ilovebanana")