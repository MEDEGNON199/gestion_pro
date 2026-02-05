# 📦 Installation Guide

This guide will walk you through setting up TaskFlow on your local development environment.

## 📋 Prerequisites

### System Requirements
- **Node.js**: 18.0.0 or higher
- **npm**: 9.0.0 or higher (or yarn 1.22.0+)
- **PostgreSQL**: 12.0 or higher
- **Git**: Latest version

### Verify Prerequisites
```bash
node --version    # Should be 18+
npm --version     # Should be 9+
psql --version    # Should be 12+
git --version     # Any recent version
```

---

## 🗄️ Database Setup

### 1. Install PostgreSQL
**macOS (Homebrew):**
```bash
brew install postgresql
brew services start postgresql
```

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

**Windows:**
Download and install from [PostgreSQL official website](https://www.postgresql.org/download/windows/)

### 2. Create Database
```bash
# Connect to PostgreSQL
psql -U postgres

# Create database and user
CREATE DATABASE taskflow_db;
CREATE USER taskflow_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE taskflow_db TO taskflow_user;

# Exit PostgreSQL
\q
```

---

## 🔧 Backend Setup

### 1. Navigate to Backend Directory
```bash
cd taskflow-api
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
```bash
# Copy the example environment file
cp .env.example .env
```

Edit `.env` file with your configuration:
```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=taskflow_user
DB_PASSWORD=your_secure_password
DB_DATABASE=taskflow_db

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-min-32-characters
JWT_EXPIRES_IN=24h

# OAuth Configuration (Optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
OAUTH_CALLBACK_URL=http://localhost:3000/auth

# Email Configuration (Optional)
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=your-email@gmail.com
MAIL_PASS=your-app-password

# Application Configuration
NODE_ENV=development
PORT=3000
FRONTEND_URL=http://localhost:5173
```

### 4. Database Migration
```bash
# Run database migrations
npm run migration:run

# (Optional) Seed database with sample data
npm run seed
```

### 5. Start Backend Server
```bash
# Development mode with hot reload
npm run start:dev

# Production mode
npm run start:prod
```

The backend will be available at `http://localhost:3000`

---

## 🎨 Frontend Setup

### 1. Navigate to Frontend Directory
```bash
cd ../taskflow-frontend
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
```bash
# Copy the example environment file
cp .env.example .env
```

Edit `.env` file:
```env
VITE_API_URL=http://localhost:3000
VITE_WS_URL=ws://localhost:3000
VITE_APP_NAME=TaskFlow
VITE_APP_VERSION=1.0.0
```

### 4. Start Frontend Server
```bash
# Development mode with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The frontend will be available at `http://localhost:5173`

---

## 🔐 OAuth Setup (Optional)

### Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `http://localhost:3000/auth/google/callback`
6. Copy Client ID and Secret to your `.env` file

### GitHub OAuth
1. Go to GitHub Settings > Developer settings > OAuth Apps
2. Create a new OAuth App
3. Set Authorization callback URL:
   - `http://localhost:3000/auth/github/callback`
4. Copy Client ID and Secret to your `.env` file

---

## ✅ Verification

### 1. Check Backend Health
```bash
curl http://localhost:3000/health
# Should return: {"status":"ok","timestamp":"..."}
```

### 2. Check Database Connection
```bash
curl http://localhost:3000/api/auth/profile
# Should return 401 (Unauthorized) - this means the API is working
```

### 3. Check Frontend
Open `http://localhost:5173` in your browser. You should see the TaskFlow login page.

---

## 🐛 Troubleshooting

### Common Issues

**Database Connection Error:**
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```
- Ensure PostgreSQL is running: `brew services start postgresql`
- Check database credentials in `.env`
- Verify database exists: `psql -U postgres -l`

**Port Already in Use:**
```
Error: listen EADDRINUSE: address already in use :::3000
```
- Kill process using port: `lsof -ti:3000 | xargs kill -9`
- Or change port in `.env`: `PORT=3001`

**Module Not Found:**
```
Error: Cannot find module '@nestjs/core'
```
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Clear npm cache: `npm cache clean --force`

**OAuth Redirect Mismatch:**
```
Error: redirect_uri_mismatch
```
- Check OAuth callback URLs in provider settings
- Ensure URLs match exactly (including http/https)

### Getting Help

If you encounter issues:
1. Check the [Troubleshooting Guide](./TROUBLESHOOTING.md)
2. Search [GitHub Issues](https://github.com/yourusername/taskflow/issues)
3. Create a new issue with:
   - Operating system
   - Node.js version
   - Error message
   - Steps to reproduce

---

## 🎉 Next Steps

Once installation is complete:
1. Create your first account at `http://localhost:5173`
2. Explore the [User Guide](./USER_GUIDE.md)
3. Check out the [API Documentation](./API.md)
4. Learn about [Deployment](./DEPLOYMENT.md)

---

## 🔄 Updates

To update TaskFlow to the latest version:

```bash
# Pull latest changes
git pull origin main

# Update backend dependencies
cd taskflow-api
npm install
npm run migration:run

# Update frontend dependencies
cd ../taskflow-frontend
npm install

# Restart both servers
```

---

<div align="center">
  <p>🎊 Congratulations! TaskFlow is now running on your machine!</p>
</div>