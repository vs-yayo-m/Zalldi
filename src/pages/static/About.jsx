// /src/pages/static/About.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Target, 
  Zap, 
  Users, 
  Heart, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  ShoppingBag, 
  Award, 
  ArrowRight,
  TrendingUp,
  Globe,
  Truck
} from 'lucide-react';

// Components
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Button from '@/components/ui/Button';
import { FOUNDER, APP_NAME } from '@/utils/constants';

/**
 * ZALLDI CORPORATE PROFILE
 * A high-impact storytelling page using the "Bento" design system.
 */

const Reveal = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 0.6, delay, type: "spring", stiffness: 50 }}
  >
    {children}
  </motion.div>
);

export default function About() {
  return (
    <div className="min-h-screen bg-white selection:bg-orange-100 font-sans">
      <Header />

      <main>
        {/* 1. HERO: The Mission */}
        <section className="relative pt-32 pb-20 px-4 overflow-hidden">
          {/* Background Ambience */}
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-50/50 rounded-full blur-[120px] -z-10 translate-x-1/3 -translate-y-1/3" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-50/40 rounded-full blur-[100px] -z-10 -translate-x-1/3 translate-y-1/3" />

          <div className="max-w-7xl mx-auto text-center">
            <Reveal>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-900 text-white mb-8 shadow-xl shadow-neutral-900/10">
                <Zap size={14} className="fill-current text-orange-500" />
                <span className="text-[10px] font-black uppercase tracking-[0.25em]">The Zalldi Mission</span>
              </div>
              
              <h1 className="text-5xl md:text-8xl font-black text-neutral-900 tracking-tighter leading-[0.9] mb-8 uppercase italic">
                Redefining <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-orange-400">
                  Time & Trust.
                </span>
              </h1>
              
              <p className="max-w-2xl mx-auto text-xl text-neutral-500 font-medium leading-relaxed">
                We are building Butwal's digital lifeline. Not just delivering groceries, but delivering time back to our community.
              </p>
            </Reveal>
          </div>
        </section>

        {/* 2. LIVE METRICS STRIP */}
        <section className="border-y border-neutral-100 bg-neutral-50/50">
          <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { label: 'Orders Delivered', value: '50K+', icon: ShoppingBag, color: 'text-blue-600' },
                { label: 'Avg. Delivery', value: '24m', icon: Clock, color: 'text-orange-600' },
                { label: 'Active Users', value: '12K+', icon: Users, color: 'text-green-600' },
                { label: 'Coverage', value: '19 Wards', icon: MapPin, color: 'text-purple-600' },
              ].map((stat, i) => (
                <Reveal key={i} delay={i * 0.1}>
                  <div className="flex flex-col items-center justify-center text-center group">
                    <div className={`mb-3 p-3 bg-white rounded-2xl shadow-sm border border-neutral-100 group-hover:scale-110 transition-transform ${stat.color}`}>
                      <stat.icon size={24} />
                    </div>
                    <span className="text-3xl font-black text-neutral-900 tracking-tight">{stat.value}</span>
                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mt-1">{stat.label}</span>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* 3. THE GENESIS (Story & Founder) */}
        <section className="py-24 px-4">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
            
            <Reveal>
              <div className="space-y-8">
                <div>
                  <h3 className="text-sm font-black text-orange-500 uppercase tracking-widest mb-2">Our Origin</h3>
                  <h2 className="text-4xl font-black text-neutral-900 tracking-tight leading-none">
                    Born in the <br /> Heart of Butwal.
                  </h2>
                </div>
                
                <div className="space-y-6 text-lg text-neutral-600 font-medium leading-relaxed">
                  <p>
                    <span className="text-neutral-900 font-bold">Zalldi</span> started in 2024 with a simple observation: why should quick commerce be limited to capital cities?
                  </p>
                  <p>
                    We built a hyper-local logistics network designed specifically for Butwal's geography. By partnering with local dark stores and optimizing routes for our riders, we achieved what seemed impossible: <span className="text-orange-600 underline decoration-2 underline-offset-4">60-minute delivery, consistently.</span>
                  </p>
                </div>

                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-3 px-5 py-3 bg-orange-50 rounded-2xl border border-orange-100">
                    <Award className="text-orange-600" size={20} />
                    <span className="text-xs font-bold text-orange-800 uppercase tracking-wide">#1 Tech Startup 2024</span>
                  </div>
                  <div className="flex items-center gap-3 px-5 py-3 bg-blue-50 rounded-2xl border border-blue-100">
                    <ShieldCheck className="text-blue-600" size={20} />
                    <span className="text-xs font-bold text-blue-800 uppercase tracking-wide">ISO Certified</span>
                  </div>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="relative">
                <div className="absolute inset-0 bg-neutral-900 rounded-[3rem] rotate-3 opacity-10" />
                <div className="relative bg-white rounded-[3rem] p-10 border border-neutral-100 shadow-2xl">
                  <div className="flex items-start gap-6 mb-8">
                    <div className="w-20 h-20 rounded-2xl bg-neutral-900 flex items-center justify-center text-white text-3xl font-black">
                      {FOUNDER.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-2xl font-black text-neutral-900">{FOUNDER.name}</h4>
                      <p className="text-sm font-bold text-neutral-400 uppercase tracking-wider">Founder & CEO</p>
                      <div className="mt-2 flex items-center gap-1 text-[10px] font-black text-green-600 bg-green-50 px-2 py-1 rounded-lg w-fit">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-600 animate-pulse" />
                        ACTIVE NOW
                      </div>
                    </div>
                  </div>
                  <blockquote className="text-xl font-bold text-neutral-700 italic leading-normal">
                    "{FOUNDER.message}"
                  </blockquote>
                  <div className="mt-8 pt-8 border-t border-neutral-100 flex justify-between items-center">
                    <img src="/logo.svg" alt="Zalldi" className="h-6 opacity-20 grayscale" onError={(e) => e.target.style.display='none'} />
                    <span className="font-handwriting text-2xl text-neutral-400 rotate-[-5deg]">Abhishek</span>
                  </div>
                </div>
              </div>
            </Reveal>

          </div>
        </section>

        {/* 4. VALUES BENTO GRID */}
        <section className="py-20 bg-neutral-50 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-black text-neutral-900 uppercase tracking-tight">The Zalldi Standard</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: 'Obsessive Speed', desc: 'We count seconds, not minutes.', icon: Clock, bg: 'bg-neutral-900', text: 'text-white' },
                { title: 'Local First', desc: 'Supporting 500+ Butwal merchants.', icon: Users, bg: 'bg-white', text: 'text-neutral-900' },
                { title: 'Radical Transparency', desc: 'Real-time tracking, no hidden fees.', icon: Globe, bg: 'bg-orange-500', text: 'text-white' },
              ].map((card, i) => (
                <Reveal key={i} delay={i * 0.1}>
                  <div className={`${card.bg} ${card.text} p-10 rounded-[2.5rem] h-full flex flex-col justify-between shadow-xl group hover:-translate-y-2 transition-transform duration-300`}>
                    <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center backdrop-blur-md mb-8">
                      <card.icon size={28} className={card.bg === 'bg-white' ? 'text-neutral-900' : 'text-white'} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black uppercase tracking-tight mb-2">{card.title}</h3>
                      <p className={`font-medium ${card.bg === 'bg-white' ? 'text-neutral-500' : 'text-white/80'}`}>{card.desc}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* 5. CTA: JOIN THE REVOLUTION */}
        <section className="py-24 px-4">
          <div className="max-w-5xl mx-auto">
            <Reveal>
              <div className="relative rounded-[3rem] bg-neutral-900 overflow-hidden p-12 md:p-20 text-center">
                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500 rounded-full blur-[80px] opacity-20 -mr-20 -mt-20" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500 rounded-full blur-[80px] opacity-20 -ml-20 -mb-20" />
                
                <div className="relative z-10">
                  <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase mb-8">
                    Ready to save time?
                  </h2>
                  <p className="text-neutral-400 text-lg md:text-xl font-medium mb-12 max-w-2xl mx-auto">
                    Join thousands of smart shoppers in Butwal who have switched to the future of retail.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Button 
                      className="h-16 px-10 rounded-2xl bg-white text-neutral-900 hover:bg-neutral-100 font-black text-sm uppercase tracking-widest shadow-2xl"
                      onClick={() => window.location.href = '/shop'}
                    >
                      Start Shopping
                    </Button>
                    <button 
                      className="h-16 px-10 rounded-2xl border border-neutral-700 text-white font-bold text-sm uppercase tracking-widest hover:bg-neutral-800 transition-colors flex items-center gap-2"
                      onClick={() => window.location.href = '/contact'}
                    >
                      Partner With Us <ArrowRight size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}


