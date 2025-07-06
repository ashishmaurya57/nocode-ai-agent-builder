import { initializeApp, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

let initialized = false;

export const initializeFirebase = () => {
  if (!initialized) {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    initializeApp({
      credential: cert(serviceAccount)
    });
    initialized = true;
    console.log('✅ Firebase initialized');
  }
};

// ✅ Express-compatible middleware
export const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or malformed token' });
  }

  const idToken = authHeader.split('Bearer ')[1];

  try {
    const decodedToken = await getAuth().verifyIdToken(idToken);
    req.user = decodedToken; // 👈 attach user info to request
    next();
  } catch (error) {
    console.error('❌ Error verifying token:', error.message);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};
