'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Leaf, Users, CalendarDays, Brain, ChartPie, Sparkles, ArrowRight, Heart, Shield, Zap } from 'lucide-react';

const features = [
  { icon: Users, title: 'Patient Management', desc: 'Complete patient profiles with Dosha analysis, medical history, and dietary preferences.', color: '#3b82f6' },
  { icon: Leaf, title: 'Ayurvedic Diet Plans', desc: 'Generate personalized diet plans based on Dosha type, season, and health conditions.', color: '#22c55e' },
  { icon: ChartPie, title: 'Nutrient Analytics', desc: 'Visual dashboards tracking calories, protein, fiber, carbs, and fat intake.', color: '#a855f7' },
  { icon: Brain, title: 'AI Recommendations', desc: 'Intelligent diet suggestions powered by Ayurvedic principles and modern AI.', color: '#f59e0b' },
  { icon: CalendarDays, title: 'Appointment Scheduler', desc: 'Manage follow-up appointments with calendar view and status tracking.', color: '#ef4444' },
  { icon: Sparkles, title: 'Dosha Balance Meter', desc: 'Real-time visualization of Vata, Pitta, and Kapha balance levels.', color: '#06b6d4' },
];

const doshas = [
  { name: 'Vata', desc: 'Air & Space – Governs movement, creativity, and communication', color: '#3b82f6', gradient: 'from-blue-500/20 to-blue-900/5' },
  { name: 'Pitta', desc: 'Fire & Water – Governs metabolism, digestion, and transformation', color: '#ef4444', gradient: 'from-red-500/20 to-red-900/5' },
  { name: 'Kapha', desc: 'Earth & Water – Governs structure, stability, and immunity', color: '#22c55e', gradient: 'from-green-500/20 to-green-900/5' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0f1c]">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-amber-500/5 to-transparent blur-3xl" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-green-500/5 to-transparent blur-3xl" />
        <div className="absolute top-[40%] left-[50%] w-[400px] h-[400px] rounded-full bg-gradient-to-br from-blue-500/3 to-transparent blur-3xl" />
      </div>

      {/* Navbar */}
      <nav className="relative z-10 flex items-center justify-between px-6 lg:px-16 py-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center">
            <Leaf className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold font-['Outfit']">
            <span className="gradient-text">Vedic</span>
            <span className="text-white">Medic</span>
          </span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm text-gray-400 hover:text-white transition-colors">Features</a>
          <a href="#doshas" className="text-sm text-gray-400 hover:text-white transition-colors">Doshas</a>
          <a href="#about" className="text-sm text-gray-400 hover:text-white transition-colors">About</a>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="btn-secondary text-sm">Log In</Link>
          <Link href="/register" className="btn-primary text-sm flex items-center gap-2">Get Started <ArrowRight className="w-4 h-4" /></Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 px-6 lg:px-16 pt-20 pb-32">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-medium mb-8">
              <Sparkles className="w-3.5 h-3.5" /> Ayurvedic Intelligence Platform
            </div>
            <h1 className="text-5xl md:text-7xl font-bold font-['Outfit'] leading-tight mb-6">
              <span className="text-white">Ancient Wisdom,</span>
              <br />
              <span className="gradient-text">Modern Healthcare</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              VedicMedic empowers Ayurvedic practitioners with AI-driven diet planning, 
              Dosha analysis, and patient management — all in one unified platform.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register" className="btn-primary text-base px-8 py-3 flex items-center gap-2">
                Start Free Trial <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/login" className="btn-secondary text-base px-8 py-3">
                Sign In to Dashboard
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Floating Stats */}
        <motion.div 
          className="max-w-4xl mx-auto mt-20 grid grid-cols-1 md:grid-cols-3 gap-6"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          {[
            { icon: Heart, label: 'Holistic Health', value: 'Complete Care', color: '#ef4444' },
            { icon: Shield, label: 'Evidence-Based', value: 'Ayurvedic Science', color: '#3b82f6' },
            { icon: Zap, label: 'AI-Powered', value: 'Smart Insights', color: '#f59e0b' },
          ].map((stat, i) => (
            <div key={i} className="glass-card p-6 text-center group hover:border-white/10 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center" style={{ background: `${stat.color}15` }}>
                <stat.icon className="w-6 h-6" style={{ color: stat.color }} />
              </div>
              <div className="text-lg font-bold text-white mb-1">{stat.value}</div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Features */}
      <section id="features" className="relative z-10 px-6 lg:px-16 py-24">
        <div className="max-w-6xl mx-auto">
          <motion.div className="text-center mb-16" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <h2 className="text-3xl md:text-4xl font-bold font-['Outfit'] text-white mb-4">
              Powerful Features for <span className="gradient-text">Practitioners</span>
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">Everything you need to manage your Ayurvedic practice efficiently.</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                className="glass-card glass-card-hover p-6 cursor-default transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="w-12 h-12 rounded-xl mb-4 flex items-center justify-center" style={{ background: `${feature.color}15` }}>
                  <feature.icon className="w-6 h-6" style={{ color: feature.color }} />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Doshas Section */}
      <section id="doshas" className="relative z-10 px-6 lg:px-16 py-24">
        <div className="max-w-6xl mx-auto">
          <motion.div className="text-center mb-16" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            <h2 className="text-3xl md:text-4xl font-bold font-['Outfit'] text-white mb-4">
              The Three <span className="gradient-text">Doshas</span>
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">Understanding the fundamental bio-energies that govern human physiology.</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {doshas.map((dosha, i) => (
              <motion.div
                key={i}
                className={`glass-card p-8 text-center bg-gradient-to-b ${dosha.gradient} hover:border-white/10 transition-all duration-300`}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
              >
                <div className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center animate-float" style={{ background: `${dosha.color}15`, animationDelay: `${i * 0.5}s` }}>
                  <span className="text-3xl font-bold font-['Outfit']" style={{ color: dosha.color }}>{dosha.name[0]}</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-3 font-['Outfit']">{dosha.name}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{dosha.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 px-6 lg:px-16 py-24">
        <div className="max-w-3xl mx-auto">
          <motion.div
            className="glass-card p-12 text-center relative overflow-hidden"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-green-500/5" />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold font-['Outfit'] text-white mb-4">
                Ready to Transform Your Practice?
              </h2>
              <p className="text-gray-400 mb-8 max-w-lg mx-auto">
                Join practitioners who are modernizing Ayurvedic healthcare with VedicMedic.
              </p>
              <Link href="/register" className="btn-primary text-base px-8 py-3 inline-flex items-center gap-2">
                Get Started Now <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer id="about" className="relative z-10 border-t border-white/5 px-6 lg:px-16 py-12">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center">
              <Leaf className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold font-['Outfit']">
              <span className="gradient-text">Vedic</span><span className="text-white">Medic</span>
            </span>
          </div>
          <p className="text-sm text-gray-500">Built with ❤️ during a hackathon using AI-assisted development.</p>
          <p className="text-sm text-gray-500">© 2024 VedicMedic. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
