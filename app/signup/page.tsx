'use client'
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import Link from 'next/link'
import { Mail, Lock, User, UserPlus, Sparkles, Eye, EyeOff } from 'lucide-react'

export default function Signup() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { signup } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim() || name.trim().length < 2) { toast.error('Name must be at least 2 characters'); return }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { toast.error('Please enter a valid email address'); return }
    if (!password || password.length < 6) { toast.error('Password must be at least 6 characters'); return }
    if (password !== confirmPassword) { toast.error('Passwords do not match'); return }

    setLoading(true)

    try {
      await signup(email.trim(), password, name.trim())
      toast.success('Account created! Check your email for a verification link.', { duration: 6000 })
      router.push('/verify-email')
    } catch (error: any) {
      setLoading(false)
      let errorMessage = 'Failed to create account'
      if (error.code === 'auth/email-already-in-use') { errorMessage = 'This email is already registered.' }
      else if (error.code === 'auth/invalid-email') { errorMessage = 'Invalid email address' }
      else if (error.code === 'auth/weak-password') { errorMessage = 'Password is too weak.' }
      toast.error(errorMessage, { duration: 5000 })
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-center bg-gradient-to-br from-blue-900 to-indigo-900 items-center relative overflow-hidden">
      {/* SIGNUP CARD */}
      <div className="relative w-full max-w-md bg-white/90 rounded-2xl shadow-2xl backdrop-blur-xl px-8 py-12 mt-6">
        <div className="flex flex-col items-center mb-8">
          <Sparkles className="w-9 h-9 text-blue-700"/>
          <h1 className="text-3xl font-extrabold tracking-tight text-blue-900 mt-3 mb-1">Create Account</h1>
          <p className="text-sm text-blue-400">Sign up and start thriving!</p>
        </div>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="relative">
            <User className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-blue-300" />
            <input
              type="text"
              required
              autoFocus
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Full Name"
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-blue-200 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 bg-white text-blue-900"
            />
          </div>
          <div className="relative">
            <Mail className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-blue-300" />
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@email.com"
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-blue-200 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 bg-white text-blue-900"
            />
          </div>
          <div className="relative">
            <Lock className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-blue-300" />
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full pl-12 pr-12 py-3 rounded-xl border border-blue-200 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 bg-white text-blue-900"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-400"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
          <div className="relative">
            <Lock className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-blue-300" />
            <input
              type={showPassword ? 'text' : 'password'}
              required
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              placeholder="Confirm Password"
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-blue-200 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 bg-white text-blue-900"
            />
          </div>
          <button type="submit" disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-blue-700 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:from-yellow-400 hover:to-yellow-500 hover:text-blue-900 transition-all flex items-center justify-center gap-2 text-lg"
          >
            <UserPlus className="w-5 h-5"/>
            {loading ? 'Creating...' : 'Create Account'}
          </button>
        </form>
        <div className="flex items-center mt-6 text-sm justify-center text-blue-600">
          Already have an account?&nbsp;
          <Link href="/login" className="font-bold underline decoration-yellow-400 hover:text-yellow-500">Sign in</Link>
        </div>
      </div>
    </div>
  )
}
