import React, { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import TaskDetails from "./TaskDetails";
import TaskList from "./TaskList";
import "./App.css";
import type { Task } from "./types";

const initialTasks: Task[] = [
  {
    id: "1",
    title: "Design homepage",
    description: "Design the main homepage layout and hero section.",
    status: "In Progress",
    priority: "High",
    estimate: 4,
    createdAt: "2024-06-01T00:00:00.000Z",
    updatedAt: "2024-06-01T00:00:00.000Z",
    subtasks: [],
  },
  {
    id: "2",
    title: "Setup backend API",
    description: "Initialize backend project and create basic endpoints.",
    status: "Backlog",
    priority: "Medium",
    estimate: 6,
    createdAt: "2024-06-02T00:00:00.000Z",
    updatedAt: "2024-06-02T00:00:00.000Z",
    subtasks: [],
  },
  {
    id: "3",
    title: "Write documentation",
    description: "Document the API and frontend usage.",
    status: "Completed",
    priority: "Low",
    estimate: 2,
    createdAt: "2024-06-03T00:00:00.000Z",
    updatedAt: "2024-06-03T00:00:00.000Z",
    subtasks: [],
  },
];

// Remove the local TaskList function definition from here
// function TaskList({ tasks, onDetails }: { tasks: Task[]; onDetails: (id: string) => void }) {
//   return (
//     <div className="task-list">
//       <h2>Tasks</h2>
//       <ul>
//         {tasks.map((task) => (
//           <li key={task.id} className="task-item">
//             <div>
//               <strong>{task.title}</strong> <span>({task.priority})</span>
//             </div>
//             <button onClick={() => onDetails(task.id)}>Details</button>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

function App() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<string>("");
  const [estimate, setEstimate] = useState<string>("");
  const navigate = useNavigate();

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    const now = new Date().toISOString();
    setTasks([
      ...tasks,
      {
        id: Math.random().toString(36).substr(2, 9),
        title,
        description,
        priority: priority as Task["priority"],
        status: "Backlog",
        estimate: estimate ? Number(estimate) : undefined,
        createdAt: now,
        updatedAt: now,
        subtasks: [],
      },
    ]);
    setTitle("");
    setDescription("");
    setPriority("");
    setEstimate("");
  };

  const handleUpdateTask = (updated: Task) => {
    setTasks((tasks) => tasks.map((t) => (t.id === updated.id ? updated : t)));
  };

  const handleDeleteTask = (id: string) => {
    setTasks((tasks) => tasks.filter((t) => t.id !== id));
    navigate("/");
  };

  return (
    <div className="app">
      <h1>Task Management System</h1>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <form onSubmit={handleCreateTask} className="task-form">
                <input
                  type="text"
                  placeholder="Task Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
                <textarea
                  placeholder="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                >
                  <option value="">Select Priority</option>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Urgent">Urgent</option>
                </select>
                <input
                  type="number"
                  placeholder="Estimate (hours)"
                  value={estimate}
                  onChange={(e) => setEstimate(e.target.value)}
                />
                <button type="submit">Add Task</button>
              </form>
              <TaskList
                tasks={tasks}
                onDetails={(id) => navigate(`/task/${id}`)}
              />
            </>
          }
        />
        <Route
          path="/task/:id"
          element={
            <TaskDetails
              task={tasks.find((t) => t.id === window.location.pathname.split("/").pop())!}
              onUpdate={handleUpdateTask}
              onDelete={handleDeleteTask}
              onBack={() => navigate("/")}
            />
          }
        />
      </Routes>
    </div>
  );
}

export default App;
