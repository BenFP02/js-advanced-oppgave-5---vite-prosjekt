import { formatDistanceToNow } from "date-fns";

export function renderTasks() {
  const taskList = document.getElementById("task-list");
  taskList.innerHTML = ""; // Clear the current list before re-rendering

  let tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
  const showCompleted =
    document.getElementById("show-completed")?.checked ?? true;

  // Sort tasks: due date (soonest first), then undated tasks
  tasks.sort((a, b) => {
    if (a.dueDate && b.dueDate) {
      return new Date(a.dueDate) - new Date(b.dueDate); // earlier first
    } else if (a.dueDate) {
      return -1; // a has date, b doesn't → a comes first
    } else if (b.dueDate) {
      return 1; // b has date, a doesn't → b comes first
    } else {
      return new Date(a.createdAt) - new Date(b.createdAt); // both have no dueDate, fallback to creation
    }
  });

  const summary = document.getElementById("task-summary");

  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const remaining = total - completed;

  summary.textContent = `${remaining} task${
    remaining !== 1 ? "s" : ""
  } remaining, ${completed} completed.`;

  tasks.forEach((task) => {
    if (task.completed && !showCompleted) {
      return; // Skip rendering this task
    }
    const li = document.createElement("li");
    if (task.completed) {
      li.classList.add("completed");
    } else if (task.dueDate && new Date(task.dueDate) < new Date()) {
      li.classList.add("overdue");
    } else {
      li.classList.add("active");
    }

    // Create checkbox
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.addEventListener("change", () => {
      task.completed = checkbox.checked;
      localStorage.setItem("tasks", JSON.stringify(tasks));
      renderTasks(); // re-render to reflect style
    });

    let dueText = "";
    if (task.dueDate) {
      const due = new Date(task.dueDate);
      dueText = ` (due ${formatDistanceToNow(due, { addSuffix: true })})`;
    } else {
      dueText = " (due whenever)";
    }

    let createdText = "";
    if (task.createdAt) {
      const created = new Date(task.createdAt);
      createdText = ` • added ${formatDistanceToNow(created, {
        addSuffix: true,
      })}`;
    }

    // Add title + due date
    const textSpan = document.createElement("span");
    textSpan.textContent = `${task.title}${dueText}${createdText}`;
    if (task.completed) {
      textSpan.style.textDecoration = "line-through";
      textSpan.style.opacity = "0.6";
    }

    // Delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "🗑️";
    deleteBtn.style.marginLeft = "1rem";
    deleteBtn.addEventListener("click", () => {
      const newTasks = tasks.filter((t) => t.id !== task.id);
      localStorage.setItem("tasks", JSON.stringify(newTasks));
      renderTasks();
    });

    // Build and append
    li.appendChild(checkbox);
    li.appendChild(textSpan);
    li.appendChild(deleteBtn);
    taskList.appendChild(li);
  });

  const checkbox = document.getElementById("show-completed");
  if (checkbox) {
    checkbox.addEventListener("change", renderTasks);
  }
}
