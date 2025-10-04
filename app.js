import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

const supabaseUrl = 'https://hkgblxpchsmcucimbmzn.supabase.co';
const supabaseKey =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhrZ2JseHBjaHNtY3VjaW1ibXpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc5NTI5NzUsImV4cCI6MjA3MzUyODk3NX0.3o85UlQif1ytkpT48_4EpkmGFDXP6Cp4UpELEjBjp3E'; // Supabase ANON key
const supabase = createClient(supabaseUrl, supabaseKey);

const taskList = document.getElementById('task-list');
const addForm = document.getElementById('add-task-form');
let currentFilter = 'all';

// Fetch tasks
async function fetchTasks(filter = 'all') {
    currentFilter = filter;

    let query = supabase.from('tasks').select('*');
    if (filter === 'pending') query = query.eq('status', 'pending');
    else if (filter === 'completed') query = query.eq('status', 'completed');

    query = query
        .order('due_date', { ascending: true })
        .order('created_at', { ascending: false });

    const { data, error } = await query;
    if (error) return console.error(error);

    taskList.innerHTML = '';
    data.forEach((task) => {
        const col = document.createElement('div');
        col.className = 'col-12 col-md-6 col-lg-4';
        col.innerHTML = `
      <div class="card card-task ${
          task.status === 'completed' ? 'completed' : ''
      }">
        <h5 class="card-title">${task.title || 'Untitled Task'}</h5>
        <p class="card-text">${task.description || 'No description'}</p>
        <p><small>Due: ${task.due_date || 'N/A'}</small></p>
        <span class="badge badge-status ${
            task.status === 'pending' ? 'bg-warning text-dark' : 'bg-success'
        }">Status: ${task.status}</span>
        <div class="mt-2 d-flex flex-wrap gap-2">
          <button class="btn btn-edit btn-sm task-btn" onclick="editTask('${
              task.id
          }','${encodeURIComponent(task.title)}','${encodeURIComponent(
            task.description
        )}','${task.due_date || ''}')">✏️ Edit</button>
          <button class="btn btn-toggle-pending btn-sm task-btn" onclick="toggleStatus('${
              task.id
          }')">${
            task.status === 'pending' ? '✅ Mark Complete' : '🔄 Mark Pending'
        }</button>
          <button class="btn btn-delete btn-sm task-btn" onclick="deleteTask('${
              task.id
          }')">🗑️ Delete</button>
        </div>
      </div>
    `;
        taskList.appendChild(col);
    });
}

// Add Task
async function addTask(e) {
    e.preventDefault();
    const title = document.getElementById('title').value || 'Untitled Task';
    const description =
        document.getElementById('description').value || 'No description';
    const due_date_input = document.getElementById('due_date').value;
    const due_date = due_date_input ? due_date_input : null;

    const { error } = await supabase
        .from('tasks')
        .insert([{ title, description, due_date }]);
    if (error) console.error(error);

    addForm.reset();
    fetchTasks(currentFilter);
}

// Toggle Status
window.toggleStatus = async (id) => {
    const { data: task, error: fetchError } = await supabase
        .from('tasks')
        .select('status')
        .eq('id', id)
        .single();
    if (fetchError) return console.error(fetchError);
    const newStatus = task.status === 'pending' ? 'completed' : 'pending';
    const { error: updateError } = await supabase
        .from('tasks')
        .update({ status: newStatus })
        .eq('id', id);
    if (updateError) return console.error(updateError);
    fetchTasks(currentFilter);
};

// Delete Task
window.deleteTask = async (id) => {
    const { error } = await supabase.from('tasks').delete().eq('id', id);
    if (error) console.error(error);
    fetchTasks(currentFilter);
};

// Edit Task
window.editTask = async (
    id,
    currentTitle,
    currentDescription,
    currentDueDate
) => {
    const newTitle =
        prompt('Edit title:', decodeURIComponent(currentTitle)) ||
        decodeURIComponent(currentTitle);
    const newDescription =
        prompt('Edit description:', decodeURIComponent(currentDescription)) ||
        decodeURIComponent(currentDescription);
    const newDueDate =
        prompt('Edit due date (YYYY-MM-DD):', currentDueDate) || currentDueDate;
    const { error } = await supabase
        .from('tasks')
        .update({
            title: newTitle,
            description: newDescription,
            due_date: newDueDate,
        })
        .eq('id', id);
    if (error) console.error(error);
    fetchTasks(currentFilter);
};

// Event listeners
addForm.addEventListener('submit', addTask);
document
    .getElementById('filter-all')
    .addEventListener('click', () => fetchTasks('all'));
document
    .getElementById('filter-pending')
    .addEventListener('click', () => fetchTasks('pending'));
document
    .getElementById('filter-completed')
    .addEventListener('click', () => fetchTasks('completed'));

// Dark Mode Toggle
document.getElementById('dark-mode-toggle').addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const btn = document.getElementById('dark-mode-toggle');
    btn.innerText = document.body.classList.contains('dark-mode')
        ? '☀️ Light Mode'
        : '🌙 Dark Mode';
});

// Initial fetch
fetchTasks();
