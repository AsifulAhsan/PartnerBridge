'use client'

import { Sidebar } from '@/components/sidebar'
import { Header } from '@/components/header'
import { useState } from 'react'
import Image from 'next/image'
import {
  Input,
  Button,
  Tag,
  InputNumber,
  Modal,
  Descriptions,
  message,
  Empty,
  Space
} from 'antd'
import {
  SearchOutlined,
  PlusOutlined,
  DeleteOutlined,
  InfoCircleOutlined
} from '@ant-design/icons'
import { ChevronRight, Home, Grid, List } from 'lucide-react'

// Localized Product Data Matrix in BDT
const products = [
  {
    id: 'CAT-001',
    name: 'Premium Cattle Feed',
    size: '50kg Bag',
    price: 4800,
    unit: 'Bag',
    inStock: 145,
    category: 'Cattle',
    image: '/products/CAT-001.png',
  },
  {
    id: 'CAT-002',
    name: 'Cattle Pellet Mix',
    size: '40kg Bag',
    price: 3900,
    unit: 'Bag',
    inStock: 98,
    category: 'Cattle',
    image: '/products/CAT-002.png',
  },
  {
    id: 'POT-001',
    name: 'Poultry Starter Mix',
    size: '25kg Bag',
    price: 1750,
    unit: 'Bag',
    inStock: 256,
    category: 'Poultry',
    image: '/products/POT-001.png',
  },
  {
    id: 'POT-002',
    name: 'Layer Pellets Premium',
    size: '25kg Bag',
    price: 1550,
    unit: 'Bag',
    inStock: 189,
    category: 'Poultry',
    image: '/products/POT-002.png',
  },
  {
    id: 'AQU-001',
    name: 'Pre-Starter Fish Feed',
    size: '10kg Bag',
    price: 3200,
    unit: 'Bag',
    inStock: 42,
    category: 'Aqua',
    image: '/products/AQU-001.png',
  },
  {
    id: 'AQU-002',
    name: 'Pre-Starter Floating Fish Feed',
    size: '30kg Bale',
    price: 1650,
    unit: 'Bale',
    inStock: 76,
    category: 'Aqua',
    image: '/products/AQU-002.jpg',
  },
  {
    id: 'AQU-003',
    name: 'Nursury Floating Fish Feed',
    size: '25kg Bale',
    price: 1900,
    unit: 'Bale',
    inStock: 54,
    category: 'Aqua',
    image: '/products/AQU-003.jpg',
  },
  {
    id: 'AQU-004',
    name: 'Aqua Nursury Fish Feed',
    size: '50kg Bag',
    price: 2450,
    unit: 'Bag',
    inStock: 112,
    category: 'Aqua',
    image: '/products/AQU-004.png',
  },
]

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  unit: string
  size: string
  image: string
}

export default function QuickOrderPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [cart, setCart] = useState<CartItem[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.id.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = !selectedCategory || product.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  const addToCart = (product: (typeof products)[0]) => {
    const existingItem = cart.find((item) => item.id === product.id)

    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      )
    } else {
      setCart([
        ...cart,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          unit: product.unit,
          size: product.size,
          image: product.image,
        },
      ])
    }
    message.success(`${product.name} added to order sheet.`)
  }

  const removeFromCart = (productId: string) => {
    setCart(cart.filter((item) => item.id !== productId))
    message.info("Item removed from order.")
  }

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId)
    } else {
      setCart(
        cart.map((item) => (item.id === productId ? { ...item, quantity } : item))
      )
    }
  }

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const totalItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0)
  const categories = [...new Set(products.map((p) => p.category))]

  const handleFinalOrderSubmit = () => {
    setIsSubmitting(true)
    const hideLoading = message.loading("Transmitting distribution batch payload...", 0)

    setTimeout(() => {
      hideLoading()
      setIsSubmitting(false)
      setIsModalOpen(false)
      setCart([])

      Modal.success({
        title: 'Order Dispatched Successfully!',
        okButtonProps: {
          style: { backgroundColor: '#23496b', borderRadius: '2px', border: 'none' },
        },
        content: (
          <div className='pt-2 text-xs'>
            <p>Your order configuration has been successfully logged inside the sales tracking module.</p>
            <p className='pt-4'>Generated System ID: <span className="font-mono font-bold text-blue-800">PO-{Math.floor(100000 + Math.random() * 900000)}</span></p>
          </div>
        ),
      })
    }, 1500)
  }

  return (
    <div className="flex h-screen bg-[#EAEFF4]">
      <Sidebar />

      <main className="flex-1 overflow-auto md:ml-0 flex flex-col">
        {/* Navy Header Shell Block */}
        <div className="bg-[#23496b] text-white">
          <Header title="Quick Order Entry" subtitle="Search and directly stage catalog products into line distribution sheets" />
        </div>

        {/* Corporate Consistent Navigation Breadcrumb Bar */}
        <div className="bg-white border-b border-slate-200 px-6 py-2.5 flex items-center gap-2 text-xs text-slate-500 font-medium shrink-0">
          <Home className="w-3.5 h-3.5 text-blue-800" />
          <span className="text-blue-800 font-semibold hover:underline cursor-pointer">Home</span>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <span className="text-blue-800 font-semibold hover:underline cursor-pointer">Sales</span>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <span className="text-slate-600">Quick Order</span>
        </div>

        <div className="flex-1 p-6 grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
          {/* Products Content Pane */}
          <div className="lg:col-span-2 space-y-4">

            {/* Filter and Search Action Box */}
            <div className="bg-white rounded-md border border-slate-200 p-4 space-y-3.5 shadow-xs">
              <div className="flex gap-3">
                <div className="flex-1">
                  <Input
                    size="middle"
                    placeholder="Search wholesale catalog items by structural name or product SKU..."
                    prefix={<SearchOutlined className="text-slate-400" />}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    allowClear
                    className="rounded-sm"
                  />
                </div>
                
                {/* Segmented View Mode Toggle Controls */}
                <div className="flex p-0.5 bg-slate-100 border border-slate-200/80 rounded-sm shrink-0">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded-xs transition-colors ${viewMode === 'grid' 
                      ? 'bg-white text-[#23496b] shadow-xs' 
                      : 'text-slate-400 hover:text-slate-600'}`}
                    title="Grid View"
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 rounded-xs transition-colors ${viewMode === 'list' 
                      ? 'bg-white text-[#23496b] shadow-xs' 
                      : 'text-slate-400 hover:text-slate-600'}`}
                    title="List View"
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* High-density Categorization Buttons */}
              <div className="flex items-center gap-2 overflow-x-auto pb-0.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1">Nodes:</span>
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`px-3 py-1 rounded-sm text-xs font-bold transition-all ${!selectedCategory
                    ? 'bg-[#23496b] text-white border border-[#23496b]'
                    : 'bg-slate-100 text-slate-600 border border-slate-200/60 hover:bg-slate-200'
                    }`}
                >
                  All Distribution
                </button>
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-3 py-1 rounded-sm text-xs font-bold transition-all ${selectedCategory === category
                      ? 'bg-[#23496b] text-white border border-[#23496b]'
                      : 'bg-slate-100 text-slate-600 border border-slate-200/60 hover:bg-slate-200'
                      }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Product Layout Presentation Layer */}
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-md border border-slate-200 p-4 hover:border-slate-400 transition-all flex flex-col justify-between shadow-xs"
                  >
                    <div>
                      <div className="flex gap-3 items-start">
                        {/* Bounded Square Image Container */}
                        <div className="relative w-24 h-24 bg-slate-50 rounded-sm overflow-hidden border border-slate-200 shrink-0">
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            sizes="96px"
                            className="object-cover"
                            priority={false}
                          />
                        </div>

                        {/* Detail Column text specs */}
                        <div className="flex-1 min-w-0 h-24 flex flex-col justify-between py-0.5">
                          <div>
                            <div className="flex items-start justify-between gap-1">
                              <h3 className="font-bold text-slate-800 text-xs leading-tight line-clamp-2">{product.name}</h3>
                              <Tag color="blue" className="m-0 text-[9px] uppercase font-bold shrink-0 rounded-sm border-none bg-slate-100 text-slate-700">
                                {product.category}
                              </Tag>
                            </div>
                            <span className="text-[10px] font-mono text-slate-400 font-bold block mt-1">
                              SKU: {product.id}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 font-medium m-0">Packing: {product.size}</p>
                        </div>
                      </div>

                      {/* Highly Structured High-Density Pricing Data Box */}
                      <div className="flex items-center justify-between my-3 bg-slate-50 p-2.5 rounded-sm border border-slate-100">
                        <div>
                          <p className="text-base font-black text-[#23496b]">৳ {product.price.toLocaleString('en-IN')}</p>
                          <p className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">Per {product.unit}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">Staged Available</p>
                          <p className="font-bold text-xs text-slate-700">
                            {product.inStock} Bags
                          </p>
                        </div>
                      </div>
                    </div>

                    <Button
                      type="default"
                      icon={<PlusOutlined />}
                      onClick={() => addToCart(product)}
                      className="w-full bg-[#23496b]! hover:bg-[#152842]! text-white! h-9 text-xs font-bold rounded-sm border-none shadow-xs"
                    >
                      Add to Order Draft
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              /* Highly Structured High-Density List View Layout */
              <div className="bg-white rounded-md border border-slate-200 divide-y divide-slate-100 shadow-xs overflow-hidden">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="p-3.5 flex items-center gap-4 hover:bg-slate-50/60 transition-colors"
                  >
                    {/* Micro Thumbnail */}
                    <div className="relative w-14 h-14 bg-slate-50 rounded-sm overflow-hidden border border-slate-200/80 shrink-0">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        sizes="56px"
                        className="object-cover"
                        priority={false}
                      />
                    </div>

                    {/* Meta Specifications */}
                    <div className="flex-1 min-w-0 grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
                      <div className="min-w-0">
                        <h3 className="font-bold text-slate-800 text-xs truncate m-0">{product.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] font-mono text-slate-400 font-bold">SKU: {product.id}</span>
                          <span className="w-1 h-1 rounded-full bg-slate-300" />
                          <span className="text-[10px] text-slate-500 font-medium">Packing: {product.size}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 md:justify-center">
                        <Tag color="blue" className="m-0 text-[9px] uppercase font-bold rounded-sm border-none bg-slate-100 text-slate-700">
                          {product.category}
                        </Tag>
                        <span className="text-[11px] text-slate-400 font-medium font-mono">({product.inStock} Staged)</span>
                      </div>

                      <div className="text-left md:text-right">
                        <span className="text-[9px] text-slate-400 uppercase font-black tracking-wider block leading-none mb-0.5">Wholesale Price</span>
                        <p className="text-sm font-black text-[#23496b] m-0">৳ {product.price.toLocaleString('en-IN')} <span className="text-[10px] font-bold text-slate-400 normal-case">/{product.unit}</span></p>
                      </div>
                    </div>

                    {/* Fast Action Row Insertion */}
                    <div className="shrink-0 pl-2">
                      <Button
                        type="default"
                        icon={<PlusOutlined />}
                        onClick={() => addToCart(product)}
                        className="bg-slate-50 hover:bg-[#23496b]! border border-slate-200 text-slate-700 hover:text-white! w-8 h-8 rounded-sm p-0 flex items-center justify-center transition-all shadow-2xs"
                        title="Add to sheet"
                      />
                    </div>
                  </div>
                ))}
                {filteredProducts.length === 0 && (
                  <div className="py-12 bg-white">
                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No logistics inventory items match your criteria." />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Summary Document Module Container */}
          <div className="bg-white rounded-md border border-slate-200 p-5 space-y-4 shadow-xs">
            <div className="flex justify-between items-center pb-2.5 border-b border-slate-100">
              <h2 className="text-sm font-bold text-[#23496b]">All Invoices / Draft</h2>
              <Tag color="blue" className="font-bold m-0 rounded-sm border-none text-[10px] uppercase">Active Order</Tag>
            </div>

            {cart.length === 0 ? (
              <div className="py-12">
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No logistics inventory items staged yet." />
              </div>
            ) : (
              <>
                <div className="space-y-2.5 max-h-95 overflow-y-auto pr-1">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="bg-slate-50 rounded-sm p-3 border border-slate-200/70"
                    >
                      <div className="flex items-center justify-between gap-2.5">
                        {/* Micro-thumbnail */}
                        <div className="relative w-9 h-9 rounded-sm overflow-hidden border border-slate-200 bg-slate-100 shrink-0">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            sizes="36px"
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-slate-800 truncate">{item.name}</p>
                          <p className="text-[11px] text-slate-400 font-medium">৳ {item.price.toLocaleString('en-IN')} each</p>
                        </div>
                        <Button
                          type="text"
                          danger
                          icon={<DeleteOutlined className="text-xs" />}
                          onClick={() => removeFromCart(item.id)}
                          className="flex items-center justify-center shrink-0 w-7 h-7"
                        />
                      </div>

                      <div className="flex items-center justify-between pt-2 mt-2 border-t border-slate-200/40">
                        <Space.Compact size="small">
                          <span className="inline-flex items-center px-2 border border-slate-300 bg-slate-100 text-[10px] font-bold text-slate-500 rounded-l-sm">
                            QTY:
                          </span>
                          <InputNumber
                            min={1}
                            value={item.quantity}
                            onChange={(val) => updateQuantity(item.id, Number(val) || 0)}
                            className="w-16 text-xs rounded-r-sm"
                            controls={false}
                          />
                        </Space.Compact>
                        <p className="font-bold text-slate-800 text-xs">
                          ৳ {(item.price * item.quantity).toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pricing totals blocks stacked explicitly */}
                <div className="border-t border-slate-200 pt-3.5 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-500 font-medium">
                    <span>Base Wholesale Subtotal:</span>
                    <span className="text-slate-800 font-bold">৳ {cartTotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-slate-500 font-medium">
                    <span>Freight/Shipping Routing:</span>
                    <span className="text-slate-600 font-bold">Ex-Mill Complex</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-[#23496b] pt-2.5 border-t border-dashed border-slate-200">
                    <span>Total Aggregate Value:</span>
                    <span className="text-base font-black">৳ {cartTotal.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* System Control Sheet Action Operations Grid */}
                <div className="space-y-2 pt-1.5">
                  <Button
                    type="primary"
                    size="middle"
                    onClick={() => setIsModalOpen(true)}
                    className="w-full bg-[#23496b]! hover:bg-[#152842]! text-white h-10 font-bold rounded-sm border-none flex items-center justify-center gap-2 py-5! text-xs tracking-wide shadow-xs"
                  >
                    Submit Order
                  </Button>

                  <div className="grid grid-cols-2 gap-2 mt-1.5">
                    <Button
                      type="default"
                      onClick={() => message.success("Order parameters saved as localization draft configuration.")}
                      className="w-full bg-slate-50 hover:bg-slate-100 text-slate-700 h-9 font-bold rounded-sm border border-slate-300 py-4! text-xs transition-colors"
                    >
                      Save Draft
                    </Button>
                    <Button
                      type="default"
                      danger
                      onClick={() => setCart([])}
                      className="w-full bg-white hover:bg-red-50 text-red-600 h-9 font-bold rounded-sm border border-red-200 py-4! text-xs transition-colors"
                    >
                      Clear
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </main>

      {/* Verification Checkout Modal matching configuration rules */}
      <Modal
        title={
          <span className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <InfoCircleOutlined className="text-[#23496b]" />
            Verify Purchase Order
          </span>
        }
        open={isModalOpen}
        onOk={handleFinalOrderSubmit}
        onCancel={() => setIsModalOpen(false)}
        confirmLoading={isSubmitting}
        okText="Confirm & Dispatch Line"
        cancelText="Cancel Verification"
        okButtonProps={{
          style: { backgroundColor: '#23496b', borderRadius: '2px', border: 'none' },
          className: "text-xs font-bold"
        }}
        cancelButtonProps={{
          className: "text-xs font-bold rounded-sm"
        }}
        width={500}
        styles={{ body: { paddingTop: '12px' } }}
      >
        <div className="space-y-3.5">
          <p className="text-xs text-slate-600">
            Please verify your item before proceeding with this order.
          </p>

          <Descriptions bordered layout="vertical" size="small" className="text-xs">
            <Descriptions.Item label="Staged Line Items">{cart.length}</Descriptions.Item>
            <Descriptions.Item label="Gross Cargo Bags">{totalItemsCount}</Descriptions.Item>
            <Descriptions.Item label="Valuation Aggregate">৳ {cartTotal.toLocaleString('en-IN')}</Descriptions.Item>
          </Descriptions>

          <div className="bg-slate-50 border border-slate-200 rounded-sm p-3 mt-4 text-[11px] font-medium text-slate-500">
            <strong>Notice:</strong> Modifying quantities after the order submission requires explicit authorization from sales admin.
          </div>
        </div>
      </Modal>
    </div>
  )
}