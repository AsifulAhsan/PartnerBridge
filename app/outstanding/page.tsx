'use client'

import { Sidebar } from '@/components/sidebar'
import { Header } from '@/components/header'
import { KPICard } from '@/components/kpi-card'
import { Search, AlertTriangle, TrendingUp } from 'lucide-react'
import { useState } from 'react'

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

        <div className="p-6 md:p-8 space-y-8">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <KPICard
              title="Total Outstanding"
              value={`৳${totalOutstanding}`}
              unit="invoices due"
              icon={<AlertTriangle />}
              color="orange"
            />
            <KPICard
              title="Overdue"
              value={overdueCount}
              unit="invoices"
              icon={<TrendingUp />}
              color="red"
            />
            <KPICard
              title="Invoices"
              value={outstandingData.length}
              unit="total"
              icon={<AlertTriangle />}
              color="blue"
            />
          </div>

          {/* Search */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search outstanding invoices..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
              />
            </div>
          </div>

          {/* Outstanding Table */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-gray-200 bg-background">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700">
                      Invoice ID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700">
                      Customer
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700">
                      Due Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700">
                      Days
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700">
                      Amount
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredData.map((item) => (
                    <tr key={item.invoice} className="hover:bg-background transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-semibold text-gray-900">{item.invoice}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-gray-700">{item.customer}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-gray-600 text-sm">{item.dueDate}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                            item.status === 'overdue'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-orange-100 text-orange-800'
                          }`}
                        >
                          {item.status === 'overdue' ? 'Overdue' : 'Due Soon'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`text-sm font-semibold ${
                            item.daysOverdue > 0 ? 'text-red-600' : 'text-orange-600'
                          }`}
                        >
                          {item.daysOverdue > 0 ? `${item.daysOverdue} days` : 'Due soon'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="font-bold text-gray-900">{item.amount}</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button className="inline-flex items-center justify-center px-3 py-1 text-sm font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors">
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
