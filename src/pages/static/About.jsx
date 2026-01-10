import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
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
  Globe
} from 'lucide-react';

// Constants & UI
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { FOUNDER, APP_NAME } from '@/utils/constants';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

/**
 * ZALLDI ENTERPRISE ABOUT PAGE
 * Features: Scroll-linked animations, glassmorphism cards, and enterprise-grade storytelling.
 */

const FeatureCard = ({ icon: Icon, title, description, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    whileHover={{ y: -10 }}
    className="relative group"
  >
    <div className="absolute inset-0 bg-orange-500/5 rounded-3xl blur-xl group-hover:bg-orange-500/10 transition-all duration-500" />
    <Card className="relative p-8 h-full bg-white/80 backdrop-blur-sm border-neutral-100 hover:border-orange-200 transition-all duration-300 rounded-3xl shadow-sm hover:shadow-2xl hover:shadow-orange-500/10 overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
        <Icon className="w-24 h-24 text-orange-500" />
      </div>
      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center mb-6 shadow-lg shadow-orange-200">
        <Icon className="w-7 h-7 text-white" />
      </div>
      <h3 className="text-xl font-bold text-neutral-900 mb-3 group-hover:text-orange-600 transition-colors">
        {title}
      </h3>
      <p className="text-neutral-600 leading-relaxed text-sm">
        {description}
      </p>
    </Card>
  </motion.div>
);

const Metric = ({ label, value, icon: Icon }) => (
  <div className="flex flex-col items-center p-6 text-center">
    <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center mb-4">
      <Icon className="w-6 h-6 text-orange-600" />
    </div>
    <span className="text-3xl font-black text-neutral-900 mb-1">{value}</span>
    <span className="text-sm font-bold text-neutral-500 uppercase tracking-widest">{label}</span>
  </div>
);

export default function About() {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  const features = [
    {
      icon: Zap,
      title: '1-Hour Delivery',
      description: 'Our proprietary "Fast-Track" logistics engine ensures your essentials reach you in under 60 minutes. Speed isn’t just a feature; it’s our promise.'
    },
    {
      icon: Globe,
      title: 'Hyper-Local Focus',
      description: 'Zalldi is built by Butwal, for Butwal. We understand the local pulse and support our regional economy by partnering with local dark stores.'
    },
    {
      icon: ShieldCheck,
      title: 'Uncompromised Quality',
      description: 'Every SKU in our inventory undergoes a 3-step quality check before it is dispatched. Freshness is guaranteed with our cold-chain tech.'
    },
    {
      icon: Heart,
      title: 'Human-First Support',
      description: 'Our customer success team isn’t a bot. We provide real-time, 24/7 human assistance to ensure your shopping experience is flawless.'
    }
  ];

  const values = [
    { title: 'Obsessive Speed', description: 'We measure success in seconds, not minutes.', icon: Clock },
    { title: 'Radical Trust', description: 'Transparent pricing with no hidden service fees.', icon: ShieldCheck },
    { title: 'Community Growth', description: 'Empowering 500+ local partners and suppliers.', icon: Users },
    { title: 'Tech Innovation', description: 'Advanced AI for inventory and route optimization.', icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen bg-[#FAFAFA] selection:bg-orange-100">
      <Header />
      {/* 1. HERO SECTION - ENTERPRISE GRADIENT MESH */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden bg-neutral-900">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-orange-600 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-orange-400 rounded-full blur-[100px]" />
        </div>
        
        <motion.div 
          style={{ opacity, scale }}
          className="relative z-10 text-center px-4"
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block py-1 px-4 rounded-full bg-orange-500/20 border border-orange-500/30 text-orange-400 text-xs font-bold uppercase tracking-[0.2em] mb-6">
              Our Identity
            </span>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter mb-6">
              Speeding Up <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">
                Future Commerce.
              </span>
            </h1>
            <p className="text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto font-medium leading-relaxed">
              Zalldi is redefining the delivery landscape in Butwal. We’re not just an app; we’re your daily time-saver.
            </p>
          </motion.div>
        </motion.div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-neutral-700 flex justify-center p-1">
            <div className="w-1 h-2 bg-orange-500 rounded-full" />
          </div>
        </div>
      </section>

      {/* 2. STATS BAR */}
      <div className="relative z-20 -mt-12 container mx-auto px-4">
        <div className="bg-white rounded-3xl shadow-xl border border-neutral-100 grid grid-cols-2 md:grid-cols-4 divide-x divide-neutral-100">
          <Metric icon={ShoppingBag} label="Orders Delivered" value="50K+" />
          <Metric icon={Clock} label="Avg. Delivery" value="24m" />
          <Metric icon={Users} label="Happy Users" value="12K+" />
          <Metric icon={MapPin} label="Wards Covered" value="19/19" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        {/* 3. STORY SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mb-32">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div>
              <h2 className="text-sm font-black text-orange-500 uppercase tracking-widest mb-2">The Genesis</h2>
              <h3 className="text-4xl font-black text-neutral-900 tracking-tight">
                Born in the heart of Butwal.
              </h3>
            </div>
            <div className="space-y-6 text-neutral-600 text-lg leading-relaxed font-medium">
              <p>
                Founded in 2024, <span className="text-orange-600 font-bold">{APP_NAME}</span> emerged from a simple observation: the digital divide in regional logistics was hindering local growth.
              </p>
              <p>
                We pioneered the "Dark Store" model in Butwal, enabling us to manage inventory with surgical precision. This technology-first approach allows us to promise and deliver within 60 minutes—a feat previously thought impossible in the region.
              </p>
              <div className="flex items-center gap-4 p-4 bg-orange-50 rounded-2xl border border-orange-100">
                <div className="w-12 h-12 rounded-xl bg-orange-500 flex items-center justify-center text-white shrink-0">
                  <Award className="w-6 h-6" />
                </div>
                <p className="text-sm text-orange-900 font-bold">
                  Awarded "Most Innovative Tech Startup 2024" by the Butwal Commerce Chamber.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="absolute -inset-4 bg-orange-500/10 rounded-[2.5rem] rotate-3" />
            <Card className="relative p-10 bg-white border-neutral-100 rounded-[2rem] shadow-2xl overflow-hidden">
              <div className="flex items-center gap-6 mb-8">
                <div className="relative">
                  <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-4xl font-black shadow-lg shadow-orange-200">
                    {FOUNDER.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-lg border-4 border-white flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full animate-ping" />
                  </div>
                </div>
                <div>
                  <h4 className="text-2xl font-black text-neutral-900 tracking-tight">
                    {FOUNDER.name}
                  </h4>
                  <p className="text-orange-600 font-bold text-sm">Founder & Chief Executive</p>
                </div>
              </div>
              <blockquote className="text-xl text-neutral-700 font-medium italic leading-relaxed border-l-4 border-orange-500 pl-6">
                "{FOUNDER.message}"
              </blockquote>
            </Card>
          </motion.div>
        </div>

        {/* 4. FEATURES GRID */}
        <div className="mb-32">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-sm font-black text-orange-500 uppercase tracking-widest mb-2">Capabilities</h2>
            <h3 className="text-4xl font-black text-neutral-900 tracking-tight">The Zalldi Advantage.</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <FeatureCard 
                key={feature.title} 
                {...feature} 
                delay={index * 0.1} 
              />
            ))}
          </div>
        </div>

        {/* 5. VALUES - GRID SYSTEM */}
        <div className="mb-32">
          <div className="bg-neutral-900 rounded-[3rem] p-12 lg:p-20 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/20 blur-[100px] -mr-32 -mt-32" />
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16">
              <div>
                <h2 className="text-sm font-black text-orange-400 uppercase tracking-widest mb-2">Our DNA</h2>
                <h3 className="text-4xl font-black text-white tracking-tight mb-6">
                  Values that drive <br />every delivery.
                </h3>
                <p className="text-neutral-400 font-medium text-lg leading-relaxed mb-8">
                  We don't just move boxes. We move the community forward by adhering to a strict set of operational principles.
                </p>
                <Button className="bg-orange-500 hover:bg-orange-600 text-white font-bold h-12 px-8 rounded-xl shadow-lg shadow-orange-900/40">
                  Read Our Full Charter
                </Button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {values.map((v) => (
                  <div key={v.title} className="p-6 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors group">
                    <v.icon className="w-6 h-6 text-orange-400 mb-4 group-hover:scale-110 transition-transform" />
                    <h4 className="text-white font-bold mb-2">{v.title}</h4>
                    <p className="text-neutral-500 text-sm leading-relaxed">{v.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 6. CALL TO ACTION - ENTERPRISE GRADE */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Card className="relative p-12 lg:p-20 bg-gradient-to-br from-orange-500 to-orange-700 rounded-[3rem] border-none overflow-hidden shadow-2xl shadow-orange-500/30">
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-48 -mt-48" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl -ml-32 -mb-32" />
            
            <div className="relative z-10 text-center max-w-3xl mx-auto text-white">
              <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">
                Ready to experience the future of local shopping?
              </h2>
              <p className="text-orange-100 text-lg font-medium mb-10 opacity-90">
                Join thousands of residents in Butwal who save over 5 hours every week by switching to Zalldi. Your time is waiting.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button
                  className="w-full sm:w-auto px-10 h-14 bg-white text-orange-600 hover:bg-orange-50 font-black text-lg rounded-2xl shadow-xl transition-all active:scale-95"
                  onClick={() => window.location.href = '/shop'}
                >
                  Start Shopping Now
                </Button>
                <Button
                  variant="outline"
                  className="w-full sm:w-auto px-10 h-14 bg-transparent border-white/30 text-white hover:bg-white/10 font-bold text-lg rounded-2xl flex items-center justify-center gap-2 group"
                  onClick={() => window.location.href = '/contact'}
                >
                  Become a Partner <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}

