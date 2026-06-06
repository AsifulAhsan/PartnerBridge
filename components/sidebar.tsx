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
  X,
} from 'lucide-react'

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

interface SidebarProps {
  isOpen?: boolean
  onClose?: () => void
}

export function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const pathname = usePathname()

  return (
    <>
      <aside
        className={`fixed md:sticky top-0 left-0 w-60 h-screen bg-white border-r border-slate-200 transition-transform duration-300 ease-in-out z-40 shrink-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full justify-between">
          
          <div className="p-4">
            <div className="px-2 mb-5 pb-4 border-b border-slate-100 flex items-center justify-between gap-2.5">
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 bg-[#1F3A60] text-white rounded-sm font-black text-xs flex items-center justify-center shadow-inner shrink-0">
                  S
                </div>
                <span className="text-sm font-black tracking-wider text-slate-800">
                  Sale Sense
                </span>
              </div>
              
              {onClose && (
                <button 
                  onClick={onClose}
                  className="md:hidden p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded transition-all cursor-pointer"
                  aria-label="Close menu menu"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            <nav className="space-y-1 overflow-y-auto max-h-[calc(100vh-140px)] pr-1">
              {menuItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => onClose?.()}
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

          <div className="p-4 border-t border-slate-100 bg-slate-50">
            <button className="flex items-center gap-3 w-full px-3 py-2 text-xs font-semibold text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-sm transition-all hover:cursor-pointer">
              <LogOut className="w-4 h-4 text-slate-400" />
              <span>Sign Out Session</span>
            </button>
          </div>

        </div>
      </aside>

      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-30 transition-opacity duration-300"
          onClick={onClose}
        />
      )}
    </>
  )
}