import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Shield, 
  Clock, 
  ThumbsUp, 
  Leaf, 
  Award, 
  Users, 
  Zap, 
  Sparkles,
  CheckCircle2,
  MapPin,
  TrendingUp
} from 'lucide-react'

// --- Gemini API Setup ---
const apiKey = ""; // Environment provided key

async function getLiveTrustMessage() {
  const hour = new Date().getHours();
  const timeContext = hour < 12 ? "morning" : hour < 17 ? "afternoon" : "evening/night";
  
  const prompt = `
    Context: Zalldi is a quick commerce app in Butwal, Nepal. 
    Current time: ${timeContext}.
    Task: Write a 1-sentence "Trust & Reliability" punchline for the website. 
    Theme: Speed, safety, or community. 
    Style: Hyper-modern, bold, reassuring. Mention Butwal. Under 12 words.
  `;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    });
    const result = await response.json();
    return result.candidates?.[0]?.content?.parts?.[0]?.text || "Butwal's most trusted 12-minute delivery partner.";
  } catch {
    return "Butwal's most trusted 12-minute delivery partner.";
  }
}

// --- Animation Wrapper (Mocking FadeInWhenVisible) ---
const Reveal = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay }}
  >
    {children}
  </motion.div>
);

const trustPoints = [
  {
    icon: Clock,
    title: 'Instant Delivery',
    description: '12-minute average arrival time in Butwal city.',
    color: 'bg-orange-500',
    lightColor: 'bg-orange-50'
  },
  {
    icon: Shield,
    title: 'Secure Payments',
    description: 'Bank-grade encryption for all Fonepay & Card transactions.',
    color: 'bg-blue-600',
    lightColor: 'bg-blue-50'
  },
  {
    icon: Leaf,
    title: 'Freshness First',
    description: 'Farm-to-fork quality checks on every produce item.',
    color: 'bg-emerald-600',
    lightColor: 'bg-emerald-50'
  }
];

const stats = [
  { number: '12m', label: 'Avg Delivery' },
  { number: '10k+', label: 'Orders Completed' },
  { number: '100%', label: 'Local Sourcing' },
  { number: '24/7', label: 'Support' }
];

export default function TrustSection() {
  const [aiMessage, setAiMessage] = useState("Authenticating Butwal's fastest delivery network...");

  useEffect(() => {
    getLiveTrustMessage().then(setAiMessage);
  }, []);

  return (
    <section className="py-24 px-4 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        
        {/* Header with AI Trust Pulse */}
        <div className="flex flex-col items-center text-center mb-20">
          <Reveal>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-100 border border-neutral-200 mb-6">
              <Sparkles className="w-4 h-4 text-orange-500" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-600">Why Zalldi?</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-neutral-900 tracking-tighter uppercase mb-6">
              More than just <span className="text-orange-500 underline decoration-4 underline-offset-8 italic">Speed</span>.
            </h2>
            <div className="max-w-xl mx-auto h-12 flex items-center justify-center">
                <AnimatePresence mode="wait">
                    <motion.p 
                        key={aiMessage}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-lg font-bold text-neutral-500"
                    >
                        {aiMessage}
                    </motion.p>
                </AnimatePresence>
            </div>
          </Reveal>
        </div>

        {/* The Trust Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {trustPoints.map((point, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <motion.div 
                whileHover={{ y: -10 }}
                className="group relative p-8 rounded-[2.5rem] bg-neutral-50 border border-neutral-100 h-full overflow-hidden"
              >
                <div className={`w-16 h-16 rounded-2xl ${point.lightColor} flex items-center justify-center mb-6 transition-transform group-hover:scale-110 group-hover:rotate-3`}>
                  <point.icon className={`w-8 h-8 ${point.color.replace('bg-', 'text-')}`} />
                </div>
                <h3 className="text-xl font-black text-neutral-900 uppercase tracking-tight mb-3">{point.title}</h3>
                <p className="text-neutral-500 font-bold leading-relaxed">{point.description}</p>
                
                {/* Decorative background element */}
                <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <point.icon size={120} />
                </div>
              </motion.div>
            </Reveal>
          ))}
        </div>

        {/* Stats Strip */}
        <Reveal>
          <div className="relative rounded-[3rem] bg-neutral-900 p-12 overflow-hidden shadow-2xl">
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
            <div className="relative z-10 grid grid-cols-2 lg:grid-cols-4 gap-12">
              {stats.map((stat, i) => (
                <div key={i} className="text-center space-y-2">
                  <p className="text-4xl md:text-5xl font-black text-white tracking-tighter">{stat.number}</p>
                  <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest">{stat.label}</p>
                </div>
              ))}
            </div>
            
            {/* Real-time Badge */}
            <div className="absolute top-4 right-8">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[9px] font-black text-white/40 uppercase tracking-widest">Live Network Status</span>
                </div>
            </div>
          </div>
        </Reveal>

        {/* Guarantee Footer */}
        <div className="mt-20 flex flex-col md:flex-row items-center justify-between gap-12 p-8 md:p-16 rounded-[3.5rem] border-2 border-dashed border-neutral-100">
            <div className="flex-1 space-y-6">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-orange-100 rounded-2xl">
                        <Award className="w-6 h-6 text-orange-600" />
                    </div>
                    <h3 className="text-2xl font-black text-neutral-900 uppercase tracking-tight">The Zalldi Guarantee</h3>
                </div>
                <p className="text-lg font-bold text-neutral-500 leading-relaxed max-w-xl">
                    We aren't just delivering groceries; we're delivering time. If we're late by even a minute, your delivery is <span className="text-orange-600">on us</span>. No questions asked.
                </p>
                <div className="flex flex-wrap gap-3">
                    {['100% Secure', 'Local Support', 'Quality Assured'].map(tag => (
                        <div key={tag} className="flex items-center gap-2 px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-neutral-600">
                            <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                            {tag}
                        </div>
                    ))}
                </div>
            </div>
            
            <div className="flex-shrink-0 w-full md:w-auto">
                <div className="bg-neutral-50 p-8 rounded-[2.5rem] border border-neutral-100 flex flex-col items-center">
                    <TrendingUp className="w-12 h-12 text-blue-600 mb-4" />
                    <p className="text-3xl font-black text-neutral-900 tracking-tighter">99.8%</p>
                    <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mt-1">On-Time Success</p>
                </div>
            </div>
        </div>
      </div>
    </section>
  )
}