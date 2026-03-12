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
    { label: 'Total Patients', value: patients.length, icon: Users, color: '#3b82f6', bg: 'from-blue-500/10 to-blue-900/5' },
    { label: 'Diet Plans', value: dietPlans.length, icon: Utensils, color: '#22c55e', bg: 'from-green-500/10 to-green-900/5' },
    { label: 'Appointments', value: appointments.length, icon: CalendarDays, color: '#f59e0b', bg: 'from-amber-500/10 to-amber-900/5' },
    { label: 'Upcoming', value: upcomingAppts.length, icon: Clock, color: '#a855f7', bg: 'from-purple-500/10 to-purple-900/5' },
  ];

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div key={i} className={`glass-card p-5 bg-gradient-to-br ${stat.bg}`}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${stat.color}15` }}>
                <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
              </div>
              <TrendingUp className="w-4 h-4 text-green-400" />
            </div>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
            <p className="text-sm text-gray-400 mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Dosha Distribution */}
        <motion.div className="glass-card p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          <h3 className="text-lg font-semibold text-white font-['Outfit'] mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-amber-400" /> Dosha Distribution
          </h3>
          <div className="space-y-4">
            {['Vata', 'Pitta', 'Kapha'].map(dosha => {
              const count = doshaDistribution[dosha] || 0;
              const pct = patients.length ? Math.round((count / patients.length) * 100) : 0;
              return (
                <div key={dosha}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium" style={{ color: doshaColors[dosha] }}>{dosha}</span>
                    <span className="text-xs text-gray-400">{count} patients ({pct}%)</span>
                  </div>
                  <div className="h-2.5 bg-white/5 rounded-full overflow-hidden">
                    <motion.div className="h-full rounded-full" style={{ background: doshaColors[dosha] }}
                      initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1, delay: 0.5 }} />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Recent Patients */}
        <motion.div className="glass-card p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white font-['Outfit'] flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-400" /> Recent Patients
            </h3>
            <Link href="/dashboard/patients" className="text-xs text-amber-400 hover:text-amber-300">View All →</Link>
          </div>
          <div className="space-y-3">
            {patients.slice(0, 5).map((p, i) => (
              <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-white/3 transition-colors">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold"
                  style={{ background: `${doshaColors[p.doshaType?.split('-')[0]] || '#d4a853'}15`, color: doshaColors[p.doshaType?.split('-')[0]] || '#d4a853' }}>
                  {p.name?.[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{p.name}</p>
                  <p className="text-xs text-gray-500">{p.doshaType} · {p.age}y</p>
                </div>
              </div>
            ))}
            {patients.length === 0 && <p className="text-sm text-gray-500 text-center py-4">No patients yet</p>}
          </div>
        </motion.div>

        {/* Upcoming Appointments */}
        <motion.div className="glass-card p-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white font-['Outfit'] flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-amber-400" /> Upcoming
            </h3>
            <Link href="/dashboard/appointments" className="text-xs text-amber-400 hover:text-amber-300">View All →</Link>
          </div>
          <div className="space-y-3">
            {upcomingAppts.map((a, i) => (
              <div key={i} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-white/3 transition-colors">
                <div className="w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center">
                  <CalendarDays className="w-4 h-4 text-amber-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{a.patientId?.name || 'Patient'}</p>
                  <p className="text-xs text-gray-500">{a.date} · {a.time}</p>
                </div>
              </div>
            ))}
            {upcomingAppts.length === 0 && <p className="text-sm text-gray-500 text-center py-4">No upcoming appointments</p>}
          </div>
        </motion.div>
      </div>

      {/* Dosha Balance Meter */}
      <motion.div className="glass-card p-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
        <h3 className="text-lg font-semibold text-white font-['Outfit'] mb-6 flex items-center gap-2">
          <Database className="w-5 h-5 text-green-400" /> Dosha Balance Meter
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: 'Vata', value: 72, color: '#3b82f6', desc: 'Air & Space energy' },
            { name: 'Pitta', value: 58, color: '#ef4444', desc: 'Fire & Water energy' },
            { name: 'Kapha', value: 45, color: '#22c55e', desc: 'Earth & Water energy' },
          ].map((dosha, i) => (
            <div key={i} className="text-center">
              <div className="relative w-32 h-32 mx-auto mb-4">
                <svg className="w-32 h-32 -rotate-90" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
                  <motion.circle cx="60" cy="60" r="52" fill="none" stroke={dosha.color} strokeWidth="10"
                    strokeLinecap="round" strokeDasharray={`${2 * Math.PI * 52}`}
                    initial={{ strokeDashoffset: 2 * Math.PI * 52 }}
                    animate={{ strokeDashoffset: 2 * Math.PI * 52 * (1 - dosha.value / 100) }}
                    transition={{ duration: 1.5, delay: 0.5 + i * 0.2 }} />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold" style={{ color: dosha.color }}>{dosha.value}%</span>
                </div>
              </div>
              <h4 className="text-lg font-semibold text-white font-['Outfit']">{dosha.name}</h4>
              <p className="text-xs text-gray-400 mt-1">{dosha.desc}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
