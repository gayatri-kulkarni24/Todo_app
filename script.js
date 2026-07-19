const input = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const list = document.getElementById("taskList");
const emptyMsg = document.getElementById("emptyMsg");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let filter = "all";

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks() {
  list.innerHTML = "";

  let filtered = tasks.filter(task => {
    if (filter === "active") return !task.completed;
    if (filter === "completed") return task.completed;
    return true;
  });

  if (filtered.length === 0) {
    emptyMsg.style.display = "block";
  } else {
    emptyMsg.style.display = "none";
  }

  filtered.forEach(task => {
    const li = document.createElement("li");

    if (task.completed) {
      li.classList.add("completed");
    }

    li.innerHTML = `
      <span>${task.text}</span>
      <div class="actions">
    <button class="tick-btn" onclick="toggleTask(${task.id})">✔</button>
    <button class="delete-btn" onclick="deleteTask(${task.id})">✕</button>
  </div>
    `;

    list.appendChild(li);
  });
}

function addTask() {
  const text = input.value.trim();

  if (text === "") return;

  const newTask = {
    id: Date.now(),
    text,
    completed: false
  };

  tasks.push(newTask);

  input.value = "";

  saveTasks();
  renderTasks();
}

function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  saveTasks();
  renderTasks();
}

function toggleTask(id) {
  tasks = tasks.map(t => {
    if (t.id === id) {
      t.completed = !t.completed;
    }
    return t;
  });

  saveTasks();
  renderTasks();
}

addBtn.addEventListener("click", addTask);

input.addEventListener("keypress", e => {
  if (e.key === "Enter") addTask();
});

document.querySelectorAll(".filters button").forEach(btn => {
  btn.addEventListener("click", () => {
    filter = btn.dataset.filter;
    renderTasks();
  });
});

renderTasks();
