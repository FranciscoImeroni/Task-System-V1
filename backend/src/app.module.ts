import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TaskController } from './Task/task.controller'; 
import { TaskService } from './Task/task.service';    

@Module({
  imports: [],
  controllers: [AppController, TaskController], 
  providers: [AppService, TaskService],      
})
export class AppModule {}
