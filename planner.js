// Academic planner: array-based state, DOM updates, filters and localStorage persistence.
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("task-form");
  if (!form) return;
  const input = document.getElementById("task-input");
  const list = document.getElementById("task-list");
  const empty = document.getElementById("empty-state");
  const totalCount = document.getElementById("total-count");
  const completedCount = document.getElementById("completed-count");
  const headingCount = document.getElementById("task-heading-count");
  const progressFill = document.getElementById("progress-fill");
  const progressCaption = document.getElementById("progress-caption");
  const feedback = document.getElementById("planner-feedback");
  const clearCompleted = document.getElementById("clear-completed");
  let activeFilter = "all";
  let tasks = [];
  try { tasks = JSON.parse(localStorage.getItem("davidPortfolioTasks") || "[]"); if (!Array.isArray(tasks)) tasks = []; }
  catch { tasks = []; }

  const save = () => {
    try { localStorage.setItem("davidPortfolioTasks", JSON.stringify(tasks)); }
    catch { feedback.textContent = "Tasks work for this session, but browser storage is unavailable."; }
  };
  const render = () => {
    list.replaceChildren();
    const visibleTasks = tasks.filter(task => activeFilter === "all" || (activeFilter === "active" && !task.completed) || (activeFilter === "completed" && task.completed));
    visibleTasks.forEach(task => {
      const item = document.createElement("li");
      item.className = `task-item${task.completed ? " completed" : ""}`;
      const check = document.createElement("input");
      check.type = "checkbox"; check.className = "task-check"; check.checked = Boolean(task.completed);
      check.setAttribute("aria-label", `Mark ${task.text} as ${task.completed ? "not completed" : "completed"}`);
      check.addEventListener("change", () => {
        task.completed = check.checked; save(); render();
        feedback.textContent = task.completed ? "Nice work — task completed." : "Task moved back to your to-do list.";
      });
      const text = document.createElement("span"); text.className = "task-text"; text.textContent = task.text;
      const remove = document.createElement("button"); remove.type = "button"; remove.className = "task-delete"; remove.textContent = "×";
      remove.setAttribute("aria-label", `Delete ${task.text}`);
      remove.addEventListener("click", () => { tasks = tasks.filter(t => t.id !== task.id); save(); render(); feedback.textContent = "Task deleted."; });
      item.append(check, text, remove); list.append(item);
    });
    const completed = tasks.filter(task => task.completed).length;
    totalCount.textContent = tasks.length;
    completedCount.textContent = completed;
    headingCount.textContent = tasks.length;
    progressFill.style.width = `${tasks.length ? (completed / tasks.length) * 100 : 0}%`;
    progressCaption.textContent = tasks.length ? `${Math.round(completed / tasks.length * 100)}% complete — keep going.` : "Your progress will appear here.";
    empty.hidden = visibleTasks.length > 0;
    list.hidden = visibleTasks.length === 0;
  };
  form.addEventListener("submit", event => {
    event.preventDefault();
    const text = input.value.trim();
    if (!text) { feedback.textContent = "Please enter a task first."; input.focus(); return; }
    tasks.unshift({ id: `${Date.now()}-${Math.random().toString(16).slice(2)}`, text, completed: false });
    save(); render(); input.value = ""; input.focus(); feedback.textContent = "Task added to your planner.";
  });
  document.querySelectorAll(".filter-tab").forEach(button => button.addEventListener("click", () => {
    activeFilter = button.dataset.filter;
    document.querySelectorAll(".filter-tab").forEach(tab => tab.classList.toggle("active", tab === button));
    render();
  }));
  clearCompleted.addEventListener("click", () => {
    const before = tasks.length; tasks = tasks.filter(task => !task.completed); save(); render();
    feedback.textContent = before === tasks.length ? "There are no completed tasks to clear." : "Completed tasks cleared.";
  });
  render();
});
