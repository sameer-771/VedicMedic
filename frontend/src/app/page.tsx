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
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)', width: '100%' }}>
      {/* Background Effects */}
      <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: '-20%', right: '-10%', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(168,85,247,0.08) 0%, transparent 70%)', filter: 'blur(60px)' }} />
        <div style={{ position: 'absolute', bottom: '-20%', left: '-10%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(245,158,11,0.05) 0%, transparent 70%)', filter: 'blur(60px)' }} />
        <div style={{ position: 'absolute', top: '40%', left: '50%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(88,28,135,0.05) 0%, transparent 70%)', filter: 'blur(60px)' }} />
      </div>

      {/* Navbar */}
      <nav style={{ position: 'relative', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 48px', maxWidth: 1280, margin: '0 auto', width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg, #f59e0b, #b45309)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Leaf style={{ width: 20, height: 20, color: 'white' }} />
          </div>
          <span style={{ fontSize: 20, fontWeight: 700, fontFamily: 'Outfit, sans-serif' }}>
            <span className="gradient-text">Vedic</span>
            <span style={{ color: 'white' }}>Medic</span>
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
          <a href="#features" style={{ fontSize: 14, color: '#9ca3af', textDecoration: 'none' }}>Features</a>
          <a href="#doshas" style={{ fontSize: 14, color: '#9ca3af', textDecoration: 'none' }}>Doshas</a>
          <a href="#about" style={{ fontSize: 14, color: '#9ca3af', textDecoration: 'none' }}>About</a>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link href="/login" className="btn-secondary" style={{ fontSize: 14 }}>Log In</Link>
          <Link href="/register" className="btn-primary" style={{ fontSize: 14, display: 'flex', alignItems: 'center', gap: 8 }}>Get Started <ArrowRight style={{ width: 16, height: 16 }} /></Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ position: 'relative', zIndex: 10, padding: '80px 48px 120px', maxWidth: 1280, margin: '0 auto', width: '100%' }}>
        <div style={{ maxWidth: 960, margin: '0 auto', textAlign: 'center' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', borderRadius: 9999, background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', color: '#f59e0b', fontSize: 12, fontWeight: 500, marginBottom: 32 }}>
              <Sparkles style={{ width: 14, height: 14 }} /> Ayurvedic Intelligence Platform
            </div>
            <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', fontWeight: 700, fontFamily: 'Outfit, sans-serif', lineHeight: 1.1, marginBottom: 24 }}>
              <span style={{ color: 'white' }}>Ancient Wisdom,</span>
              <br />
              <span className="gradient-text">Modern Healthcare</span>
            </h1>
            <p style={{ fontSize: 'clamp(1rem, 2vw, 1.25rem)', color: '#94a3b8', maxWidth: 640, margin: '0 auto 40px', lineHeight: 1.7 }}>
              VedicMedic empowers Ayurvedic practitioners with AI-driven diet planning, 
              Dosha analysis, and patient management — all in one unified platform.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
              <Link href="/register" className="btn-primary" style={{ fontSize: 16, padding: '14px 32px', display: 'flex', alignItems: 'center', gap: 8 }}>
                Start Free Trial <ArrowRight style={{ width: 20, height: 20 }} />
              </Link>
              <Link href="/login" className="btn-secondary" style={{ fontSize: 16, padding: '14px 32px' }}>
                Sign In to Dashboard
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Stats */}
        <motion.div 
          style={{ maxWidth: 960, margin: '80px auto 0', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          {[
            { icon: Heart, label: 'Holistic Health', value: 'Complete Care', color: '#ef4444' },
            { icon: Shield, label: 'Evidence-Based', value: 'Ayurvedic Science', color: '#3b82f6' },
            { icon: Zap, label: 'AI-Powered', value: 'Smart Insights', color: '#f59e0b' },
          ].map((stat, i) => (
            <div key={i} className="glass-card" style={{ padding: 24, textAlign: 'center', transition: 'all 0.3s' }}>
              <div style={{ width: 48, height: 48, borderRadius: 12, margin: '0 auto 12px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${stat.color}15` }}>
                <stat.icon style={{ width: 24, height: 24, color: stat.color }} />
              </div>
              <div style={{ fontSize: 18, fontWeight: 700, color: 'white', marginBottom: 4 }}>{stat.value}</div>
              <div style={{ fontSize: 14, color: '#94a3b8' }}>{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Features */}
      <section id="features" style={{ position: 'relative', zIndex: 10, padding: '96px 48px', maxWidth: 1280, margin: '0 auto', width: '100%' }}>
        <motion.div style={{ textAlign: 'center', marginBottom: 64 }} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          <h2 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 700, fontFamily: 'Outfit, sans-serif', color: 'white', marginBottom: 16 }}>
            Powerful Features for <span className="gradient-text">Practitioners</span>
          </h2>
          <p style={{ color: '#94a3b8', maxWidth: 560, margin: '0 auto' }}>Everything you need to manage your Ayurvedic practice efficiently.</p>
        </motion.div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
          {features.map((feature, i) => (
            <motion.div
              key={i}
              className="glass-card glass-card-hover"
              style={{ padding: 32, textAlign: 'center', cursor: 'default', transition: 'all 0.3s' }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div style={{ width: 56, height: 56, borderRadius: 14, margin: '0 auto 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${feature.color}15` }}>
                <feature.icon style={{ width: 28, height: 28, color: feature.color }} />
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 600, color: 'white', marginBottom: 8 }}>{feature.title}</h3>
              <p style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.6 }}>{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Doshas */}
      <section id="doshas" style={{ position: 'relative', zIndex: 10, padding: '96px 48px', maxWidth: 1280, margin: '0 auto', width: '100%' }}>
        <motion.div style={{ textAlign: 'center', marginBottom: 64 }} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          <h2 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 700, fontFamily: 'Outfit, sans-serif', color: 'white', marginBottom: 16 }}>
            The Three <span className="gradient-text">Doshas</span>
          </h2>
          <p style={{ color: '#94a3b8', maxWidth: 560, margin: '0 auto' }}>Understanding the fundamental bio-energies that govern human physiology.</p>
        </motion.div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32 }}>
          {doshas.map((dosha, i) => (
            <motion.div
              key={i}
              className="glass-card"
              style={{ padding: 40, textAlign: 'center', transition: 'all 0.3s' }}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
            >
              <div className="animate-float" style={{ width: 80, height: 80, borderRadius: '50%', margin: '0 auto 24px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${dosha.color}15`, animationDelay: `${i * 0.5}s` }}>
                <span style={{ fontSize: 30, fontWeight: 700, fontFamily: 'Outfit, sans-serif', color: dosha.color }}>{dosha.name[0]}</span>
              </div>
              <h3 style={{ fontSize: 24, fontWeight: 700, color: 'white', marginBottom: 12, fontFamily: 'Outfit, sans-serif' }}>{dosha.name}</h3>
              <p style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.7 }}>{dosha.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ position: 'relative', zIndex: 10, padding: '96px 48px', maxWidth: 1280, margin: '0 auto', width: '100%' }}>
        <motion.div
          className="glass-card"
          style={{ padding: 64, textAlign: 'center', position: 'relative', overflow: 'hidden', maxWidth: 800, margin: '0 auto' }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(245,158,11,0.05), transparent, rgba(34,197,94,0.05))' }} />
          <div style={{ position: 'relative', zIndex: 10 }}>
            <h2 style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 700, fontFamily: 'Outfit, sans-serif', color: 'white', marginBottom: 16 }}>
              Ready to Transform Your Practice?
            </h2>
            <p style={{ color: '#94a3b8', marginBottom: 32, maxWidth: 480, margin: '0 auto 32px' }}>
              Join practitioners who are modernizing Ayurvedic healthcare with VedicMedic.
            </p>
            <Link href="/register" className="btn-primary" style={{ fontSize: 16, padding: '14px 32px', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              Get Started Now <ArrowRight style={{ width: 20, height: 20 }} />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer id="about" style={{ position: 'relative', zIndex: 10, borderTop: '1px solid rgba(255,255,255,0.05)', padding: '48px', maxWidth: 1280, margin: '0 auto', width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg, #f59e0b, #b45309)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Leaf style={{ width: 16, height: 16, color: 'white' }} />
            </div>
            <span style={{ fontSize: 18, fontWeight: 700, fontFamily: 'Outfit, sans-serif' }}>
              <span className="gradient-text">Vedic</span><span style={{ color: 'white' }}>Medic</span>
            </span>
          </div>
          <p style={{ fontSize: 14, color: '#6b7280' }}>Built with ❤️ during a hackathon using AI-assisted development.</p>
          <p style={{ fontSize: 14, color: '#6b7280' }}>© 2024 VedicMedic. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
