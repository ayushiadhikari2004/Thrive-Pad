'use client'
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import Link from 'next/link'
import { Mail, Lock, LogIn } from 'lucide-react'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await login(email, password)
      toast.success('Welcome back!')
      router.push('/')
    } catch (error: any) {
      setLoading(false)
      if (error.code === 'auth/email-not-verified') {
        toast.error('Please verify your email before logging in.', { duration: 7000 })
      } else {
        toast.error('Invalid email or password', { duration: 5000 })
      }
    }
  }

  return (
    <div className="min-h-screen flex flex-col justify-center items-center relative bg-gradient-to-br from-blue-900 to-indigo-900 overflow-hidden">
      <div className="relative flex flex-col md:flex-row items-center justify-between max-w-4xl w-full gap-8 z-10">
        {/* Branding */}
        <div className="flex-1 mt-12 md:mt-0 px-7 mb-8 md:mb-0">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight text-white">
            Sign in to <br />
            <span className="text-yellow-300 drop-shadow-lg">Thrive Pad</span>
          </h1>
          <p className="mt-5 text-lg text-blue-100 max-w-md">
            Welcome back! Organize, plan and thrive with your everyday goals.
          </p>
        </div>
        {/* Sign in Box */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-8 md:min-w-[370px] min-w-full max-w-md flex flex-col">
          <h2 className="text-2xl font-bold mb-6 text-blue-950 text-center">Sign in</h2>
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="relative">
              <Mail className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-blue-300" />
              <input
                type="email"
                required
                autoFocus
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@email.com"
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-blue-200 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 bg-white text-blue-900 placeholder:text-blue-200 outline-none"
              />
            </div>
            <div className="relative">
              <Lock className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-blue-300" />
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-blue-200 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 bg-white text-blue-900 placeholder:text-blue-200 outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 mt-2 font-semibold rounded-xl bg-gradient-to-r from-blue-700 to-indigo-600 text-white shadow-lg hover:from-yellow-400 hover:to-yellow-500 hover:text-blue-900 transition-all flex items-center justify-center gap-2 text-lg"
            >
              <LogIn className="w-5 h-5" />
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          <div className="flex items-center mt-6 text-sm justify-center text-blue-600">
            New?&nbsp;
            <Link href="/signup" className="font-bold underline decoration-yellow-400 hover:text-yellow-500">Create an account</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
