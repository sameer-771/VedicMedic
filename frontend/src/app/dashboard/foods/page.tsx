'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Database, Search, Leaf, Flame, Droplets, Wind, Sparkles, Plus, Trash2, X } from 'lucide-react';
import { foodsAPI } from '@/lib/api';

const effectColors: Record<string, { bg: string; text: string; icon: any }> = {
  Heating: { bg: 'rgba(239,68,68,0.1)', text: '#ef4444', icon: Flame },
  Cooling: { bg: 'rgba(59,130,246,0.1)', text: '#3b82f6', icon: Droplets },
  Detoxifying: { bg: 'rgba(34,197,94,0.1)', text: '#22c55e', icon: Sparkles },
  Nourishing: { bg: 'rgba(245,158,11,0.1)', text: '#f59e0b', icon: Leaf },
  Balancing: { bg: 'rgba(168,85,247,0.1)', text: '#a855f7', icon: Wind },
  Energizing: { bg: 'rgba(6,182,212,0.1)', text: '#06b6d4', icon: Sparkles },
};

const effectOptions = ['Heating', 'Cooling', 'Detoxifying', 'Nourishing', 'Balancing', 'Energizing'];
const emptyForm = {
  foodName: '', category: '', description: '', ayurvedicEffect: 'Balancing', doshaImpact: '', taste: '', season: '',
  calories: '', protein: '', fiber: '', carbs: '', fat: ''
};

export default function FoodsPage() {
  const [foods, setFoods] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [effectFilter, setEffectFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);

  const fetchFoods = async () => {
    try {
      const { data } = await foodsAPI.getAll({ search, effect: effectFilter || undefined });
      setFoods(data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchFoods(); }, [search, effectFilter]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      foodName: form.foodName,
      category: form.category,
      description: form.description,
      ayurvedicEffect: form.ayurvedicEffect,
      doshaImpact: form.doshaImpact,
      taste: form.taste,
      season: form.season ? form.season.split(',').map(s => s.trim()) : [],
      nutritionalValues: {
        calories: Number(form.calories) || 0,
        protein: Number(form.protein) || 0,
        fiber: Number(form.fiber) || 0,
        carbs: Number(form.carbs) || 0,
        fat: Number(form.fat) || 0,
      }
    };
    try {
      await foodsAPI.create(payload);
      setShowModal(false);
      setForm(emptyForm);
      fetchFoods();
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this food item?')) return;
    try { await foodsAPI.delete(id); fetchFoods(); } catch (err) { console.error(err); }
  };

  if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 256 }}><div style={{ width: 32, height: 32, border: '2px solid #f59e0b', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} /></div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: 'white', fontFamily: 'Outfit, sans-serif' }}>Ayurvedic Food Intelligence</h1>
          <p style={{ fontSize: 14, color: '#94a3b8', marginTop: 6 }}>Explore food properties, dosha impacts, and Ayurvedic classifications</p>
        </div>
        <button onClick={() => { setForm(emptyForm); setShowModal(true); }} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Plus style={{ width: 16, height: 16 }} /> Add Food Item
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div className="input-icon-wrapper" style={{ maxWidth: 480 }}>
          <Search className="input-icon" />
          <input className="input-field" placeholder="Search foods..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          <button onClick={() => setEffectFilter('')}
            style={{ padding: '8px 16px', borderRadius: 10, fontSize: 13, fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s',
              background: !effectFilter ? 'rgba(245,158,11,0.15)' : 'rgba(255,255,255,0.04)',
              color: !effectFilter ? '#f59e0b' : '#94a3b8',
              border: `1.5px solid ${!effectFilter ? 'rgba(245,158,11,0.3)' : 'rgba(255,255,255,0.06)'}` }}>
            All
          </button>
          {effectOptions.map(effect => {
            const ec = effectColors[effect];
            const active = effectFilter === effect;
            return (
              <button key={effect} onClick={() => setEffectFilter(effect)}
                style={{ padding: '8px 16px', borderRadius: 10, fontSize: 13, fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s',
                  background: active ? ec.bg : 'rgba(255,255,255,0.04)',
                  color: active ? ec.text : '#94a3b8',
                  border: `1.5px solid ${active ? ec.text + '40' : 'rgba(255,255,255,0.06)'}` }}>
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
            <motion.div key={food._id || i} className="glass-card glass-card-hover" style={{ padding: 24, transition: 'all 0.3s', position: 'relative' }}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
              {/* Delete button */}
              <button onClick={() => handleDelete(food._id)}
                style={{ position: 'absolute', top: 14, right: 14, padding: 6, borderRadius: 8, background: 'transparent', border: 'none', color: '#6b7280', cursor: 'pointer', transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#ef4444')}
                onMouseLeave={e => (e.currentTarget.style.color = '#6b7280')}>
                <Trash2 style={{ width: 15, height: 15 }} />
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', background: ec.bg }}>
                  <IconComp style={{ width: 22, height: 22, color: ec.text }} />
                </div>
                <div>
                  <h3 style={{ fontSize: 15, fontWeight: 600, color: 'white' }}>{food.foodName}</h3>
                  <p style={{ fontSize: 13, color: '#6b7280' }}>{food.category}</p>
                </div>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
                <span style={{ padding: '4px 12px', borderRadius: 8, fontSize: 12, fontWeight: 500, background: ec.bg, color: ec.text }}>
                  {food.ayurvedicEffect}
                </span>
                {food.taste && <span style={{ padding: '4px 12px', borderRadius: 8, fontSize: 12, background: 'rgba(255,255,255,0.05)', color: '#94a3b8' }}>{food.taste}</span>}
              </div>

              <p style={{ fontSize: 13, color: '#94a3b8', marginBottom: 12, lineHeight: 1.6 }}>{food.description}</p>

              <div style={{ padding: 12, borderRadius: 10, background: 'rgba(255,255,255,0.03)', marginBottom: 12 }}>
                <p style={{ fontSize: 12, fontWeight: 600, color: '#f59e0b', marginBottom: 4 }}>Dosha Impact</p>
                <p style={{ fontSize: 13, color: '#cbd5e1' }}>{food.doshaImpact}</p>
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
                <div style={{ display: 'flex', gap: 6, marginTop: 12 }}>
                  {food.season.map((s: string, j: number) => (
                    <span key={j} style={{ fontSize: 11, padding: '3px 10px', borderRadius: 6, background: 'rgba(255,255,255,0.05)', color: '#6b7280' }}>{s}</span>
                  ))}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
      {foods.length === 0 && <div className="glass-card" style={{ padding: 48, textAlign: 'center' }}><Database style={{ width: 48, height: 48, color: '#4b5563', margin: '0 auto 12px' }} /><p style={{ color: '#94a3b8' }}>No foods found. Try adjusting your search or filters.</p></div>}

      {/* Add Food Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="glass-card" style={{ padding: 32, width: '100%', maxWidth: 580, margin: '0 16px', maxHeight: '85vh', overflowY: 'auto', background: '#1f1035' }}
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
                <h2 style={{ fontSize: 20, fontWeight: 700, color: 'white', fontFamily: 'Outfit, sans-serif' }}>Add New Food Item</h2>
                <button onClick={() => setShowModal(false)} style={{ padding: 8, borderRadius: 8, background: 'transparent', border: 'none', color: '#9ca3af', cursor: 'pointer' }}><X style={{ width: 20, height: 20 }} /></button>
              </div>
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
                  <div style={{ gridColumn: 'span 2' }}>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#cbd5e1', marginBottom: 6 }}>Food Name *</label>
                    <input required className="input-field" placeholder="e.g. Basmati Rice" value={form.foodName} onChange={e => setForm({...form, foodName: e.target.value})} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#cbd5e1', marginBottom: 6 }}>Category</label>
                    <input className="input-field" placeholder="e.g. Grains" value={form.category} onChange={e => setForm({...form, category: e.target.value})} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#cbd5e1', marginBottom: 6 }}>Taste</label>
                    <input className="input-field" placeholder="e.g. Sweet" value={form.taste} onChange={e => setForm({...form, taste: e.target.value})} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#cbd5e1', marginBottom: 6 }}>Ayurvedic Effect *</label>
                    <select className="input-field" value={form.ayurvedicEffect} onChange={e => setForm({...form, ayurvedicEffect: e.target.value})}>
                      {effectOptions.map(e => <option key={e} value={e}>{e}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#cbd5e1', marginBottom: 6 }}>Season</label>
                    <input className="input-field" placeholder="Summer, Winter" value={form.season} onChange={e => setForm({...form, season: e.target.value})} />
                  </div>
                  <div style={{ gridColumn: 'span 2' }}>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#cbd5e1', marginBottom: 6 }}>Dosha Impact</label>
                    <input className="input-field" placeholder="e.g. Balances Vata, aggravates Pitta" value={form.doshaImpact} onChange={e => setForm({...form, doshaImpact: e.target.value})} />
                  </div>
                  <div style={{ gridColumn: 'span 2' }}>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 500, color: '#cbd5e1', marginBottom: 6 }}>Description</label>
                    <textarea className="input-field" rows={2} placeholder="Brief description of the food..." value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
                  </div>
                </div>

                {/* Nutritional Values */}
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#f59e0b', marginBottom: 10 }}>Nutritional Values (per serving)</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 11, color: '#94a3b8', marginBottom: 4 }}>Calories</label>
                      <input type="number" className="input-field" placeholder="0" value={form.calories} onChange={e => setForm({...form, calories: e.target.value})} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: 11, color: '#94a3b8', marginBottom: 4 }}>Protein (g)</label>
                      <input type="number" className="input-field" placeholder="0" value={form.protein} onChange={e => setForm({...form, protein: e.target.value})} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: 11, color: '#94a3b8', marginBottom: 4 }}>Fiber (g)</label>
                      <input type="number" className="input-field" placeholder="0" value={form.fiber} onChange={e => setForm({...form, fiber: e.target.value})} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: 11, color: '#94a3b8', marginBottom: 4 }}>Carbs (g)</label>
                      <input type="number" className="input-field" placeholder="0" value={form.carbs} onChange={e => setForm({...form, carbs: e.target.value})} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: 11, color: '#94a3b8', marginBottom: 4 }}>Fat (g)</label>
                      <input type="number" className="input-field" placeholder="0" value={form.fat} onChange={e => setForm({...form, fat: e.target.value})} />
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 14, paddingTop: 8 }}>
                  <button type="button" onClick={() => setShowModal(false)} className="btn-secondary" style={{ flex: 1 }}>Cancel</button>
                  <button type="submit" className="btn-primary" style={{ flex: 1 }}>Add Food Item</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
