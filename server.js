const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5000;
const tasksFilePath = path.join(__dirname, 'data', 'tasks.json');

app.use(bodyParser.json());
app.use(cors());

// Get all tasks
app.get('/tasks', (req, res) => {
    fs.readFile(tasksFilePath, (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to read tasks' });
        }
        const tasks = JSON.parse(data);
        res.json(tasks);
    });
});

// Add a new task
app.post('/tasks', (req, res) => {
    const newTask = req.body;
    fs.readFile(tasksFilePath, (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to read tasks' });
        }
        const tasks = JSON.parse(data);
        tasks.push(newTask);
        fs.writeFile(tasksFilePath, JSON.stringify(tasks), (err) => {
            if (err) {
                return res.status(500).json({ error: 'Failed to save task' });
            }
            res.json(newTask);
        });
    });
});

// Edit a task
app.put('/tasks/:id', (req, res) => {
    const taskId = req.params.id;
    const updatedTask = req.body;
    fs.readFile(tasksFilePath, (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to read tasks' });
        }
        const tasks = JSON.parse(data);
        const taskIndex = tasks.findIndex((task) => task.id === taskId);
        if (taskIndex === -1) {
            return res.status(404).json({ error: 'Task not found' });
        }
        tasks[taskIndex] = updatedTask;
        fs.writeFile(tasksFilePath, JSON.stringify(tasks), (err) => {
            if (err) {
                return res.status(500).json({ error: 'Failed to update task' });
            }
            res.json(updatedTask);
        });
    });
});

// Delete a task
app.delete('/tasks/:id', (req, res) => {
    const taskId = req.params.id;
    fs.readFile(tasksFilePath, (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to read tasks' });
        }
        let tasks = JSON.parse(data);
        tasks = tasks.filter((task) => task.id !== taskId);
        fs.writeFile(tasksFilePath, JSON.stringify(tasks), (err) => {
            if (err) {
                return res.status(500).json({ error: 'Failed to delete task' });
            }
            res.json({ id: taskId });
        });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
