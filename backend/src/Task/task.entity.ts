import { Entity, PrimaryColumn, Column, Generated } from 'typeorm'; // Importa 'Generated'

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
  @Generated('increment') // Añade esta línea para generar un número auto-incrementable
  displayId: number; // Nuevo campo para el ID numérico a mostrar

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