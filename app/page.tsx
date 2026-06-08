'use client'

import { useState } from 'react'
import { Eye, EyeOff, LogIn, HelpCircle, ShoppingCart, Truck, FileText, PackageCheck } from 'lucide-react'
import Image from 'next/image'

export default function LoginPage() {
  const [phone, setPhone] = useState('')
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

  const features = [
    { icon: ShoppingCart, label: 'Place Orders', desc: 'Direct order entry with live catalog & pricing' },
    { icon: PackageCheck, label: 'Track Orders', desc: 'Real-time order status from dispatch to delivery' },
    { icon: FileText, label: 'Invoice Access', desc: 'View, download & reconcile invoices instantly' },
    { icon: Truck, label: 'Delivery Tracking', desc: 'Follow shipments & confirm receipt online' },
  ]

  return (
    <div className="min-h-screen flex">
      {/* Left Panel — Branding */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-[55%] relative flex-col justify-between overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a3a5c] via-[#23496B] to-[#3A73A6]" />
        
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />
        <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-[#3A73A6]/20 rounded-full blur-2xl" />

        <div className="relative z-10 p-12 xl:p-16">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center shadow-sm overflow-hidden shrink-0">
              <Image src="/logo.png" alt="SaleSense" width={36} height={36} className="object-contain" />
            </div>
            <div>
              <span className="text-xl font-black text-white tracking-tight leading-none block">SaleSense</span>
              <span className="text-xs font-bold text-blue-200/80 uppercase tracking-wider mt-0.5 block">SFA PartnerBridge</span>
            </div>
          </div>

          {/* Hero Text */}
          <div className="max-w-lg mb-10">
            <h1 className="text-2xl lg:text-3xl xl:text-4xl font-black text-white leading-tight">
              Dealer & Partner Automation
            </h1>
          </div>

          {/* Feature Grid */}
          <div className="grid grid-cols-2 gap-5 max-w-lg">
            {features.map((f) => (
              <div
                key={f.label}
                className="flex flex-col items-start gap-4 p-5 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors"
              >
                <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                  <f.icon className="w-6 h-6 text-blue-200" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{f.label}</p>
                  <p className="text-xs text-blue-200/70 mt-1 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 px-12 xl:px-16 pb-8">
          <div className="flex items-center gap-4 text-xs text-blue-200/60 font-medium">
            <span>© 2026 SaleSense SFA</span>
            <span className="w-1 h-1 rounded-full bg-blue-300/40" />
            <a href="#" className="hover:text-blue-200 transition-colors">Privacy Policy</a>
            <span className="w-1 h-1 rounded-full bg-blue-300/40" />
            <a href="#" className="hover:text-blue-200 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>

      {/* Right Panel — Login Form */}
      <div className="flex-1 flex flex-col justify-center items-center bg-[#f4f7fa] p-4 sm:p-6 relative">
        {/* Mobile Logo */}
        <div className="lg:hidden flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center shadow-sm overflow-hidden shrink-0">
            <Image src="/logo.png" alt="SaleSense" width={36} height={36} className="object-contain" />
          </div>
          <div>
            <span className="text-lg font-black text-slate-900 tracking-tight leading-none block">SaleSense</span>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-0.5 block">SFA PartnerBridge</span>
          </div>
        </div>

        <div className="w-full max-w-sm">
          {/* Form Card */}
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-8 space-y-6">
            <div className="text-center">
              <h2 className="text-lg font-bold text-[#23496B] tracking-tight">Partner Portal Login</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Phone Number
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="01734520260"
                  className="w-full h-10 px-3.5 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#3A73A6]/20 focus:border-[#3A73A6] outline-none text-sm text-slate-900 font-medium transition-all placeholder:text-slate-400"
                  required
                />
              </div>

              {/* Password */}
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
                    placeholder="Enter your password"
                    className="w-full h-10 px-3.5 py-2 pr-10 border border-slate-300 rounded-lg focus:ring-2 focus:ring-[#3A73A6]/20 focus:border-[#3A73A6] outline-none text-sm text-slate-900 tracking-widest focus:tracking-normal font-medium transition-all placeholder:text-slate-400"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember / Forgot */}
              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 font-medium text-slate-600 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-slate-300 text-[#3A73A6] focus:ring-[#3A73A6]"
                  />
                  Remember me
                </label>
                <a href="#" className="text-[#3A73A6] hover:text-[#23496B] font-semibold transition-colors">
                  Forgot Password?
                </a>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full h-10 flex items-center justify-center gap-2 bg-gradient-to-r from-[#23496B] to-[#3A73A6] hover:from-[#1a3a5c] hover:to-[#2d5d85] text-white text-sm font-bold rounded-lg border-none shadow-sm transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <LogIn className="w-4 h-4" />
                {isLoading ? 'Authenticating...' : 'Sign In'}
              </button>
            </form>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-100" />
              </div>
              <div className="relative flex justify-center text-xs font-bold uppercase tracking-wider">
                <span className="px-3 bg-white text-slate-400 flex items-center gap-1.5">
                  <HelpCircle className="w-3 h-3" /> Need Help?
                </span>
              </div>
            </div>

            {/* Support Buttons */}
            <div className="grid grid-cols-2 gap-2.5">
              <a
                href="#"
                className="px-3 py-2.5 border border-slate-200 hover:border-[#3A73A6]/30 hover:bg-[#3A73A6]/5 rounded-lg text-xs font-semibold text-slate-600 hover:text-[#3A73A6] transition-all text-center"
              >
                Contact Support
              </a>
              <a
                href="#"
                className="px-3 py-2.5 border border-slate-200 hover:border-[#3A73A6]/30 hover:bg-[#3A73A6]/5 rounded-lg text-xs font-semibold text-slate-600 hover:text-[#3A73A6] transition-all text-center"
              >
                Documentation
              </a>
            </div>
          </div>

          {/* Mobile Footer */}
          <p className="lg:hidden text-center text-xs font-bold text-slate-400 uppercase tracking-widest mt-6">
            © 2026 SaleSense SFA. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  )
}
