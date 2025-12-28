// src/components/customer/CheckoutStepper.jsx

import { motion } from 'framer-motion'
import { Check } from 'lucide-react'

export default function CheckoutStepper({ steps, currentStep }) {
  return (
    <div className="bg-white rounded-2xl shadow-card p-6">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const Icon = step.icon
          const isCompleted = currentStep > step.number
          const isCurrent = currentStep === step.number
          const isUpcoming = currentStep < step.number

          return (
            <div key={step.number} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <motion.div
                  initial={false}
                  animate={{
                    scale: isCurrent ? 1.1 : 1,
                    backgroundColor: isCompleted
                      ? '#10B981'
                      : isCurrent
                      ? '#FF6B35'
                      : '#E5E7EB'
                  }}
                  className="relative flex items-center justify-center w-12 h-12 rounded-full transition-colors"
                >
                  {isCompleted ? (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    >
                      <Check className="w-6 h-6 text-white" />
                    </motion.div>
                  ) : (
                    <Icon
                      className={`w-6 h-6 ${
                        isCurrent ? 'text-white' : isUpcoming ? 'text-neutral-400' : 'text-white'
                      }`}
                    />
                  )}

                  {isCurrent && (
                    <motion.div
                      className="absolute inset-0 rounded-full border-4 border-primary-200"
                      initial={{ scale: 1, opacity: 0 }}
                      animate={{ scale: 1.3, opacity: [0, 1, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}
                </motion.div>

                <div className="mt-3 text-center">
                  <p
                    className={`text-sm font-semibold ${
                      isCurrent
                        ? 'text-primary-600'
                        : isCompleted
                        ? 'text-green-600'
                        : 'text-neutral-500'
                    }`}
                  >
                    {step.label}
                  </p>
                </div>
              </div>

              {index < steps.length - 1 && (
                <div className="flex-1 h-0.5 mx-4 mt-[-2.5rem]">
                  <motion.div
                    initial={false}
                    animate={{
                      backgroundColor: currentStep > step.number ? '#10B981' : '#E5E7EB'
                    }}
                    className="h-full"
                    transition={{ duration: 0.3 }}
                  />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}