'use client'
import { createContext, useContext, useEffect, useState } from 'react'
import {
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendEmailVerification
} from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'

interface AuthContextType {
  user: User | null
  loading: boolean
  signup: (email: string, password: string, displayName: string) => Promise<void>
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType)

export const useAuth = () => useContext(AuthContext)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser)
      setLoading(false)
    })
    return unsubscribe
  }, [])

  const signup = async (email: string, password: string, displayName: string) => {
    // Create Firebase Auth account
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const userObj = userCredential.user
    await updateProfile(userObj, { displayName })
    // Send verification email
    await sendEmailVerification(userObj)
    // Store in Firestore (fire and forget)
    setDoc(doc(db, 'users', userObj.uid), {
      uid: userObj.uid,
      email: userObj.email,
      displayName,
      createdAt: new Date(),
      updatedAt: new Date(),
    }).catch(err => console.error('Error storing user data:', err))
  }

  const login = async (email: string, password: string) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    const userObj = userCredential.user
    if (!userObj.emailVerified) {
      await signOut(auth)
      const error = new Error('Please verify your email (check your inbox) before logging in.') as any
      error.code = 'auth/email-not-verified'
      throw error
    }
  }

  const logout = async () => {
    await signOut(auth)
  }

  return (
    <AuthContext.Provider value={{ user, loading, signup, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}
