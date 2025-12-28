// src/pages/supplier/Orders.jsx

import { useState, useEffect } from 'react'
import { useAuth } from '@hooks/useAuth'
import { useOrders } from '@hooks/useOrders'
import OrderQueue from '@components/supplier/OrderQueue'
import OrderKanban from '@components/supplier/OrderKanban'
import { LayoutGrid, List } from 'lucide-react'
import Button from '@components/ui/Button'
import LoadingScreen from '@components/shared/LoadingScreen'
import EmptyState from '@components/shared/EmptyState'

export default function SupplierOrders() {
  const { user } = useAuth()
  const { orders, loading, fetchSupplierOrders } = useOrders()
  const [viewMode, setViewMode] = useState('queue')
  const [statusFilter, setStatusFilter] = useState('all')
  
  useEffect(() => {
    if (user?.uid) {
      fetchSupplierOrders(user.uid)
    }
  }, [user])
  
  const filteredOrders = statusFilter === 'all' ?
    orders :
    orders.filter(order => order.status === statusFilter)
  
  const activeOrders = orders.filter(order =>
    !['delivered', 'cancelled'].includes(order.status)
  )
  
  const statusCounts = {
    all: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    confirmed: orders.filter(o => o.status === 'confirmed').length,
    picking: orders.filter(o => o.status === 'picking').length,
    packing: orders.filter(o => o.status === 'packing').length,
    out_for_delivery: orders.filter(o => o.status === 'out_for_delivery').length
  }
  
  if (loading) {
    return <LoadingScreen />
  }
  
  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-display font-display text-neutral-800">Orders</h1>
              <p className="text-body text-neutral-600 mt-1">
                Manage and fulfill your orders
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'queue' ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setViewMode('queue')}
              >
                <List className="w-4 h-4" />
                <span className="hidden sm:inline ml-2">Queue</span>
              </Button>
              <Button
                variant={viewMode === 'kanban' ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setViewMode('kanban')}
              >
                <LayoutGrid className="w-4 h-4" />
                <span className="hidden sm:inline ml-2">Kanban</span>
              </Button>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-2">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-4 py-2 rounded-lg text-body-sm font-medium transition-colors ${
                statusFilter === 'all'
                  ? 'bg-primary-500 text-white'
                  : 'bg-white text-neutral-700 hover:bg-neutral-100'
              }`}
            >
              All ({statusCounts.all})
            </button>
            <button
              onClick={() => setStatusFilter('pending')}
              className={`px-4 py-2 rounded-lg text-body-sm font-medium transition-colors ${
                statusFilter === 'pending'
                  ? 'bg-primary-500 text-white'
                  : 'bg-white text-neutral-700 hover:bg-neutral-100'
              }`}
            >
              Pending ({statusCounts.pending})
            </button>
            <button
              onClick={() => setStatusFilter('confirmed')}
              className={`px-4 py-2 rounded-lg text-body-sm font-medium transition-colors ${
                statusFilter === 'confirmed'
                  ? 'bg-primary-500 text-white'
                  : 'bg-white text-neutral-700 hover:bg-neutral-100'
              }`}
            >
              Confirmed ({statusCounts.confirmed})
            </button>
            <button
              onClick={() => setStatusFilter('picking')}
              className={`px-4 py-2 rounded-lg text-body-sm font-medium transition-colors ${
                statusFilter === 'picking'
                  ? 'bg-primary-500 text-white'
                  : 'bg-white text-neutral-700 hover:bg-neutral-100'
              }`}
            >
              Picking ({statusCounts.picking})
            </button>
            <button
              onClick={() => setStatusFilter('packing')}
              className={`px-4 py-2 rounded-lg text-body-sm font-medium transition-colors ${
                statusFilter === 'packing'
                  ? 'bg-primary-500 text-white'
                  : 'bg-white text-neutral-700 hover:bg-neutral-100'
              }`}
            >
              Packing ({statusCounts.packing})
            </button>
            <button
              onClick={() => setStatusFilter('out_for_delivery')}
              className={`px-4 py-2 rounded-lg text-body-sm font-medium transition-colors ${
                statusFilter === 'out_for_delivery'
                  ? 'bg-primary-500 text-white'
                  : 'bg-white text-neutral-700 hover:bg-neutral-100'
              }`}
            >
              Out for Delivery ({statusCounts.out_for_delivery})
            </button>
          </div>
        </div>

        {filteredOrders.length === 0 ? (
          <EmptyState
            title="No orders found"
            description={statusFilter === 'all' 
              ? "You don't have any orders yet. Orders will appear here when customers place them."
              : `No orders in ${statusFilter} status.`}
          />
        ) : (
          <>
            {viewMode === 'queue' ? (
              <OrderQueue orders={filteredOrders} />
            ) : (
              <OrderKanban orders={filteredOrders} />
            )}
          </>
        )}
      </div>
    </div>
  )
}