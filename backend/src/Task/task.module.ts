import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { Task } from './task.entity'; // Importa la entidad Task

@Module({
  imports: [TypeOrmModule.forFeature([Task])], // Registra la entidad Task para este módulo
  controllers: [TaskController],
  providers: [TaskService],
})
export class TaskModule {}