import React from "react";
import type { Task } from "./types";

interface TaskListProps {
  tasks: Task[];
  onDetails: (id: string) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onDetails }) => {


  return (
    <div style={{ padding: "2rem" }}>
      <h2>Tasks</h2>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
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
            <tr key={task.id} style={{ borderBottom: "1px solid #eee" }}>
              <td>{task.id}</td>
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
    </div>
  );
};

export default TaskList;