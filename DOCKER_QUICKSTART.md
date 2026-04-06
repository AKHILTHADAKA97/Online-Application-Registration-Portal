# 🐳 Docker Quick Start

## 1️⃣ One Command Setup

```bash
docker-compose up
```

That's it! Everything will start automatically:
- ✅ Frontend on http://localhost:3000
- ✅ Backend on http://localhost:5000
- ✅ Firebase Emulator for local development
- ✅ All services connected and ready

## 2️⃣ Register & Login

1. Open http://localhost:3000
2. Click "Register"
3. Use email: `admin@example.com`
4. Password: `admin123`
5. Click "🔧 Admin" button to access admin dashboard

## 3️⃣ View Firebase Data (Optional)

Open http://localhost:4000 to see:
- User accounts created
- Firestore database
- Authentication logs
- Real-time updates

## 4️⃣ Stop Services

```bash
# Stop and remove containers
docker-compose down

# Keep data (don't remove volumes)
docker-compose down (keeps database)

# Remove everything including data
docker-compose down -v
```

## 5️⃣ View Logs

```bash
# All logs
docker-compose logs -f

# Just backend
docker-compose logs -f backend

# Just frontend
docker-compose logs -f frontend
```

---

## 🔄 Rebuild After Code Changes

```bash
# Rebuild images and restart
docker-compose up --build

# Or rebuild specific service
docker-compose build backend && docker-compose up
```

---

## 📊 What's Running?

| Service | Port | Status |
|---------|------|--------|
| Frontend | 3000 | ✅ Ready |
| Backend | 5000 | ✅ Ready |
| Firebase Emulator | 4000 | ✅ Ready |
| Firestore DB | 8080 | ✅ Ready |
| Auth Emulator | 9099 | ✅ Ready |

---

## 🎯 No MongoDB Setup Needed!

✅ Docker handles everything
✅ Firebase Emulator built-in
✅ Works without Firebase account
✅ Same environment for all developers
✅ Ready for cloud deployment

---

## 📚 More Details

For full Firebase & Docker documentation, see [DOCKER_FIREBASE_GUIDE.md](DOCKER_FIREBASE_GUIDE.md)

---

**That's all! Happy coding! 🚀**
