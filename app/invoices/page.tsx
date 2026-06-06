'use client'

import { Sidebar } from '@/components/sidebar'
import { Header } from '@/components/header'
import { Search, Download, Eye, Filter } from 'lucide-react'
import { useState } from 'react'

const invoices = [
  {
    id: 'INV-2024-0856',
    orderIds: ['ORD-2024-00156'],
    date: '2024-06-06',
    dueDate: '2024-06-20',
    amount: '$449.95',
    status: 'paid',
    customer: 'Springfield Farm',
  },
  {
    id: 'INV-2024-0855',
    orderIds: ['ORD-2024-00155'],
    date: '2024-06-05',
    dueDate: '2024-06-19',
    amount: '$320.00',
    status: 'pending',
    customer: 'Riverside Hatchery',
  },
  {
    id: 'INV-2024-0854',
    orderIds: ['ORD-2024-00154'],
    date: '2024-06-05',
    dueDate: '2024-06-19',
    amount: '$179.97',
    status: 'overdue',
    customer: 'Premium Livestock',
  },
  {
    id: 'INV-2024-0853',
    orderIds: ['ORD-2024-00153'],
    date: '2024-06-04',
    dueDate: '2024-06-18',
    amount: '$239.92',
    status: 'pending',
    customer: 'Green Pastures',
  },
  {
    id: 'INV-2024-0852',
    orderIds: ['ORD-2024-00152'],
    date: '2024-06-04',
    dueDate: '2024-06-18',
    amount: '$287.50',
    status: 'paid',
    customer: 'Mountain View Farm',
  },
  {
    id: 'INV-2024-0851',
    orderIds: ['ORD-2024-00151'],
    date: '2024-06-03',
    dueDate: '2024-06-17',
    amount: '$507.50',
    status: 'paid',
    customer: 'Sunny Valley Ranch',
  },
]

const statusConfig = {
  paid: { bg: 'bg-green-100', text: 'text-green-800', label: 'Paid' },
  pending: { bg: 'bg-orange-100', text: 'text-orange-800', label: 'Pending' },
  overdue: { bg: 'bg-red-100', text: 'text-red-800', label: 'Overdue' },
}

export default function InvoicesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null)

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      invoice.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.customer.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = !selectedStatus || invoice.status === selectedStatus

    return matchesSearch && matchesStatus
  })

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <main className="flex-1 overflow-auto md:ml-0">
        <Header
          title="Invoice Center"
          subtitle="View and download your invoices"
          actions={
            <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold">
              <Download className="w-4 h-4" />
              Download All
            </button>
          }
        />

        <div className="p-6 md:p-8 space-y-6">
          {/* Filter Section */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search invoices by ID or customer..."
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
                All Invoices
              </button>
              {['paid', 'pending', 'overdue'].map((status) => (
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

          {/* Invoices Table */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-gray-200 bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700">
                      Invoice ID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700">
                      Customer
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700">
                      Due Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700">
                      Status
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-700">
                      Amount
                    </th>
                    <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredInvoices.map((invoice) => {
                    const config = statusConfig[invoice.status as keyof typeof statusConfig]
                    return (
                      <tr key={invoice.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <span className="font-semibold text-gray-900">{invoice.id}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-gray-700">{invoice.customer}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-gray-600 text-sm">{invoice.date}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-gray-600 text-sm">{invoice.dueDate}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}
                          >
                            {config.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className="font-bold text-gray-900">{invoice.amount}</span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button className="inline-flex items-center justify-center w-8 h-8 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">
                              <Eye className="w-4 h-4" />
                            </button>
                            <button className="inline-flex items-center justify-center w-8 h-8 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">
                              <Download className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {filteredInvoices.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No invoices found</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
