'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Database, Search, Leaf, Flame, Droplets, Wind, Sparkles } from 'lucide-react';
import { foodsAPI } from '@/lib/api';

const effectColors: Record<string, { bg: string; text: string; icon: any }> = {
  Heating: { bg: 'rgba(239,68,68,0.1)', text: '#ef4444', icon: Flame },
  Cooling: { bg: 'rgba(59,130,246,0.1)', text: '#3b82f6', icon: Droplets },
  Detoxifying: { bg: 'rgba(34,197,94,0.1)', text: '#22c55e', icon: Sparkles },
  Nourishing: { bg: 'rgba(245,158,11,0.1)', text: '#f59e0b', icon: Leaf },
  Balancing: { bg: 'rgba(168,85,247,0.1)', text: '#a855f7', icon: Wind },
  Energizing: { bg: 'rgba(6,182,212,0.1)', text: '#06b6d4', icon: Sparkles },
};

export default function FoodsPage() {
  const [foods, setFoods] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [effectFilter, setEffectFilter] = useState('');

  const fetchFoods = async () => {
    try {
      const { data } = await foodsAPI.getAll({ search, effect: effectFilter || undefined });
      setFoods(data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchFoods(); }, [search, effectFilter]);

  if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 256 }}><div style={{ width: 32, height: 32, border: '2px solid #f59e0b', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} /></div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      <div>
        <h1 style={{ fontSize: 26, fontWeight: 700, color: 'white', fontFamily: 'Outfit, sans-serif' }}>Ayurvedic Food Intelligence</h1>
        <p style={{ fontSize: 14, color: '#94a3b8', marginTop: 6 }}>Explore food properties, dosha impacts, and Ayurvedic classifications</p>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div className="input-icon-wrapper" style={{ maxWidth: 480 }}>
          <Search className="input-icon" />
          <input className="input-field" placeholder="Search foods..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setEffectFilter('')} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${!effectFilter ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-white/5 text-gray-400 border border-white/5 hover:bg-white/10'}`}>All</button>
          {Object.keys(effectColors).map(effect => {
            const ec = effectColors[effect];
            return (
              <button key={effect} onClick={() => setEffectFilter(effect)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${effectFilter === effect ? `border` : 'bg-white/5 text-gray-400 border border-white/5 hover:bg-white/10'}`}
                style={effectFilter === effect ? { background: ec.bg, color: ec.text, borderColor: `${ec.text}40` } : {}}>
                {effect}
              </button>
            );
          })}
        </div>
      </div>

      {/* Foods Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
        {foods.map((food, i) => {
          const ec = effectColors[food.ayurvedicEffect] || effectColors.Balancing;
          const IconComp = ec.icon;
          return (
            <motion.div key={food._id || i} className="glass-card glass-card-hover" style={{ padding: 24, transition: 'all 0.3s' }}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', background: ec.bg }}>
                    <IconComp style={{ width: 22, height: 22, color: ec.text }} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: 15, fontWeight: 600, color: 'white' }}>{food.foodName}</h3>
                    <p style={{ fontSize: 13, color: '#6b7280' }}>{food.category}</p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-3">
                <span className="px-2.5 py-0.5 rounded-md text-xs font-medium" style={{ background: ec.bg, color: ec.text }}>
                  {food.ayurvedicEffect}
                </span>
                {food.taste && <span className="px-2.5 py-0.5 rounded-md text-xs bg-white/5 text-gray-400">{food.taste}</span>}
              </div>

              <p className="text-xs text-gray-400 mb-3 leading-relaxed">{food.description}</p>

              <div className="p-2.5 rounded-lg bg-white/3 mb-3">
                <p className="text-xs font-medium text-amber-400 mb-1">Dosha Impact</p>
                <p className="text-xs text-gray-300">{food.doshaImpact}</p>
              </div>

              {food.nutritionalValues && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 6, textAlign: 'center' }}>
                  {[
                    { label: 'Cal', value: food.nutritionalValues.calories },
                    { label: 'P', value: food.nutritionalValues.protein },
                    { label: 'Fib', value: food.nutritionalValues.fiber },
                    { label: 'C', value: food.nutritionalValues.carbs },
                    { label: 'Fat', value: food.nutritionalValues.fat },
                  ].map((n, j) => (
                    <div key={j} style={{ padding: 8, borderRadius: 6, background: 'rgba(255,255,255,0.03)' }}>
                      <p style={{ fontSize: 13, fontWeight: 700, color: 'white' }}>{n.value}</p>
                      <p style={{ fontSize: 10, color: '#6b7280' }}>{n.label}</p>
                    </div>
                  ))}
                </div>
              )}

              {food.season?.length > 0 && (
                <div className="flex gap-1 mt-3">
                  {food.season.map((s: string, j: number) => (
                    <span key={j} className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-gray-500">{s}</span>
                  ))}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
      {foods.length === 0 && <div className="glass-card p-12 text-center"><Database className="w-12 h-12 text-gray-600 mx-auto mb-3" /><p className="text-gray-400">No foods found. Try adjusting your search or filters.</p></div>}
    </div>
  );
}
