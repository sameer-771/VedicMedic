'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Utensils, CalendarDays, Database, Activity, TrendingUp, Clock } from 'lucide-react';
import { patientsAPI, dietAPI, appointmentsAPI } from '@/lib/api';
import Link from 'next/link';

const doshaColors: Record<string, string> = {
  Vata: '#3b82f6', Pitta: '#ef4444', Kapha: '#22c55e',
  'Vata-Pitta': '#8b5cf6', 'Pitta-Kapha': '#f59e0b', 'Vata-Kapha': '#06b6d4', Tridosha: '#d4a853'
};

export default function DashboardPage() {
  const [patients, setPatients] = useState<any[]>([]);
  const [dietPlans, setDietPlans] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pRes, dRes, aRes] = await Promise.all([
          patientsAPI.getAll(), dietAPI.getAll(), appointmentsAPI.getAll()
        ]);
        setPatients(pRes.data);
        setDietPlans(dRes.data);
        setAppointments(aRes.data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  const upcomingAppts = appointments.filter(a => a.status === 'Scheduled').slice(0, 5);
  const doshaDistribution = patients.reduce((acc: Record<string, number>, p) => {
    const base = p.doshaType?.split('-')[0] || 'Vata';
    acc[base] = (acc[base] || 0) + 1;
    return acc;
  }, {});

  const stats = [
    { label: 'Total Patients', value: patients.length, icon: Users, color: '#3b82f6' },
    { label: 'Diet Plans', value: dietPlans.length, icon: Utensils, color: '#22c55e' },
    { label: 'Appointments', value: appointments.length, icon: CalendarDays, color: '#f59e0b' },
    { label: 'Upcoming', value: upcomingAppts.length, icon: Clock, color: '#a855f7' },
  ];

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 256 }}>
      <div style={{ width: 32, height: 32, border: '2px solid #f59e0b', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
        {stats.map((stat, i) => (
          <motion.div key={i} className="glass-card"
            style={{ padding: 24 }}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${stat.color}18` }}>
                <stat.icon style={{ width: 22, height: 22, color: stat.color }} />
              </div>
              <TrendingUp style={{ width: 16, height: 16, color: '#4ade80' }} />
            </div>
            <p style={{ fontSize: 28, fontWeight: 700, color: 'white', fontFamily: 'Outfit, sans-serif' }}>{stat.value}</p>
            <p style={{ fontSize: 14, color: '#94a3b8', marginTop: 4 }}>{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Middle Row: Dosha Distribution + Recent Patients + Upcoming */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
        {/* Dosha Distribution */}
        <motion.div className="glass-card" style={{ padding: 24 }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: 'white', fontFamily: 'Outfit, sans-serif', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 10 }}>
            <Activity style={{ width: 20, height: 20, color: '#f59e0b' }} /> Dosha Distribution
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {['Vata', 'Pitta', 'Kapha'].map(dosha => {
              const count = doshaDistribution[dosha] || 0;
              const pct = patients.length ? Math.round((count / patients.length) * 100) : 0;
              return (
                <div key={dosha}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                    <span style={{ fontSize: 14, fontWeight: 600, color: doshaColors[dosha] }}>{dosha}</span>
                    <span style={{ fontSize: 12, color: '#94a3b8' }}>{count} patients ({pct}%)</span>
                  </div>
                  <div style={{ height: 10, background: 'rgba(255,255,255,0.05)', borderRadius: 5, overflow: 'hidden' }}>
                    <motion.div style={{ height: '100%', borderRadius: 5, background: doshaColors[dosha] }}
                      initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1, delay: 0.5 }} />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Recent Patients */}
        <motion.div className="glass-card" style={{ padding: 24 }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: 'white', fontFamily: 'Outfit, sans-serif', display: 'flex', alignItems: 'center', gap: 10 }}>
              <Users style={{ width: 20, height: 20, color: '#3b82f6' }} /> Recent Patients
            </h3>
            <Link href="/dashboard/patients" style={{ fontSize: 12, color: '#f59e0b', textDecoration: 'none' }}>View All →</Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {patients.slice(0, 5).map((p, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 10, borderRadius: 10, transition: 'background 0.2s' }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700,
                  background: `${doshaColors[p.doshaType?.split('-')[0]] || '#d4a853'}18`, color: doshaColors[p.doshaType?.split('-')[0]] || '#d4a853' }}>
                  {p.name?.[0]}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 14, fontWeight: 500, color: 'white', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</p>
                  <p style={{ fontSize: 12, color: '#6b7280' }}>{p.doshaType} · {p.age}y</p>
                </div>
              </div>
            ))}
            {patients.length === 0 && <p style={{ fontSize: 14, color: '#6b7280', textAlign: 'center', padding: '16px 0' }}>No patients yet</p>}
          </div>
        </motion.div>

        {/* Upcoming Appointments */}
        <motion.div className="glass-card" style={{ padding: 24 }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: 'white', fontFamily: 'Outfit, sans-serif', display: 'flex', alignItems: 'center', gap: 10 }}>
              <CalendarDays style={{ width: 20, height: 20, color: '#f59e0b' }} /> Upcoming
            </h3>
            <Link href="/dashboard/appointments" style={{ fontSize: 12, color: '#f59e0b', textDecoration: 'none' }}>View All →</Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {upcomingAppts.map((a, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 10, borderRadius: 10, transition: 'background 0.2s' }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(245,158,11,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CalendarDays style={{ width: 18, height: 18, color: '#f59e0b' }} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 14, fontWeight: 500, color: 'white', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.patientId?.name || 'Patient'}</p>
                  <p style={{ fontSize: 12, color: '#6b7280' }}>{a.date} · {a.time}</p>
                </div>
              </div>
            ))}
            {upcomingAppts.length === 0 && <p style={{ fontSize: 14, color: '#6b7280', textAlign: 'center', padding: '16px 0' }}>No upcoming appointments</p>}
          </div>
        </motion.div>
      </div>

      {/* Dosha Balance Meter */}
      <motion.div className="glass-card" style={{ padding: 32 }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
        <h3 style={{ fontSize: 16, fontWeight: 600, color: 'white', fontFamily: 'Outfit, sans-serif', marginBottom: 32, display: 'flex', alignItems: 'center', gap: 10 }}>
          <Database style={{ width: 20, height: 20, color: '#4ade80' }} /> Dosha Balance Meter
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32 }}>
          {[
            { name: 'Vata', value: 72, color: '#3b82f6', desc: 'Air & Space energy' },
            { name: 'Pitta', value: 58, color: '#ef4444', desc: 'Fire & Water energy' },
            { name: 'Kapha', value: 45, color: '#22c55e', desc: 'Earth & Water energy' },
          ].map((dosha, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{ position: 'relative', width: 140, height: 140, margin: '0 auto 20px' }}>
                <svg width="140" height="140" viewBox="0 0 140 140" style={{ transform: 'rotate(-90deg)' }}>
                  <circle cx="70" cy="70" r="58" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
                  <motion.circle cx="70" cy="70" r="58" fill="none" stroke={dosha.color} strokeWidth="10"
                    strokeLinecap="round" strokeDasharray={`${2 * Math.PI * 58}`}
                    initial={{ strokeDashoffset: 2 * Math.PI * 58 }}
                    animate={{ strokeDashoffset: 2 * Math.PI * 58 * (1 - dosha.value / 100) }}
                    transition={{ duration: 1.5, delay: 0.5 + i * 0.2 }} />
                </svg>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: 26, fontWeight: 700, color: dosha.color, fontFamily: 'Outfit, sans-serif' }}>{dosha.value}%</span>
                </div>
              </div>
              <h4 style={{ fontSize: 18, fontWeight: 600, color: 'white', fontFamily: 'Outfit, sans-serif', marginBottom: 4 }}>{dosha.name}</h4>
              <p style={{ fontSize: 13, color: '#94a3b8' }}>{dosha.desc}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
