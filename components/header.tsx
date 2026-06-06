'use client'

import { Bell, ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { Select } from 'antd'

interface HeaderProps {
  title: string
  subtitle?: string
  actions?: React.ReactNode
}

export function Header({ title, subtitle, actions }: HeaderProps) {
  const [showProfile, setShowProfile] = useState(false)

  return (
    <header className="bg-[#23496b] text-white border-b border-blue-900/40 sticky top-0 z-20 shadow-sm">
      <div className="px-6 py-3.5">
        <div className="flex items-center justify-between gap-4">

          {/* Brand Prefix & Quick Navigation Title Bar */}
          <div className="flex items-center gap-6">
            <div className="hidden lg:block shrink-0">
              <span className="font-bruno-ace text-base font-black tracking-wider text-white">
                PartnerBridge
              </span>
            </div>

            {/* Salesense Context Menu Selector Input */}
            {/* <div className="w-56 md:w-64 hidden sm:block">
              <Select
                showSearch
                placeholder="Navigate To Your Menu"
                variant="borderless"
                className="w-full bg-white/10! hover:bg-white/15 transition-colors rounded text-white/80! text-xs h-8 flex items-center"
                classNames={{
                  popup: {
                    root: 'rounded-sm shadow-xl color'
                  }
                }}
                options={[
                  { value: 'dashboard', label: 'Dashboard Overview' },
                  { value: 'quick-order', label: 'Quick Order Pad' },
                  { value: 'orders', label: 'Order Hub Management' },
                  { value: 'invoices', label: 'Accounting Invoices' },
                ]}
                styles={{
                  placeholder: { color: 'rgba(255,255,255,0.7)', fontSize: '12px' }
                }}
              />
            </div> */}
          </div>

          {/* Center/Custom Workflow Actions Block */}
          {actions && <div className="hidden md:flex items-center gap-2">{actions}</div>}

          {/* Right System Utility Hub */}
          <div className="flex items-center gap-4 ml-auto shrink-0">
            {/* Notifications */}
            <button className="relative p-1.5 text-blue-200 hover:text-white hover:bg-white/10 rounded transition-all">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" />
            </button>

            {/* User Profile Trigger Combo matching image_f250a6.png */}
            <div className="relative">
              <button
                onClick={() => setShowProfile(!showProfile)}
                className="flex items-center gap-2 pl-2 pr-3 py-1 bg-white/5 hover:bg-white/10 text-white rounded-full transition-all border border-white/10 hover:cursor-pointer"
              >
                <div className="w-6 h-6 bg-blue-500 text-white font-bold text-xs rounded-full flex items-center justify-center border border-white/20">
                  R
                </div>
                <span className="text-xs font-semibold hidden md:inline-block max-w-22.5 truncate">
                  Rafiul Islam
                </span>
                <ChevronDown className="w-3 h-3 text-blue-300" />
              </button>

              {/* Profile Context Floating Menu */}
              {showProfile && (
                <div className="absolute top-10 right-0 bg-white border border-slate-200 rounded shadow-xl py-1 w-48 text-slate-800 z-50 animate-in fade-in duration-100">
                  <div className="px-4 py-2 border-b border-slate-100 bg-slate-50">
                    <p className="text-xs font-bold text-slate-900">Rafiul Islam</p>
                    <p className="text-[10px] text-slate-400">Regional Node Admin</p>
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