'use client'

import { Sidebar } from '@/components/sidebar'
import { Header } from '@/components/header'
import {
  Search,
  Download,
  Eye,
  Calendar,
  Truck,
  MapPin,
  DollarSign,
  FileText,
  ShoppingBag,
  ChevronRight,
  Home,
} from 'lucide-react'
import { useState, useEffect, useCallback } from 'react'
import {
  Table,
  Input,
  Select,
  Button,
  Drawer,
  Space,
  Statistic,
  Divider,
  Spin,
  message,
  Descriptions,
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import axios from 'axios'
import { ACCESS_TOKEN, customerInfo } from '@/lib/values'

const API_BASE = 'https://api.salesense.logiqbits.com'

interface OrderProduct {
  sku: string
  name: string
  quantity: number
  unitPrice: number
  total: number
  size: string
}

interface OrderDataType {
  id: string
  serial: number
  date: string
  items: string
  status: string
  total: number
  customer: string
  phone: string
  address: string
  shippingMethod: string
  paymentMethod: string
  productsList: OrderProduct[]
}

const statusConfig: Record<
  string,
  { dotColor: string; label: string; bg?: string; text?: string }
> = {
  PND: { dotColor: 'bg-amber-500', label: 'Pending' },
  AP1: { dotColor: 'bg-blue-500', label: 'SM Approval' },
  AP2: { dotColor: 'bg-indigo-500', label: 'Admin Approval' },
  SHP: { dotColor: 'bg-purple-500', label: 'Shipped' },
  CMP: { dotColor: 'bg-emerald-500', label: 'Completed' },
}

function formatDate(ts: number | string): string {
  const n = typeof ts === 'string' ? parseInt(ts, 10) : ts
  if (!n) return '-'
  const d = new Date(n)
  return d.toLocaleDateString('en-CA')
}

function resolveStatus(status?: string): string {
  if (!status) return 'PND'
  const s = status.toUpperCase().trim()
  if (['PND', 'AP1', 'AP2', 'SHP', 'CMP'].includes(s)) return s
  // Fallback mapping from old/verbose status values
  const lower = s.toLowerCase()
  if (lower.includes('COMP')) return 'CMP'
  if (lower.includes('SHIP')) return 'SHP'
  if (lower.includes('ADMIN') || lower.includes('AP2')) return 'AP2'
  if (lower.includes('SM') || lower.includes('AP1')) return 'AP1'
  if (lower.includes('PEND') || lower.includes('PND')) return 'PND'
  return 'PND'
}

export default function OrdersPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState('date')

  const [orders, setOrders] = useState<OrderDataType[]>([])
  const [loading, setLoading] = useState(false)

  const [selectedOrder, setSelectedOrder] = useState<OrderDataType | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [drawerProducts, setDrawerProducts] = useState<OrderProduct[]>([])
  const [drawerLoading, setDrawerLoading] = useState(false)

  const [sidebarOpen, setSidebarOpen] = useState(false)

  const fetchOrders = useCallback(async () => {
    setLoading(true)
    try {
      const res = await axios.get(`${API_BASE}/me-user/area-orders?fromDate=1000000`, {
        headers: { Authorization: `Bearer ${ACCESS_TOKEN}` },
      })
      const data = Array.isArray(res.data) ? res.data : res.data?.data ?? []
      const mapped: OrderDataType[] = data.map((o: any) => ({
        id: `ORD-${o.id ?? o.serial ?? Math.floor(Math.random() * 900000)}`,
        serial: o.serial ?? o.id,
        date: formatDate(o.dateTime),
        items: o.note || o.deliveryAddress || 'Order dispatched',
        status: resolveStatus(o.status),
        total: o.totalAmount ?? o.payableAmount ?? 0,
        customer: o.customerName || customerInfo.businessName,
        phone: '+880 1711-094321',
        address: o.deliveryAddress || 'Natore Sadar',
        shippingMethod: 'Ex-Mill Sirajganj Delivery',
        paymentMethod: 'Dealer Credit Line Account',
        productsList: [],
      }))
      setOrders(mapped)
    } catch (err: any) {
      message.error(
        `Failed to load orders: ${err?.response?.data?.message || err?.message || 'Unknown error'}`
      )
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  const fetchOrderProducts = async (orderId: string) => {
    const numericId = orderId.replace('ORD-', '')
    setDrawerLoading(true)
    try {
      const res = await axios.get(`${API_BASE}/orders/${numericId}/products`, {
        headers: { Authorization: `Bearer ${ACCESS_TOKEN}` },
      })
      const data = Array.isArray(res.data)
        ? res.data
        : res.data?.data ?? []
      const mapped: OrderProduct[] = data.map((p: any) => ({
        sku: p.variant?.sku || p.product?.code || 'N/A',
        name: p.product?.name || p.variant?.name || 'Product',
        quantity: p.quantity ?? 0,
        unitPrice: p.price ?? 0,
        total: p.subTotal ?? p.totalWithVat ?? (p.price ?? 0) * (p.quantity ?? 0),
        size: p.variant?.unit
          ? `${p.variant.baseUnitSize || ''}${p.variant.unit}`
          : 'Standard',
      }))
      setDrawerProducts(mapped)
    } catch (err: any) {
      setDrawerProducts([])
    } finally {
      setDrawerLoading(false)
    }
  }

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus =
      !selectedStatus || order.status === selectedStatus
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

  const statuses = ['PND', 'AP1', 'AP2', 'SHP', 'CMP']

  const handleOpenDrawer = (order: OrderDataType) => {
    setSelectedOrder(order)
    setIsDrawerOpen(true)
    fetchOrderProducts(order.id)
  }

  const columns: ColumnsType<OrderDataType> = [
    {
      title: 'Order ID',
      dataIndex: 'id',
      key: 'id',
      width: 140,
      align: 'left',
      className: 'text-sm font-bold text-slate-900 font-mono tracking-tight pl-4',
    },
    {
      title: 'Customer Dealer / Farm',
      dataIndex: 'customer',
      key: 'customer',
      align: 'left',
      ellipsis: true,
      className: 'text-sm font-semibold text-slate-800',
    },
    {
      title: 'Staged Date',
      dataIndex: 'date',
      key: 'date',
      width: 120,
      align: 'left',
      className: 'text-sm text-slate-500 font-medium',
    },
    {
      title: 'Distribution Summary',
      dataIndex: 'items',
      key: 'items',
      align: 'left',
      ellipsis: true,
      className: 'text-sm text-slate-500 font-medium',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      align: 'left',
      render: (status: string) => {
        const config =
          statusConfig[status as keyof typeof statusConfig] ||
          statusConfig.pending
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-50 border border-slate-200/80 text-slate-700 font-semibold text-sm tracking-wide">
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
        <span className="font-bold text-slate-900 text-sm tracking-tight pr-4">
          TK {value.toLocaleString('en-IN')}
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

  const displayProducts =
    drawerProducts.length > 0 ? drawerProducts : selectedOrder?.productsList ?? []

  return (
    <div className="flex h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 overflow-auto md:ml-0 flex flex-col w-full">
        <div className="bg-brand-secondary text-white shrink-0">
          <Header
            title="SalesSense"
            subtitle="Navigate To Your Menu"
            onMenuToggle={() => setSidebarOpen(true)}
            actions={
              <button className="flex items-center gap-2 px-3 py-1.5 bg-brand-secondary/30 hover:bg-[#152842]/50 text-white border border-white/20 rounded-sm font-bold text-xs tracking-wide transition-colors">
                <Download className="w-3.5 h-3.5" />
                Export Channel Data
              </button>
            }
          />
        </div>

        <div className="bg-white border-b border-slate-200 px-4 sm:px-6 py-2.5 flex items-center gap-2 text-xs text-slate-500 font-medium shrink-0 overflow-x-auto whitespace-nowrap scrollbar-none">
          <Home className="w-3.5 h-3.5 text-brand-secondary shrink-0" />
          <span className="text-brand-secondary font-semibold hover:underline cursor-pointer">
            Home
          </span>
          <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
          <span className="text-brand-secondary font-semibold hover:underline cursor-pointer">
            Sales
          </span>
          <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
          <span className="text-slate-600">Order Management</span>
        </div>

        <div className="p-4 sm:p-6 space-y-4 flex-1 overflow-auto w-full">
          <div className="bg-white rounded-md border border-slate-200 p-4 space-y-3.5 shadow-xs">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 w-full">
                <Input
                  prefix={
                    <Search className="w-3.5 h-3.5 text-slate-400 mr-1" />
                  }
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
                    root: 'rounded-sm text-xs font-medium',
                  },
                }}
                options={[
                  { value: 'date', label: 'Sort by Entry Date' },
                  { value: 'total', label: 'Sort by Gross Value (BDT)' },
                ]}
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 border-t border-slate-100 pt-3 scrollbar-thin">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-2 shrink-0">
                Nodes:
              </span>
              <button
                onClick={() => setSelectedStatus(null)}
                className={`px-3 py-1 rounded-sm text-[11px] font-bold transition-all uppercase tracking-wide shrink-0 ${!selectedStatus
                  ? 'bg-brand-secondary text-white border border-[#23496b]'
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
                    ? 'bg-brand-secondary text-white border border-[#23496b]'
                    : 'bg-slate-100 text-slate-600 border border-slate-200/60 hover:bg-slate-200'
                    }`}
                >
                  {statusConfig[status as keyof typeof statusConfig].label}
                </button>
              ))}
            </div>
          </div>

          <div className="hidden md:block bg-white rounded-md border border-slate-200 shadow-xs overflow-hidden">
            <Spin spinning={loading}>
              <Table
                columns={columns}
                dataSource={sortedOrders}
                rowKey="id"
                size="middle"
                pagination={{
                  pageSize: 5,
                  showSizeChanger: false,
                  placement: ['bottomRight'] as any,
                  className:
                    'px-4 py-3 m-0 border-t border-slate-100 text-xs font-medium',
                }}
                locale={{
                  emptyText:
                    'No localized logistics accounts mapped to this query.',
                }}
              />
            </Spin>
          </div>

          <div className="block md:hidden space-y-3">
            {sortedOrders.map((order) => {
              const config =
                statusConfig[order.status as keyof typeof statusConfig] ||
                statusConfig.pending
              return (
                <div
                  key={order.id}
                  className="bg-white border border-slate-200 rounded-md p-4 shadow-2xs space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-900 font-mono tracking-tight">
                      {order.id}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-sm bg-slate-50 border border-slate-200/80 text-slate-700 font-bold text-[10px] tracking-wide">
                      <span className={`w-1 h-1 rounded-full ${config.dotColor}`} />
                      {config.label}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-800 line-clamp-1">
                      {order.customer}
                    </p>
                    <p className="text-[11px] text-slate-500 font-medium line-clamp-1">
                      {order.items}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2.5 border-t border-slate-100">
                    <div>
                      <span className="text-[9px] text-slate-400 font-bold uppercase block tracking-wider">
                        Gross Total
                      </span>
                      <span className="text-xs font-black text-slate-900">
                        TK {order.total.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <Button
                      type="default"
                      size="small"
                      icon={<Eye className="w-3.5 h-3.5 text-slate-600" />}
                      onClick={() => handleOpenDrawer(order)}
                      className="inline-flex items-center gap-1 text-sm font-semibold px-2.5 h-8 bg-slate-50 border-slate-200"
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              )
            })}
            {sortedOrders.length === 0 && !loading && (
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
            <span className="font-mono font-black text-slate-900 text-sm">
              {selectedOrder?.id}
            </span>
            {selectedOrder && (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-sm bg-slate-100 border border-slate-200 text-slate-700 font-bold text-[10px] uppercase">
                <span
                  className={`w-1.5 h-1.5 rounded-full ${statusConfig[
                    selectedOrder.status as keyof typeof statusConfig
                  ]?.dotColor
                    }`}
                />
                {
                  statusConfig[
                    selectedOrder.status as keyof typeof statusConfig
                  ]?.label
                }
              </span>
            )}
          </div>
        }
        placement="right"
        size={
          typeof window !== 'undefined' && window.innerWidth < 640
            ? '100%'
            : 720
        }
        onClose={() => setIsDrawerOpen(false)}
        open={isDrawerOpen}
        styles={{ body: { padding: '16px sm:padding:20px' } }}
        className="max-w-full"
        extra={
          <Space>
            <Button
              size="small"
              type="default"
              className="text-xs font-bold rounded-sm hover:border-[#23496b]! hover:text-[#23496b]!"
            >
              Print Invoice
            </Button>
          </Space>
        }
      >
        {selectedOrder && (
          <div className="space-y-5 text-xs">
            <Descriptions
              title="Logistics Scope Statement"
              bordered
              size="small"
              column={1}
              layout="horizontal"
              labelStyle={{ fontWeight: 600, color: '#64748B', width: '40%', fontSize: '14px' }}
              contentStyle={{ fontWeight: 700, color: '#1E293B', fontSize: '14px' }}
            >
              <Descriptions.Item label="Dealer Account">
                {selectedOrder.customer}
              </Descriptions.Item>
              <Descriptions.Item label="Contact Node">
                {selectedOrder.phone}
              </Descriptions.Item>
              <Descriptions.Item label="Staged Date">
                {selectedOrder.date}
              </Descriptions.Item>
              <Descriptions.Item label="Settlement Protocol">
                {selectedOrder.paymentMethod}
              </Descriptions.Item>
            </Descriptions>

            <Descriptions
              title="Distribution Waybill"
              bordered
              size="small"
              column={1}
              layout="horizontal"
              labelStyle={{ fontWeight: 600, color: '#64748B', width: '40%', fontSize: '14px' }}
              contentStyle={{ fontWeight: 700, color: '#1E293B', fontSize: '14px' }}
            >
              <Descriptions.Item label="Delivery Base Station">
                {selectedOrder.address}
              </Descriptions.Item>
              <Descriptions.Item label="Dispatched Freight Mode">
                {selectedOrder.shippingMethod}
              </Descriptions.Item>
            </Descriptions>

            <div className="space-y-2">
              <h3 className="text-[13px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <ShoppingBag className="w-3.5 h-3.5" /> Product Dispatches
              </h3>
              <div className="border border-slate-200 rounded-sm overflow-hidden bg-white">
                <Spin spinning={drawerLoading}>
                  <Table
                    columns={[
                      {
                        title: <span style={{ fontSize: '14px' }}>Product Item</span>,
                        dataIndex: 'name',
                        key: 'name',
                        render: (_: string, record: OrderProduct) => (
                          <div>
                            <p style={{ fontSize: '14px', fontWeight: 700, color: '#1E293B' }}>{record.name}</p>
                            <span style={{ fontSize: '14px', color: '#94A3B8', fontFamily: 'monospace' }}>
                              SKU: {record.sku} | {record.size}
                            </span>
                          </div>
                        ),
                      },
                      {
                        title: <span style={{ fontSize: '14px' }}>Bags</span>,
                        dataIndex: 'quantity',
                        key: 'quantity',
                        align: 'center',
                        render: (qty: number) => <span style={{ fontSize: '14px', fontWeight: 700, color: '#1E293B' }}>{qty}</span>,
                      },
                      {
                        title: <span style={{ fontSize: '14px' }}>Unit</span>,
                        dataIndex: 'unitPrice',
                        key: 'unitPrice',
                        align: 'right',
                        render: (price: number) => <span style={{ fontSize: '14px', color: '#64748B' }}>TK {price.toLocaleString('en-IN')}</span>,
                      },
                      {
                        title: <span style={{ fontSize: '14px' }}>Total</span>,
                        dataIndex: 'total',
                        key: 'total',
                        align: 'right',
                        render: (total: number) => <span style={{ fontSize: '14px', fontWeight: 700, color: '#1E293B' }}>TK {total.toLocaleString('en-IN')}</span>,
                      },
                    ]}
                    dataSource={displayProducts}
                    rowKey={(r) => r.sku}
                    pagination={false}
                    size="small"
                    locale={{ emptyText: 'No product line items found.' }}
                  />
                </Spin>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-sm p-3.5">
              <div className="space-y-1.5">
                <div className="flex justify-between" style={{ fontSize: '14px', fontWeight: 500, color: '#64748B' }}>
                  <span>Gross Item Subtotal:</span>
                  <span style={{ fontWeight: 700, color: '#1E293B' }}>
                    TK {selectedOrder.total.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between" style={{ fontSize: '14px', fontWeight: 500, color: '#64748B' }}>
                  <span>AIT (Advance Income Tax) & VAT:</span>
                  <span style={{ fontWeight: 700, color: '#1E293B' }}>Included</span>
                </div>
                <div className="flex justify-between" style={{ fontSize: '14px', fontWeight: 500, color: '#64748B' }}>
                  <span>FOB Transport Surcharge:</span>
                  <span style={{ fontWeight: 700, color: '#1E293B' }}>TK 0</span>
                </div>
                <Divider dashed className="my-2" />
                <div className="flex justify-between items-center">
                  <span style={{ fontSize: '14px', fontWeight: 700, color: '#1E293B' }}>
                    Net Payables:
                  </span>
                  <span style={{ fontSize: '18px', fontWeight: 900, color: '#23496b' }}>
                    TK {selectedOrder.total.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  )
}
