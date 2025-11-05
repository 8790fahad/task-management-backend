# Quick Start Guide

Get the Task Management API up and running in minutes!

## Prerequisites

- [Bun.js](https://bun.sh/) installed (version 1.0+)
- Docker and Docker Compose installed
- Git (optional)

## Step-by-Step Setup

### 1. Install Dependencies

```bash
bun install
```

### 2. Configure Environment

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` if needed (defaults should work for local development).

### 3. Start Services

Start PostgreSQL and Redis using Docker Compose:

```bash
docker-compose up -d
```

This will start:
- PostgreSQL on port `5432`
- Redis on port `6379`

Wait a few seconds for services to be healthy.

### 4. Run Database Migrations

```bash
bun run db:migrate
```

This creates the necessary database tables.

### 5. Start the Server

```bash
bun run dev
```

The server will start on `http://localhost:3000`

## Verify Installation

### Check Server Status

```bash
curl http://localhost:3000
```

Expected response:
```json
{
  "message": "Task Management API",
  "version": "1.0.0"
}
```

### Access Swagger Documentation

Open your browser and navigate to:
```
http://localhost:3000/swagger
```

You'll see the interactive API documentation with all endpoints.

### Test Creating a Task

```bash
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Task",
    "description": "This is a test task",
    "dueDate": "2024-12-25T12:00:00Z"
  }'
```

## Development Commands

| Command | Description |
|---------|-------------|
| `bun run dev` | Start development server |
| `bun run build` | Build for production |
| `bun run db:migrate` | Run database migrations |
| `bun run db:generate` | Generate migration files |
| `bun run db:studio` | Open Drizzle Studio (database GUI) |

## Docker Commands

| Command | Description |
|---------|-------------|
| `docker-compose up -d` | Start all services in background |
| `docker-compose down` | Stop all services |
| `docker-compose logs -f` | View logs |
| `docker-compose ps` | Check service status |

## Troubleshooting

### Port Already in Use

If port 3000 is already in use, change it in `.env`:
```
PORT=3001
```

### Database Connection Error

1. Ensure Docker services are running: `docker-compose ps`
2. Check database logs: `docker-compose logs postgres`
3. Verify DATABASE_URL in `.env` matches docker-compose.yml

### Redis Connection Error

1. Check Redis is running: `docker-compose ps redis`
2. Verify REDIS_URL in `.env`
3. The app will still work without Redis (notifications will only log to file)

### Migration Errors

If migrations fail:
1. Ensure database is running and healthy
2. Check DATABASE_URL is correct
3. Try: `bun run db:generate` then `bun run db:migrate`

## Next Steps

- Read the [API Documentation](./API_DOCUMENTATION.md) for detailed endpoint information
- Check the [README](./README.md) for architecture details
- Explore the Swagger UI at `http://localhost:3000/swagger`

## Production Deployment

For production:

1. Build the application:
   ```bash
   bun run build
   ```

2. Update environment variables for production

3. Use the Dockerfile:
   ```bash
   docker build -t task-management-api .
   docker run -p 3000:3000 task-management-api
   ```

Or use docker-compose in production mode with proper environment variables.

## Support

For issues or questions, refer to:
- [API Documentation](./API_DOCUMENTATION.md)
- [README](./README.md)
- Project repository

