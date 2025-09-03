export type TaskStatus = 'Backlog' | 'Unstarted' | 'Started' | 'Completed' | 'Canceled';
export type TaskPriority = 'Low' | 'Medium' | 'High' | 'Urgent';

export class Task {
  id: string;
  title: string;
  description: string;
  priority?: TaskPriority;
  status: TaskStatus;
  estimate?: number;
  createdAt: string;
  updatedAt: string;
  subtasks?: Task[]; 
}