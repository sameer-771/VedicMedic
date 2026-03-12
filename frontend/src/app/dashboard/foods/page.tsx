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

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white font-['Outfit']">Ayurvedic Food Intelligence</h1>
        <p className="text-sm text-gray-400 mt-1">Explore food properties, dosha impacts, and Ayurvedic classifications</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input className="input-field pl-10" placeholder="Search foods..." value={search} onChange={e => setSearch(e.target.value)} />
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {foods.map((food, i) => {
          const ec = effectColors[food.ayurvedicEffect] || effectColors.Balancing;
          const IconComp = ec.icon;
          return (
            <motion.div key={food._id || i} className="glass-card glass-card-hover p-5 transition-all duration-300"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: ec.bg }}>
                    <IconComp className="w-5 h-5" style={{ color: ec.text }} />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">{food.foodName}</h3>
                    <p className="text-xs text-gray-500">{food.category}</p>
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
                <div className="grid grid-cols-5 gap-1 text-center">
                  {[
                    { label: 'Cal', value: food.nutritionalValues.calories },
                    { label: 'P', value: food.nutritionalValues.protein },
                    { label: 'Fib', value: food.nutritionalValues.fiber },
                    { label: 'C', value: food.nutritionalValues.carbs },
                    { label: 'Fat', value: food.nutritionalValues.fat },
                  ].map((n, j) => (
                    <div key={j} className="p-1.5 rounded bg-white/3">
                      <p className="text-xs font-bold text-white">{n.value}</p>
                      <p className="text-[10px] text-gray-500">{n.label}</p>
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
