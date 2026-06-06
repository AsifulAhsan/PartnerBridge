'use client'

import { Sidebar } from '@/components/sidebar'
import { Header } from '@/components/header'
import { Search, Download, Eye, Calendar, Truck, MapPin, DollarSign, FileText, ShoppingBag, ChevronRight, Home } from 'lucide-react'
import { useState } from 'react'
import { Table, Input, Select, Button, Drawer, Space, Statistic, Divider } from 'antd'
import type { ColumnsType } from 'antd/es/table'

const allOrders = [
  {
    id: 'ORD-2026-08101',
    date: '2026-06-06',
    items: 'Broiler Feed Starter (40 Bags)',
    status: 'delivered',
    total: 92400,
    customer: 'Natore Poultry & Hatchery Complex',
    phone: '+880 1711-094321',
    address: 'Chowrasta Bazar, Natore Sadar, Natore',
    shippingMethod: 'Ex-Mill Sirajganj Delivery',
    paymentMethod: 'Dealer Credit Line Account',
    productsList: [
      { sku: 'PLY-BR-01', name: 'Premium Broiler Feed Starter', quantity: 40, unitPrice: 2310, total: 92400, size: '50kg Woven Bag' }
    ]
  },
  {
    id: 'ORD-2026-08102',
    date: '2026-06-05',
    items: 'Floating Tilapia Grower (25 Bags)',
    status: 'in-transit',
    total: 58750,
    customer: 'Natore Poultry & Hatchery Complex',
    phone: '+880 1912-887766',
    address: 'Trishal Fish Feed Ghat, Mymensingh',
    shippingMethod: 'Company Truck Transport',
    paymentMethod: 'Bank Wire Clearing / BEFTN',
    productsList: [
      { sku: 'AQ-TL-05', name: 'High-Protein Floating Tilapia Grower', quantity: 25, unitPrice: 2350, total: 58750, size: '40kg Moisture-Proof Bag' }
    ]
  },
  {
    id: 'ORD-2026-08103',
    date: '2026-06-05',
    items: 'High-Yield Dairy Feed (15 Bags)',
    status: 'processing',
    total: 31500,
    customer: 'Natore Poultry & Hatchery Complex',
    phone: '+880 1819-445522',
    address: 'Baghabari Ghat Road, Shahjadpur, Sirajganj',
    shippingMethod: 'Ex-Mill Sirajganj Delivery',
    paymentMethod: 'Dealer Credit Line Account',
    productsList: [
      { sku: 'CTL-DY-02', name: 'Milking Dairy Feed Premium', quantity: 15, unitPrice: 2100, total: 31500, size: '50kg Bag' }
    ]
  },
  {
    id: 'ORD-2026-08104',
    date: '2026-06-04',
    items: 'Cattle Fattening Feed Mash (50 Bags)',
    status: 'pending',
    total: 97500,
    customer: 'Natore Poultry & Hatchery Complex',
    phone: '+880 1515-223344',
    address: 'Bhairab Bazar, Kishoreganj',
    shippingMethod: 'Company Truck Transport',
    paymentMethod: 'Cash on Delivery (COD)',
    productsList: [
      { sku: 'CTL-FT-09', name: 'Bull Fattening Feed Mash', quantity: 50, unitPrice: 1950, total: 97500, size: '50kg Bag' }
    ]
  },
  {
    id: 'ORD-2026-08105',
    date: '2026-06-02',
    items: 'Layer Feed Grower (30 Bags)',
    status: 'cancelled',
    total: 64500,
    customer: 'Natore Poultry & Hatchery Complex',
    phone: '+880 1713-990011',
    address: 'Sherpur Road, Bogura Sadar, Bogura',
    shippingMethod: 'Ex-Mill Sirajganj Delivery',
    paymentMethod: 'Dealer Credit Line Account',
    productsList: [
      { sku: 'PLY-LY-03', name: 'Layer Feed Grower Elite', quantity: 30, unitPrice: 2150, total: 64500, size: '50kg Woven Bag' }
    ]
  }
]

const statusConfig = {
  pending: { dotColor: 'bg-amber-500', label: 'Pending' },
  processing: { dotColor: 'bg-blue-500', label: 'Processing' },
  'in-transit': { dotColor: 'bg-purple-500', label: 'In Transit' },
  delivered: { dotColor: 'bg-emerald-500', label: 'Delivered' },
  cancelled: { dotColor: 'bg-slate-400', label: 'Cancelled' },
}

interface OrderDataType {
  id: string
  date: string
  items: string
  status: string
  total: number
  customer: string
  phone: string
  address: string
  shippingMethod: string
  paymentMethod: string
  productsList: Array<{ sku: string; name: string; quantity: number; unitPrice: number; total: number; size: string }>
}

export default function OrdersPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState('date')

  const [selectedOrder, setSelectedOrder] = useState<OrderDataType | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const filteredOrders = allOrders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = !selectedStatus || order.status === selectedStatus

    return matchesSearch && matchesStatus
  })

  const sortedOrders = [...filteredOrders].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    } else if (sortBy === 'total') {
      return b.total - a.total
    }
    return 0
  })

  const statuses = ['pending', 'processing', 'in-transit', 'delivered', 'cancelled']

  const handleOpenDrawer = (order: OrderDataType) => {
    setSelectedOrder(order)
    setIsDrawerOpen(true)
  }

  const columns: ColumnsType<OrderDataType> = [
    {
      title: 'Order ID',
      dataIndex: 'id',
      key: 'id',
      width: 140,
      align: 'left',
      className: 'text-xs font-bold text-slate-900 font-mono tracking-tight pl-4',
    },
    {
      title: 'Customer Dealer / Farm',
      dataIndex: 'customer',
      key: 'customer',
      align: 'left',
      ellipsis: true,
      className: 'text-xs font-semibold text-slate-800',
    },
    {
      title: 'Staged Date',
      dataIndex: 'date',
      key: 'date',
      width: 120,
      align: 'left',
      className: 'text-xs text-slate-500 font-medium',
    },
    {
      title: 'Distribution Summary',
      dataIndex: 'items',
      key: 'items',
      align: 'left',
      ellipsis: true,
      className: 'text-xs text-slate-500 font-medium',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      align: 'left',
      render: (status: string) => {
        const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-50 border border-slate-200/80 text-slate-700 font-semibold text-[11px] tracking-wide">
            <span className={`w-1.5 h-1.5 rounded-full ${config.dotColor}`} />
            {config.label}
          </span>
        )
      },
    },
    {
      title: 'Gross Total',
      dataIndex: 'total',
      key: 'total',
      width: 120,
      align: 'right',
      render: (value: number) => (
        <span className="font-bold text-slate-900 text-xs tracking-tight pr-4">
          ৳ {value.toLocaleString('en-IN')}
        </span>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      width: 65,
      align: 'center',
      render: (_, record) => (
        <Button
          type="default"
          icon={<Eye className="w-3.5 h-3.5 text-slate-500" />}
          onClick={() => handleOpenDrawer(record)}
          className="inline-flex items-center justify-center rounded-sm w-7 h-7 bg-white shadow-xs hover:border-slate-300"
        />
      ),
    },
  ]

  return (
    <div className="flex h-screen bg-[#EAEFF4]">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 overflow-auto md:ml-0 flex flex-col w-full">
        <div className="bg-[#23496b] text-white shrink-0">
          <Header
            title="SalesSense"
            subtitle="Navigate To Your Menu"
            onMenuToggle={() => setSidebarOpen(true)}
            actions={
              <button className="flex items-center gap-2 px-3 py-1.5 bg-[#23496b]/30 hover:bg-[#152842]/50 text-white border border-white/20 rounded-sm font-bold text-xs tracking-wide transition-colors">
                <Download className="w-3.5 h-3.5" />
                Export Channel Data
              </button>
            }
          />
        </div>

        <div className="bg-white border-b border-slate-200 px-4 sm:px-6 py-2.5 flex items-center gap-2 text-xs text-slate-500 font-medium shrink-0 overflow-x-auto whitespace-nowrap scrollbar-none">
          <Home className="w-3.5 h-3.5 text-blue-800 shrink-0" />
          <span className="text-blue-800 font-semibold hover:underline cursor-pointer">Home</span>
          <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
          <span className="text-blue-800 font-semibold hover:underline cursor-pointer">Sales</span>
          <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
          <span className="text-slate-600">Order Management</span>
        </div>

        <div className="p-4 sm:p-6 space-y-4 flex-1 overflow-auto w-full">
          <div className="bg-white rounded-md border border-slate-200 p-4 space-y-3.5 shadow-xs">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 w-full">
                <Input
                  prefix={<Search className="w-3.5 h-3.5 text-slate-400 mr-1" />}
                  placeholder="Filter parameters by Order reference ID or Bangladeshi customer node..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  allowClear
                  className="rounded-sm text-xs h-9 w-full"
                />
              </div>

              <Select
                value={sortBy}
                onChange={(value) => setSortBy(value)}
                className="w-full md:w-48 text-xs font-bold h-9"
                classNames={{
                  popup: {
                    root: 'rounded-sm text-xs font-medium'
                  }
                }}
                options={[
                  { value: 'date', label: 'Sort by Entry Date' },
                  { value: 'total', label: 'Sort by Gross Value (BDT)' },
                ]}
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 border-t border-slate-100 pt-3 scrollbar-thin">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-2 shrink-0">Nodes:</span>
              <button
                onClick={() => setSelectedStatus(null)}
                className={`px-3 py-1 rounded-sm text-[11px] font-bold transition-all uppercase tracking-wide shrink-0 ${!selectedStatus
                  ? 'bg-[#23496b] text-white border border-[#23496b]'
                  : 'bg-slate-100 text-slate-600 border border-slate-200/60 hover:bg-slate-200'
                  }`}
              >
                All Regional Logs
              </button>
              {statuses.map((status) => (
                <button
                  key={status}
                  onClick={() => setSelectedStatus(status)}
                  className={`px-3 py-1 rounded-sm text-[11px] font-bold uppercase transition-all tracking-wide shrink-0 ${selectedStatus === status
                    ? 'bg-[#23496b] text-white border border-[#23496b]'
                    : 'bg-slate-100 text-slate-600 border border-slate-200/60 hover:bg-slate-200'
                    }`}
                >
                  {statusConfig[status as keyof typeof statusConfig].label}
                </button>
              ))}
            </div>
          </div>

          <div className="hidden md:block bg-white rounded-md border border-slate-200 shadow-xs overflow-hidden">
            <Table
              columns={columns}
              dataSource={sortedOrders}
              rowKey="id"
              size="middle"
              pagination={{
                pageSize: 5,
                showSizeChanger: false,
                placement: ['bottomRight'] as any,
                className: "px-4 py-3 m-0 border-t border-slate-100 text-xs font-medium"
              }}
              locale={{ emptyText: 'No localized logistics accounts mapped to this query.' }}
            />
          </div>

          <div className="block md:hidden space-y-3">
            {sortedOrders.map((order) => {
              const config = statusConfig[order.status as keyof typeof statusConfig] || statusConfig.pending
              return (
                <div 
                  key={order.id} 
                  className="bg-white border border-slate-200 rounded-md p-4 shadow-2xs space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-900 font-mono tracking-tight">{order.id}</span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-sm bg-slate-50 border border-slate-200/80 text-slate-700 font-bold text-[10px] tracking-wide">
                      <span className={`w-1 h-1 rounded-full ${config.dotColor}`} />
                      {config.label}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-800 line-clamp-1">{order.customer}</p>
                    <p className="text-[11px] text-slate-500 font-medium line-clamp-1">{order.items}</p>
                  </div>

                  <div className="flex items-center justify-between pt-2.5 border-t border-slate-100">
                    <div>
                      <span className="text-[9px] text-slate-400 font-bold uppercase block tracking-wider">Gross Total</span>
                      <span className="text-xs font-black text-slate-900">৳ {order.total.toLocaleString('en-IN')}</span>
                    </div>
                    <Button
                      type="default"
                      size="small"
                      icon={<Eye className="w-3.5 h-3.5 text-slate-600" />}
                      onClick={() => handleOpenDrawer(order)}
                      className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 h-8 bg-slate-50 border-slate-200"
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              )
            })}
            {sortedOrders.length === 0 && (
              <div className="bg-white rounded-md border border-slate-200 p-8 text-center text-xs text-slate-400">
                No localized logistics accounts mapped to this query.
              </div>
            )}
          </div>
        </div>
      </main>

      <Drawer
        title={
          <div className="flex items-center gap-2">
            <span className="font-mono font-black text-slate-900 text-sm">{selectedOrder?.id}</span>
            {selectedOrder && (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-sm bg-slate-100 border border-slate-200 text-slate-700 font-bold text-[10px] uppercase">
                <span className={`w-1.5 h-1.5 rounded-full ${statusConfig[selectedOrder.status as keyof typeof statusConfig]?.dotColor}`} />
                {statusConfig[selectedOrder.status as keyof typeof statusConfig]?.label}
              </span>
            )}
          </div>
        }
        placement="right"
        width={typeof window !== 'undefined' && window.innerWidth < 640 ? '100%' : 500}
        onClose={() => setIsDrawerOpen(false)}
        open={isDrawerOpen}
        styles={{ body: { padding: '16px sm:padding:20px' } }}
        className="max-w-full"
        extra={
          <Space>
            <Button size="small" type="default" className="text-xs font-bold rounded-sm hover:border-[#23496b]! hover:text-[#23496b]!">Print Invoice</Button>
          </Space>
        }
      >
        {selectedOrder && (
          <div className="space-y-5 text-xs">
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2">Logistics Scope Statement</p>
              <div className="bg-slate-50 border border-slate-200 rounded-sm p-3 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-4">
                  <div>
                    <span className="text-slate-400 block font-medium items-center gap-1">
                      <FileText className="w-3 h-3 text-slate-400 inline mr-1" /> Dealer Account
                    </span>
                    <span className="font-bold text-slate-800">{selectedOrder.customer}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Contact Node</span>
                    <span className="font-bold text-slate-700 font-mono">{selectedOrder.phone}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400 inline mr-1" /> Staged Date
                    </span>
                    <span className="font-bold text-slate-700">{selectedOrder.date}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium items-center gap-1">
                      <DollarSign className="w-3 h-3 text-slate-400 inline mr-1" /> Settlement Protocol
                    </span>
                    <span className="font-bold text-slate-800">{selectedOrder.paymentMethod}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5" /> Distribution Waybill
              </h3>
              <div className="border border-slate-200 rounded-sm p-3 space-y-3 bg-white">
                <div className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                  <div>
                    <span className="text-slate-400 block font-medium">Delivery Base Station</span>
                    <p className="font-bold text-slate-800 mt-0.5 leading-relaxed">{selectedOrder.address}</p>
                  </div>
                </div>
                <Divider className="my-1.5" />
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                  <div>
                    <span className="text-slate-400 block font-medium">Dispatched Freight Mode</span>
                    <span className="font-bold text-slate-800">{selectedOrder.shippingMethod}</span>
                  </div>
                  <span className="inline-flex items-center self-start sm:self-auto px-2 py-0.5 font-bold text-[9px] uppercase border border-slate-200 rounded-sm bg-slate-50 text-slate-600">Authorized Fleet</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <ShoppingBag className="w-3.5 h-3.5" /> Product Dispatches
              </h3>
              <div className="border border-slate-200 rounded-sm overflow-hidden bg-white overflow-x-auto">
                <table className="w-full text-xs min-w-95">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="px-3 py-2 text-left">Product Item</th>
                      <th className="px-3 py-2 text-center">Bags</th>
                      <th className="px-3 py-2 text-right">Unit</th>
                      <th className="px-3 py-2 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {selectedOrder.productsList.map((prod, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50">
                        <td className="px-3 py-2.5">
                          <p className="font-bold text-slate-900">{prod.name}</p>
                          <span className="text-[9px] text-slate-400 font-bold font-mono">SKU: {prod.sku} | {prod.size}</span>
                        </td>
                        <td className="px-3 py-2.5 text-center font-bold text-slate-900">{prod.quantity}</td>
                        <td className="px-3 py-2.5 text-right text-slate-400">৳ {prod.unitPrice.toLocaleString('en-IN')}</td>
                        <td className="px-3 py-2.5 text-right font-bold text-slate-900">৳ {prod.total.toLocaleString('en-IN')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-sm p-3.5">
              <div className="space-y-1.5">
                <div className="flex justify-between text-slate-500 font-medium">
                  <span>Gross Item Subtotal:</span>
                  <span className="text-slate-900 font-bold">৳ {selectedOrder.total.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-slate-500 font-medium">
                  <span>AIT (Advance Income Tax) & VAT:</span>
                  <span className="text-slate-800 font-bold">Included</span>
                </div>
                <div className="flex justify-between text-slate-500 font-medium">
                  <span>FOB Transport Surcharge:</span>
                  <span className="text-slate-800 font-bold">৳ 0</span>
                </div>
                <Divider dashed className="my-2" />
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-wide">Net Payables:</span>
                  <Statistic
                    value={selectedOrder.total}
                    prefix="৳"
                    styles={{
                      content: { fontSize: '18px', fontWeight: 900, color: '#23496b' }
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  )
}