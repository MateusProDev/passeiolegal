/**
 * Build-time Firebase Initialization
 * This script runs during the build process to initialize Firebase collections
 */

const admin = require('firebase-admin');
const { readFileSync } = require('fs');
const path = require('path');
const { initializeFirebaseCollections } = require('../src/lib/firebase-init.js');

async function initializeFirebaseAdmin() {
  try {
    // Try to load the service account key from environment variable or file
    const serviceAccountKey = process.env.FIREBASE_ADMIN_SDK 
      ? JSON.parse(process.env.FIREBASE_ADMIN_SDK)
      : (() => {
          try {
            const filePath = path.join(process.cwd(), 'passeiolegal-firebase-adminsdk-fbsvc-c63c5e50d2.json');
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
      return true;
    } else {
      console.warn('Firebase Admin SDK credentials not found. Admin features will be limited.');
      return false;
    }
  } catch (error) {
    console.error('Error initializing Firebase Admin:', error);
    return false;
  }
}

async function runBuildInit() {
  console.log('🔥 Running Firebase initialization during build...');
  
  try {
    // Initialize Firebase Admin first
    const adminInitialized = await initializeFirebaseAdmin();
    
    if (!adminInitialized) {
      console.log('⚠️ Firebase Admin not configured, skipping collection creation');
      console.log('   Collections will be created on first API access');
      process.exit(0);
      return;
    }

    const success = await initializeFirebaseCollections();
    
    if (success) {
      console.log('✅ Firebase collections initialized successfully during build');
    } else {
      console.log('⚠️ Firebase initialization skipped');
      console.log('   Collections will be created on first API access');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Firebase initialization failed during build:', error);
    console.log('   Continuing with build (collections will be created at runtime)');
    process.exit(0); // Don't fail the build if Firebase init fails
  }
}

runBuildInit();
