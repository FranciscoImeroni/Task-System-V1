import React from "react";
import "./TaskForm.css"; 

interface TaskFormProps {
  title: string;
  setTitle: (title: string) => void;
  description: string;
  setDescription: (description: string) => void;
  priority: string;
  setPriority: (priority: string) => void;
  estimate: string;
  setEstimate: (estimate: string) => void;
  handleCreateTask: (e: React.FormEvent) => void;
}

const TaskForm: React.FC<TaskFormProps> = ({
  title,
  setTitle,
  description,
  setDescription,
  priority,
  setPriority,
  estimate,
  setEstimate,
  handleCreateTask,
}) => {
  return (
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
  );
};

export default TaskForm;