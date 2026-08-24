import admin from 'firebase-admin';
import { readFileSync } from 'fs';
import path from 'path';

// Check if we're in a server environment
if (typeof window === 'undefined') {
  try {
    // Try to load the service account key from environment variable or file
    const serviceAccountKey = process.env.FIREBASE_ADMIN_SDK 
      ? JSON.parse(process.env.FIREBASE_ADMIN_SDK)
      : (() => {
          try {
            const filePath = path.join(process.cwd(), 'passeiolegal-firebase-adminsdk-fbsvc-6edf8c6e66.json');
            const fileContent = readFileSync(filePath, 'utf8');
            return JSON.parse(fileContent);
          } catch (error) {
            console.error('Error loading service account file:', error);
            return null;
          }
        })();

    if (serviceAccountKey) {
      if (!admin.apps.length) {
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccountKey),
          projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'passeiolegal',
        });
      }
      console.log('Firebase Admin initialized successfully');
    } else {
      console.warn('Firebase Admin SDK credentials not found. Admin features will be limited.');
    }
  } catch (error) {
    console.error('Error initializing Firebase Admin:', error);
  }
}

export const adminDb = admin.apps.length ? admin.firestore() : null;
export const adminAuth = admin.apps.length ? admin.auth() : null;

export default admin;
