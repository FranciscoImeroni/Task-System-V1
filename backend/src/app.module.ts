import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './Task/task.entity';
import { TaskModule } from './Task/task.module'; // Importa TaskModule

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST || 'localhost',
      port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
      username: process.env.DATABASE_USER || 'postgres',
      password: process.env.DATABASE_PASSWORD || 'postgrespassword',
      database: process.env.DATABASE_NAME || 'taskdb',
      entities: [Task],
      synchronize: true,
    }),
    TaskModule, // Importa TaskModule aquí
  ],
  controllers: [AppController], // Solo AppController si TaskController está en TaskModule
  providers: [AppService], // Solo AppService si TaskService está en TaskModule
})
export class AppModule {
  constructor() {
    console.log('DB Host:', process.env.DATABASE_HOST || 'localhost');
    console.log('DB Port:', parseInt(process.env.DATABASE_PORT, 10) || 5432);
    console.log('DB User:', process.env.DATABASE_USER || 'postgres');
    console.log('DB Password:', process.env.DATABASE_PASSWORD ? '********' : 'postgrespassword'); // No logear la contraseña real
    console.log('DB Name:', process.env.DATABASE_NAME || 'taskdb');
  }
}
