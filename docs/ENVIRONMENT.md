# 🔧 Environment Variables Guide

This guide covers all environment variables used in TaskFlow for both development and production environments.

## 📋 Overview

TaskFlow uses environment variables to configure:
- Database connections
- Authentication settings
- OAuth providers
- Email services
- Application settings
- Third-party integrations

---

## 🗄️ Backend Environment Variables

### Database Configuration

#### PostgreSQL Connection
```env
# Individual connection parameters (Development)
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=taskflow_user
DB_PASSWORD=your_secure_password
DB_DATABASE=taskflow_db

# Or use connection URL (Production - Recommended)
DATABASE_URL=postgresql://username:password@hostname:port/database
```

**Notes:**
- Use `DATABASE_URL` for production (Render, Heroku, etc.)
- Individual parameters for local development
- Ensure database exists before starting the application

### JWT Authentication
```env
JWT_SECRET=your-super-secure-jwt-secret-key-minimum-32-characters
JWT_EXPIRES_IN=24h
```

**Requirements:**
- `JWT_SECRET` must be at least 32 characters
- Use a cryptographically secure random string
- `JWT_EXPIRES_IN` accepts: `60s`, `5m`, `1h`, `1d`, `7d`

**Generate secure JWT secret:**
```bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Using OpenSSL
openssl rand -hex 32
```

### OAuth Configuration

#### Google OAuth
```env
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

**Setup:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create OAuth 2.0 credentials
3. Add authorized redirect URIs:
   - Development: `http://localhost:3000/auth/google/callback`
   - Production: `https://your-domain.com/auth/google/callback`

#### GitHub OAuth
```env
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
```

**Setup:**
1. Go to GitHub Settings > Developer settings > OAuth Apps
2. Create new OAuth App
3. Set Authorization callback URL:
   - Development: `http://localhost:3000/auth/github/callback`
   - Production: `https://your-domain.com/auth/github/callback`

#### OAuth Callback URL
```env
OAUTH_CALLBACK_URL=http://localhost:3000/auth
```

**Notes:**
- Base URL for OAuth callbacks
- Must match your domain in production
- Used by OAuth strategies to construct redirect URLs

### Email Configuration

#### SMTP Settings
```env
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=your-email@gmail.com
MAIL_PASS=your-app-password
MAIL_FROM=noreply@taskflow.com
```

**Gmail Setup:**
1. Enable 2-factor authentication
2. Generate app password
3. Use app password (not your regular password)

**Other Providers:**
- **SendGrid**: `smtp.sendgrid.net:587`
- **Mailgun**: `smtp.mailgun.org:587`
- **AWS SES**: `email-smtp.region.amazonaws.com:587`

### Application Settings
```env
NODE_ENV=development
PORT=3000
FRONTEND_URL=http://localhost:5173
```

**NODE_ENV Options:**
- `development` - Development mode with detailed logging
- `production` - Production mode with optimizations
- `test` - Testing mode

### CORS Configuration
```env
CORS_ORIGIN=http://localhost:5173,https://your-frontend-domain.com
```

**Notes:**
- Comma-separated list of allowed origins
- Use `*` for development only (security risk in production)
- Must include your frontend domain

---

## 🎨 Frontend Environment Variables

### API Configuration
```env
VITE_API_URL=http://localhost:3000
VITE_WS_URL=ws://localhost:3000
```

**Production:**
```env
VITE_API_URL=https://your-api-domain.onrender.com
VITE_WS_URL=wss://your-api-domain.onrender.com
```

### Application Settings
```env
VITE_APP_NAME=TaskFlow
VITE_APP_VERSION=1.0.0
VITE_APP_DESCRIPTION=Modern Project Management Platform
```

### Feature Flags
```env
VITE_ENABLE_ANALYTICS=true
VITE_ENABLE_NOTIFICATIONS=true
VITE_ENABLE_DARK_MODE=true
```

### Third-party Services
```env
VITE_GOOGLE_ANALYTICS_ID=GA_MEASUREMENT_ID
VITE_SENTRY_DSN=https://your-sentry-dsn
```

---

## 📁 Environment Files

### File Structure
```
taskflow-api/
├── .env                 # Development environment
├── .env.example         # Template file
├── .env.production      # Production overrides
└── .env.test           # Testing environment

taskflow-frontend/
├── .env                 # Development environment
├── .env.example         # Template file
├── .env.production      # Production overrides
└── .env.local          # Local overrides (gitignored)
```

### Loading Priority
1. `.env.local` (highest priority)
2. `.env.production` (if NODE_ENV=production)
3. `.env`
4. `.env.example` (lowest priority)

---

## 🔒 Security Best Practices

### Secret Management
- **Never commit secrets** to version control
- Use **strong, unique passwords** for each environment
- **Rotate secrets** regularly
- Use **environment-specific secrets**

### Production Security
```env
# Use secure random strings
JWT_SECRET=cryptographically-secure-random-string-32-chars-min

# Use strong database passwords
DB_PASSWORD=complex-password-with-symbols-123!@#

# Restrict CORS origins
CORS_ORIGIN=https://your-production-domain.com

# Use HTTPS URLs
FRONTEND_URL=https://your-frontend-domain.com
```

### Development vs Production
| Setting | Development | Production |
|---------|-------------|------------|
| JWT_SECRET | Simple string | Cryptographically secure |
| CORS_ORIGIN | `*` or localhost | Specific domains |
| NODE_ENV | development | production |
| Database | Local PostgreSQL | Managed database |
| URLs | http://localhost | https://domain.com |

---

## 🚀 Platform-Specific Configuration

### Render
```env
# Render automatically provides
PORT=10000
DATABASE_URL=postgresql://...

# You need to set
JWT_SECRET=your-secret
GOOGLE_CLIENT_ID=your-id
GOOGLE_CLIENT_SECRET=your-secret
FRONTEND_URL=https://your-frontend.onrender.com
```

### Heroku
```env
# Heroku automatically provides
PORT=dynamic
DATABASE_URL=postgresql://...

# You need to set
JWT_SECRET=your-secret
NODE_ENV=production
```

### Vercel (Frontend)
```env
VITE_API_URL=https://your-api-domain.com
VITE_WS_URL=wss://your-api-domain.com
```

### Railway
```env
# Railway automatically provides
PORT=dynamic
DATABASE_URL=postgresql://...

# Similar to Render configuration
```

---

## 🧪 Testing Environment

### Test Database
```env
# Use separate test database
DB_DATABASE=taskflow_test
# Or
DATABASE_URL=postgresql://user:pass@localhost:5432/taskflow_test
```

### Test Configuration
```env
NODE_ENV=test
JWT_SECRET=test-secret-for-testing-only
MAIL_HOST=ethereal.email  # For testing emails
```

---

## 🔍 Validation and Debugging

### Environment Validation
The application validates required environment variables on startup:

```typescript
// Backend validation
const requiredEnvVars = [
  'JWT_SECRET',
  'DB_HOST',
  'DB_USERNAME',
  'DB_PASSWORD',
  'DB_DATABASE'
];

requiredEnvVars.forEach(envVar => {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
});
```

### Debug Environment Issues
```bash
# Check if variables are loaded
node -e "console.log(process.env.JWT_SECRET)"

# Verify database connection
npm run db:check

# Test email configuration
npm run test:email
```

---

## 📝 Environment Templates

### Backend .env.example
```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=taskflow_user
DB_PASSWORD=your_password
DB_DATABASE=taskflow_db

# JWT
JWT_SECRET=your-super-secure-jwt-secret-key-minimum-32-characters
JWT_EXPIRES_IN=24h

# OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
OAUTH_CALLBACK_URL=http://localhost:3000/auth

# Email
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=your-email@gmail.com
MAIL_PASS=your-app-password

# Application
NODE_ENV=development
PORT=3000
FRONTEND_URL=http://localhost:5173
```

### Frontend .env.example
```env
# API Configuration
VITE_API_URL=http://localhost:3000
VITE_WS_URL=ws://localhost:3000

# Application
VITE_APP_NAME=TaskFlow
VITE_APP_VERSION=1.0.0

# Features
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_NOTIFICATIONS=true
```

---

## 🆘 Troubleshooting

### Common Issues

**Database Connection Failed:**
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```
- Check `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`
- Ensure PostgreSQL is running
- Verify database exists

**JWT Secret Too Short:**
```
Error: JWT secret must be at least 32 characters
```
- Generate longer JWT secret
- Use cryptographically secure random string

**OAuth Redirect Mismatch:**
```
Error: redirect_uri_mismatch
```
- Check `OAUTH_CALLBACK_URL` matches provider settings
- Ensure exact URL match (including http/https)

**CORS Errors:**
```
Access to fetch blocked by CORS policy
```
- Check `CORS_ORIGIN` includes frontend URL
- Verify `FRONTEND_URL` is correct

---

<div align="center">
  <p>🔧 Need help with environment configuration?</p>
  <p>Check our <a href="./TROUBLESHOOTING.md">Troubleshooting Guide</a> or <a href="https://discord.gg/taskflow">join our Discord</a></p>
</div>