export interface Subtask {
  title: string;
  estimate: number;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: "Low" | "Medium" | "High" | "Urgent";
  status: "Backlog" | "In Progress" | "Completed";
  estimate?: number; // Optional, as it's handled as string and converted to number
  createdAt: string;
  updatedAt: string;
  subtasks?: Subtask[];
}