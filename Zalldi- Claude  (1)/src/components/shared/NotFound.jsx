// src/components/shared/NotFound.jsx

import { useNavigate } from 'react-router-dom'
import { Home, Search, ShoppingBag, ArrowLeft } from 'lucide-react'
import { motion } from 'framer-motion'
import Button from '@components/ui/Button'
import { ROUTES } from '@utils/constants'

export default function NotFound({
  title = 'Page Not Found',
  message = 'The page you are looking for does not exist or has been moved.',
  showBackButton = true,
  showHomeButton = true,
  showShopButton = true
}) {
  const navigate = useNavigate()
  
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-lg"
      >
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="relative inline-block">
            <motion.div
              animate={{ 
                rotate: [0, -5, 5, -5, 0],
                scale: [1, 1.05, 1]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatDelay: 3
              }}
            >
              <div className="text-[120px] font-display font-bold text-orange-500 leading-none">
                404
              </div>
            </motion.div>
            
            <motion.div
              className="absolute -top-4 -right-4"
              animate={{ 
                rotate: 360,
                scale: [1, 1.2, 1]
              }}
              transition={{ 
                rotate: { duration: 20, repeat: Infinity, ease: 'linear' },
                scale: { duration: 2, repeat: Infinity }
              }}
            >
              <Search className="w-12 h-12 text-orange-300" />
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <h1 className="text-display font-display font-bold text-neutral-800 mb-4">
            {title}
          </h1>
          <p className="text-body-lg text-neutral-600">
            {message}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          {showBackButton && (
            <Button
              variant="secondary"
              onClick={() => navigate(-1)}
              className="w-full sm:w-auto"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Go Back
            </Button>
          )}
          
          {showHomeButton && (
            <Button
              onClick={() => navigate(ROUTES.HOME)}
              className="w-full sm:w-auto"
            >
              <Home className="w-5 h-5 mr-2" />
              Home
            </Button>
          )}
          
          {showShopButton && (
            <Button
              variant="secondary"
              onClick={() => navigate(ROUTES.SHOP)}
              className="w-full sm:w-auto"
            >
              <ShoppingBag className="w-5 h-5 mr-2" />
              Shop Now
            </Button>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12 pt-8 border-t border-neutral-200"
        >
          <p className="text-body-sm text-neutral-500 mb-4">
            Looking for something specific?
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {['Groceries', 'Vegetables', 'Fruits', 'Dairy'].map((category, index) => (
              <motion.button
                key={category}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1 + index * 0.1 }}
                onClick={() => navigate(`${ROUTES.SHOP}?category=${category.toLowerCase()}`)}
                className="px-4 py-2 bg-orange-50 text-orange-600 rounded-full text-body-sm font-medium hover:bg-orange-100 transition-colors"
              >
                {category}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export function ProductNotFound() {
  return (
    <NotFound
      title="Product Not Found"
      message="The product you are looking for is no longer available or doesn't exist."
      showShopButton={true}
      showHomeButton={false}
    />
  )
}

export function OrderNotFound() {
  const navigate = useNavigate()
  
  return (
    <NotFound
      title="Order Not Found"
      message="We couldn't find the order you're looking for. Please check your order number."
      showShopButton={false}
      showHomeButton={false}
    >
      <Button onClick={() => navigate(ROUTES.CUSTOMER_ORDERS)}>
        View My Orders
      </Button>
    </NotFound>
  )
}