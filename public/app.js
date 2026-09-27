/**
 * Student Management REST API - Client Playground Logic
 */

document.addEventListener("DOMContentLoaded", () => {
  initTabs();
  loadStudents();
  initFormHandlers();
  initFilterHandlers();
  initCopyButton();
});

// Switch Tab Navigation
function initTabs() {
  const tabs = document.querySelectorAll(".tab-btn");
  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));

      tab.classList.add("active");
      const targetId = tab.getAttribute("data-tab");
      const targetContent = document.getElementById(targetId);
      if (targetContent) targetContent.classList.add("active");
    });
  });
}

// Fetch & Render Student Table
async function loadStudents() {
  const search = document.getElementById("search-input").value;
  const course = document.getElementById("course-filter").value;

  const params = new URLSearchParams();
  if (search) params.append("search", search);
  if (course) params.append("course", course);

  const endpoint = `/students${params.toString() ? "?" + params.toString() : ""}`;

  const start = performance.now();
  try {
    const res = await fetch(endpoint);
    const data = await res.json();
    const duration = Math.round(performance.now() - start);

    updateInspector("GET", endpoint, res.status, res.statusText, duration, data);

    const tbody = document.getElementById("students-tbody");
    tbody.innerHTML = "";

    if (!data.data || data.data.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--text-muted); padding: 24px;">No students found matching your criteria.</td></tr>`;
      return;
    }

    data.data.forEach(s => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td><strong>#${s.id}</strong></td>
        <td>${escapeHtml(s.name)}</td>
        <td>${s.age}</td>
        <td><span class="panel-tag">${escapeHtml(s.course)}</span></td>
        <td>Sem ${s.semester || "-"}</td>
        <td><strong>${s.gpa || "-"}</strong></td>
        <td>
          <div class="table-actions">
            <button class="btn-sm" onclick="fetchSingleStudent(${s.id})">Inspect</button>
            <button class="btn-sm" onclick="populateUpdateForm(${s.id})">Edit</button>
            <button class="btn-sm" style="color: #ff7b72" onclick="deleteStudent(${s.id})">Delete</button>
          </div>
        </td>
      `;
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error("Fetch error:", err);
  }
}

// Fetch single student by ID
window.fetchSingleStudent = async function(id) {
  const start = performance.now();
  try {
    const res = await fetch(`/students/${id}`);
    const data = await res.json();
    const duration = Math.round(performance.now() - start);
    updateInspector("GET", `/students/${id}`, res.status, res.statusText, duration, data);
  } catch (err) {
    console.error(err);
  }
};

// Delete student by ID
window.deleteStudent = async function(id) {
  if (!confirm(`Are you sure you want to delete student #${id}?`)) return;

  const start = performance.now();
  try {
    const res = await fetch(`/students/${id}`, { method: "DELETE" });
    const data = await res.json();
    const duration = Math.round(performance.now() - start);

    updateInspector("DELETE", `/students/${id}`, res.status, res.statusText, duration, data);
    loadStudents();
  } catch (err) {
    console.error(err);
  }
};

// Populate update form
window.populateUpdateForm = async function(id) {
  // Switch to update tab
  document.querySelector('[data-tab="tab-update"]').click();
  document.getElementById("update-id").value = id;

  try {
    const res = await fetch(`/students/${id}`);
    const data = await res.json();
    if (data.success && data.data) {
      document.getElementById("update-name").value = data.data.name || "";
      document.getElementById("update-age").value = data.data.age || "";
      document.getElementById("update-course").value = data.data.course || "";
      document.getElementById("update-email").value = data.data.email || "";
      document.getElementById("update-sem").value = data.data.semester || "";
      document.getElementById("update-gpa").value = data.data.gpa || "";
    }
  } catch (err) {
    console.error(err);
  }
};

// Quick Request Executor
window.executeQuickRequest = async function(method, path, body = null) {
  const start = performance.now();
  const options = {
    method,
    headers: { "Content-Type": "application/json" }
  };
  if (body) options.body = JSON.stringify(body);

  try {
    const res = await fetch(path, options);
    const data = await res.json();
    const duration = Math.round(performance.now() - start);

    updateInspector(method, path, res.status, res.statusText, duration, data);
    if (["POST", "PUT", "DELETE"].includes(method) && res.status < 400) {
      loadStudents();
    }
  } catch (err) {
    console.error("Quick request error:", err);
  }
};

// Update Response Inspector UI
function updateInspector(method, url, statusCode, statusText, durationMs, jsonData) {
  const methodTag = document.getElementById("req-method-tag");
  methodTag.className = `req-method-tag ${method.toLowerCase()}`;
  methodTag.textContent = method;

  document.getElementById("req-url-text").textContent = url;

  const statusBadge = document.getElementById("response-status-badge");
  let codeClass = "code-200";
  if (statusCode >= 400 && statusCode < 500) codeClass = "code-400";
  if (statusCode >= 500) codeClass = "code-500";

  statusBadge.innerHTML = `
    <span class="status-code ${codeClass}">${statusCode} ${statusText || ""}</span>
    <span class="response-time">${durationMs}ms</span>
  `;

  document.getElementById("json-viewer").textContent = JSON.stringify(jsonData, null, 2);
}

// Form Handlers
function initFormHandlers() {
  // Create Student
  const createForm = document.getElementById("create-student-form");
  if (createForm) {
    createForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const payload = {
        name: document.getElementById("create-name").value,
        age: document.getElementById("create-age").value,
        course: document.getElementById("create-course").value,
        email: document.getElementById("create-email").value || undefined,
        semester: document.getElementById("create-sem").value || undefined,
        gpa: document.getElementById("create-gpa").value || undefined
      };

      await executeQuickRequest("POST", "/students", payload);
      createForm.reset();
      document.querySelector('[data-tab="tab-list"]').click();
      loadStudents();
    });
  }

  // Update Student
  const updateForm = document.getElementById("update-student-form");
  if (updateForm) {
    updateForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const id = document.getElementById("update-id").value;
      const payload = {};

      const name = document.getElementById("update-name").value;
      const age = document.getElementById("update-age").value;
      const course = document.getElementById("update-course").value;
      const email = document.getElementById("update-email").value;
      const sem = document.getElementById("update-sem").value;
      const gpa = document.getElementById("update-gpa").value;

      if (name) payload.name = name;
      if (age) payload.age = age;
      if (course) payload.course = course;
      if (email) payload.email = email;
      if (sem) payload.semester = sem;
      if (gpa) payload.gpa = gpa;

      await executeQuickRequest("PUT", `/students/${id}`, payload);
      document.querySelector('[data-tab="tab-list"]').click();
      loadStudents();
    });
  }

  // Fetch for update button
  const fetchBtn = document.getElementById("btn-fetch-for-update");
  if (fetchBtn) {
    fetchBtn.addEventListener("click", () => {
      const id = document.getElementById("update-id").value;
      if (id) populateUpdateForm(id);
    });
  }
}

// Filter and Search Handlers
function initFilterHandlers() {
  const searchInput = document.getElementById("search-input");
  const courseFilter = document.getElementById("course-filter");
  const refreshBtn = document.getElementById("btn-refresh");

  if (searchInput) searchInput.addEventListener("input", debounce(loadStudents, 300));
  if (courseFilter) courseFilter.addEventListener("change", loadStudents);
  if (refreshBtn) refreshBtn.addEventListener("click", loadStudents);
}

// Copy JSON Response
function initCopyButton() {
  const copyBtn = document.getElementById("btn-copy-response");
  if (copyBtn) {
    copyBtn.addEventListener("click", () => {
      const text = document.getElementById("json-viewer").textContent;
      navigator.clipboard.writeText(text).then(() => {
        copyBtn.textContent = "Copied!";
        setTimeout(() => (copyBtn.textContent = "Copy JSON"), 2000);
      });
    });
  }
}

// Utilities
function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
