# 🐳 Docker & Firebase Setup Guide

## Overview

This project now supports:
- ✅ **Firebase** for authentication and database (replacing MongoDB)
- ✅ **Docker** for containerized deployment
- ✅ **Docker Compose** for orchestrating frontend, backend, and Firebase emulator

## Why Firebase + Docker?

### Benefits of Firebase:
- ✅ No MongoDB setup needed
- ✅ Built-in authentication (email/password, social login, etc.)
- ✅ Real-time Firestore database
- ✅ Scalable without DevOps
- ✅ Free tier: 50k reads, 20k writes, 20k deletes per day
- ✅ File storage included

### Benefits of Docker:
- ✅ Same environment everywhere (dev, test, prod)
- ✅ Easy deployment to cloud (AWS, GCP, Azure, Heroku, etc.)
- ✅ One command setup: `docker-compose up`
- ✅ Automatic service management
- ✅ Isolated services don't conflict

---

## 🚀 Quick Start with Docker

### Prerequisites
- Docker installed: https://www.docker.com/products/docker-desktop
- Docker Compose (included with Docker Desktop)

### Option A: Use Firebase Emulator (Local, No Account Needed)

```bash
# Clone the project
git clone https://github.com/AKHILTHADAKA97/Online-Application-Registration-Portal.git
cd Online-Application-Registration-Portal

# Start all services with one command
docker-compose up

# Wait for services to be ready (2-3 minutes)
# Open browser to http://localhost:3000
```

### Option B: Use Firebase Production (Own Firebase Account)

1. **Create Firebase Project:**
   - Go to https://console.firebase.google.com
   - Create new project
   - Enable Authentication (Email/Password)
   - Create Firestore Database (production mode)

2. **Create Service Account Key:**
   - Firebase Console → Project Settings → Service Accounts
   - Generate new private key
   - Download JSON file
   - Rename to `firebase-key.json`
   - Place in project root

3. **Update Environment:**
   ```bash
   # Edit docker-compose.yml or backend/.env
   USE_FIREBASE_EMULATOR=false
   # Add your Firebase config from .env file
   ```

4. **Start Docker:**
   ```bash
   docker-compose up
   ```

---

## 📁 Docker Files

### `Dockerfile.frontend`
- Builds React app in Node 18 Alpine image
- Exposes port 3000
- Hot-reload enabled via volumes

### `Dockerfile.backend`
- Builds Express server in Node 18 Alpine image
- Exposes port 5000
- Connected to Firebase or Firebase Emulator

### `docker-compose.yml`
- **frontend** service: React on port 3000
- **backend** service: Express on port 5000
- **firebase-emulator** service: Local Firebase simulation on ports 4000, 8080, 9099
- All services on shared network for inter-service communication

---

## 🔧 Configuration

### Backend Environment Variables

**For Firebase Emulator (Local Development):**
```env
USE_FIREBASE_EMULATOR=true
FIREBASE_PROJECT_ID=registration-portal-demo
PORT=5000
JWT_SECRET=your-secret-key-12345
NODE_ENV=development
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin123
```

**For Firebase Production:**
```env
USE_FIREBASE_EMULATOR=false
GOOGLE_APPLICATION_CREDENTIALS=/app/firebase-key.json
# + all Firebase config from firebase-key.json
```

### Frontend Environment Variables
```env
REACT_APP_API_URL=http://localhost:5000/api
```

---

## 📖 Using Docker

### Start All Services
```bash
docker-compose up
```

### Start in Background
```bash
docker-compose up -d
```

### View Logs
```bash
docker-compose logs -f frontend  # Frontend logs
docker-compose logs -f backend   # Backend logs
docker-compose logs -f firebase-emulator  # Firebase logs
```

### Stop Services
```bash
docker-compose down
```

### Rebuild Images
```bash
docker-compose up --build
```

### Remove All Data
```bash
docker-compose down -v
```

---

## 🎯 Access Points

| Service | URL | Purpose |
|---------|-----|---------|
| Frontend | http://localhost:3000 | React App |
| Backend API | http://localhost:5000/api | REST API |
| Health Check | http://localhost:5000/health | Server Status |
| Firebase Emulator UI | http://localhost:4000 | View data |
| Firestore | localhost:8080 | Database |
| Auth Emulator | localhost:9099 | Authentication |

---

## 🔐 Admin Login

### Default Credentials (Firebase Emulator):
- Email: `admin@example.com`
- Password: `admin123`

### Steps:
1. Go to http://localhost:3000
2. Click "Register"
3. Use email `admin@example.com`
4. Click "Register"
5. You'll get Admin button in header
6. Click "🔧 Admin" to access admin dashboard

---

## 📊 Firebase Emulator UI

The Firebase Emulator provides a UI to manage data locally:

1. Open http://localhost:4000
2. You can:
   - Browse Firestore database
   - View Authentication users
   - Manage Realtime Database
   - Monitor usage

---

## 🚢 Deployment

### Deploy to Docker Container Registry

```bash
# Build images
docker build -f Dockerfile.frontend -t myapp-frontend:1.0 .
docker build -f Dockerfile.backend -t myapp-backend:1.0 .

# Push to Docker Hub / AWS ECR / Google Container Registry
docker push myapp-frontend:1.0
docker push myapp-backend:1.0
```

### Deploy to Cloud Platforms

#### AWS (Elastic Container Service)
```bash
# Push to ECR
aws ecr get-login-password | docker login --username AWS --password-stdin [account-id].dkr.ecr.[region].amazonaws.com
docker tag myapp-backend:1.0 [account-id].dkr.ecr.[region].amazonaws.com/myapp-backend:1.0
docker push [account-id].dkr.ecr.[region].amazonaws.com/myapp-backend:1.0

# Deploy with ECS task definition
```

#### Google Cloud (Cloud Run)
```bash
# Build and push
docker build -f Dockerfile.backend -t gcr.io/[project-id]/myapp-backend:1.0 .
docker push gcr.io/[project-id]/myapp-backend:1.0

# Deploy
gcloud run deploy myapp-backend --image gcr.io/[project-id]/myapp-backend:1.0
```

#### Heroku
```bash
# Create heroku.yml
# Push container to Heroku
heroku container:login
heroku container:push web --app myapp-backend
heroku container:release web --app myapp-backend
```

---

## 🐛 Troubleshooting

### "Cannot connect to Docker daemon"
```bash
# Make sure Docker is running
# macOS: Click Docker icon in taskbar
# Windows: Start Docker Desktop
# Ubuntu: sudo systemctl start docker
```

### "Port already in use"
```bash
# Change port in docker-compose.yml
ports:
  - "3001:3000"  # Changed from 3000:3000
```

### "Firebase Emulator not starting"
```bash
# Check if port 4000 is available
# Or wait longer for startup (30 seconds)
docker-compose logs firebase-emulator
```

### "API connection refused"
```bash
# Ensure backend is ready before frontend makes requests
# Check logs: docker-compose logs backend
# Wait 10 seconds after startup before making API calls
```

---

## 📚 File Structure with Docker

```
project/
├── docker-compose.yml          # Orchestration
├── Dockerfile.frontend         # React app container
├── Dockerfile.backend          # Express server container
├── backend/
│   ├── config/
│   │   └── firebase.js        # Firebase configuration
│   ├── routes/
│   │   ├── auth.js            # Updated for Firebase
│   │   └── admin.js           # Updated for Firebase
│   ├── models/
│   │   └── FirebaseUser.js    # Firebase operations
│   └── .env                   # Backend config
├── src/                       # React frontend
└── firebase-key.json          # (If using production Firebase)
```

---

## ✅ Checklist

- [ ] Docker installed and running
- [ ] Clone project
- [ ] Run `docker-compose up`
- [ ] Wait for "Server running on port 5000"
- [ ] Open http://localhost:3000
- [ ] Register with admin@example.com
- [ ] Access admin dashboard

---

## 🎓 Next Steps

1. **Customize Firebase Settings:**
   - Edit `backend/config/firebase.js`
   - Add production Firebase config

2. **Add More Routes:**
   - Create new route files in `backend/routes/`
   - Import in `backend/server.js`

3. **Extend Admin Dashboard:**
   - Add charts with Chart.js
   - Real-time notifications
   - Advanced analytics

4. **Production Deployment:**
   - Use Firebase Production
   - Deploy containers to cloud
   - Set up CI/CD pipeline

---

## 📞 Support

For issues:
1. Check Docker logs: `docker-compose logs -f`
2. Ensure all ports are available
3. Make sure Docker has enough resources (2GB+ RAM)
4. Restart Docker daemon if stuck: `docker-compose down && docker-compose up`

---

**You're ready to go! 🚀** Just run `docker-compose up` and visit http://localhost:3000
