import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { swagger } from "@elysiajs/swagger";
import { TaskRepository } from "@infrastructure/database/repositories/TaskRepository";
import { RedisNotificationQueue } from "@infrastructure/queue/RedisNotificationQueue";
import { CreateTaskUseCase } from "@application/use-cases/CreateTaskUseCase";
import { GetTaskByIdUseCase } from "@application/use-cases/GetTaskByIdUseCase";
import { GetAllTasksUseCase } from "@application/use-cases/GetAllTasksUseCase";
import { UpdateTaskUseCase } from "@application/use-cases/UpdateTaskUseCase";
import { DeleteTaskUseCase } from "@application/use-cases/DeleteTaskUseCase";
import { NotificationService } from "@application/services/NotificationService";
import { createTaskRoutes } from "@infrastructure/http/routes/taskRoutes";
import { errorHandler } from "@infrastructure/http/errors/errorHandler";

const port = parseInt(process.env.PORT || "3001");

// Infrastructure
const taskRepository = new TaskRepository();
const notificationQueue = new RedisNotificationQueue();

// Application
const createTaskUseCase = new CreateTaskUseCase(taskRepository);
const getTaskByIdUseCase = new GetTaskByIdUseCase(taskRepository);
const getAllTasksUseCase = new GetAllTasksUseCase(taskRepository);
const updateTaskUseCase = new UpdateTaskUseCase(taskRepository);
const deleteTaskUseCase = new DeleteTaskUseCase(taskRepository);
const notificationService = new NotificationService(notificationQueue);

// HTTP
const app = new Elysia()
  .use(cors())
  .use(
    swagger({
      documentation: {
        info: {
          title: "Task Management API",
          description:
            "A task management backend service built with Clean Architecture and DDD principles",
          version: "1.0.0",
        },
        tags: [{ name: "Tasks", description: "Task management endpoints" }],
      },
    })
  )
  .use(errorHandler)
  .use(
    createTaskRoutes(
      createTaskUseCase,
      getTaskByIdUseCase,
      getAllTasksUseCase,
      updateTaskUseCase,
      deleteTaskUseCase,
      notificationService
    )
  )
  .get("/", () => ({
    message: "Task Management API",
    version: "1.0.0",
  }))
  .listen(port);

// Handle process errors (including port conflicts)
process.on("uncaughtException", (error: any) => {
  if (error?.code === "EADDRINUSE") {
    const alternativePort = port === 3001 ? 3002 : 3001;
    console.error(`\n❌ Port ${port} is already in use.`);
    console.error(`\n💡 Try one of these solutions:`);
    console.error(`   1. Kill the process: kill -9 $(lsof -ti:${port})`);
    console.error(
      `   2. Use a different port: PORT=${alternativePort} bun run dev`
    );
    console.error(`   3. Check Docker: docker-compose ps`);
    console.error(`   4. Use the helper script: ./start-dev.sh\n`);
    process.exit(1);
  }
  throw error;
});

console.log(`🚀 Server starting on http://localhost:${port}`);
console.log(`📚 Swagger documentation: http://localhost:${port}/swagger`);

export default app;
