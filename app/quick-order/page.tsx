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
  Space,
} from 'antd'
import {
  SearchOutlined,
  PlusOutlined,
  DeleteOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons'
import { ChevronRight, Home, Grid, List } from 'lucide-react'
import axios from 'axios'
import {
  products as backendProducts,
  customerInfo,
  paymentTerms,
  distributionPoints,
  ACCESS_TOKEN,
} from '@/lib/values'

// Build catalog from backend data
const catalog = backendProducts.map((p) => {
  const variant = p.variants[0]
  return {
    id: p.code,
    productId: p.id,
    variantId: variant.id,
    name: p.name,
    size: `${variant.baseUnitSize}${p.baseUnit}`,
    price: variant.distributorPrice,
    unit: variant.unit,
    baseUnitSize: variant.baseUnitSize,
    inStock: 999,
    category: p.category.name,
    image: p.imageUrl,
  }
})

interface CartItem {
  id: string
  productId: number
  variantId: number
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

  const [sidebarOpen, setSidebarOpen] = useState(false)

  const filteredProducts = catalog.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.id.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory =
      !selectedCategory || product.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  const addToCart = (product: (typeof catalog)[0]) => {
    const existingItem = cart.find((item) => item.id === product.id)

    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      )
    } else {
      setCart([
        ...cart,
        {
          id: product.id,
          productId: product.productId,
          variantId: product.variantId,
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
    message.info('Item removed from order.')
  }

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId)
    } else {
      setCart(
        cart.map((item) =>
          item.id === productId ? { ...item, quantity } : item
        )
      )
    }
  }

  const cartTotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )
  const totalItemsCount = cart.reduce((sum, item) => sum + item.quantity, 0)
  const categories = [...new Set(catalog.map((p) => p.category))]

  const handleFinalOrderSubmit = async () => {
    if (cart.length === 0) {
      message.error('Your cart is empty.')
      return
    }

    setIsSubmitting(true)
    const hideLoading = message.loading('Transmitting order to backend...', 0)

    const payload = {
      paymentTermId: paymentTerms[0].id,
      customerId: customerInfo.id,
      saleAreaId: customerInfo.saleArea.id,
      distributionPointId: distributionPoints[0].id,
      dateTime: Date.now(),
      deliveryAddress: customerInfo.address,
      productType: 'G',
      channel: 'P',
      note: '',
      metadata: {},
      products: cart.map((item) => ({
        productId: item.productId,
        variantId: item.variantId,
        quantity: item.quantity,
        displayUnit: item.unit,
        secondaryUnitId: null,
        secondaryQuantity: 0,
      })),
    }

    try {
      const res = await axios.post(
        'https://api.salesense.logiqbits.com/orders',
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${ACCESS_TOKEN}`,
          },
        }
      )

      hideLoading()
      setIsSubmitting(false)

      const data = res.data
      const orderId =
        data?.id ?? data?.serial ?? Math.floor(100000 + Math.random() * 900000)

      setIsModalOpen(false)
      setCart([])

      Modal.success({
        title: 'Order Dispatched Successfully!',
        okButtonProps: {
          style: {
            backgroundColor: '#23496b',
            borderRadius: '2px',
            border: 'none',
          },
        },
        content: (
          <div className="pt-2 text-xs">
            <p>
              Your order has been successfully submitted to the sales tracking
              module.
            </p>
            <p className="pt-4">
              Generated System ID:{" "}
              <span className="font-mono font-bold text-blue-800">
                PO-{orderId}
              </span>
            </p>
          </div>
        ),
      })
    } catch (err: any) {
      hideLoading()
      setIsSubmitting(false)
      const errMsg =
        err?.response?.data?.message ||
        err?.response?.statusText ||
        err?.message ||
        'Unknown error'
      message.error(`Order failed: ${errMsg}`)
    }
  }

  return (
    <div className="flex h-screen bg-[#EAEFF4]">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 overflow-auto md:ml-0 flex flex-col">
        <div className="bg-[#23496b] text-white">
          <Header
            title="Quick Order Entry"
            subtitle="Search and directly stage catalog products into line distribution sheets"
            onMenuToggle={() => setSidebarOpen(true)}
          />
        </div>

        <div className="bg-white border-b border-slate-200 px-4 sm:px-6 py-2.5 flex items-center gap-2 text-xs text-slate-500 font-medium shrink-0 overflow-x-auto whitespace-nowrap">
          <Home className="w-3.5 h-3.5 text-blue-800 shrink-0" />
          <span className="text-blue-800 font-semibold hover:underline cursor-pointer">
            Home
          </span>
          <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
          <span className="text-blue-800 font-semibold hover:underline cursor-pointer">
            Sales
          </span>
          <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
          <span className="text-slate-600">Quick Order</span>
        </div>

        <div className="flex-1 p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
          <div className="lg:col-span-2 space-y-4 w-full">
            <div className="bg-white rounded-md border border-slate-200 p-4 space-y-3.5 shadow-xs">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <Input
                    size="middle"
                    placeholder="Search wholesale catalog items by structural name or product SKU..."
                    prefix={<SearchOutlined className="text-slate-400" />}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    allowClear
                    className="rounded-sm w-full"
                  />
                </div>

                <div className="flex p-0.5 bg-slate-100 border border-slate-200/80 rounded-sm shrink-0 self-end sm:self-auto">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded-xs transition-colors ${viewMode === 'grid'
                        ? 'bg-white text-[#23496b] shadow-xs'
                        : 'text-slate-400 hover:text-slate-600'
                      }`}
                    title="Grid View"
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 rounded-xs transition-colors ${viewMode === 'list'
                        ? 'bg-white text-[#23496b] shadow-xs'
                        : 'text-slate-400 hover:text-slate-600'
                      }`}
                    title="List View"
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-thin">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1 shrink-0">
                  Nodes:
                </span>
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`px-3 py-1 rounded-sm text-xs font-bold transition-all shrink-0 ${!selectedCategory
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
                    className={`px-3 py-1 rounded-sm text-xs font-bold transition-all shrink-0 ${selectedCategory === category
                        ? 'bg-[#23496b] text-white border border-[#23496b]'
                        : 'bg-slate-100 text-slate-600 border border-slate-200/60 hover:bg-slate-200'
                      }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-md border border-slate-200 p-4 hover:border-slate-400 transition-all flex flex-col justify-between shadow-xs"
                  >
                    <div>
                      <div className="flex gap-3 items-start">
                        <div className="relative w-20 h-20 sm:w-24 sm:h-24 bg-slate-50 rounded-sm overflow-hidden border border-slate-200 shrink-0">
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            sizes="(max-width: 640px) 80px, 96px"
                            className="object-cover"
                            priority={false}
                          />
                        </div>

                        <div className="flex-1 min-w-0 h-20 sm:h-24 flex flex-col justify-between py-0.5">
                          <div>
                            <div className="flex items-start justify-between gap-1">
                              <h3 className="font-bold text-slate-800 text-xs leading-tight line-clamp-2">
                                {product.name}
                              </h3>
                              <Tag
                                color="blue"
                                className="m-0 text-[9px] uppercase font-bold shrink-0 rounded-sm border-none bg-slate-100 text-slate-700"
                              >
                                {product.category}
                              </Tag>
                            </div>
                            <span className="text-[10px] font-mono text-slate-400 font-bold block mt-1">
                              SKU: {product.id}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 font-medium m-0">
                            Packing: {product.size}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between my-3 bg-slate-50 p-2.5 rounded-sm border border-slate-100">
                        <div>
                          <p className="text-sm sm:text-base font-black text-[#23496b]">
                            TK {product.price.toLocaleString('en-IN')}
                          </p>
                          <p className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">
                            Per {product.unit}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-[9px] text-slate-400 uppercase font-bold tracking-wider">
                            Staged Available
                          </p>
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
              <div className="bg-white rounded-md border border-slate-200 divide-y divide-slate-100 shadow-xs overflow-hidden">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="p-3.5 flex flex-col sm:flex-row sm:items-center gap-4 hover:bg-slate-50/60 transition-colors"
                  >
                    <div className="flex items-center gap-3.5 flex-1 min-w-0">
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

                      <div className="flex-1 min-w-0 grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-3 items-center">
                        <div className="min-w-0">
                          <h3 className="font-bold text-slate-800 text-xs truncate m-0">
                            {product.name}
                          </h3>
                          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-1">
                            <span className="text-[10px] font-mono text-slate-400 font-bold">
                              SKU: {product.id}
                            </span>
                            <span className="w-1 h-1 rounded-full bg-slate-300 hidden sm:inline-block" />
                            <span className="text-[10px] text-slate-500 font-medium">
                              Packing: {product.size}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 md:justify-center">
                          <Tag
                            color="blue"
                            className="m-0 text-[9px] uppercase font-bold rounded-sm border-none bg-slate-100 text-slate-700"
                          >
                            {product.category}
                          </Tag>
                          <span className="text-[10px] sm:text-[11px] text-slate-400 font-medium font-mono">
                            ({product.inStock} Staged)
                          </span>
                        </div>

                        <div className="text-left md:text-right">
                          <span className="text-[9px] text-slate-400 uppercase font-black tracking-wider block leading-none mb-0.5">
                            Wholesale Price
                          </span>
                          <p className="text-xs sm:text-sm font-black text-[#23496b] m-0">
                            TK {product.price.toLocaleString('en-IN')}{' '}
                            <span className="text-[10px] font-bold text-slate-400 font-normal normal-case">
                              /{product.unit}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0 pl-0 sm:pl-2 flex justify-end">
                      <Button
                        type="default"
                        icon={<PlusOutlined />}
                        onClick={() => addToCart(product)}
                        className="bg-slate-50 hover:bg-[#23496b]! border border-slate-200 text-slate-700 hover:text-white! w-full sm:w-8 h-8 rounded-sm p-0 flex items-center justify-center transition-all shadow-2xs text-xs sm:text-sm px-4 sm:px-0"
                        title="Add to sheet"
                      >
                        <span className="inline-block sm:hidden ml-2">
                          Add Item
                        </span>
                      </Button>
                    </div>
                  </div>
                ))}
                {filteredProducts.length === 0 && (
                  <div className="py-12 bg-white">
                    <Empty
                      image={Empty.PRESENTED_IMAGE_SIMPLE}
                      description="No logistics inventory items match your criteria."
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="bg-white rounded-md border border-slate-200 p-4 sm:p-5 space-y-4 shadow-xs w-full">
            <div className="flex justify-between items-center pb-2.5 border-b border-slate-100">
              <h2 className="text-sm font-bold text-[#23496b]">
                All Invoices / Draft
              </h2>
              <Tag
                color="blue"
                className="font-bold m-0 rounded-sm border-none text-[10px] uppercase"
              >
                Active Order
              </Tag>
            </div>

            {cart.length === 0 ? (
              <div className="py-12">
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description="No logistics inventory items staged yet."
                />
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
                          <p className="text-xs font-bold text-slate-800 truncate">
                            {item.name}
                          </p>
                          <p className="text-[11px] text-slate-400 font-medium">
                            TK {item.price.toLocaleString('en-IN')} each
                          </p>
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
                            onChange={(val) =>
                              updateQuantity(item.id, Number(val) || 0)
                            }
                            className="w-16 text-xs rounded-r-sm"
                            controls={false}
                          />
                        </Space.Compact>
                        <p className="font-bold text-slate-800 text-xs">
                          TK{' '}
                          {(item.price * item.quantity).toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-slate-200 pt-3.5 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-500 font-medium">
                    <span>Base Wholesale Subtotal:</span>
                    <span className="text-slate-800 font-bold">
                      TK {cartTotal.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex justify-between text-slate-500 font-medium">
                    <span>Freight/Shipping Routing:</span>
                    <span className="text-slate-600 font-bold">
                      Ex-Mill Complex
                    </span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-[#23496b] pt-2.5 border-t border-dashed border-slate-200">
                    <span>Total Aggregate Value:</span>
                    <span className="text-base font-black">
                      TK {cartTotal.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

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
                      onClick={() =>
                        message.success(
                          'Order parameters saved as localization draft configuration.'
                        )
                      }
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
        okText="Confirm Order"
        cancelText="Cancel"
        okButtonProps={{
          style: {
            backgroundColor: '#23496b',
            borderRadius: '2px',
            border: 'none',
          },
          className: 'text-xs font-bold',
        }}
        cancelButtonProps={{
          className: 'text-xs font-bold rounded-sm',
        }}
        width={500}
        styles={{ body: { paddingTop: '12px' } }}
        className="max-w-[calc(100vw-32px)]"
      >
        <div className="space-y-3.5">
          <p className="text-xs text-slate-600">
            Please verify your item before proceeding with this order.
          </p>

          <Descriptions
            bordered
            layout="vertical"
            size="small"
            className="text-xs"
            column={{ xs: 1, sm: 3 }}
          >

            <Descriptions.Item label="Staged Line Items">
              {cart.length}
            </Descriptions.Item>
            <Descriptions.Item label="Gross Cargo Bags">
              {totalItemsCount}
            </Descriptions.Item>
            <Descriptions.Item label="Valuation Aggregate">
              TK {cartTotal.toLocaleString('en-IN')}
            </Descriptions.Item>
          </Descriptions>

          <div className="bg-slate-50 border border-slate-200 rounded-sm p-3 mt-4 text-[11px] font-medium text-slate-500">
            <strong>Notice:</strong> Modifying quantities after the order
            submission requires explicit authorization from sales admin.
          </div>
        </div>
      </Modal>
    </div>
  )
}
