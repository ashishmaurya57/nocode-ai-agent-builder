import admin from 'firebase-admin';
import serviceAccount from './serviceAccountKey.json' assert { type: 'json' };

export function initializeFirebase() {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
  }
}
