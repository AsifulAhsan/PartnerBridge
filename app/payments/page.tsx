'use client'

import { Sidebar } from '@/components/sidebar'
import { Header } from '@/components/header'
import { Search, Plus, Filter, CheckCircle, Clock, AlertCircle } from 'lucide-react'
import { useState } from 'react'
import { KPICard } from '@/components/kpi-card'

const payments = [
  {
    id: 'PAY-2024-0245',
    invoice: 'INV-2024-0856',
    amount: '৳449.95',
    method: 'Bank Transfer',
    date: '2024-06-06',
    status: 'completed',
    dueDate: '2024-06-20',
  },
  {
    id: 'PAY-2024-0244',
    invoice: 'INV-2024-0852',
    amount: '৳287.50',
    method: 'Credit Card',
    date: '2024-06-04',
    status: 'completed',
    dueDate: '2024-06-18',
  },
  {
    id: 'PAY-2024-0243',
    invoice: 'INV-2024-0851',
    amount: '৳507.50',
    method: 'Bank Transfer',
    date: '2024-06-02',
    status: 'completed',
    dueDate: '2024-06-17',
  },
  {
    id: 'PAY-2024-0242',
    invoice: 'INV-2024-0855',
    amount: '৳320.00',
    method: 'Credit Card',
    date: '2024-06-05',
    status: 'pending',
    dueDate: '2024-06-19',
  },
  {
    id: 'PAY-2024-0241',
    invoice: 'INV-2024-0854',
    amount: '৳179.97',
    method: 'Bank Transfer',
    date: '2024-06-05',
    status: 'overdue',
    dueDate: '2024-06-19',
  },
]

const statusConfig = {
  completed: { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle, label: 'Completed' },
  pending: { bg: 'bg-orange-100', text: 'text-orange-800', icon: Clock, label: 'Pending' },
  overdue: { bg: 'bg-red-100', text: 'text-red-800', icon: AlertCircle, label: 'Overdue' },
}

export default function PaymentsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null)

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.invoice.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = !selectedStatus || payment.status === selectedStatus

    return matchesSearch && matchesStatus
  })

  const totalPending = payments
    .filter((p) => p.status === 'pending' || p.status === 'overdue')
    .reduce((sum, p) => sum + parseFloat(p.amount.replace('৳', '')), 0)
    .toFixed(2)

  const totalCompleted = payments
    .filter((p) => p.status === 'completed')
    .reduce((sum, p) => sum + parseFloat(p.amount.replace('৳', '')), 0)
    .toFixed(2)

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />

      <main className="flex-1 overflow-auto md:ml-0">
        <div className="bg-brand-secondary text-white shrink-0">
          <Header
            title="Payment Management"
            subtitle="Track and submit your payments"
            actions={
              <button className="flex items-center gap-2 px-4 py-2 bg-[#0191da] text-white rounded-lg hover:bg-[#1466b8] transition-colors font-semibold">
                <Plus className="w-4 h-4" />
                Submit Payment
              </button>
            }
          />
        </div>

        <div className="p-6 md:p-8 space-y-8">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <KPICard
              title="Total Completed"
              value={`৳${totalCompleted}`}
              unit="this month"
              icon={<CheckCircle />}
              color="green"
            />
            <KPICard
              title="Pending Payments"
              value={`৳${totalPending}`}
              unit="awaiting payment"
              icon={<Clock />}
              color="orange"
            />
            <KPICard
              title="Payment Methods"
              value="2"
              unit="on file"
              icon={<Plus />}
              color="blue"
            />
          </div>

          {/* Filter Section */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search payments by ID or invoice..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                />
              </div>
            </div>

            {/* Status Filters */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              <Filter className="w-4 h-4 text-gray-500 flex-shrink-0" />
              <button
                onClick={() => setSelectedStatus(null)}
                className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  !selectedStatus
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                All Payments
              </button>
              {['completed', 'pending', 'overdue'].map((status) => (
                <button
                  key={status}
                  onClick={() => setSelectedStatus(status)}
                  className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    selectedStatus === status
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {statusConfig[status as keyof typeof statusConfig].label}
                </button>
              ))}
            </div>
          </div>

          {/* Payments Table */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-gray-200 bg-[#0191da]">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-white">
                      Payment ID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-white">
                      Invoice
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-white">
                      Payment Method
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-white">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-white">
                      Status
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-white">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredPayments.map((payment) => {
                    const config = statusConfig[payment.status as keyof typeof statusConfig]
                    const StatusIcon = config.icon
                    return (
                      <tr key={payment.id} className="hover:bg-background transition-colors">
                        <td className="px-6 py-4">
                          <span className="font-semibold text-gray-900">{payment.id}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-black">{payment.invoice}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-gray-600 text-sm">{payment.method}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-gray-600 text-sm">{payment.date}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}
                          >
                            <StatusIcon className="w-3 h-3" />
                            {config.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className="font-bold text-gray-900">{payment.amount}</span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {filteredPayments.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No payments found</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
