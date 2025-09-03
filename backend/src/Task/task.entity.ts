import { Entity, PrimaryColumn, Column } from 'typeorm';

export type TaskStatus = "Backlog" | "In Progress" | "Completed";
export type TaskPriority = "Low" | "Medium" | "High" | "Urgent";

export interface Subtask {
  title: string;
  estimate: number;
  status: "Backlog" | "Unstarted" | "Started" | "Completed";
  subtasks?: Subtask[]; 
}

@Entity('tasks') 
export class Task {
  @PrimaryColumn() 
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  priority: TaskPriority; 

  @Column()
  status: TaskStatus;

  @Column({ type: 'int', nullable: true })
  estimate?: number;

  @Column({ type: 'timestamp with time zone' }) 
  createdAt: string;

  @Column({ type: 'timestamp with time zone' })
  updatedAt: string;

  @Column({ type: 'jsonb', nullable: true, default: '[]' }) 
  subtasks?: Subtask[];
}