import { motion } from 'framer-motion'
import { MapPin, CreditCard, Package, Check } from 'lucide-react'

export default function CheckoutStepper({ currentStep = 1 }) {
  const steps = [
    {
      number: 1,
      title: 'Address',
      icon: MapPin,
      description: 'Where to deliver?'
    },
    {
      number: 2,
      title: 'Payment',
      icon: CreditCard,
      description: 'How to pay?'
    },
    {
        number: 3,
        title: 'Review',
        icon: Package,
        description: 'Check details'
    }
  ]

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isActive = currentStep === step.number
          const isCompleted = currentStep > step.number
          const Icon = step.icon

          return (
            <div key={step.number} className="flex-1 relative last:flex-none last:w-12">
              <div className="flex items-center">
                <div className="flex flex-col items-center relative z-10">
                  <motion.div
                    initial={false}
                    animate={{
                      scale: isActive ? 1.15 : 1,
                      backgroundColor: isCompleted 
                        ? '#15803d' // green-700
                        : isActive 
                        ? '#000000' 
                        : '#f5f5f5'
                    }}
                    className={`
                      w-12 h-12 rounded-2xl flex items-center justify-center
                      transition-all duration-300 shadow-xl
                    `}
                  >
                    {isCompleted ? (
                      <motion.div
                        initial={{ scale: 0, rotate: -45 }}
                        animate={{ scale: 1, rotate: 0 }}
                      >
                        <Check className="w-6 h-6 text-white" strokeWidth={4} />
                      </motion.div>
                    ) : (
                      <Icon className={`
                        w-5 h-5 transition-colors
                        ${isActive ? 'text-white' : 'text-neutral-400'}
                      `} />
                    )}

                    {isActive && (
                      <motion.div
                        className="absolute inset-0 rounded-2xl bg-black opacity-20"
                        animate={{
                          scale: [1, 1.4, 1],
                          opacity: [0.2, 0, 0.2]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: 'easeInOut'
                        }}
                      />
                    )}
                  </motion.div>

                  <div className="mt-4 absolute -bottom-12 whitespace-nowrap text-center">
                    <p className={`
                      text-[10px] font-black uppercase tracking-widest transition-colors
                      ${isCompleted ? 'text-green-700' : isActive ? 'text-neutral-900' : 'text-neutral-300'}
                    `}>
                      {step.title}
                    </p>
                  </div>
                </div>

                {index < steps.length - 1 && (
                  <div className="flex-1 h-[3px] bg-neutral-100 mx-4 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-green-700 to-green-500"
                      initial={{ width: '0%' }}
                      animate={{
                        width: isCompleted ? '100%' : '0%'
                      }}
                      transition={{ duration: 0.6, ease: 'circOut' }}
                    />
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
      
      {/* Spacer for titles below icons */}
      <div className="h-12" />
    </div>
  )
}

