'use client'

import { useState } from 'react'
import { Eye, EyeOff, LogIn, HelpCircle } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    setTimeout(() => {
      window.location.href = '/dashboard'
      setIsLoading(false)
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-[#EAEFF4] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* SaleSense SFA Corporate Branding Logo */}
        <div className="flex justify-center mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-[#23496b] rounded-sm flex items-center justify-center shadow-xs">
              <span className="text-white font-black text-2xl tracking-tighter">S</span>
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none">PartnerBridge</h1>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-1">SalesSense SFA</p>
            </div>
          </div>
        </div>

        {/* Form Container Module */}
        <div className="bg-white rounded-md border border-slate-200 shadow-xs p-8 space-y-5">
          <div className="text-center pb-2">
            <h2 className="text-xl font-bold text-[#23496b] tracking-tight">System Authentication</h2>
            <p className="text-xs text-slate-500 font-medium mt-1">Sign in to directly stage catalog items into logistics distribution paths</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Input Node */}
            <div>
              <label htmlFor="email" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                className="w-full h-10 px-3 py-2 border border-slate-300 rounded-sm focus:ring-1 focus:ring-[#23496b] focus:border-[#23496b] outline-none text-xs text-slate-900 font-medium transition-all"
                required
              />
            </div>

            {/* Password Input Node */}
            <div>
              <label htmlFor="password" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-10 px-3 py-2 border border-slate-300 rounded-sm focus:ring-1 focus:ring-[#23496b] focus:border-[#23496b] outline-none text-xs text-slate-900 tracking-widest focus:tracking-normal font-medium transition-all"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me / Forgot Password Layout Context */}
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 font-medium text-slate-600 cursor-pointer select-none">
                <input type="checkbox" className="rounded-xs border-slate-300 text-[#23496b] focus:ring-[#23496b]" />
                Remember active session
              </label>
              <a href="#" className="text-[#23496b]/60 hover:text-[#23496b]/80 hover:underline font-bold">
                Forgot Password?
              </a>
            </div>

            {/* Login Submission Execution operation */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-10 mt-2 flex items-center justify-center gap-2 bg-[#23496b] hover:bg-[#152842] text-white text-xs font-bold rounded-sm border-none shadow-xs transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <LogIn className="w-4 h-4" />
              {isLoading ? 'Checking...' : 'Authorize Session'}
            </button>
          </form>

          {/* Operational Support Grid Segment */}
          <div className="relative pt-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-100" />
            </div>
            <div className="relative flex justify-center text-[10px] font-bold uppercase tracking-wider">
              <span className="px-2 bg-white text-slate-400 flex items-center gap-1">
                <HelpCircle className="w-3 h-3" /> Technical Assistance
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-0.5">
            <a
              href="#"
              className="px-3 py-2 border border-slate-200 hover:border-slate-300 rounded-sm text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all text-center"
            >
              Contact Support Node
            </a>
            <a
              href="#"
              className="px-3 py-2 border border-slate-200 hover:border-slate-300 rounded-sm text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all text-center"
            >
              SFA Documentation
            </a>
          </div>
        </div>

        {/* Footer Ledger */}
        <p className="text-center text-[10px] font-bold font-mono text-slate-400 uppercase tracking-widest mt-6">
          © 2026 SaleSense SFA PartnerBride. All rights reserved.
        </p>
      </div>
    </div>
  )
}