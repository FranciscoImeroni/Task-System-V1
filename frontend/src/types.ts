export interface Subtask {
  title: string;
  estimate: number;
  status: "Backlog" | "Unstarted" | "Started" | "Completed";
  subtasks?: Subtask[];
}

export interface Task {
  id: string;
  displayId: number; // Añade esta línea
  title: string;
  description: string;
  priority: "Low" | "Medium" | "High" | "Urgent";
  status: "Backlog" | "In Progress" | "Completed";
  estimate?: number;
  createdAt: string;
  updatedAt: string;
  subtasks?: Subtask[];
}