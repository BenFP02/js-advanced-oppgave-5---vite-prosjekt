// Import setup and rendering functions from other files (coming soon)
import "./style.css";
import { setupForm } from "./taskForm.js";
import { renderTasks } from "./taskList.js";

// When the page loads, set up the form listener and show existing tasks
setupForm();
renderTasks();
