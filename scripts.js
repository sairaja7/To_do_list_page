document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('task-list');

    // Fetch tasks from the backend
    fetchTasks();

    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        addTask(taskInput.value);
        taskInput.value = '';
    });

    taskList.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete')) {
            deleteTask(e.target.parentElement.dataset.id);
        } else if (e.target.classList.contains('edit')) {
            editTask(e.target.parentElement.dataset.id, e.target.parentElement);
        } else if (e.target.classList.contains('complete')) {
            toggleCompleteTask(e.target.parentElement.dataset.id, e.target.parentElement);
        }
    });

    function fetchTasks() {
        fetch('http://localhost:5000/tasks')
            .then(response => response.json())
            .then(tasks => {
                tasks.forEach(task => {
                    renderTask(task);
                });
            });
    }

    function addTask(taskText) {
        const newTask = {
            id: Date.now().toString(),
            text: taskText,
            completed: false
        };

        fetch('http://localhost:5000/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newTask)
        })
            .then(response => response.json())
            .then(task => {
                renderTask(task);
            });
    }

    function deleteTask(taskId) {
        fetch(`http://localhost:5000/tasks/${taskId}`, {
            method: 'DELETE'
        })
            .then(() => {
                document.querySelector(`[data-id='${taskId}']`).remove();
            });
    }

    function editTask(taskId, taskItem) {
        const taskText = prompt('Edit task:', taskItem.querySelector('span').textContent);
        if (taskText) {
            const updatedTask = {
                id: taskId,
                text: taskText,
                completed: taskItem.classList.contains('task-completed')
            };

            fetch(`http://localhost:5000/tasks/${taskId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedTask)
            })
                .then(response => response.json())
                .then(task => {
                    taskItem.querySelector('span').textContent = task.text;
                });
        }
    }

    function toggleCompleteTask(taskId, taskItem) {
        const updatedTask = {
            id: taskId,
            text: taskItem.querySelector('span').textContent,
            completed: !taskItem.classList.contains('task-completed')
        };

        fetch(`http://localhost:5000/tasks/${taskId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedTask)
        })
            .then(response => response.json())
            .then(task => {
                taskItem.classList.toggle('task-completed');
            });
    }

    function renderTask(task) {
        const li = document.createElement('li');
        li.className = 'task-item';
        li.dataset.id = task.id;
        li.innerHTML = `
            <span>${task.text}</span>
            <div>
                <button class="complete">${task.completed ? 'Undo' : 'Complete'}</button>
                <button class="edit">Edit</button>
                <button class="delete">Delete</button>
            </div>
        `;
        if (task.completed) {
            li.classList.add('task-completed');
        }
        taskList.appendChild(li);
    }
});
