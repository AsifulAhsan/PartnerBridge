'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  BarChart3,
  ShoppingCart,
  Package,
  Truck,
  FileText,
  AlertCircle,
  CreditCard,
  Settings,
  LogOut,
  Menu,
  X,
} from 'lucide-react'
import { useState } from 'react'

const menuItems = [
  { icon: BarChart3, label: 'Dashboard', href: '/dashboard' },
  { icon: ShoppingCart, label: 'Quick Order', href: '/quick-order' },
  { icon: Package, label: 'Order Management', href: '/orders' },
  { icon: Truck, label: 'Deliveries', href: '/deliveries' },
  { icon: FileText, label: 'Invoices', href: '/invoices' },
  { icon: AlertCircle, label: 'Outstanding Balance', href: '/outstanding' },
  { icon: CreditCard, label: 'Dealer Payments', href: '/payments' },
  { icon: Settings, label: 'System Settings', href: '/settings' },
]

export function Sidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Mobile Responsive Menu Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed bottom-4 right-4 z-50 p-3 bg-[#23496b] text-white rounded-full shadow-lg border border-blue-900/50"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Primary Navigation Sidebar Drawer */}
      <aside
        className={`fixed md:relative md:block w-60 h-screen bg-white border-r border-slate-200 transition-transform duration-200 z-40 shrink-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full justify-between">
          
          <div className="p-4">
            {/* Minimalist Top App Signature Context Label */}
            <div className="px-2 mb-5 pb-4 border-b border-slate-100 flex items-center gap-2.5">
              <div className="w-6 h-6 bg-[#1F3A60] text-white rounded-sm font-black text-xs flex items-center justify-center shadow-inner shrink-0">
                S
              </div>
              <span className="text-sm font-black tracking-wider text-slate-800">
                Sale Sense
              </span>
            </div>

            {/* High Density Flat Menu Links List */}
            <nav className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-sm transition-all text-xs font-semibold tracking-wide ${
                      isActive
                        ? 'bg-[#EAEFF4] text-[#1F3A60] font-bold border border-slate-300/60 shadow-xs'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#1F3A60]' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </nav>
          </div>

          {/* Understated Structural Logout Block Footer */}
          <div className="p-4 border-t border-slate-100 bg-slate-50">
            <button className="flex items-center gap-3 w-full px-3 py-2 text-xs font-semibold text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-sm transition-all hover:cursor-pointer">
              <LogOut className="w-4 h-4 text-slate-400" />
              <span>Sign Out Session</span>
            </button>
          </div>

        </div>
      </aside>

      {/* Masking dim overlay Layer for Mobile Devices */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-30 transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}