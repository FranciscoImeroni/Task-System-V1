import React, { useState, useEffect } from "react"; 
import { Routes, Route, useNavigate } from "react-router-dom";
import TaskDetails from "./TaskDetails/TaskDetails";
import TaskList from "./TaskList/TaskList";
import TaskForm from "./TaskForm/TaskForm"; 
import "./App.css";
import type { Task } from "./types"; 


function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<string>("");
  const [estimate, setEstimate] = useState<string>("");
  const navigate = useNavigate();

  const API_BASE_URL = "http://localhost:3000";

  const fetchTasks = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: Task[] = await response.json();
      setTasks(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newTaskData = {
      title,
      description,
      priority: priority as Task["priority"],
      status: "Backlog",
      estimate: estimate ? Number(estimate) : undefined,
      subtasks: [],
    };

    try {
      const response = await fetch(`${API_BASE_URL}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTaskData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const createdTask: Task = await response.json();
      setTasks((prevTasks) => [...prevTasks, createdTask]);
      setTitle("");
      setDescription("");
      setPriority("");
      setEstimate("");
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  const handleUpdateTask = async (updatedTask: Task) => {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/${updatedTask.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedTask),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: Task = await response.json();
      setTasks((prevTasks) =>
        prevTasks.map((t) => (t.id === data.id ? data : t))
      );
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setTasks((prevTasks) => prevTasks.filter((t) => t.id !== id));
      navigate("/");
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  return (
    <div className="app">
      <h1>Task Management System</h1>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <TaskForm 
                title={title}
                setTitle={setTitle}
                description={description}
                setDescription={setDescription}
                priority={priority}
                setPriority={setPriority}
                estimate={estimate}
                setEstimate={setEstimate}
                handleCreateTask={handleCreateTask}
              />
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
