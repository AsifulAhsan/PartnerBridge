'use client'

import { Sidebar } from '@/components/sidebar'
import { Header } from '@/components/header'
import { useState } from 'react'
import { Card, Row, Col, Statistic, Table, Tag, Tooltip as AntTooltip } from 'antd'
import {
  Package,
  Truck,
  DollarSign,
  AlertCircle,
  Clock,
  TrendingUp,
  Info,
  ChevronRight,
  Home
} from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts'
import { AppColorPalette } from '@/lib/theme'

const weeklyLogisticsData = [
  { name: 'Saturday', dispatches: 12, value: 240000 },
  { name: 'Sunday', dispatches: 19, value: 380000 },
  { name: 'Monday', dispatches: 14, value: 290000 },
  { name: 'Tuesday', dispatches: 22, value: 450000 },
  { name: 'Wednesday', dispatches: 28, value: 580000 },
  { name: 'Thursday', dispatches: 16, value: 320000 },
  { name: 'Friday', dispatches: 9, value: 180000 },
]

const creditDistribution = [
  { name: 'Available Credit Line', value: 65, fill: AppColorPalette.brandSecondary },
  { name: 'Utilized Credit', value: 25, fill: '#4B5563' },
  { name: 'Escrowed/Reserved Pool', value: 10, fill: '#9CA3AF' },
]

const recentOrders = [
  {
    key: '1',
    id: 'ORD-2026-08101',
    customer: 'Natore Poultry & Hatchery Complex',
    product: 'Premium Broiler Feed Starter (40 Bags)',
    quantity: 40,
    status: 'delivered',
    date: '2026-06-06',
    total: 92400,
  },
  {
    key: '2',
    id: 'ORD-2026-08102',
    customer: 'Mymensingh Aqua Culture Project',
    product: 'High-Protein Floating Tilapia Grower (25 Bags)',
    quantity: 25,
    status: 'in-transit',
    date: '2026-06-05',
    total: 58750,
  },
  {
    key: '3',
    id: 'ORD-2026-08103',
    customer: 'Shahjadpur Milk Cooperative Hub',
    product: 'Milking Dairy Feed Premium (15 Bags)',
    quantity: 15,
    status: 'processing',
    date: '2026-06-05',
    total: 31500,
  },
  {
    key: '4',
    id: 'ORD-2026-08104',
    customer: 'Rahman Agro & Livestock Farm',
    product: 'Bull Fattening Feed Mash (50 Bags)',
    quantity: 50,
    status: 'pending',
    date: '2026-06-04',
    total: 97500,
  },
]

export default function Dashboard() {
  const [activeKpi, setActiveKpi] = useState<string | null>(null)

  const columns = [
    {
      title: 'Order ID',
      dataIndex: 'id',
      key: 'id',
      render: (text: string) => <span className="font-bold text-slate-700">{text}</span>,
    },
    {
      title: 'Dealer Node / Client',
      dataIndex: 'customer',
      key: 'customer',
      render: (text: string) => <div className="font-semibold text-slate-800">{text}</div>,
    },
    {
      title: 'Product Allocation Line',
      dataIndex: 'product',
      key: 'product',
      ellipsis: true,
    },
    {
      title: 'Volume (Bags)',
      dataIndex: 'quantity',
      key: 'quantity',
      align: 'center' as const,
      render: (qty: number) => <span className="font-bold">{qty}</span>
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      align: 'center' as const,
      render: (status: string) => {
        let tagColor = 'default';
        if (status === 'delivered') tagColor = 'blue';
        if (status === 'in-transit') tagColor = 'cyan';
        if (status === 'processing') tagColor = 'warning';
        return (
          <Tag color={tagColor} className="rounded-sm font-bold uppercase text-xs px-2 py-0.5">
            {status.replace('-', ' ')}
          </Tag>
        )
      },
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (date: string) => <span className="text-slate-500 text-xs">{date}</span>
    },
    {
      title: 'Total Amount',
      dataIndex: 'total',
      key: 'total',
      align: 'right' as const,
      render: (val: number) => <span className="font-bold text-slate-900">TK {val.toLocaleString('en-IN')}</span>,
    },
  ]
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="flex h-screen bg-background">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 overflow-auto md:ml-0">
        <div className="bg-brand-secondary text-white">
          <Header
            title="Business to Business Order Management System"
            subtitle="Regional distribution node operations and liquidity tracking metrics"
            onMenuToggle={() => setSidebarOpen(true)}
          />
        </div>

        <div className="bg-white border-b border-slate-200 px-4 sm:px-6 py-2.5 flex items-center gap-2 text-sm text-slate-500 font-medium overflow-x-auto whitespace-nowrap">
          <Home className="w-3.5 h-3.5 text-brand-secondary shrink-0" />
          <span className="text-brand-secondary font-semibold hover:underline cursor-pointer">Home</span>
          <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
          <span className="text-brand-secondary font-semibold hover:underline cursor-pointer">Reports</span>
          <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
          <span className="text-slate-600">Sales Dashboard</span>
        </div>

        <div className="p-4 sm:p-6 space-y-6">
          <Row gutter={[12, 12]}>
            <Col xs={24} sm={12} lg={6}>
              <Card
                variant='borderless'
                onClick={() => setActiveKpi('orders')}
                styles={{ body: { padding: '16px' } }}
                className={`rounded-md transition-all shadow-sm border-slate-200 ${activeKpi === 'orders' ? 'border-brand-secondary ring-1 ring-brand-secondary/20' : ''}`}
              >
                <div className="text-center">
                  <p className="text-sm font-semibold text-slate-600 mb-1">Primary Ordered</p>
                  <Statistic
                    value={156}
                    styles={{ content: { fontSize: '22px', fontWeight: 800, color: AppColorPalette.brandSecondary } }}
                  />
                  <p className="text-xs text-slate-400 mt-1 font-medium">This Month Trailing</p>
                </div>
              </Card>
            </Col>

            <Col xs={24} sm={12} lg={6}>
              <Card
                variant='borderless'
                onClick={() => setActiveKpi('revenue')}
                styles={{ body: { padding: '16px' } }}
                className={`rounded-md transition-all shadow-sm border-slate-200 ${activeKpi === 'revenue' ? 'border-brand-secondary ring-1 ring-brand-secondary/20' : ''}`}
              >
                <div className="text-center">
                  <p className="text-sm font-semibold text-slate-600 mb-1">Gross Invoiced Value</p>
                  <Statistic
                    value={2845000}
                    prefix="TK "
                    styles={{ content: { fontSize: '22px', fontWeight: 800, color: AppColorPalette.brandSecondary } }}
                  />
                  <p className="text-xs text-slate-400 mt-1 font-medium">Net Realized Collection</p>
                </div>
              </Card>
            </Col>

            <Col xs={24} sm={12} lg={6}>
              <Card
                variant='borderless'
                onClick={() => setActiveKpi('credit')}
                styles={{ body: { padding: '16px' } }}
                className={`rounded-md transition-all shadow-sm border-slate-200 ${activeKpi === 'credit' ? 'border-brand-secondary ring-1 ring-brand-secondary/20' : ''}`}
              >
                <div className="text-center">
                  <p className="text-sm font-semibold text-slate-600 mb-1">Available Credit Line</p>
                  <Statistic
                    value={6500000}
                    prefix="TK "
                    styles={{ content: { fontSize: '22px', fontWeight: 800, color: AppColorPalette.brandSecondary } }}
                  />
                  <p className="text-xs text-slate-400 mt-1 font-medium">Cap Limit: TK 10M</p>
                </div>
              </Card>
            </Col>

            <Col xs={24} sm={12} lg={6}>
              <Card
                variant='borderless'
                onClick={() => setActiveKpi('transit')}
                styles={{ body: { padding: '16px' } }}
                className={`rounded-md transition-all shadow-sm border-slate-200 ${activeKpi === 'transit' ? 'border-brand-secondary ring-1 ring-brand-secondary/20' : ''}`}
              >
                <div className="text-center">
                  <p className="text-sm font-semibold text-slate-600 mb-1">Primary Delivered</p>
                  <Statistic
                    value={12}
                    suffix=" Units"
                    styles={{ content: { fontSize: '22px', fontWeight: 800, color: AppColorPalette.brandSecondary } }}
                  />
                  <p className="text-xs text-slate-400 mt-1 font-medium">Active Transit Cargo</p>
                </div>
              </Card>
            </Col>
          </Row>

          {/* SYSTEM TREND PLOTS CONTAINER */}
          <Row gutter={[16, 16]}>
            <Col xs={24} lg={16}>
              <div className="bg-white rounded-md border border-slate-200 p-4 sm:p-5 shadow-sm h-full">
                <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-3">
                  <div>
                    <h2 className="text-sm font-bold text-brand-secondary">Overall Sales Flow Trends</h2>
                    <p className="text-xs text-slate-400">Weekly breakdown of distributor logistics velocity</p>
                  </div>
                  <AntTooltip title="Data aggregates ex-mill transaction volumes.">
                    <Info className="w-4 h-4 text-slate-400 cursor-help shrink-0" />
                  </AntTooltip>
                </div>

                <div className="w-full overflow-x-auto overflow-y-hidden">
                  <div className="min-w-125 w-full">
                    <ResponsiveContainer width="100%" height={280}>
                      <BarChart data={weeklyLogisticsData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="0" stroke="#F1F5F9" vertical={false} />
                        <XAxis dataKey="name" stroke="#94A3B8" fontSize={10} tickLine={false} />
                        <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} axisLine={false} />
                        <RechartsTooltip
                          contentStyle={{
                            backgroundColor: '#FFF',
                            border: '1px solid #CBD5E1',
                            borderRadius: '4px',
                          }}
                        />
                        <Legend verticalAlign="top" height={32} iconType="square" iconSize={10} wrapperStyle={{ fontSize: '11px' }} />
                        <Bar name="Dispatched Cargo Units" dataKey="dispatches" fill={AppColorPalette.brandSecondary} radius={[2, 2, 0, 0]} barSize={20} />
                        <Bar name="Value Stream (BDT)" dataKey="value" fill={AppColorPalette.brandPrimary} radius={[2, 2, 0, 0]} barSize={20} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </Col>

            <Col xs={24} lg={8}>
              <div className="bg-white rounded-md border border-slate-200 p-4 sm:p-5 shadow-sm h-full flex flex-col justify-between">
                <div className="border-b border-slate-100 pb-3">
                  <h2 className="text-sm font-bold text-brand-secondary">Dealer Credit Position</h2>
                  <p className="text-xs text-slate-400">Asset distribution of limits</p>
                </div>

                <div className="relative flex justify-center items-center my-3">
                  <ResponsiveContainer width="100%" height={170}>
                    <PieChart>
                      <Pie
                        data={creditDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={68}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {creditDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} className="outline-none" />
                        ))}
                      </Pie>
                      <RechartsTooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute text-center pointer-events-none">
                    <span className="text-xl font-bold text-brand-secondary">65%</span>
                    <p className="text-xs uppercase font-bold text-slate-400">Available</p>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs pt-2">
                  {creditDistribution.map((item) => (
                    <div key={item.name} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: item.fill }} />
                        <span className="text-slate-600 truncate max-w-45">{item.name}</span>
                      </div>
                      <span className="font-bold text-slate-800 shrink-0">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </Col>
          </Row>

          {/* DATA LEDGER TABLE CARD */}
          <div className="bg-white rounded-md border border-slate-200 p-4 sm:p-5 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-sm font-bold text-brand-secondary">All Dispatches Ledger</h2>
                <p className="text-xs text-slate-400">Real-time tracked distribution orders routed across dealer lines</p>
              </div>
              <button
                onClick={() => window.location.href = '/orders'}
                className="bg-brand-secondary hover:bg-brand-secondary/90 text-white text-xs font-semibold px-3 py-1.5 rounded-sm transition-colors shadow-xs self-start sm:self-auto"
              >
                Load Data
              </button>
            </div>

            <Table
              columns={columns}
              dataSource={recentOrders}
              pagination={false}
              size="small"
              className="border border-slate-100 rounded-sm"
              rowClassName="hover:bg-slate-50/80"
              scroll={{ x: 'max-content' }}
            />
          </div>

        </div>
      </main>
    </div>
  )
}