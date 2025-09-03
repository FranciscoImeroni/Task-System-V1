import React, { useState, useEffect } from "react";
import type { Task } from "../types";
import type { Subtask } from "../types";
import "./TaskDetails.css";

interface TaskDetailsProps {
  task: Task;
  onUpdate: (task: Task) => void;
  onDelete: (id: string) => void;
  onBack: () => void; // Changed from onClose to onBack
}

const TaskDetails: React.FC<TaskDetailsProps> = ({
  task,
  onUpdate,
  onDelete,
  onBack, // Destructure onBack
}) => {
  const [editMode, setEditMode] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [priority, setPriority] = useState(task.priority);
  const [status, setStatus] = useState(task.status);
  const [estimate, setEstimate] = useState<string>(task.estimate?.toString() || "");
  const [subtasks, setSubtasks] = useState<Subtask[]>(task.subtasks || []);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState("");
  const [newSubtaskEstimate, setNewSubtaskEstimate] = useState("");
  const [subtaskEstimates, setSubtaskEstimates] = useState({ pending: 0, started: 0, total: 0 });

  const API_BASE_URL = "http://localhost:3000";

  useEffect(() => {
    setTitle(task.title);
    setDescription(task.description);
    setPriority(task.priority);
    setStatus(task.status);
    setEstimate(task.estimate?.toString() || "");
    setSubtasks(task.subtasks || []);
    fetchSubtaskEstimates();
  }, [task]);

  const fetchSubtaskEstimates = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/tasks/${task.id}/estimates`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setSubtaskEstimates(data);
    } catch (error) {
      console.error("Error fetching subtask estimates:", error);
    }
  };

  const handleSave = () => {
    onUpdate({
      ...task,
      title,
      description,
      priority,
      status,
      estimate: estimate ? Number(estimate) : undefined,
      updatedAt: new Date().toISOString(),
      subtasks,
    });
    setEditMode(false);
    fetchSubtaskEstimates();
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      onDelete(task.id);
      onBack(); // Call onBack
    }
  };

  const handleAddSubtask = () => {
    if (newSubtaskTitle && newSubtaskEstimate) {
      const newSubtask: Subtask = {
        title: newSubtaskTitle,
        estimate: Number(newSubtaskEstimate),
        status: "Unstarted",
        subtasks: [],
      };
      setSubtasks([...subtasks, newSubtask]);
      setNewSubtaskTitle("");
      setNewSubtaskEstimate("");
    }
  };

  const handleSubtaskStatusChange = (index: number, newStatus: Subtask["status"]) => {
    const updatedSubtasks = [...subtasks];
    updatedSubtasks[index].status = newStatus;
    setSubtasks(updatedSubtasks);
  };

  const handleSubtaskDelete = (index: number) => {
    const updatedSubtasks = subtasks.filter((_, i) => i !== index);
    setSubtasks(updatedSubtasks);
  };

  return (
    <div className="task-details">
      <button className="close-button" onClick={onBack}> {/* Call onBack */}
        &times;
      </button>
      {editMode ? (
        <>
          <h2>Edit Task #{task.displayId}</h2> {/* Muestra el displayId */}
          <label>
            Title:
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
          </label>
          <label>
            Description:
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
          </label>
          <label>
            Priority:
            <select value={priority} onChange={(e) => setPriority(e.target.value as Task["priority"])}>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Urgent">Urgent</option>
            </select>
          </label>
          <label>
            Status:
            <select value={status} onChange={(e) => setStatus(e.target.value as Task["status"])}>
              <option value="Backlog">Backlog</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </label>
          <label>
            Estimate (hours):
            <input type="number" value={estimate} onChange={(e) => setEstimate(e.target.value)} />
          </label>

          <h3>Subtasks</h3>
          {subtasks.length === 0 ? (
            <p>No subtasks.</p>
          ) : (
            <ul>
              {subtasks.map((sub, index) => (
                <li key={index}>
                  {sub.title} ({sub.estimate}h) - {sub.status}
                  <select value={sub.status} onChange={(e) => handleSubtaskStatusChange(index, e.target.value as Subtask["status"])}>
                    <option value="Backlog">Backlog</option>
                    <option value="Unstarted">Unstarted</option>
                    <option value="Started">Started</option>
                    <option value="Completed">Completed</option>
                  </select>
                  <button onClick={() => handleSubtaskDelete(index)}>Delete</button>
                </li>
              ))}
            </ul>
          )}
          <div className="add-subtask">
            <input type="text" placeholder="New subtask title" value={newSubtaskTitle} onChange={(e) => setNewSubtaskTitle(e.target.value)} />
            <input type="number" placeholder="Estimate" value={newSubtaskEstimate} onChange={(e) => setNewSubtaskEstimate(e.target.value)} />
            <button onClick={handleAddSubtask}>Add Subtask</button>
          </div>

          <button onClick={handleSave}>Save</button>
          <button onClick={() => setEditMode(false)}>Cancel</button>
        </>
      ) : (
        <>
          <h2>Task Details #{task.displayId}</h2> {/* Muestra el displayId */}
          <p>
            <strong>Title:</strong> {task.title}
          </p>
          <p>
            <strong>Description:</strong> {task.description}
          </p>
          <p>
            <strong>Priority:</strong> {task.priority}
          </p>
          <p>
            <strong>Status:</strong> {task.status}
          </p>
          {task.estimate && (
            <p>
              <strong>Estimate:</strong> {task.estimate} hours
            </p>
          )}
          <p>
            <strong>Created At:</strong> {new Date(task.createdAt).toLocaleString()}
          </p>
          <p>
            <strong>Last Updated:</strong> {new Date(task.updatedAt).toLocaleString()}
          </p>

          <h3>Subtasks ({subtaskEstimates.total}h total)</h3>
          <p>Pending: {subtaskEstimates.pending}h | Started: {subtaskEstimates.started}h</p>
          {task.subtasks && task.subtasks.length > 0 ? (
            <ul>
              {task.subtasks.map((sub, index) => (
                <li key={index}>
                  {sub.title} ({sub.estimate}h) - {sub.status}
                </li>
              ))}
            </ul>
          ) : (
            <p>No subtasks defined.</p>
          )}

          <button onClick={() => setEditMode(true)}>Edit</button>
          <button onClick={handleDelete}>Delete</button>
        </>
      )}
    </div>
  );
};

export default TaskDetails;