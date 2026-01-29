// State
let tasksContent = "";
let isEditing = false;

// DOM Elements
const loginScreen = document.getElementById("login-screen");
const mainScreen = document.getElementById("main-screen");
const loginForm = document.getElementById("login-form");
const loginError = document.getElementById("login-error");
const passwordInput = document.getElementById("password");

const quickAddForm = document.getElementById("quick-add-form");
const quickAddInput = document.getElementById("quick-add-input");

const taskView = document.getElementById("task-view");
const tasksContentEl = document.getElementById("tasks-content");
const editView = document.getElementById("edit-view");
const editTextarea = document.getElementById("edit-textarea");

const refreshBtn = document.getElementById("refresh-btn");
const editBtn = document.getElementById("edit-btn");
const logoutBtn = document.getElementById("logout-btn");
const saveBtn = document.getElementById("save-btn");
const cancelBtn = document.getElementById("cancel-btn");

const lastUpdatedEl = document.getElementById("last-updated");

// API helpers
async function api(path, options = {}) {
  const response = await fetch(`/api${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers
    },
    credentials: "same-origin"
  });

  if (response.status === 401) {
    showLogin();
    throw new Error("Unauthorized");
  }

  return response.json();
}

// Auth
async function login(password) {
  try {
    const result = await api("/login", {
      method: "POST",
      body: JSON.stringify({ password })
    });

    if (result.success) {
      showMain();
      await loadTasks();
    } else {
      loginError.textContent = result.error || "Login failed";
    }
  } catch (e) {
    loginError.textContent = "Login failed";
  }
}

async function logout() {
  await api("/logout", { method: "POST" });
  showLogin();
}

async function checkAuth() {
  try {
    await api("/tasks");
    showMain();
    await loadTasks();
  } catch {
    showLogin();
  }
}

function showLogin() {
  loginScreen.classList.remove("hidden");
  mainScreen.classList.add("hidden");
  passwordInput.value = "";
  loginError.textContent = "";
}

function showMain() {
  loginScreen.classList.add("hidden");
  mainScreen.classList.remove("hidden");
}

// Tasks
async function loadTasks() {
  try {
    tasksContentEl.classList.add("loading");
    const result = await api("/tasks");
    tasksContent = result.content;
    renderTasks();
    updateLastUpdated(result.updatedAt);
  } catch (e) {
    console.error("Failed to load tasks:", e);
  } finally {
    tasksContentEl.classList.remove("loading");
  }
}

async function saveTasks(content) {
  try {
    const result = await api("/tasks", {
      method: "PUT",
      body: JSON.stringify({ content })
    });
    tasksContent = content;
    updateLastUpdated(result.updatedAt);
    return true;
  } catch (e) {
    console.error("Failed to save tasks:", e);
    return false;
  }
}

async function quickAdd(task) {
  if (!task.trim()) return;

  try {
    quickAddInput.disabled = true;
    const result = await api("/tasks/add", {
      method: "POST",
      body: JSON.stringify({ task: task.trim() })
    });

    if (result.success) {
      quickAddInput.value = "";
      await loadTasks();
    }
  } catch (e) {
    console.error("Failed to add task:", e);
  } finally {
    quickAddInput.disabled = false;
    quickAddInput.focus();
  }
}

async function toggleTask(lineIndex) {
  try {
    await api("/tasks/toggle", {
      method: "POST",
      body: JSON.stringify({ lineIndex })
    });
    await loadTasks();
  } catch (e) {
    console.error("Failed to toggle task:", e);
  }
}

// Rendering
function renderTasks() {
  const lines = tasksContent.split("\n");
  let html = "";
  let inList = false;

  lines.forEach((line, index) => {
    // Heading
    if (line.startsWith("# ")) {
      if (inList) { html += "</ul>"; inList = false; }
      html += `<h1>${escapeHtml(line.slice(2))}</h1>`;
    } else if (line.startsWith("## ")) {
      if (inList) { html += "</ul>"; inList = false; }
      html += `<h2>${escapeHtml(line.slice(3))}</h2>`;
    }
    // Checkbox item
    else if (line.match(/^- \[([ x])\] /)) {
      if (!inList) { html += "<ul>"; inList = true; }

      const checked = line.includes("- [x]");
      const text = line.replace(/^- \[[ x]\] /, "");

      html += `
        <li>
          <input type="checkbox"
                 class="task-checkbox"
                 data-line="${index}"
                 ${checked ? "checked" : ""}>
          <span class="task-text ${checked ? "completed" : ""}">${escapeHtml(text)}</span>
        </li>
      `;
    }
    // Regular list item
    else if (line.startsWith("- ")) {
      if (!inList) { html += "<ul>"; inList = true; }
      html += `<li><span class="task-text">${escapeHtml(line.slice(2))}</span></li>`;
    }
    // Close list on empty line
    else if (line.trim() === "" && inList) {
      html += "</ul>";
      inList = false;
    }
  });

  if (inList) html += "</ul>";

  tasksContentEl.innerHTML = html;

  // Add checkbox handlers
  tasksContentEl.querySelectorAll(".task-checkbox").forEach(checkbox => {
    checkbox.addEventListener("change", (e) => {
      const lineIndex = parseInt(e.target.dataset.line, 10);
      toggleTask(lineIndex);
    });
  });
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

function updateLastUpdated(timestamp) {
  if (timestamp) {
    const date = new Date(timestamp);
    lastUpdatedEl.textContent = `Last updated: ${date.toLocaleString()}`;
  } else {
    lastUpdatedEl.textContent = "";
  }
}

// Edit mode
function enterEditMode() {
  isEditing = true;
  editTextarea.value = tasksContent;
  taskView.classList.add("hidden");
  editView.classList.remove("hidden");
  editBtn.classList.add("hidden");
  editTextarea.focus();
}

function exitEditMode() {
  isEditing = false;
  taskView.classList.remove("hidden");
  editView.classList.add("hidden");
  editBtn.classList.remove("hidden");
}

async function saveEdit() {
  const content = editTextarea.value;
  saveBtn.disabled = true;
  saveBtn.textContent = "Saving...";

  const success = await saveTasks(content);

  saveBtn.disabled = false;
  saveBtn.textContent = "Save";

  if (success) {
    renderTasks();
    exitEditMode();
  } else {
    alert("Failed to save. Please try again.");
  }
}

// Event Listeners
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  login(passwordInput.value);
});

quickAddForm.addEventListener("submit", (e) => {
  e.preventDefault();
  quickAdd(quickAddInput.value);
});

refreshBtn.addEventListener("click", loadTasks);
editBtn.addEventListener("click", enterEditMode);
logoutBtn.addEventListener("click", logout);
saveBtn.addEventListener("click", saveEdit);
cancelBtn.addEventListener("click", exitEditMode);

// Keyboard shortcuts
document.addEventListener("keydown", (e) => {
  // Escape to cancel edit
  if (e.key === "Escape" && isEditing) {
    exitEditMode();
  }

  // Cmd/Ctrl + S to save in edit mode
  if ((e.metaKey || e.ctrlKey) && e.key === "s" && isEditing) {
    e.preventDefault();
    saveEdit();
  }

  // Cmd/Ctrl + E to toggle edit mode
  if ((e.metaKey || e.ctrlKey) && e.key === "e" && !isEditing) {
    e.preventDefault();
    enterEditMode();
  }
});

// Init
checkAuth();
