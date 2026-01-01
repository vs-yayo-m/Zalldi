// src/components/customer/CheckoutStepper.jsx

import { motion } from 'framer-motion'
import { MapPin, CreditCard, Check } from 'lucide-react'

export default function CheckoutStepper({ currentStep = 1 }) {
  const steps = [
    {
      number: 1,
      title: 'Address',
      icon: MapPin,
      description: 'Delivery address'
    },
    {
      number: 2,
      title: 'Payment',
      icon: CreditCard,
      description: 'Payment method'
    }
  ]

  return (
    <div className="relative">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isActive = currentStep === step.number
          const isCompleted = currentStep > step.number
          const Icon = step.icon

          return (
            <div key={step.number} className="flex-1 relative">
              <div className="flex items-center">
                <div className="flex flex-col items-center flex-1">
                  <motion.div
                    initial={false}
                    animate={{
                      scale: isActive ? 1.1 : 1,
                      backgroundColor: isCompleted 
                        ? '#10B981' 
                        : isActive 
                        ? '#FF6B35' 
                        : '#E5E7EB'
                    }}
                    className={`
                      relative w-12 h-12 rounded-full flex items-center justify-center
                      transition-all duration-300 shadow-lg z-10
                      ${isCompleted ? 'bg-green-500' : isActive ? 'bg-orange-500' : 'bg-neutral-300'}
                    `}
                  >
                    {isCompleted ? (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      >
                        <Check className="w-6 h-6 text-white" strokeWidth={3} />
                      </motion.div>
                    ) : (
                      <Icon className={`
                        w-5 h-5
                        ${isActive ? 'text-white' : 'text-neutral-500'}
                      `} />
                    )}

                    {isActive && (
                      <motion.div
                        className="absolute inset-0 rounded-full bg-orange-500 opacity-30"
                        animate={{
                          scale: [1, 1.5, 1],
                          opacity: [0.3, 0, 0.3]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: 'easeInOut'
                        }}
                      />
                    )}
                  </motion.div>

                  <div className="mt-3 text-center">
                    <motion.p
                      animate={{
                        color: isCompleted 
                          ? '#10B981' 
                          : isActive 
                          ? '#FF6B35' 
                          : '#9CA3AF',
                        fontWeight: isActive ? 600 : 500
                      }}
                      className="text-body-sm font-medium"
                    >
                      {step.title}
                    </motion.p>
                    <p className={`
                      text-caption mt-0.5
                      ${isActive ? 'text-neutral-600' : 'text-neutral-400'}
                    `}>
                      {step.description}
                    </p>
                  </div>
                </div>

                {index < steps.length - 1 && (
                  <div className="absolute top-6 left-1/2 w-full h-0.5 -z-10">
                    <div className="relative w-full h-full bg-neutral-200">
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-orange-500 to-green-500"
                        initial={{ width: '0%' }}
                        animate={{
                          width: currentStep > step.number ? '100%' : '0%'
                        }}
                        transition={{ duration: 0.5, ease: 'easeInOut' }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <motion.div
        className="mt-6 p-4 bg-orange-50 border border-orange-200 rounded-xl"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <p className="text-body-sm text-neutral-700">
          <strong className="text-orange-600">Step {currentStep} of {steps.length}:</strong>{' '}
          {steps[currentStep - 1]?.description}
        </p>
      </motion.div>
    </div>
  )
}