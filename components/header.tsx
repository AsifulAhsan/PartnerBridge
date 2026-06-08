'use client'

import Image from 'next/image'
import { Bell, ChevronDown, Menu } from 'lucide-react'
import { useState } from 'react'
import { Select } from 'antd'

interface HeaderProps {
  title: string
  subtitle?: string
  actions?: React.ReactNode
  onMenuToggle?: () => void
}

export function Header({ title, subtitle, actions, onMenuToggle }: HeaderProps) {
  const [showProfile, setShowProfile] = useState(false)

  return (
    <header className="bg-[#23496b] text-white sticky top-0 z-20 shadow-sm">
      <div className="px-4 sm:px-6 py-3.5">
        <div className="flex items-center justify-between gap-4">

          <div className="flex items-center gap-3 md:gap-6">
            <button
              onClick={onMenuToggle}
              className="md:hidden p-1 -ml-1 text-blue-200 hover:text-white hover:bg-white/10 rounded transition-all cursor-pointer"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="hidden lg:flex items-center gap-2.5 shrink-0">
              {/* <div className="w-7 h-7 bg-white rounded-md flex items-center justify-center shadow-sm overflow-hidden shrink-0">
                <Image src="/logo.png" alt="SaleSense" width={24} height={24} className="object-contain" />
              </div> */}
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-white tracking-wider pl-2">
                  Partner Bridge
                </span>
              </div>
            </div>
            <div className="flex flex-col lg:hidden">
              <h1 className="text-md md:text-lg font-bold tracking-tight line-clamp-1">
                SaleSense SFA
              </h1>
            </div>
          </div>

          {actions && <div className="hidden lg:flex items-center gap-2">{actions}</div>}

          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            <button className="relative p-1.5 text-blue-200 hover:text-white hover:bg-white/10 rounded transition-all cursor-pointer">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" />
            </button>

            <div className="relative">
              <button
                onClick={() => setShowProfile(!showProfile)}
                className="flex items-center gap-2 pl-2 pr-2 sm:pr-3 py-1 bg-white/5 hover:bg-white/10 text-white rounded-full transition-all border border-white/10 hover:cursor-pointer"
              >
                <div className="w-6 h-6 bg-blue-500 text-white font-bold text-xs rounded-full flex items-center justify-center border border-white/20 shrink-0">
                  R
                </div>
                <span className="text-xs font-semibold hidden md:inline-block max-w-22.5 truncate">
                  MD Zakir
                </span>
                <ChevronDown className="w-3 h-3 text-blue-300 shrink-0" />
              </button>

              {showProfile && (
                <div className="absolute top-10 right-0 bg-white border border-slate-200 rounded shadow-xl py-1 w-48 text-slate-800 z-50 animate-in fade-in duration-100">
                  <div className="px-4 py-2 border-b border-slate-100 bg-slate-50">
                    <p className="text-xs font-bold text-slate-900">MD Zakir</p>
                    <p className="text-[10px] text-slate-400">Dealer</p>
                  </div>
                  <a href="#" className="block px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">My Profile</a>
                  <a href="#" className="block px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">Account Settings</a>
                  <hr className="border-slate-100 my-1" />
                  <a href="#" className="block px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50">Logout</a>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </header>
  )
}