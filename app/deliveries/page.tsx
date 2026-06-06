'use client'

import { Sidebar } from '@/components/sidebar'
import { Header } from '@/components/header'
import { Search, MapPin, Phone, Calendar, Package, CheckCircle } from 'lucide-react'
import { useState } from 'react'

const deliveries = [
  {
    id: 'DLV-2024-045',
    orderId: 'ORD-2024-00155',
    status: 'in-transit',
    estimatedDelivery: '2024-06-07',
    driver: 'John Martinez',
    phone: '+1 (555) 123-4567',
    vehicle: 'Truck #42',
    items: '10x Poultry Starter Mix',
    currentLocation: 'En route to Springfield',
    lastUpdate: '2 hours ago',
    progress: 65,
  },
  {
    id: 'DLV-2024-046',
    orderId: 'ORD-2024-00154',
    status: 'processing',
    estimatedDelivery: '2024-06-07',
    driver: 'Sarah Johnson',
    phone: '+1 (555) 234-5678',
    vehicle: 'Van #12',
    items: '3x Mineral & Vitamin Supplement',
    currentLocation: 'Warehouse (Processing)',
    lastUpdate: 'Just now',
    progress: 20,
  },
  {
    id: 'DLV-2024-044',
    orderId: 'ORD-2024-00156',
    status: 'delivered',
    estimatedDelivery: '2024-06-06',
    driver: 'Michael Chen',
    phone: '+1 (555) 345-6789',
    vehicle: 'Truck #38',
    items: '5x Premium Cattle Feed',
    currentLocation: 'Springfield Farm',
    lastUpdate: '1 day ago',
    progress: 100,
  },
  {
    id: 'DLV-2024-043',
    orderId: 'ORD-2024-00150',
    status: 'in-transit',
    estimatedDelivery: '2024-06-07',
    driver: 'Patricia Williams',
    phone: '+1 (555) 456-7890',
    vehicle: 'Truck #41',
    items: '6x Alfalfa Hay',
    currentLocation: 'Route to Meadow Feeds',
    lastUpdate: '30 minutes ago',
    progress: 45,
  },
  {
    id: 'DLV-2024-042',
    orderId: 'ORD-2024-00152',
    status: 'delivered',
    estimatedDelivery: '2024-06-05',
    driver: 'David Rodriguez',
    phone: '+1 (555) 567-8901',
    vehicle: 'Van #15',
    items: '5x Layer Pellets, 3x Grain Mix',
    currentLocation: 'Mountain View Farm',
    lastUpdate: '2 days ago',
    progress: 100,
  },
]

const statusConfig = {
  pending: { bg: 'bg-gray-100', text: 'text-gray-800', icon: Package },
  processing: { bg: 'bg-orange-100', text: 'text-orange-800', icon: Package },
  'in-transit': { bg: 'bg-blue-100', text: 'text-blue-800', icon: MapPin },
  delivered: { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle },
}

export default function DeliveriesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null)
  const [selectedDelivery, setSelectedDelivery] = useState<(typeof deliveries)[0] | null>(null)

  const filteredDeliveries = deliveries.filter((delivery) => {
    const matchesSearch =
      delivery.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      delivery.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      delivery.driver.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = !selectedStatus || delivery.status === selectedStatus

    return matchesSearch && matchesStatus
  })

  const statuses = ['processing', 'in-transit', 'delivered']

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <main className="flex-1 overflow-auto md:ml-0">
        <Header title="Delivery Tracking" subtitle="Real-time tracking of your shipments" />

        <div className="p-6 md:p-8 space-y-6">
          {/* Search and Filters */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by Delivery ID, Order ID, or Driver..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              <button
                onClick={() => setSelectedStatus(null)}
                className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  !selectedStatus
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                All Shipments
              </button>
              {statuses.map((status) => (
                <button
                  key={status}
                  onClick={() => setSelectedStatus(status)}
                  className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    selectedStatus === status
                      ? 'bg-green-100 text-green-700'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
                </button>
              ))}
            </div>
          </div>

          {/* Deliveries Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* List View */}
            <div className="lg:col-span-2 space-y-4">
              {filteredDeliveries.length === 0 ? (
                <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                  <p className="text-gray-500">No deliveries found</p>
                </div>
              ) : (
                filteredDeliveries.map((delivery) => {
                  const config = statusConfig[delivery.status as keyof typeof statusConfig]
                  const StatusIcon = config.icon
                  return (
                    <div
                      key={delivery.id}
                      onClick={() => setSelectedDelivery(delivery)}
                      className={`bg-white rounded-lg border-2 p-4 cursor-pointer transition-all hover:shadow-md ${
                        selectedDelivery?.id === delivery.id
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-bold text-gray-900">{delivery.id}</h3>
                          <p className="text-sm text-gray-500">Order {delivery.orderId}</p>
                        </div>
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${config.bg} ${config.text}`}
                        >
                          {delivery.status.charAt(0).toUpperCase() +
                            delivery.status.slice(1).replace('-', ' ')}
                        </span>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <p className="text-gray-700">{delivery.currentLocation}</p>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Package className="w-4 h-4 text-gray-400" />
                          <p className="text-gray-700">{delivery.items}</p>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs font-semibold text-gray-600">
                            Delivery Progress
                          </span>
                          <span className="text-xs font-bold text-gray-900">{delivery.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-600 h-2 rounded-full transition-all"
                            style={{ width: `${delivery.progress}%` }}
                          />
                        </div>
                      </div>

                      <div className="text-xs text-gray-500">
                        Updated {delivery.lastUpdate}
                      </div>
                    </div>
                  )
                })
              )}
            </div>

            {/* Detail Panel */}
            <div className="h-fit sticky top-24">
              {selectedDelivery ? (
                <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900 mb-2">{selectedDelivery.id}</h2>
                    <p className="text-sm text-gray-500">Order {selectedDelivery.orderId}</p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-gray-600 uppercase mb-3">Driver Info</p>
                    <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                      <div>
                        <p className="text-xs text-gray-500">Name</p>
                        <p className="font-semibold text-gray-900">{selectedDelivery.driver}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Vehicle</p>
                        <p className="font-semibold text-gray-900">{selectedDelivery.vehicle}</p>
                      </div>
                      <a
                        href={`tel:${selectedDelivery.phone}`}
                        className="flex items-center gap-2 text-green-600 font-semibold hover:text-green-700 transition-colors text-sm"
                      >
                        <Phone className="w-4 h-4" />
                        {selectedDelivery.phone}
                      </a>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-gray-600 uppercase mb-3">
                      Expected Delivery
                    </p>
                    <div className="bg-blue-50 rounded-lg p-4 flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="text-xs text-blue-600">Est. Delivery Date</p>
                        <p className="font-bold text-blue-900">{selectedDelivery.estimatedDelivery}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-gray-600 uppercase mb-3">Items</p>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm text-gray-700">{selectedDelivery.items}</p>
                    </div>
                  </div>

                  <button className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors">
                    Contact Driver
                  </button>
                </div>
              ) : (
                <div className="bg-white rounded-lg border border-gray-200 p-6 text-center text-gray-500">
                  <p>Select a delivery to view details</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
