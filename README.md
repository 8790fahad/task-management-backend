# Task Management Backend

A task management backend service built with **Clean Architecture** and **Domain-Driven Design (DDD)** principles using Bun.js and Elysia.js.

## Architecture

The project follows Clean Architecture with clear separation of concerns:

### Domain Layer

- **Entities**: `Task` - Core business entity
- **Value Objects**: `DueDate`, `TaskStatus` - Immutable business rules
- **Repository Interfaces**: `ITaskRepository` - Abstraction for data access

### Application Layer

- **Use Cases**: Business operations (Create, Read, Update, Delete tasks)
- **Services**: `NotificationService` - Application services
- **Errors**: Domain-specific error types

### Infrastructure Layer

- **Database**: DrizzleORM with PostgreSQL
- **Repositories**: Concrete implementations of domain interfaces
- **HTTP**: Elysia.js routes and handlers
- **Queue**: Redis-based notification queue

## Tech Stack

- **Runtime**: Bun.js
- **Framework**: Elysia.js
- **Database**: PostgreSQL with DrizzleORM
- **Cache/Queue**: Redis
- **Containerization**: Docker & Docker Compose

## Features

- ✅ CRUD operations for tasks
- ✅ Task filtering by status
- ✅ Async notifications when tasks are due within 24 hours
- ✅ Input validation with Zod
- ✅ Centralized error handling
- ✅ SOLID principles implementation
- ✅ Clean Architecture / DDD structure

## API Endpoints

### 1. Create Task

```http
POST /tasks
Content-Type: application/json

{
  "title": "Complete project",
  "description": "Finish the task management backend",
  "dueDate": "2024-12-31T23:59:59Z"
}
```

### 2. Get All Tasks

```http
GET /tasks
GET /tasks?status=completed
```

### 3. Get Task by ID

```http
GET /tasks/:id
```

### 4. Update Task

```http
PUT /tasks/:id
Content-Type: application/json

{
  "title": "Updated title",
  "description": "Updated description",
  "dueDate": "2024-12-31T23:59:59Z",
  "status": "completed"
}
```

### 5. Delete Task

```http
DELETE /tasks/:id
```

## Setup

### Prerequisites

- [Bun.js](https://bun.sh/) installed
- Docker and Docker Compose installed

### Local Development

1. **Clone and install dependencies:**

   ```bash
   bun install
   ```

2. **Set up environment variables:**

   ```bash
   cp .env.example .env
   ```

3. **Start services with Docker Compose:**

   ```bash
   docker-compose up -d
   ```

4. **Run database migrations:**

   ```bash
   bun run db:migrate
   ```

5. **Start the development server:**
   ```bash
   bun run dev
   ```

The server will start on `http://localhost:3001`

### API Documentation

Swagger documentation is available at: `http://localhost:3001/swagger`

## Project Structure

```
src/
├── domain/              # Domain Layer
│   ├── entities/       # Business entities
│   ├── value-objects/  # Value objects
│   └── repositories/   # Repository interfaces
├── application/         # Application Layer
│   ├── use-cases/      # Business use cases
│   ├── services/       # Application services
│   └── errors/         # Domain errors
└── infrastructure/     # Infrastructure Layer
    ├── database/       # Database setup & repositories
    ├── queue/          # Redis queue implementation
    └── http/           # HTTP routes & handlers
```

## Async Notifications

When a task is created or updated with a `dueDate` less than 24 hours from now, the system:

1. Enqueues a notification via Redis
2. Logs the notification to console
3. Writes to `logs/notifications.log`

## Development Scripts

- `bun run dev` - Start development server
- `bun run build` - Build for production
- `bun run db:migrate` - Run database migrations
- `bun run db:generate` - Generate migration files (see note below)
- `bun run db:studio` - Open Drizzle Studio

**Note on `db:generate` and `db:studio`:** These commands have known compatibility issues with the current drizzle versions. This **does not affect your application**:

1. ✅ **`db:migrate` works perfectly** - Your migrations are already set up and working
2. ⚠️ **`db:generate`** - Only needed when changing schema (optional, has compatibility issues)
3. ⚠️ **`db:studio`** - Optional GUI tool (has compatibility issues)
4. **Your application is fully functional** - These are just optional development tools

See `DRIZZLE_NOTE.md` for more details and workarounds.

## Testing the API

Example using curl:

```bash
# Create a task
curl -X POST http://localhost:3001/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Task",
    "description": "This is a test",
    "dueDate": "2024-12-25T12:00:00Z"
  }'

# Get all tasks
curl http://localhost:3001/tasks

# Get task by ID
curl http://localhost:3001/tasks/{id}

# Update task
curl -X PUT http://localhost:3001/tasks/{id} \
  -H "Content-Type: application/json" \
  -d '{
    "status": "completed"
  }'

# Delete task
curl -X DELETE http://localhost:3001/tasks/{id}
```

## Design Principles

- **SOLID**: Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion
- **Clean Architecture**: Separation of concerns with clear boundaries
- **DDD**: Domain entities, value objects, and repositories
- **Dependency Injection**: Use cases depend on abstractions (interfaces)

## License

MIT
