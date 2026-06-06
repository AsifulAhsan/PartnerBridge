'use client'

import { Sidebar } from '@/components/sidebar'
import { Header } from '@/components/header'
import { Save, Lock, Bell, CreditCard, Users, Shield } from 'lucide-react'
import { useState } from 'react'

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile')
  const [formData, setFormData] = useState({
    companyName: 'Springfield Farm',
    contactName: 'John Doe',
    email: 'john@springfieldfarm.com',
    phone: '+1 (555) 123-4567',
    address: '123 Farm Lane, Springfield, IL 62701',
  })

  const [notificationSettings, setNotificationSettings] = useState({
    orderConfirmation: true,
    shipmentUpdates: true,
    invoiceNotification: true,
    paymentReminders: true,
    promotions: false,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleNotificationChange = (key: string) => {
    setNotificationSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  const tabs = [
    { id: 'profile', label: 'Company Profile', icon: Users },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'payment', label: 'Payment Methods', icon: CreditCard },
    { id: 'security', label: 'Security', icon: Shield },
  ]

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <main className="flex-1 overflow-auto md:ml-0">
        <Header title="Settings" subtitle="Manage your account and preferences" />

        <div className="p-6 md:p-8">
          <div className="max-w-4xl">
            {/* Tabs */}
            <div className="flex border-b border-gray-200 mb-6 overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-3 font-medium text-sm border-b-2 transition-colors whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'border-green-600 text-green-600'
                        : 'border-transparent text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                )
              })}
            </div>

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-6">Company Information</h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Company Name
                      </label>
                      <input
                        type="text"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Contact Name
                      </label>
                      <input
                        type="text"
                        name="contactName"
                        value={formData.contactName}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Billing Address
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                      />
                    </div>

                    <button className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors">
                      <Save className="w-4 h-4" />
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-6">Notification Preferences</h3>

                  <div className="space-y-4">
                    {[
                      {
                        key: 'orderConfirmation',
                        label: 'Order Confirmations',
                        description: 'Receive confirmation when orders are placed',
                      },
                      {
                        key: 'shipmentUpdates',
                        label: 'Shipment Updates',
                        description: 'Get notified about order status changes and deliveries',
                      },
                      {
                        key: 'invoiceNotification',
                        label: 'Invoice Notifications',
                        description: 'Receive alerts when invoices are issued',
                      },
                      {
                        key: 'paymentReminders',
                        label: 'Payment Reminders',
                        description: 'Get reminders about upcoming payment due dates',
                      },
                      {
                        key: 'promotions',
                        label: 'Promotional Offers',
                        description: 'Receive special offers and product promotions',
                      },
                    ].map((item) => (
                      <div key={item.key} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{item.label}</p>
                          <p className="text-sm text-gray-500">{item.description}</p>
                        </div>
                        <label className="relative inline-block w-12 h-7 bg-gray-300 rounded-full cursor-pointer">
                          <input
                            type="checkbox"
                            checked={
                              notificationSettings[item.key as keyof typeof notificationSettings]
                            }
                            onChange={() => handleNotificationChange(item.key)}
                            className="opacity-0 w-0 h-0"
                          />
                          <span
                            className={`absolute cursor-pointer top-1 left-1 w-5 h-5 rounded-full transition-all ${
                              notificationSettings[item.key as keyof typeof notificationSettings]
                                ? 'bg-green-600 left-6'
                                : 'bg-white'
                            }`}
                          />
                        </label>
                      </div>
                    ))}
                  </div>

                  <button className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors mt-6">
                    <Save className="w-4 h-4" />
                    Save Preferences
                  </button>
                </div>
              </div>
            )}

            {/* Payment Methods Tab */}
            {activeTab === 'payment' && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-6">Saved Payment Methods</h3>

                  <div className="space-y-4">
                    <div className="border border-gray-200 rounded-lg p-4 flex items-start justify-between">
                      <div>
                        <p className="font-semibold text-gray-900">Bank Account - Checking</p>
                        <p className="text-sm text-gray-500">Ending in 4821</p>
                        <p className="text-xs text-gray-400 mt-1">Primary payment method</p>
                      </div>
                      <button className="text-gray-400 hover:text-red-600 transition-colors">
                        Remove
                      </button>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-4 flex items-start justify-between">
                      <div>
                        <p className="font-semibold text-gray-900">Credit Card - Visa</p>
                        <p className="text-sm text-gray-500">Ending in 4242</p>
                        <p className="text-xs text-gray-400 mt-1">Added 3 months ago</p>
                      </div>
                      <button className="text-gray-400 hover:text-red-600 transition-colors">
                        Remove
                      </button>
                    </div>
                  </div>

                  <button className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors mt-6">
                    <CreditCard className="w-4 h-4" />
                    Add Payment Method
                  </button>
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="space-y-6">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-6">Security Settings</h3>

                  <div className="space-y-4">
                    <div className="border border-gray-200 rounded-lg p-4 flex items-start justify-between">
                      <div>
                        <p className="font-semibold text-gray-900">Password</p>
                        <p className="text-sm text-gray-500">Last changed 2 months ago</p>
                      </div>
                      <button className="px-4 py-2 text-sm font-medium text-green-600 border border-green-600 rounded-lg hover:bg-green-50 transition-colors">
                        Change
                      </button>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-4 flex items-start justify-between">
                      <div>
                        <p className="font-semibold text-gray-900">Two-Factor Authentication</p>
                        <p className="text-sm text-gray-500">Not enabled</p>
                      </div>
                      <button className="px-4 py-2 text-sm font-medium text-green-600 border border-green-600 rounded-lg hover:bg-green-50 transition-colors">
                        Enable
                      </button>
                    </div>

                    <div className="border border-gray-200 rounded-lg p-4">
                      <p className="font-semibold text-gray-900 mb-2">Active Sessions</p>
                      <p className="text-sm text-gray-500">You are currently signed in on 1 device</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
