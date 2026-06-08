'use client'

import { Sidebar } from '@/components/sidebar'
import { Header } from '@/components/header'
import {
  Search,
  MapPin,
  Phone,
  Calendar,
  Package,
  CheckCircle,
  Truck,
  Download,
  ChevronRight,
  Home,
  FileText,
} from 'lucide-react'
import { useState, useEffect, useCallback } from 'react'
import {
  Table,
  Input,
  Button,
  Drawer,
  Spin,
  message,
  Tag,
  Divider,
  Descriptions,
  ConfigProvider
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import axios from 'axios'
import { ACCESS_TOKEN } from '@/lib/values'

const API_BASE = 'https://api.salesense.logiqbits.com'

interface DeliveryItem {
  productName: string
  variantName: string
  deliveredQty: number
  unitPrice: number
  subTotal: number
  totalWithVat: number
}

interface DeliveryDataType {
  id: string
  serial: number
  orderId: string
  receiptNumber: string
  status: string
  deliveryDate: string
  dispatcherName: string
  vehicleNo: string
  transporterInfo: string
  note: string
  items: DeliveryItem[]
  rawDate: number
}

const statusConfig: Record<string, { dotColor: string; label: string; bg: string; text: string }> = {
  PLN: { dotColor: 'bg-amber-500', label: 'Planned', bg: 'bg-amber-100', text: 'text-amber-800' },
  DSP: { dotColor: 'bg-blue-500', label: 'Dispatched', bg: 'bg-blue-100', text: 'text-brand-secondary' },
  DLV: { dotColor: 'bg-emerald-500', label: 'Delivered', bg: 'bg-emerald-100', text: 'text-emerald-800' },
}

function formatDate(ts: number | string): string {
  const n = typeof ts === 'string' ? parseInt(ts, 10) : ts
  if (!n) return '-'
  const d = new Date(n)
  return d.toLocaleDateString('en-CA')
}

function resolveStatus(status?: string): string {
  if (!status) return 'PLN'
  const s = status.toUpperCase().trim()
  if (['PLN', 'DSP', 'DLV'].includes(s)) return s
  // Fallback mapping from old/verbose status values
  const lower = s.toLowerCase()
  if (lower.includes('DELIVER')) return 'DLV'
  if (lower.includes('DISPATCH')) return 'DSP'
  if (lower.includes('PLAN')) return 'PLN'
  return 'PLN'
}

export default function DeliveriesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null)

  const [deliveries, setDeliveries] = useState<DeliveryDataType[]>([])
  const [loading, setLoading] = useState(false)

  const [selectedDelivery, setSelectedDelivery] = useState<DeliveryDataType | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [downloadingId, setDownloadingId] = useState<string | null>(null)

  const [sidebarOpen, setSidebarOpen] = useState(false)

  const fetchDeliveries = useCallback(async () => {
    setLoading(true)
    try {
      const res = await axios.get(`${API_BASE}/deliveries?fromDate=100000`, {
        headers: { Authorization: `Bearer ${ACCESS_TOKEN}` },
      })
      const data = Array.isArray(res.data) ? res.data : res.data?.data ?? []
      const mapped: DeliveryDataType[] = data.map((d: any) => ({
        id: `DLV-${d.id ?? d.deliverySerial ?? Math.floor(Math.random() * 900000)}`,
        serial: d.deliverySerial ?? d.id,
        orderId: `ORD-${d.orderId ?? '-'}`,
        receiptNumber: d.receiptNumber || '-',
        status: resolveStatus(d.status),
        deliveryDate: formatDate(d.deliveryDate),
        dispatcherName: d.dispatcherName || 'N/A',
        vehicleNo: d.vehicleNo || 'N/A',
        transporterInfo: d.transporterInfo || 'N/A',
        note: d.note || '',
        items: Array.isArray(d.items)
          ? d.items.map((it: any) => ({
            productName: it.productName || 'Product',
            variantName: it.variantName || '',
            deliveredQty: it.deliveredQty ?? 0,
            unitPrice: it.unitPrice ?? 0,
            subTotal: it.subTotal ?? 0,
            totalWithVat: it.totalWithVat ?? 0,
          }))
          : [],
        rawDate: d.deliveryDate || 0,
      }))
      setDeliveries(mapped)
    } catch (err: any) {
      message.error(
        `Failed to load deliveries: ${err?.response?.data?.message || err?.message || 'Unknown error'}`
      )
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchDeliveries()
  }, [fetchDeliveries])

  const downloadChallan = async (deliveryId: string) => {
    const numericId = deliveryId.replace('DLV-', '')
    setDownloadingId(deliveryId)
    try {
      const res = await axios.get(
        `${API_BASE}/deliveries/${numericId}/challan.pdf`,
        {
          headers: { Authorization: `Bearer ${ACCESS_TOKEN}` },
          responseType: 'blob',
        }
      )
      const blob = new Blob([res.data], { type: 'application/pdf' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `challan-${deliveryId}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      message.success('Challan downloaded successfully')
    } catch (err: any) {
      message.error(
        `Download failed: ${err?.response?.data?.message || err?.message || 'Unknown error'}`
      )
    } finally {
      setDownloadingId(null)
    }
  }

  const filteredDeliveries = deliveries.filter((d) => {
    const matchesSearch =
      d.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.dispatcherName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.vehicleNo.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = !selectedStatus || d.status === selectedStatus
    return matchesSearch && matchesStatus
  })

  const statuses = ['PLN', 'DSP', 'DLV']

  const handleOpenDrawer = (delivery: DeliveryDataType) => {
    setSelectedDelivery(delivery)
    setIsDrawerOpen(true)
  }

  const columns: ColumnsType<DeliveryDataType> = [
    {
      title: 'Delivery ID',
      dataIndex: 'id',
      key: 'id',
      width: 140,
      align: 'left',
      className: 'text-sm font-bold text-slate-900 font-mono tracking-tight pl-4',
    },
    {
      title: 'Order ID',
      dataIndex: 'orderId',
      key: 'orderId',
      width: 130,
      align: 'left',
      className: 'text-sm font-semibold text-slate-800',
    },
    {
      title: 'Delivery Date',
      dataIndex: 'deliveryDate',
      key: 'deliveryDate',
      width: 120,
      align: 'left',
      className: 'text-sm text-slate-500 font-medium',
    },
    {
      title: 'Vehicle',
      dataIndex: 'vehicleNo',
      key: 'vehicleNo',
      width: 110,
      align: 'left',
      className: 'text-sm text-slate-500 font-medium',
    },
    {
      title: 'Dispatcher',
      dataIndex: 'dispatcherName',
      key: 'dispatcherName',
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
      title: 'Action',
      key: 'action',
      width: 140,
      align: 'center',
      render: (_, record) => (
        <div className="flex items-center justify-center gap-1">
          <Button
            type="default"
            icon={<FileText className="w-3.5 h-3.5 text-slate-500" />}
            onClick={() => handleOpenDrawer(record)}
            className="inline-flex items-center justify-center rounded-sm w-8 h-8 bg-white shadow-xs hover:border-slate-300"
            title="View details"
          />
          <Button
            type="default"
            icon={<Download className="w-3.5 h-3.5 text-slate-500" />}
            loading={downloadingId === record.id}
            onClick={() => downloadChallan(record.id)}
            className="inline-flex items-center justify-center rounded-sm w-8 h-8 bg-white shadow-xs hover:border-slate-300"
            title="Download challan"
          />
        </div>
      ),
    },
  ]

  return (
    <div className="flex h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 overflow-auto md:ml-0 flex flex-col w-full">
        <div className="bg-brand-secondary text-white shrink-0">
          <Header
            title="Delivery Tracking"
            subtitle="Real-time tracking of your shipments"
            onMenuToggle={() => setSidebarOpen(true)}
          />
        </div>

        <div className="bg-white border-b border-slate-200 px-4 sm:px-6 py-2.5 flex items-center gap-2 text-xs text-slate-500 font-medium shrink-0 overflow-x-auto whitespace-nowrap scrollbar-none">
          <Home className="w-3.5 h-3.5 text-brand-secondary shrink-0" />
          <span className="text-brand-secondary font-semibold hover:underline cursor-pointer">
            Home
          </span>
          <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
          <span className="text-brand-secondary font-semibold hover:underline cursor-pointer">
            Operations
          </span>
          <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
          <span className="text-slate-600">Delivery Tracking</span>
        </div>

        <div className="p-4 sm:p-6 space-y-4 flex-1 overflow-auto w-full">
          <div className="bg-white rounded-md border border-slate-200 p-4 space-y-3.5 shadow-xs">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 w-full">
                <Input
                  prefix={
                    <Search className="w-3.5 h-3.5 text-slate-400 mr-1" />
                  }
                  placeholder="Search by Delivery ID, Order ID, Vehicle or Dispatcher..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  allowClear
                  className="rounded-sm text-xs h-9 w-full"
                />
              </div>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 border-t border-slate-100 pt-3 scrollbar-thin">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-2 shrink-0">
                Status:
              </span>
              <button
                onClick={() => setSelectedStatus(null)}
                className={`px-3 py-1 rounded-sm text-[11px] font-bold transition-all uppercase tracking-wide shrink-0 ${!selectedStatus
                  ? 'bg-brand-secondary text-white border border-[#23496b]'
                  : 'bg-slate-100 text-slate-600 border border-slate-200/60 hover:bg-slate-200'
                  }`}
              >
                All Shipments
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
              <ConfigProvider
                theme={{
                  components: {
                    Table: {
                      fontSize: 12,          // Sets internal body content font tracking rules
                      fontSizeSM: 11,        // Overrides size="small" table fonts explicitly
                      paddingXS: 8,          // Condenses cellular padding height grids
                      headerBg: '#0191da',
                    },
                  },
                }}
              ><Table
                  columns={columns}
                  dataSource={filteredDeliveries}
                  rowKey="id"
                  size="middle"
                  pagination={{
                    pageSize: 5,
                    showSizeChanger: false,
                    placement: ['bottomRight'] as any,
                    className:
                      'px-4 py-3 m-0 border-t border-slate-100 text-xs font-medium',
                  }}
                  locale={{ emptyText: 'No deliveries found.' }}
                /></ConfigProvider>

            </Spin>
          </div>

          <div className="block md:hidden space-y-3">
            {filteredDeliveries.map((delivery) => {
              const config =
                statusConfig[delivery.status as keyof typeof statusConfig] ||
                statusConfig.pending
              return (
                <div
                  key={delivery.id}
                  className="bg-white border border-slate-200 rounded-md p-4 shadow-2xs space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-900 font-mono tracking-tight">
                      {delivery.id}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-sm bg-slate-50 border border-slate-200/80 text-slate-700 font-bold text-[10px] tracking-wide">
                      <span className={`w-1 h-1 rounded-full ${config.dotColor}`} />
                      {config.label}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-800 line-clamp-1">
                      {delivery.orderId}
                    </p>
                    <p className="text-[11px] text-slate-500 font-medium line-clamp-1">
                      {delivery.vehicleNo} | {delivery.dispatcherName}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2.5 border-t border-slate-100">
                    <div>
                      <span className="text-[9px] text-slate-400 font-bold uppercase block tracking-wider">
                        Delivery Date
                      </span>
                      <span className="text-xs font-black text-slate-900">
                        {delivery.deliveryDate}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        type="default"
                        size="small"
                        icon={<FileText className="w-3.5 h-3.5 text-slate-600" />}
                        onClick={() => handleOpenDrawer(delivery)}
                        className="inline-flex items-center justify-center w-7 h-7 bg-slate-50 border-slate-200"
                        title="View details"
                      />
                      <Button
                        type="default"
                        size="small"
                        loading={downloadingId === delivery.id}
                        icon={<Download className="w-3.5 h-3.5 text-slate-600" />}
                        onClick={() => downloadChallan(delivery.id)}
                        className="inline-flex items-center justify-center w-7 h-7 bg-slate-50 border-slate-200"
                        title="Download challan"
                      />
                    </div>
                  </div>
                </div>
              )
            })}
            {filteredDeliveries.length === 0 && !loading && (
              <div className="bg-white rounded-md border border-slate-200 p-8 text-center text-xs text-slate-400">
                No deliveries found.
              </div>
            )}
          </div>
        </div>
      </main>

      <Drawer
        title={
          <div className="flex items-center gap-2">
            <span className="font-mono font-black text-slate-900 text-sm">
              {selectedDelivery?.id}
            </span>
            {selectedDelivery && (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-sm bg-slate-100 border border-slate-200 text-slate-700 font-bold text-[10px] uppercase">
                <span
                  className={`w-1.5 h-1.5 rounded-full ${statusConfig[
                    selectedDelivery.status as keyof typeof statusConfig
                  ]?.dotColor
                    }`}
                />
                {
                  statusConfig[
                    selectedDelivery.status as keyof typeof statusConfig
                  ]?.label
                }
              </span>
            )}
          </div>
        }
        placement="right"
        width={
          typeof window !== 'undefined' && window.innerWidth < 640
            ? '100%'
            : 720
        }
        onClose={() => setIsDrawerOpen(false)}
        open={isDrawerOpen}
        styles={{ body: { padding: '16px sm:padding:20px' } }}
        className="max-w-full"
        extra={
          selectedDelivery && (
            <Button
              size="small"
              type="default"
              icon={<Download className="w-3.5 h-3.5" />}
              loading={downloadingId === selectedDelivery.id}
              onClick={() => downloadChallan(selectedDelivery.id)}
              className="text-xs font-bold rounded-sm hover:border-[#23496b]! hover:text-[#23496b]!"
            >
              Challan PDF
            </Button>
          )
        }
      >
        {selectedDelivery && (
          <div className="space-y-5 text-xs">
            <Descriptions
              title="Delivery Info"
              bordered
              size="small"
              column={1}
              layout="horizontal"
              labelStyle={{ fontWeight: 600, color: '#64748B', width: '40%', fontSize: '14px' }}
              contentStyle={{ fontWeight: 700, color: '#1E293B', fontSize: '14px' }}
            >
              <Descriptions.Item label="Order ID">
                {selectedDelivery.orderId}
              </Descriptions.Item>
              <Descriptions.Item label="Receipt No">
                {selectedDelivery.receiptNumber}
              </Descriptions.Item>
              <Descriptions.Item label="Delivery Date">
                {selectedDelivery.deliveryDate}
              </Descriptions.Item>
              <Descriptions.Item label="Vehicle">
                {selectedDelivery.vehicleNo}
              </Descriptions.Item>
            </Descriptions>

            <Descriptions
              title="Dispatcher & Transport"
              bordered
              size="small"
              column={1}
              layout="horizontal"
              labelStyle={{ fontWeight: 600, color: '#64748B', width: '40%', fontSize: '14px' }}
              contentStyle={{ fontWeight: 700, color: '#1E293B', fontSize: '14px' }}
            >
              <Descriptions.Item label="Dispatcher">
                {selectedDelivery.dispatcherName}
              </Descriptions.Item>
              <Descriptions.Item label="Transporter Info">
                {selectedDelivery.transporterInfo}
              </Descriptions.Item>
              {selectedDelivery.note && (
                <Descriptions.Item label="Note">
                  {selectedDelivery.note}
                </Descriptions.Item>
              )}
            </Descriptions>

            <div className="space-y-2">
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Package className="w-3.5 h-3.5" /> Delivered Items
              </h3>
              <div className="border border-slate-200 rounded-sm overflow-hidden bg-white overflow-x-auto">
                <table className="w-full text-xs min-w-95">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="px-3 py-2 text-left">Product</th>
                      <th className="px-3 py-2 text-center">Qty</th>
                      <th className="px-3 py-2 text-right">Unit</th>
                      <th className="px-3 py-2 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {selectedDelivery.items.length > 0 ? (
                      selectedDelivery.items.map((it, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50">
                          <td className="px-3 py-2.5">
                            <p className="font-bold text-slate-900">{it.productName}</p>
                            <span className="text-[9px] text-slate-400 font-bold font-mono">
                              {it.variantName}
                            </span>
                          </td>
                          <td className="px-3 py-2.5 text-center font-bold text-slate-900">
                            {it.deliveredQty}
                          </td>
                          <td className="px-3 py-2.5 text-right text-slate-400">
                            TK {it.unitPrice.toLocaleString('en-IN')}
                          </td>
                          <td className="px-3 py-2.5 text-right font-bold text-slate-900">
                            TK {it.totalWithVat.toLocaleString('en-IN')}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="px-3 py-4 text-center text-slate-400">
                          No delivery items found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {selectedDelivery.items.length > 0 && (
              <div className="bg-slate-50 border border-slate-200 rounded-sm p-3.5">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-slate-500 font-medium">
                    <span>Subtotal:</span>
                    <span className="text-slate-900 font-bold">
                      TK {selectedDelivery.items.reduce((s, it) => s + it.subTotal, 0).toLocaleString('en-IN')}
                    </span>
                  </div>
                  <Divider dashed className="my-2" />
                  <div className="flex justify-between items-center">
                    <span style={{ fontSize: '14px', fontWeight: 700, color: '#1E293B' }}>
                      Total with VAT:
                    </span>
                    <span style={{ fontSize: '18px', fontWeight: 900, color: '#23496b' }}>
                      TK {selectedDelivery.items.reduce((s, it) => s + it.totalWithVat, 0).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </Drawer>
    </div>
  )
}
