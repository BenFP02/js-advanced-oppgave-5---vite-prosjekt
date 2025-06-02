import { v4 as uuidv4 } from "uuid";
import { renderTasks } from "./taskList.js";

export function setupForm() {
  const form = document.getElementById("task-form");
  const titleInput = document.getElementById("task-title");
  const dateInput = document.getElementById("task-date");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const title = titleInput.value.trim();
    const dueDate = dateInput.value;

    if (!title) return;

    const newTask = {
      id: uuidv4(),
      title,
      dueDate,
      createdAt: new Date().toISOString(),
      completed: false,
    };

    // Get current tasks from localStorage
    const tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
    tasks.push(newTask);
    localStorage.setItem("tasks", JSON.stringify(tasks));

    renderTasks(); // update task list
    form.reset(); // clear the form
  });
}
