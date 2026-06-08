'use client'

import { Sidebar } from '@/components/sidebar'
import { Header } from '@/components/header'
import { KPICard } from '@/components/kpi-card'
import { Search, AlertTriangle, TrendingUp, Layers } from 'lucide-react'
import { useState } from 'react'
import { Card, ConfigProvider, Statistic } from 'antd'

const outstandingData = [
  {
    invoice: 'INV-2024-0854',
    customer: 'Premium Livestock',
    amount: '৳179.97',
    daysOverdue: 2,
    dueDate: '2024-06-19',
    lastReminder: '2024-06-05',
    status: 'overdue',
  },
  {
    invoice: 'INV-2024-0853',
    customer: 'Green Pastures',
    amount: '৳239.92',
    daysOverdue: 0,
    dueDate: '2024-06-18',
    lastReminder: 'Not sent',
    status: 'due-soon',
  },
  {
    invoice: 'INV-2024-0855',
    customer: 'Riverside Hatchery',
    amount: '৳320.00',
    daysOverdue: 0,
    dueDate: '2024-06-19',
    lastReminder: 'Not sent',
    status: 'due-soon',
  },
]

export default function OutstandingPage() {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredData = outstandingData.filter(
    (item) =>
      item.invoice.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.customer.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const totalOutstanding = outstandingData
    .reduce((sum, item) => sum + parseFloat(item.amount.replace('৳', '')), 0)
    .toFixed(2)

  const overdueCount = outstandingData.filter((item) => item.daysOverdue > 0).length

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />

      <main className="flex-1 overflow-auto md:ml-0">
        <div className="bg-brand-secondary text-white shrink-0">
          <Header
            title="Outstanding Management"
            subtitle="Monitor and manage outstanding invoices"
          />
        </div>

        <div className="p-6 md:p-8 space-y-3">
          {/* KPI Cards */}
          <ConfigProvider
            theme={{
              components: {
                Card: {
                  paddingLG: 20, // Clean, condensed padding tracking grid
                },
                Statistic: {
                  titleFontSize: 12,
                  contentFontSize: 24,
                },
              },
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              {/* Card 1: Total Outstanding */}
              <Card
                variant='borderless'
                className="px-2! py-4! shadow-none! border border-gray-200 rounded-sm! bg-white!"
              >
                <div className="flex justify-between items-start">
                  <Statistic
                    title={<span className="text-black font-normal tracking-wide uppercase text-lg">Total Outstanding</span>}
                    value={parseFloat(totalOutstanding)}
                    precision={2}
                    prefix={<span className="font-bold text-slate-800 mr-0.5">৳</span>}
                    suffix={<span className="text-sm text-black font-normal ml-2">invoices due</span>}
                    valueStyle={{ color: '#000000', fontWeight: 500 }}
                  />
                  <div className="p-2 rounded-sm bg-slate-50 border border-slate-200 text-slate-500 shadow-2xs">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                </div>
              </Card>

              {/* Card 2: Overdue Invoices */}
              <Card
                variant='borderless'
                className="px-2! py-4! shadow-none! border border-gray-200 rounded-sm! bg-white!"
              >
                <div className="flex justify-between items-start">
                  <Statistic
                    title={<span className="text-black font-normal tracking-wide uppercase text-lg">Overdue Accounts</span>}
                    value={overdueCount}
                    suffix={<span className="text-sm text-black font-normal ml-2">invoices</span>}
                    valueStyle={{ color: '#000000', fontWeight: 500 }}
                  />
                  <div className="p-2 rounded-sm bg-slate-50 border border-slate-200 text-slate-500 shadow-2xs">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                </div>
              </Card>

              {/* Card 3: Total Logged Ledger Invoices */}
              <Card
                variant='borderless'
                className="px-2! py-4! shadow-none! border border-gray-200 rounded-sm! bg-white!"
              >
                <div className="flex justify-between items-start">
                  <Statistic
                    title={<span className="text-black font-normal tracking-wide uppercase text-lg">Total Invoices</span>}
                    value={outstandingData.length}
                    suffix={<span className="text-sm text-black font-normal ml-2">total items</span>}
                    valueStyle={{ color: '#000000', fontWeight: 500 }}
                  />
                  <div className="p-2 rounded-sm bg-slate-50 border border-slate-200 text-slate-500 shadow-2xs">
                    <Layers className="w-4 h-4" />
                  </div>
                </div>
              </Card>
            </div>
          </ConfigProvider>

          {/* Search */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search outstanding invoices..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0191da] focus:border-transparent outline-none"
              />
            </div>
          </div>

          {/* Outstanding Table */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-gray-200 bg-[#0191da]">
                  <tr>
                    <th className="px-6 py-4 text-left text-md font-semibold text-white">
                      Invoice ID
                    </th>
                    <th className="px-6 py-4 text-left text-md font-semibold text-white">
                      Customer
                    </th>
                    <th className="px-6 py-4 text-left text-md font-semibold text-white">
                      Due Date
                    </th>
                    <th className="px-6 py-4 text-left text-md font-semibold text-white">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-md font-semibold text-white">
                      Days
                    </th>
                    <th className="px-6 py-4 text-right text-md font-semibold text-white">
                      Amount
                    </th>
                    <th className="px-6 py-4 text-center text-md font-semibold text-white">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredData.map((item) => (
                    <tr key={item.invoice} className="hover:bg-background transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-normal text-black text-sm">{item.invoice}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-normal text-black text-sm">{item.customer}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-normal text-black text-sm">{item.dueDate}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-md font-semibold ${item.status === 'overdue'
                            ? 'bg-red-100 text-red-800 text-sm'
                            : 'bg-orange-100 text-orange-800 text-sm'
                            }`}
                        >
                          {item.status === 'overdue' ? 'Overdue' : 'Due Soon'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`text-sm font-semibold ${item.daysOverdue > 0 ? 'text-gray-600 ' : 'text-gray-600'
                            }`}
                        >
                          {item.daysOverdue > 0 ? `${item.daysOverdue} days` : 'Due soon'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="font-sm text-gray-900 text-sm">{item.amount}</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-[#1466b8] bg-white rounded-sm hover:bg-gray-200 border border-[#1466b8] transition-colors">
                          Send Reminder
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredData.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No outstanding invoices found</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
