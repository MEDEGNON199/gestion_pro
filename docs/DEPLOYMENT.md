# 🚀 Deployment Guide

This guide covers deploying TaskFlow to production environments, with detailed instructions for Render (recommended) and other popular platforms.

## 🌟 Render Deployment (Recommended)

Render provides the easiest deployment experience with automatic builds, PostgreSQL integration, and SSL certificates.

### 📋 Prerequisites
- GitHub account with your TaskFlow repository
- Render account (free tier available)

---

## 🗄️ Database Deployment

### 1. Create PostgreSQL Database
1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"PostgreSQL"**
3. Configure database:
   - **Name**: `taskflow-db`
   - **Database**: `taskflow_db`
   - **User**: `taskflow_user`
   - **Region**: Choose closest to your users
   - **Plan**: Free (for testing) or Starter ($7/month)
4. Click **"Create Database"**
5. **Save the connection details** - you'll need them for the backend

---

## 🔧 Backend Deployment

### 1. Create Web Service
1. In Render Dashboard, click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Configure service:
   - **Name**: `taskflow-api`
   - **Environment**: `Node`
   - **Region**: Same as database
   - **Branch**: `main`
   - **Root Directory**: `taskflow-api`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start:prod`

### 2. Environment Variables
Add these environment variables in Render:

```env
# Database (use your Render PostgreSQL connection string)
DATABASE_URL=postgresql://taskflow_user:password@hostname:5432/taskflow_db

# JWT Configuration
JWT_SECRET=your-super-secure-jwt-secret-min-32-characters
JWT_EXPIRES_IN=24h

# OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
OAUTH_CALLBACK_URL=https://your-api-domain.onrender.com/auth

# Email Configuration
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=your-email@gmail.com
MAIL_PASS=your-app-password

# Application Configuration
NODE_ENV=production
PORT=3000
FRONTEND_URL=https://your-frontend-domain.onrender.com
```

### 3. Deploy Backend
1. Click **"Create Web Service"**
2. Wait for deployment to complete (5-10 minutes)
3. Your API will be available at `https://your-api-name.onrender.com`

---

## 🎨 Frontend Deployment

### 1. Create Static Site
1. In Render Dashboard, click **"New +"** → **"Static Site"**
2. Connect your GitHub repository
3. Configure site:
   - **Name**: `taskflow-frontend`
   - **Branch**: `main`
   - **Root Directory**: `taskflow-frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`

### 2. Environment Variables
Add these environment variables:

```env
VITE_API_URL=https://your-api-name.onrender.com
VITE_WS_URL=wss://your-api-name.onrender.com
VITE_APP_NAME=TaskFlow
VITE_APP_VERSION=1.0.0
```

### 3. Deploy Frontend
1. Click **"Create Static Site"**
2. Wait for deployment to complete (3-5 minutes)
3. Your app will be available at `https://your-frontend-name.onrender.com`

---

## 🔐 OAuth Configuration for Production

### Update OAuth Redirect URLs

**Google OAuth:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to your OAuth credentials
3. Add production redirect URI:
   - `https://your-api-name.onrender.com/auth/google/callback`

**GitHub OAuth:**
1. Go to GitHub Settings > Developer settings > OAuth Apps
2. Edit your OAuth App
3. Update Authorization callback URL:
   - `https://your-api-name.onrender.com/auth/github/callback`

---

## 🔄 Automatic Deployments

### Enable Auto-Deploy
1. In your Render services, go to **Settings**
2. Enable **"Auto-Deploy"**
3. Choose **"Yes"** for auto-deploy on push to main branch

Now every push to your main branch will automatically deploy!

---

## 🌐 Custom Domain (Optional)

### 1. Add Custom Domain
1. In Render service settings, go to **"Custom Domains"**
2. Add your domain (e.g., `app.yourdomain.com`)
3. Update your DNS records as instructed

### 2. Update Environment Variables
Update `FRONTEND_URL` and `OAUTH_CALLBACK_URL` to use your custom domain.

---

## 📊 Monitoring & Logs

### View Logs
1. Go to your service in Render Dashboard
2. Click **"Logs"** tab to view real-time logs
3. Use filters to find specific issues

### Health Checks
Render automatically monitors your services. You can also set up custom health checks:

```typescript
// In your NestJS app
@Get('health')
healthCheck() {
  return { status: 'ok', timestamp: new Date().toISOString() };
}
```

---

## 🔧 Alternative Deployment Options

### Vercel + Railway

**Frontend (Vercel):**
1. Connect GitHub to Vercel
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Add environment variables

**Backend (Railway):**
1. Connect GitHub to Railway
2. Add PostgreSQL database
3. Set environment variables
4. Deploy from `taskflow-api` directory

### Netlify + Heroku

**Frontend (Netlify):**
1. Connect GitHub to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables

**Backend (Heroku):**
1. Create Heroku app
2. Add Heroku PostgreSQL addon
3. Set environment variables
4. Deploy with Git

---

## 🐳 Docker Deployment

### 1. Create Dockerfiles

**Backend Dockerfile:**
```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "run", "start:prod"]
```

**Frontend Dockerfile:**
```dockerfile
FROM node:18-alpine as builder

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### 2. Docker Compose
```yaml
version: '3.8'
services:
  database:
    image: postgres:15
    environment:
      POSTGRES_DB: taskflow_db
      POSTGRES_USER: taskflow_user
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data

  backend:
    build: ./taskflow-api
    environment:
      DATABASE_URL: postgresql://taskflow_user:password@database:5432/taskflow_db
      JWT_SECRET: your-jwt-secret
    depends_on:
      - database

  frontend:
    build: ./taskflow-frontend
    ports:
      - "80:80"
    depends_on:
      - backend

volumes:
  postgres_data:
```

---

## 🔍 Performance Optimization

### Backend Optimizations
- Enable gzip compression
- Use Redis for caching
- Optimize database queries
- Enable connection pooling

### Frontend Optimizations
- Enable code splitting
- Optimize images
- Use CDN for static assets
- Enable service worker

---

## 🚨 Security Checklist

- [ ] Use HTTPS in production
- [ ] Set secure JWT secret (32+ characters)
- [ ] Enable CORS with specific origins
- [ ] Use environment variables for secrets
- [ ] Enable rate limiting
- [ ] Set up proper error handling
- [ ] Use secure headers
- [ ] Regular security updates

---

## 📈 Scaling

### Horizontal Scaling
- Use load balancers
- Deploy multiple instances
- Use Redis for session storage
- Implement database read replicas

### Vertical Scaling
- Upgrade server resources
- Optimize database performance
- Use caching strategies
- Monitor resource usage

---

## 🆘 Troubleshooting

### Common Deployment Issues

**Build Failures:**
- Check Node.js version compatibility
- Verify all dependencies are in package.json
- Check for TypeScript errors

**Database Connection Issues:**
- Verify DATABASE_URL format
- Check network connectivity
- Ensure database is running

**OAuth Issues:**
- Verify redirect URLs match exactly
- Check client ID and secret
- Ensure HTTPS in production

### Getting Help
- Check Render logs for specific errors
- Review [Render documentation](https://render.com/docs)
- Contact support if needed

---

## 🎉 Post-Deployment

After successful deployment:
1. Test all functionality
2. Set up monitoring and alerts
3. Configure backups
4. Document your deployment process
5. Set up CI/CD pipeline

---

<div align="center">
  <p>🚀 Congratulations! TaskFlow is now live in production!</p>
  <p>Share your deployment with the world! 🌍</p>
</div>