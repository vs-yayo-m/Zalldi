// src/components/admin/MarketingTools.jsx

import { useState } from 'react'
import { motion } from 'framer-motion'
import Card from '@components/ui/Card'
import Tabs from '@components/ui/Tabs'
import CampaignManager from './CampaignManager'
import BannerManager from './BannerManager'
import CouponManager from './CouponManager'
import { Megaphone, Image, Ticket, Mail, Bell } from 'lucide-react'

export default function MarketingTools() {
  const [activeTab, setActiveTab] = useState('campaigns')
  
  const tabs = [
    { id: 'campaigns', label: 'Campaigns', icon: Megaphone },
    { id: 'banners', label: 'Banners', icon: Image },
    { id: 'coupons', label: 'Coupons', icon: Ticket }
  ]
  
  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold text-neutral-800 mb-2">
            Marketing Tools
          </h1>
          <p className="text-neutral-600">
            Create and manage marketing campaigns, banners, and promotions
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {[
            {
              label: 'Active Campaigns',
              value: '3',
              icon: Megaphone,
              color: 'orange'
            },
            {
              label: 'Active Banners',
              value: '5',
              icon: Image,
              color: 'blue'
            },
            {
              label: 'Active Coupons',
              value: '8',
              icon: Ticket,
              color: 'green'
            }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-lg bg-${stat.color}-100`}>
                    <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                  </div>
                  <div>
                    <p className="text-sm text-neutral-600">{stat.label}</p>
                    <p className="text-2xl font-bold text-neutral-800">{stat.value}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        <Card className="p-6">
          <Tabs
            tabs={tabs}
            activeTab={activeTab}
            onChange={setActiveTab}
            className="mb-6"
          />

          <div className="mt-6">
            {activeTab === 'campaigns' && <CampaignManager />}
            {activeTab === 'banners' && <BannerManager />}
            {activeTab === 'coupons' && <CouponManager />}
          </div>
        </Card>
      </div>
    </div>
  )
}