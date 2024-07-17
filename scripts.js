document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('task-list');

    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        addTask(taskInput.value);
        taskInput.value = '';
    });

    taskList.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete')) {
            deleteTask(e.target.parentElement);
        } else if (e.target.classList.contains('edit')) {
            editTask(e.target.parentElement);
        } else if (e.target.classList.contains('complete')) {
            toggleCompleteTask(e.target.parentElement);
        }
    });

    function addTask(task) {
        const li = document.createElement('li');
        li.className = 'task-item';
        li.innerHTML = `
            <span>${task}</span>
            <div>
                <button class="complete">Complete</button>
                <button class="edit">Edit</button>
                <button class="delete">Delete</button>
            </div>
        `;
        taskList.appendChild(li);
    }

    function deleteTask(taskItem) {
        taskList.removeChild(taskItem);
    }

    function editTask(taskItem) {
        const task = prompt('Edit task:', taskItem.firstElementChild.textContent);
        if (task) {
            taskItem.firstElementChild.textContent = task;
        }
    }

    function toggleCompleteTask(taskItem) {
        taskItem.classList.toggle('task-completed');
    }
});
