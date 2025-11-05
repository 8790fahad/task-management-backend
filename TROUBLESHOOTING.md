# Troubleshooting Guide

## Port 3001 Already in Use

If you see the error `EADDRINUSE` or "Port 3001 is already in use", try these solutions:

### Solution 1: Find and Kill the Process

**macOS/Linux:**
```bash
# Find what's using port 3001
lsof -ti:3001

# Kill the process (replace PID with the number from above)
kill -9 PID

# Or in one command:
kill -9 $(lsof -ti:3001)
```

**Alternative:**
```bash
# Using netstat
netstat -vanp tcp | grep 3001

# Kill using pkill
pkill -f "bun\|node\|elysia"
```

### Solution 2: Use a Different Port

```bash
# Set PORT environment variable
PORT=3001 bun run dev

# Or create/update .env file
echo "PORT=3001" >> .env
bun run dev
```

### Solution 3: Stop Docker Containers

If you're running the app in Docker, stop it:

```bash
# Stop all containers
docker-compose down

# Or stop just the app container
docker-compose stop app
```

### Solution 4: Check for Zombie Processes

Sometimes processes don't exit cleanly:

```bash
# List all bun/node processes
ps aux | grep -E "bun|node" | grep -v grep

# Kill specific processes
kill -9 <PID>
```

## Database Connection Issues

### Error: "Cannot connect to database"

1. **Check if PostgreSQL is running:**
   ```bash
   docker-compose ps postgres
   ```

2. **Check database logs:**
   ```bash
   docker-compose logs postgres
   ```

3. **Verify DATABASE_URL in .env:**
   ```bash
   cat .env | grep DATABASE_URL
   ```

4. **Restart PostgreSQL:**
   ```bash
   docker-compose restart postgres
   ```

## Redis Connection Issues

### Error: "Redis connection failed"

The app will still work without Redis - notifications will only log to file.

1. **Check if Redis is running:**
   ```bash
   docker-compose ps redis
   ```

2. **Test Redis connection:**
   ```bash
   docker-compose exec redis redis-cli ping
   # Should return: PONG
   ```

3. **Restart Redis:**
   ```bash
   docker-compose restart redis
   ```

## Migration Issues

### Error: "Migration failed"

1. **Ensure database is running:**
   ```bash
   docker-compose ps postgres
   ```

2. **Check database connection:**
   ```bash
   docker-compose exec postgres psql -U user -d taskdb -c "SELECT 1;"
   ```

3. **Run migrations manually:**
   ```bash
   bun run db:migrate
   ```

4. **If migrations are corrupted, reset:**
   ```bash
   # ⚠️ WARNING: This will delete all data
   docker-compose down -v
   docker-compose up -d postgres
   sleep 5
   bun run db:migrate
   ```

## Build Issues

### Docker Build Fails

1. **Clear Docker cache:**
   ```bash
   docker-compose build --no-cache
   ```

2. **Check Docker logs:**
   ```bash
   docker-compose logs app
   ```

3. **Rebuild from scratch:**
   ```bash
   docker-compose down
   docker-compose build
   docker-compose up -d
   ```

## Module Not Found Errors

### Error: "Cannot find module"

1. **Reinstall dependencies:**
   ```bash
   rm -rf node_modules
   bun install
   ```

2. **Clear Bun cache:**
   ```bash
   bun pm cache rm
   bun install
   ```

## TypeScript Errors

### Error: "Cannot find type definitions"

These are expected before installing dependencies. After running `bun install`, they should resolve.

If they persist:

1. **Check tsconfig.json:**
   Ensure `types: ["bun-types", "node"]` is set

2. **Reinstall dev dependencies:**
   ```bash
   bun install --dev
   ```

## Common Issues Quick Reference

| Issue | Quick Fix |
|-------|-----------|
| Port in use | `PORT=3001 bun run dev` or `kill -9 $(lsof -ti:3001)` |
| Database connection | `docker-compose restart postgres` |
| Redis connection | App works without Redis (logs to file only) |
| Migration errors | `bun run db:migrate` |
| Module not found | `rm -rf node_modules && bun install` |
| Docker build fails | `docker-compose build --no-cache` |

## Getting Help

1. Check the logs:
   ```bash
   docker-compose logs -f
   ```

2. Check application logs:
   ```bash
   tail -f logs/notifications.log
   ```

3. Verify environment:
   ```bash
   cat .env
   ```

4. Test database:
   ```bash
   docker-compose exec postgres psql -U user -d taskdb
   ```

## Still Having Issues?

1. Ensure all prerequisites are installed
2. Check that Docker is running
3. Verify environment variables are correct
4. Review the [Quick Start Guide](./QUICK_START.md)
5. Check the [README](./README.md) for architecture details

