'use client'

import { Sidebar } from '@/components/sidebar'
import { Header } from '@/components/header'
import { Search, Download, Eye, ChevronRight, Home } from 'lucide-react'
import { useState, useEffect, useCallback } from 'react'
import {
  Table,
  Input,
  Button,
  Drawer,
  Space,
  Divider,
  Spin,
  message,
  Tag,
  Descriptions,
  ConfigProvider,
} from 'antd'
import type { ColumnsType } from 'antd/es/table'
import axios from 'axios'
import { ACCESS_TOKEN, paymentTerms } from '@/lib/values'

const API_BASE = 'https://api.salesense.logiqbits.com'
const CREDIT_DAYS = paymentTerms[0]?.creditPeriodDays ?? 30

interface CollectionItem {
  id: number
  serial: number
  amount: number
  collectDate: string
  depositDate: string
  paymentMethod: string
  bankName: string
  bankBranchName: string
  payerName: string
  payerPhone: string
  note: string
  isVerified: boolean
}

interface InvoiceDataType {
  id: string
  serial: number
  date: string
  dueDate: string
  amount: number
  paidAmount: number
  dueAmount: number
  status: string
  customer: string
  reference: string
  rawDate: number
}

const statusConfig: Record<string, { bg: string; text: string; label: string; dotColor?: string }> = {
  O: { bg: 'bg-orange-100', text: 'text-orange-800', label: 'Open', dotColor: 'bg-amber-500' },
  C: { bg: 'bg-slate-100', text: 'text-slate-800', label: 'Closed', dotColor: 'bg-slate-400' },
  P: { bg: 'bg-blue-100', text: 'text-brand-secondary', label: 'Partial', dotColor: 'bg-blue-500' },
  D: { bg: 'bg-emerald-100', text: 'text-emerald-800', label: 'Paid', dotColor: 'bg-emerald-500' },
}

function formatDate(ts: number | string): string {
  const n = typeof ts === 'string' ? parseInt(ts, 10) : ts
  if (!n) return '-'
  const d = new Date(n)
  return d.toLocaleDateString('en-CA')
}

function addDays(ts: number, days: number): string {
  const d = new Date(ts)
  d.setDate(d.getDate() + days)
  return d.toLocaleDateString('en-CA')
}

function resolveStatus(invoice: any): string {
  const s = (invoice.status || '').toUpperCase().trim()
  if (['O', 'C', 'P', 'D'].includes(s)) return s
  // Fallback mapping from old/verbose status values
  const lower = s.toLowerCase()
  if (lower.includes('PAID') || lower.includes('D')) return 'D'
  if (lower.includes('PARTIAL') || lower.includes('P')) return 'P'
  if (lower.includes('CLOSE') || lower.includes('C')) return 'C'
  if (lower.includes('OPEN') || lower.includes('O')) return 'O'
  // Derive from amounts if status is missing
  const due = invoice.totalDueAmount ?? (invoice.totalAmount - (invoice.totalPaidAmount || 0))
  if (due <= 0) return 'D'
  if ((invoice.totalPaidAmount || 0) > 0) return 'P'
  return 'O'
}

export default function InvoicesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null)

  const [invoices, setInvoices] = useState<InvoiceDataType[]>([])
  const [loading, setLoading] = useState(false)

  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceDataType | null>(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [collections, setCollections] = useState<CollectionItem[]>([])
  const [drawerLoading, setDrawerLoading] = useState(false)
  const [downloadingPdfId, setDownloadingPdfId] = useState<string | null>(null)
  const [downloadingCollectionId, setDownloadingCollectionId] = useState<number | null>(null)

  const [sidebarOpen, setSidebarOpen] = useState(false)

  const downloadInvoicePdf = async (invoiceId: string) => {
    const numericId = invoiceId.replace('INV-', '')
    setDownloadingPdfId(invoiceId)
    try {
      const res = await axios.get(
        `${API_BASE}/export/pdf/invoices/${numericId}`,
        {
          headers: { Authorization: `Bearer ${ACCESS_TOKEN}` },
          responseType: 'blob',
        }
      )
      const blob = new Blob([res.data], { type: 'application/pdf' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `invoice-${invoiceId}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      message.success('Invoice PDF downloaded successfully')
    } catch (err: any) {
      message.error(
        `Download failed: ${err?.response?.data?.message || err?.message || 'Unknown error'}`
      )
    } finally {
      setDownloadingPdfId(null)
    }
  }

  const downloadCollectionPdf = async (collectionId: number) => {
    setDownloadingCollectionId(collectionId)
    try {
      const res = await axios.get(
        `${API_BASE}/export/pdf/collections/${collectionId}`,
        {
          headers: { Authorization: `Bearer ${ACCESS_TOKEN}` },
          responseType: 'blob',
        }
      )
      const blob = new Blob([res.data], { type: 'application/pdf' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `collection-${collectionId}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      message.success('Collection PDF downloaded successfully')
    } catch (err: any) {
      message.error(
        `Download failed: ${err?.response?.data?.message || err?.message || 'Unknown error'}`
      )
    } finally {
      setDownloadingCollectionId(null)
    }
  }

  const fetchInvoices = useCallback(async () => {
    setLoading(true)
    try {
      const res = await axios.get(`${API_BASE}/me-user/area-invoices?fromDate=100000`, {
        headers: { Authorization: `Bearer ${ACCESS_TOKEN}` },
      })
      const data = Array.isArray(res.data) ? res.data : res.data?.data ?? []
      const mapped: InvoiceDataType[] = data.map((inv: any) => {
        const rawDate = inv.date || 0
        const status = resolveStatus(inv)
        return {
          id: `INV-${inv.id ?? inv.serial ?? Math.floor(Math.random() * 900000)}`,
          serial: inv.serial ?? inv.id,
          date: formatDate(rawDate),
          dueDate: addDays(rawDate, CREDIT_DAYS),
          amount: inv.totalAmount ?? 0,
          paidAmount: inv.totalPaidAmount ?? 0,
          dueAmount: inv.totalDueAmount ?? (inv.totalAmount - (inv.totalPaidAmount || 0)),
          status,
          customer: inv.customerName || 'Unknown Customer',
          reference: inv.reference || '-',
          rawDate,
        }
      })
      setInvoices(mapped)
    } catch (err: any) {
      message.error(
        `Failed to load invoices: ${err?.response?.data?.message || err?.message || 'Unknown error'}`
      )
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchInvoices()
  }, [fetchInvoices])

  const fetchCollections = async (invoiceId: string) => {
    const numericId = invoiceId.replace('INV-', '')
    setDrawerLoading(true)
    try {
      const res = await axios.get(`${API_BASE}/invoices/${numericId}/collections`, {
        headers: { Authorization: `Bearer ${ACCESS_TOKEN}` },
      })
      const data = Array.isArray(res.data) ? res.data : res.data?.data ?? []
      const mapped: CollectionItem[] = data.map((c: any) => ({
        id: c.id,
        serial: c.serial,
        amount: c.amount ?? 0,
        collectDate: formatDate(c.collectDate),
        depositDate: formatDate(c.depositDate),
        paymentMethod: c.paymentMethod || '-',
        bankName: c.bankName || '-',
        bankBranchName: c.bankBranchName || '-',
        payerName: c.payerName || '-',
        payerPhone: c.payerPhone || '-',
        note: c.note || '',
        isVerified: c.isVerified ?? false,
      }))
      setCollections(mapped)
    } catch (err: any) {
      setCollections([])
    } finally {
      setDrawerLoading(false)
    }
  }

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      invoice.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.customer.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus =
      !selectedStatus || invoice.status === selectedStatus
    return matchesSearch && matchesStatus
  })

  const statuses = ['O', 'P', 'D', 'C']

  const handleOpenDrawer = (invoice: InvoiceDataType) => {
    setSelectedInvoice(invoice)
    setIsDrawerOpen(true)
    fetchCollections(invoice.id)
  }

  const columns: ColumnsType<InvoiceDataType> = [
    {
      title: 'Invoice ID',
      dataIndex: 'id',
      key: 'id',
      width: 140,
      align: 'left',
      className: 'text-sm font-bold text-slate-900 font-mono tracking-tight pl-4',
    },
    {
      title: 'Customer',
      dataIndex: 'customer',
      key: 'customer',
      align: 'left',
      ellipsis: true,
      className: 'text-sm font-semibold text-slate-800',
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      width: 110,
      align: 'left',
      className: 'text-sm text-slate-500 font-medium',
    },
    {
      title: 'Due Date',
      dataIndex: 'dueDate',
      key: 'dueDate',
      width: 110,
      align: 'left',
      className: 'text-sm text-slate-500 font-medium',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 110,
      align: 'left',
      render: (status: string) => {
        const config =
          statusConfig[status as keyof typeof statusConfig] ||
          statusConfig.pending
        return (
          <span
            className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-50 border border-slate-200/80 text-slate-700 font-semibold text-sm tracking-wide`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${config.dotColor}`} />
            {config.label}
          </span>
        )
      },
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
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
      width: 100,
      align: 'center',
      render: (_, record) => (
        <div className="flex items-center justify-center gap-1">
          <Button
            type="default"
            icon={<Eye className="w-3.5 h-3.5 text-slate-500" />}
            onClick={() => handleOpenDrawer(record)}
            className="inline-flex items-center justify-center rounded-sm w-7 h-7 bg-white shadow-xs hover:border-slate-300"
            title="View details"
          />
          <Button
            type="default"
            icon={<Download className="w-3.5 h-3.5 text-slate-500" />}
            loading={downloadingPdfId === record.id}
            onClick={() => downloadInvoicePdf(record.id)}
            className="inline-flex items-center justify-center rounded-sm w-7 h-7 bg-white shadow-xs hover:border-slate-300"
            title="Download PDF"
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
            title="Invoice Center"
            subtitle="View and manage your invoices"
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
          <span className="text-slate-600">Invoice Center</span>
        </div>

        <div className="p-4 sm:p-6 space-y-4 flex-1 overflow-auto w-full">
          <div className="bg-white rounded-md border border-slate-200 p-4 space-y-3.5 shadow-xs">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 w-full">
                <Input
                  prefix={
                    <Search className="w-3.5 h-3.5 text-slate-400 mr-1" />
                  }
                  placeholder="Search invoices by ID or customer name..."
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
                All Invoices
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
              > <Table
                  columns={columns}
                  dataSource={filteredInvoices}
                  rowKey="id"
                  size="middle"
                  pagination={{
                    pageSize: 5,
                    showSizeChanger: false,
                    placement: ['bottomRight'] as any,
                    className:
                      'px-4 py-3 m-0 border-t border-slate-100 text-xs font-medium',
                  }}
                  locale={{ emptyText: 'No invoices found.' }}
                /></ConfigProvider>

            </Spin>
          </div>

          <div className="block md:hidden space-y-3">
            {filteredInvoices.map((invoice) => {
              const config =
                statusConfig[invoice.status as keyof typeof statusConfig] ||
                statusConfig.pending
              return (
                <div
                  key={invoice.id}
                  className="bg-white border border-slate-200 rounded-md p-4 shadow-2xs space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-900 font-mono tracking-tight">
                      {invoice.id}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-sm bg-slate-50 border border-slate-200/80 text-slate-700 font-bold text-[10px] tracking-wide">
                      <span className={`w-1 h-1 rounded-full ${config.dotColor}`} />
                      {config.label}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-800 line-clamp-1">
                      {invoice.customer}
                    </p>
                    <p className="text-[11px] text-slate-500 font-medium line-clamp-1">
                      Ref: {invoice.reference} | Due: {invoice.dueDate}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2.5 border-t border-slate-100">
                    <div>
                      <span className="text-[9px] text-slate-400 font-bold uppercase block tracking-wider">
                        Amount
                      </span>
                      <span className="text-xs font-black text-slate-900">
                        TK {invoice.amount.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        type="default"
                        size="small"
                        icon={<Eye className="w-3.5 h-3.5 text-slate-600" />}
                        onClick={() => handleOpenDrawer(invoice)}
                        className="inline-flex items-center justify-center w-7 h-7 bg-slate-50 border-slate-200"
                        title="View details"
                      />
                      <Button
                        type="default"
                        size="small"
                        loading={downloadingPdfId === invoice.id}
                        icon={<Download className="w-3.5 h-3.5 text-slate-600" />}
                        onClick={() => downloadInvoicePdf(invoice.id)}
                        className="inline-flex items-center justify-center w-7 h-7 bg-slate-50 border-slate-200"
                        title="Download PDF"
                      />
                    </div>
                  </div>
                </div>
              )
            })}
            {filteredInvoices.length === 0 && !loading && (
              <div className="bg-white rounded-md border border-slate-200 p-8 text-center text-xs text-slate-400">
                No invoices found.
              </div>
            )}
          </div>
        </div>
      </main>

      <Drawer
        title={
          <div className="flex items-center gap-2">
            <span className="font-mono font-black text-slate-900 text-sm">
              {selectedInvoice?.id}
            </span>
            {selectedInvoice && (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-sm bg-slate-100 border border-slate-200 text-slate-700 font-bold text-[10px] uppercase">
                <span
                  className={`w-1.5 h-1.5 rounded-full ${statusConfig[
                    selectedInvoice.status as keyof typeof statusConfig
                  ]?.dotColor
                    }`}
                />
                {
                  statusConfig[
                    selectedInvoice.status as keyof typeof statusConfig
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
            {selectedInvoice && (
              <Button
                size="small"
                type="default"
                icon={<Download className="w-3.5 h-3.5" />}
                loading={downloadingPdfId === selectedInvoice.id}
                onClick={() => downloadInvoicePdf(selectedInvoice.id)}
                className="text-xs font-bold rounded-sm hover:border-[#23496b]! hover:text-[#23496b]!"
              >
                PDF
              </Button>
            )}
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
        {selectedInvoice && (
          <div className="space-y-5 text-xs">
            <Descriptions
              title="Invoice Summary"
              bordered
              size="small"
              column={1}
              layout="horizontal"
              labelStyle={{ fontWeight: 600, color: '#64748B', width: '40%', fontSize: '14px' }}
              contentStyle={{ fontWeight: 700, color: '#1E293B', fontSize: '14px' }}
            >
              <Descriptions.Item label="Customer">
                {selectedInvoice.customer}
              </Descriptions.Item>
              <Descriptions.Item label="Reference">
                {selectedInvoice.reference}
              </Descriptions.Item>
              <Descriptions.Item label="Invoice Date">
                {selectedInvoice.date}
              </Descriptions.Item>
              <Descriptions.Item label="Due Date">
                {selectedInvoice.dueDate}
              </Descriptions.Item>
            </Descriptions>

            <div className="bg-slate-50 border border-slate-200 rounded-sm p-3.5">
              <div className="space-y-1.5">
                <div className="flex justify-between text-slate-500 font-medium">
                  <span>Total Amount:</span>
                  <span className="text-slate-900 font-bold">
                    TK {selectedInvoice.amount.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between text-slate-500 font-medium">
                  <span>Paid Amount:</span>
                  <span className="text-emerald-700 font-bold">
                    TK {selectedInvoice.paidAmount.toLocaleString('en-IN')}
                  </span>
                </div>
                <Divider dashed className="my-2" />
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                    Due Balance:
                  </span>
                  <span className="text-sm font-black text-[#23496b]">
                    TK {selectedInvoice.dueAmount.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-[13px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                Collection History
              </h3>
              <div className="border border-slate-200 rounded-sm overflow-hidden bg-white">
                <Spin spinning={drawerLoading}>
                  <Table
                    columns={[
                      {
                        title: <span style={{ fontSize: '14px' }}>Date</span>,
                        dataIndex: 'collectDate',
                        key: 'collectDate',
                        render: (_: string, record: any) => (
                          <div>
                            <p style={{ fontSize: '14px', fontWeight: 700, color: '#1E293B' }}>{record.collectDate}</p>
                            <span style={{ fontSize: '14px', color: '#94A3B8', fontFamily: 'monospace' }}>{record.paymentMethod}</span>
                          </div>
                        ),
                      },
                      {
                        title: <span style={{ fontSize: '14px' }}>Payer</span>,
                        dataIndex: 'payerName',
                        key: 'payerName',
                        render: (_: string, record: any) => (
                          <div>
                            <p style={{ fontSize: '14px', fontWeight: 700, color: '#1E293B' }}>{record.payerName}</p>
                            <span style={{ fontSize: '14px', color: '#94A3B8', fontFamily: 'monospace' }}>{record.payerPhone}</span>
                          </div>
                        ),
                      },
                      {
                        title: <span style={{ fontSize: '14px' }}>Amount</span>,
                        dataIndex: 'amount',
                        key: 'amount',
                        align: 'right',
                        render: (amount: number) => <span style={{ fontSize: '14px', fontWeight: 700, color: '#1E293B' }}>TK {amount.toLocaleString('en-IN')}</span>,
                      },
                      {
                        title: <span style={{ fontSize: '14px' }}>Verified</span>,
                        dataIndex: 'isVerified',
                        key: 'isVerified',
                        align: 'center',
                        render: (isVerified: boolean) => (
                          <Tag
                            color={isVerified ? 'green' : 'orange'}
                            style={{ fontSize: '14px', fontWeight: 700, margin: 0, borderRadius: '4px', border: 'none' }}
                          >
                            {isVerified ? 'Verified' : 'Pending'}
                          </Tag>
                        ),
                      },
                      {
                        title: <span style={{ fontSize: '14px' }}>PDF</span>,
                        key: 'action',
                        align: 'center',
                        render: (_: any, record: any) => (
                          <Button
                            type="default"
                            size="small"
                            loading={downloadingCollectionId === record.id}
                            icon={<Download className="w-3.5 h-3.5 text-slate-500" />}
                            onClick={() => downloadCollectionPdf(record.id)}
                            className="inline-flex items-center justify-center w-6 h-6 bg-white shadow-xs hover:border-slate-300"
                            title="Download collection PDF"
                          />
                        ),
                      },
                    ]}
                    dataSource={collections}
                    rowKey="id"
                    pagination={false}
                    size="small"
                    locale={{ emptyText: 'No collection records found.' }}
                  />
                </Spin>
              </div>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  )
}
