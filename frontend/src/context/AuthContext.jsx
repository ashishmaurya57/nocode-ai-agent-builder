import { createContext, useContext, useEffect, useState } from 'react';
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut
} from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        const token = await user.getIdToken(); // ✅ Gets Firebase ID token
        localStorage.setItem('token', token);
      } else {
        localStorage.removeItem('token');
      }
      setLoading(false);
    });

    return () => unsubscribe(); // ✅ Cleanup function
  }, []);

  const login = async (email, password) => {
    const auth = getAuth();
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const token = await userCredential.user.getIdToken();
    localStorage.setItem('token', token);
    return userCredential; // ✅ Return for usage
  };

  const register = async (email, password) => {
    const auth = getAuth();
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const token = await userCredential.user.getIdToken();
    localStorage.setItem('token', token);
    return userCredential; // ✅ Return for usage
  };

  const logout = async () => {
    const auth = getAuth();
    await signOut(auth);
    localStorage.removeItem('token');
  };

  const value = {
    currentUser,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
