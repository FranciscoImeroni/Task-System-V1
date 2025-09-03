import React from "react";
import type { Task } from "../types";
import "./TaskList.css";

interface TaskListProps {
  tasks: Task[];
  onDetails: (id: string) => void;
  page: number;
  total: number;
  limit: number;
  onPageChange: (page: number) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onDetails, page, total, limit, onPageChange }) => {
  const totalPages = Math.ceil(total / limit);

  return (
    <div className="task-list-container">
      <h2>Tasks</h2>
      <table className="task-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Status</th>
            <th>Priority</th>
            <th>Estimate</th>
            <th>Created At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id}>
              <td>{task.displayId}</td>
              <td>{task.title}</td>
              <td>{task.status}</td>
              <td>{task.priority}</td>
              <td>{task.estimate}</td>
              <td>{new Date(task.createdAt).toLocaleDateString()}</td>
              <td>
                <button onClick={() => onDetails(task.id)}>Details</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div style={{ marginTop: '1rem', textAlign: 'center' }}>
        <button onClick={() => onPageChange(page - 1)} disabled={page <= 1}>
          Previous
        </button>
        <span style={{ margin: '0 1rem' }}>
          Page {page} of {totalPages}
        </span>
        <button onClick={() => onPageChange(page + 1)} disabled={page >= totalPages}>
          Next
        </button>
      </div>
    </div>
  );
};

export default TaskList;