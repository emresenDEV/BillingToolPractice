import React, { useState, useEffect } from "react";
import "../styles/tasksWidget.css";

const TasksWidget = () => {
const [tasks, setTasks] = useState([]);
const [newTask, setNewTask] = useState("");
const [error, setError] = useState("");

// Load tasks from localStorage
useEffect(() => {
const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
setTasks(savedTasks);
}, []);

// Save tasks to localStorage (TODO: create table in db to store tasks M-1 to Users)
useEffect(() => {
localStorage.setItem("tasks", JSON.stringify(tasks));
}, [tasks]);

const addTask = () => {
if (newTask.trim() === "") {
    setError("Task description cannot be empty.");
    return;
}
setError("");

const task = {
    id: Date.now(), 
    description: newTask,
    status: "Not Started",
};

setTasks((prevTasks) => [...prevTasks, task]);
setNewTask("");
};

const updateTaskStatus = (id, status) => {
setTasks((prevTasks) =>
    prevTasks.map((task) => (task.id === id ? { ...task, status } : task))
);
};

const deleteTask = (id) => {
setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
};

return (
<div className="tasks-widget">
    <h2>Tasks</h2>
    <div className="add-task">
    <input
        type="text"
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
        placeholder="Add a new task"
        aria-label="New task input"
    />
    <button onClick={addTask} aria-label="Add task">
        Add
    </button>
    {error && <p className="error">{error}</p>}
    </div>
    {tasks.length > 0 ? (
    <ul aria-live="polite">
        {tasks.map((task) => (
        <li key={task.id} className="task-item">
            <span>{task.description}</span>
            <select
            value={task.status}
            onChange={(e) => updateTaskStatus(task.id, e.target.value)}
            aria-label={`Change status for task: ${task.description}`}
            >
            <option value="Not Started">Not Started</option>
            <option value="Ongoing">Ongoing</option>
            <option value="Complete">Complete</option>
            </select>
            <button
            onClick={() => deleteTask(task.id)}
            aria-label={`Delete task: ${task.description}`}
            >
            Delete
            </button>
        </li>
        ))}
    </ul>
    ) : (
    <p>No tasks available. Add a new task to get started.</p>
    )}
</div>
);
};

export default TasksWidget;
