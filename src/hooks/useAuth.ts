import { useState, useEffect } from 'react';
import { 
  User as FirebaseUser,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  onAuthStateChanged
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { User } from '@/types';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setAuthState((prev) => ({
        ...prev,
        user: firebaseUser ? mapFirebaseUserToUser(firebaseUser) : null,
        loading: false
      }));
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    setAuthState((prev) => ({ ...prev, loading: true, error: null }));
    
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setAuthState({
        user: mapFirebaseUserToUser(userCredential.user),
        loading: false,
        error: null
      });
      return userCredential.user;
    } catch (error) {
      setAuthState({
        user: null,
        loading: false,
        error: (error as Error).message
      });
      throw error;
    }
  };

  const signUp = async (email: string, password: string) => {
    setAuthState((prev) => ({ ...prev, loading: true, error: null }));
    
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      setAuthState({
        user: mapFirebaseUserToUser(userCredential.user),
        loading: false,
        error: null
      });
      return userCredential.user;
    } catch (error) {
      setAuthState({
        user: null,
        loading: false,
        error: (error as Error).message
      });
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      setAuthState({
        user: null,
        loading: false,
        error: null
      });
    } catch (error) {
      setAuthState((prev) => ({
        ...prev,
        error: (error as Error).message
      }));
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      throw error;
    }
  };

  return {
    user: authState.user,
    loading: authState.loading,
    error: authState.error,
    signIn,
    signUp,
    signOut,
    resetPassword
  };
};

// Helper function to map Firebase user to our User type
function mapFirebaseUserToUser(firebaseUser: FirebaseUser): User {
  return {
    id: firebaseUser.uid,
    email: firebaseUser.email || '',
    name: firebaseUser.displayName || undefined,
    photoURL: firebaseUser.photoURL || undefined
  };
} 