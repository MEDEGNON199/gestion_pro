# 🔧 Troubleshooting Guide

Common issues and solutions for TaskFlow deployment and operation.

## 🐳 Docker Issues

### Container Won't Start

**Problem**: Container exits immediately or fails to start
```bash
Error: Container taskflow-backend exited with code 1
```

**Solutions**:
1. **Check logs**:
   ```bash
   docker-compose logs backend
   docker-compose logs frontend
   docker-compose logs postgres
   ```

2. **Verify environment variables**:
   ```bash
   # Check if .env file exists and has correct values
   cat .env
   
   # Verify required variables are set
   docker-compose config
   ```

3. **Check port conflicts**:
   ```bash
   # Find processes using ports
   netstat -tulpn | grep :3000
   netstat -tulpn | grep :5173
   netstat -tulpn | grep :5432
   
   # Kill conflicting processes
   sudo kill -9 <PID>
   ```

### Database Connection Issues

**Problem**: Backend can't connect to PostgreSQL
```bash
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**Solutions**:
1. **Wait for database to be ready**:
   ```bash
   # Check database health
   docker-compose exec postgres pg_isready -U postgres
   
   # Wait for healthy status
   docker-compose ps
   ```

2. **Check database credentials**:
   ```bash
   # Verify environment variables
   docker-compose exec backend env | grep DB_
   
   # Test connection manually
   docker-compose exec postgres psql -U postgres -d taskflow_db
   ```

3. **Reset database**:
   ```bash
   # Stop and remove volumes
   docker-compose down -v
   
   # Start fresh
   docker-compose up -d
   ```

### Build Failures

**Problem**: Docker build fails during npm install
```bash
Error: npm ERR! network timeout
```

**Solutions**:
1. **Clear Docker cache**:
   ```bash
   # Remove all unused containers, networks, images
   docker system prune -a
   
   # Rebuild without cache
   docker-compose build --no-cache
   ```

2. **Check n