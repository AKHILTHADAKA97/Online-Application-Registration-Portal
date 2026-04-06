// Firebase Admin SDK configuration
const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Check if using emulator or production
const useEmulator = process.env.USE_FIREBASE_EMULATOR === 'true';

if (useEmulator) {
  // Use Firebase Emulator (for local development with Docker)
  process.env.FIREBASE_AUTH_EMULATOR_HOST = 'localhost:9099';
  process.env.FIRESTORE_EMULATOR_HOST = 'localhost:8080';
  
  admin.initializeApp({
    projectId: 'registration-portal-demo',
  });
  
  console.log('✅ Using Firebase Emulator (local development)');
} else {
  // Use Firebase Production (requires service account key)
  const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS || 
    path.join(__dirname, '../firebase-key.json');
  
  if (!fs.existsSync(serviceAccountPath)) {
    console.warn('⚠️ firebase-key.json not found. Firebase will not work in production mode.');
    console.log('📝 Please add GOOGLE_APPLICATION_CREDENTIALS environment variable or firebase-key.json');
    
    // Initialize with dummy config for development
    admin.initializeApp({
      projectId: 'registration-portal-demo',
    });
  } else {
    const serviceAccount = require(serviceAccountPath);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`
    });
    console.log('✅ Firebase initialized with service account');
  }
}

const db = admin.firestore();
const auth = admin.auth();

module.exports = {
  admin,
  db,
  auth,
  useEmulator
};
