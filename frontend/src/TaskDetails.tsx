import React, { useState } from "react";
import type { Task } from "./types"; // Changed to type-only import

interface TaskDetailsProps {
  task: Task;
  onUpdate: (task: Task) => void;
  onDelete: (id: string) => void;
  onBack: () => void;
}

const TaskDetails: React.FC<TaskDetailsProps> = ({ task, onUpdate, onDelete, onBack }) => {
  const [editMode, setEditMode] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [priority, setPriority] = useState(task.priority);
  const [status, setStatus] = useState(task.status);
  const [estimate, setEstimate] = useState(task.estimate ? String(task.estimate) : "");
  const [subtasks, setSubtasks] = useState(task.subtasks || []);

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
  };

  const handleAddSubtask = () => {
    setSubtasks([...subtasks, { title: "", estimate: 0 }]);
  };

  const handleSubtaskChange = (idx: number, field: string, value: string) => {
    setSubtasks(subtasks.map((st, i) =>
      i === idx ? { ...st, [field]: field === "estimate" ? Number(value) : value } : st
    ));
  };

  const handleDeleteSubtask = (idx: number) => {
    setSubtasks(subtasks.filter((_, i) => i !== idx));
  };

  return (
    <div className="task-details">
      <button onClick={onBack}>Back</button>
      {editMode ? (
        <div>
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" />
          <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" />
          <select value={priority} onChange={e => setPriority(e.target.value as Task['priority'])}>
            <option value="">Priority</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Urgent">Urgent</option>
          </select>
          <select value={status} onChange={e => setStatus(e.target.value as Task['status'])}>
            <option value="Backlog">Backlog</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
          <input type="number" min="0" value={estimate} onChange={e => setEstimate(e.target.value)} placeholder="Estimate" />
          <h4>Subtasks</h4>
          {subtasks.map((st, idx) => (
            <div key={idx}>
              <input value={st.title} onChange={e => handleSubtaskChange(idx, "title", e.target.value)} placeholder="Subtask Title" />
              <input type="number" min="0" value={st.estimate} onChange={e => handleSubtaskChange(idx, "estimate", e.target.value)} placeholder="Estimate" />
              <button type="button" onClick={() => handleDeleteSubtask(idx)}>Delete</button>
            </div>
          ))}
          <button type="button" onClick={handleAddSubtask}>Add Subtask</button>
          <button onClick={handleSave}>Save</button>
        </div>
      ) : (
        <div>
          <h2>{task.title}</h2>
          <p>{task.description}</p>
          <p>Priority: {task.priority}</p>
          <p>Status: {task.status}</p>
          <p>Estimate: {task.estimate}</p>
          <h4>Subtasks</h4>
          <ul>
            {task.subtasks && task.subtasks.map((st, idx) => (
              <li key={idx}>{st.title} ({st.estimate})</li>
            ))}
          </ul>
          <button onClick={() => setEditMode(true)}>Edit</button>
          <button onClick={() => onDelete(task.id)}>Delete</button>
        </div>
      )}
    </div>
  );
};

export default TaskDetails;