import React, { useState, useEffect } from "react";
import "../styles/tasksWidget.css";

const TasksWidget = () => {
const [tasks, setTasks] = useState(() => {
const savedTasks = localStorage.getItem("tasks");
return savedTasks ? JSON.parse(savedTasks) : [];
});
const [newTask, setNewTask] = useState("");

useEffect(() => {
localStorage.setItem("tasks", JSON.stringify(tasks));
}, [tasks]);

const addTask = () => {
if (newTask.trim() === "") return;
const task = {
    id: tasks.length + 1,
    description: newTask,
    status: "Not Started",
};
setTasks([...tasks, task]);
setNewTask("");
};

const updateTaskStatus = (id, status) => {
setTasks((prevTasks) =>
    prevTasks.map((task) => (task.id === id ? { ...task, status } : task))
);
};

const clearTasks = () => {
setTasks([]);
localStorage.removeItem("tasks");
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
    />
    <button onClick={addTask}>Add</button>
    <button onClick={clearTasks} className="clear-button">
        Clear All
    </button>
    </div>
    <ul>
    {tasks.map((task) => (
        <li key={task.id}>
        <span>{task.description}</span>
        <select
            value={task.status}
            onChange={(e) => updateTaskStatus(task.id, e.target.value)}
        >
            <option value="Not Started">Not Started</option>
            <option value="Ongoing">Ongoing</option>
            <option value="Complete">Complete</option>
        </select>
        </li>
    ))}
    </ul>
</div>
);
};

export default TasksWidget;
