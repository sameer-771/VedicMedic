'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { ChartPie, TrendingUp, BarChart3 } from 'lucide-react';
import { dietAPI } from '@/lib/api';

const COLORS = ['#f59e0b', '#3b82f6', '#22c55e', '#a855f7', '#ef4444'];
const LABELS = ['Calories', 'Protein', 'Fiber', 'Carbs', 'Fat'];

export default function NutritionPage() {
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try { const { data } = await dietAPI.getAll(); setPlans(data); }
      catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetch();
  }, []);

  const latestPlan = plans[0];
  const nutrients = latestPlan?.totalNutrients;

  const pieData = nutrients ? [
    { name: 'Carbs', value: nutrients.carbs, color: '#a855f7' },
    { name: 'Protein', value: nutrients.protein, color: '#3b82f6' },
    { name: 'Fat', value: nutrients.fat, color: '#ef4444' },
    { name: 'Fiber', value: nutrients.fiber, color: '#22c55e' },
  ] : [];

  const weeklyData = plans.slice(0, 7).reverse().map((p, i) => ({
    day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i % 7],
    calories: p.totalNutrients?.calories || 0,
    protein: p.totalNutrients?.protein || 0,
    fiber: p.totalNutrients?.fiber || 0,
  }));

  const dailyProgress = nutrients ? [
    { name: 'Calories', value: nutrients.calories, max: 2500, color: '#f59e0b' },
    { name: 'Protein', value: nutrients.protein, max: 100, color: '#3b82f6', unit: 'g' },
    { name: 'Fiber', value: nutrients.fiber, max: 50, color: '#22c55e', unit: 'g' },
    { name: 'Carbs', value: nutrients.carbs, max: 350, color: '#a855f7', unit: 'g' },
    { name: 'Fat', value: nutrients.fat, max: 80, color: '#ef4444', unit: 'g' },
  ] : [];

  if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 256 }}><div style={{ width: 32, height: 32, border: '2px solid #f59e0b', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} /></div>;

  if (!latestPlan) return (
    <div className="glass-card p-12 text-center">
      <ChartPie className="w-12 h-12 text-gray-600 mx-auto mb-3" />
      <p className="text-gray-400">No diet plans available. Generate a diet plan first to see nutrition analytics.</p>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      <div>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: 'white', fontFamily: 'Outfit, sans-serif' }}>Nutrient Analysis Dashboard</h1>
        <p style={{ fontSize: 14, color: '#94a3b8', marginTop: 6 }}>Visual analytics of nutritional intake from diet plans</p>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 20 }}>
        {dailyProgress.map((item, i) => (
          <motion.div key={i} className="glass-card" style={{ padding: 20, textAlign: 'center' }} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <p style={{ fontSize: 26, fontWeight: 700, color: item.color }}>{item.value}{item.unit || ''}</p>
            <p style={{ fontSize: 13, color: '#94a3b8', marginTop: 4 }}>{item.name}</p>
          </motion.div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Pie Chart */}
        <motion.div className="glass-card" style={{ padding: 28 }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: 'white', fontFamily: 'Outfit, sans-serif', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
            <ChartPie className="w-5 h-5 text-amber-400" /> Macronutrient Breakdown
          </h3>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={4} dataKey="value">
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: '#1f2937', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', color: '#f1f5f9' }} />
                <Legend wrapperStyle={{ color: '#94a3b8', fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Weekly Trend */}
        <motion.div className="glass-card" style={{ padding: 28 }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: 'white', fontFamily: 'Outfit, sans-serif', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
            <TrendingUp className="w-5 h-5 text-green-400" /> Weekly Nutrition Trend
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="day" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={{ stroke: 'rgba(255,255,255,0.05)' }} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={{ stroke: 'rgba(255,255,255,0.05)' }} />
              <Tooltip contentStyle={{ background: '#1f2937', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', color: '#f1f5f9' }} />
              <Line type="monotone" dataKey="calories" stroke="#f59e0b" strokeWidth={2} dot={{ fill: '#f59e0b', r: 4 }} />
              <Line type="monotone" dataKey="protein" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6', r: 4 }} />
              <Line type="monotone" dataKey="fiber" stroke="#22c55e" strokeWidth={2} dot={{ fill: '#22c55e', r: 4 }} />
              <Legend wrapperStyle={{ color: '#94a3b8', fontSize: '12px' }} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Daily Intake Progress Bars */}
      <motion.div className="glass-card" style={{ padding: 28 }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <h3 style={{ fontSize: 16, fontWeight: 600, color: 'white', fontFamily: 'Outfit, sans-serif', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 10 }}>
          <BarChart3 style={{ width: 20, height: 20, color: '#a855f7' }} /> Daily Intake Progress
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
          {dailyProgress.map((item, i) => {
            const pct = Math.min(Math.round((item.value / item.max) * 100), 100);
            return (
              <div key={i}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-white">{item.name}</span>
                  <span className="text-xs text-gray-400">{item.value}{item.unit || ''} / {item.max}{item.unit || ''} ({pct}%)</span>
                </div>
                <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                  <motion.div className="h-full rounded-full" style={{ background: item.color }}
                    initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1, delay: 0.5 + i * 0.15 }} />
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
