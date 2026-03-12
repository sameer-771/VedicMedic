'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Sparkles, Sun, Snowflake, CloudRain, CheckCircle, XCircle, Utensils } from 'lucide-react';
import { aiAPI } from '@/lib/api';

const doshaOptions = ['Vata', 'Pitta', 'Kapha', 'Vata-Pitta', 'Pitta-Kapha', 'Vata-Kapha'];
const doshaColors: Record<string, string> = { Vata: '#3b82f6', Pitta: '#ef4444', Kapha: '#22c55e', 'Vata-Pitta': '#8b5cf6', 'Pitta-Kapha': '#f59e0b', 'Vata-Kapha': '#06b6d4' };
const symptomOptions = ['Fatigue', 'Insomnia', 'Digestive issues', 'Anxiety', 'Skin problems', 'Joint pain', 'Weight gain', 'Acidity', 'Bloating', 'Low energy', 'Headaches', 'Inflammation'];

export default function AIPage() {
  const [doshaType, setDoshaType] = useState('Vata');
  const [season, setSeason] = useState('Summer');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const toggleSymptom = (s: string) => {
    setSelectedSymptoms(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  };

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const { data } = await aiAPI.getRecommendation({ doshaType, symptoms: selectedSymptoms, season });
      setResult(data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ width: 52, height: 52, borderRadius: 14, background: 'linear-gradient(135deg, rgba(245,158,11,0.15), rgba(168,85,247,0.15))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Brain style={{ width: 26, height: 26, color: '#f59e0b' }} />
        </div>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: 'white', fontFamily: 'Outfit, sans-serif' }}>AI Diet Recommendation</h1>
          <p style={{ fontSize: 15, color: '#94a3b8', marginTop: 4 }}>Get intelligent Ayurvedic diet recommendations powered by AI</p>
        </div>
      </div>

      {/* Configuration Card */}
      <div className="glass-card" style={{ padding: 32 }}>
        <h3 style={{ fontSize: 18, fontWeight: 600, color: 'white', fontFamily: 'Outfit, sans-serif', marginBottom: 28, display: 'flex', alignItems: 'center', gap: 10 }}>
          <Sparkles style={{ width: 20, height: 20, color: '#f59e0b' }} /> Configure Recommendation
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32 }}>
          {/* Dosha Type */}
          <div>
            <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#cbd5e1', marginBottom: 14 }}>Dosha Type</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
              {doshaOptions.map(d => {
                const c = doshaColors[d] || '#d4a853';
                const active = doshaType === d;
                return (
                  <button key={d} onClick={() => setDoshaType(d)}
                    style={{
                      padding: '12px 8px', borderRadius: 12, fontSize: 13, fontWeight: 600,
                      transition: 'all 0.2s', border: `1.5px solid ${active ? c + '50' : 'rgba(255,255,255,0.06)'}`,
                      background: active ? `${c}15` : 'rgba(255,255,255,0.03)',
                      color: active ? c : '#94a3b8', cursor: 'pointer', textAlign: 'center',
                    }}>
                    {d}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Season */}
          <div>
            <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#cbd5e1', marginBottom: 14 }}>Season</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
              {[
                { name: 'Summer', icon: Sun, color: '#f59e0b' },
                { name: 'Winter', icon: Snowflake, color: '#3b82f6' },
                { name: 'Monsoon', icon: CloudRain, color: '#22c55e' },
              ].map(s => {
                const active = season === s.name;
                return (
                  <button key={s.name} onClick={() => setSeason(s.name)}
                    style={{
                      padding: '14px 8px', borderRadius: 12, fontSize: 13, fontWeight: 600,
                      transition: 'all 0.2s', border: `1.5px solid ${active ? s.color + '50' : 'rgba(255,255,255,0.06)'}`,
                      background: active ? `${s.color}15` : 'rgba(255,255,255,0.03)',
                      color: active ? s.color : '#94a3b8', cursor: 'pointer',
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
                    }}>
                    <s.icon style={{ width: 22, height: 22 }} />
                    {s.name}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Symptoms */}
        <div style={{ marginTop: 32 }}>
          <label style={{ display: 'block', fontSize: 14, fontWeight: 500, color: '#cbd5e1', marginBottom: 14 }}>Symptoms (Optional)</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {symptomOptions.map(s => {
              const active = selectedSymptoms.includes(s);
              return (
                <button key={s} onClick={() => toggleSymptom(s)}
                  style={{
                    padding: '8px 16px', borderRadius: 10, fontSize: 13, fontWeight: 500,
                    transition: 'all 0.2s', cursor: 'pointer',
                    border: `1.5px solid ${active ? 'rgba(245,158,11,0.35)' : 'rgba(255,255,255,0.06)'}`,
                    background: active ? 'rgba(245,158,11,0.12)' : 'rgba(255,255,255,0.03)',
                    color: active ? '#f59e0b' : '#94a3b8',
                  }}>
                  {s}
                </button>
              );
            })}
          </div>
        </div>

        <button onClick={handleGenerate} disabled={loading} className="btn-primary"
          style={{ marginTop: 32, display: 'flex', alignItems: 'center', gap: 10, padding: '14px 28px', fontSize: 15 }}>
          {loading ? 'Analyzing...' : <><Sparkles style={{ width: 18, height: 18 }} /> Get AI Recommendation</>}
        </button>
      </div>

      {/* Results */}
      <AnimatePresence>
        {result && (
          <motion.div style={{ display: 'flex', flexDirection: 'column', gap: 24 }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            {/* Result Header */}
            <div className="glass-card" style={{ padding: 32, background: 'linear-gradient(135deg, rgba(245,158,11,0.04), rgba(168,85,247,0.04))' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(245,158,11,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Sparkles style={{ width: 20, height: 20, color: '#f59e0b' }} />
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 600, color: 'white', fontFamily: 'Outfit, sans-serif' }}>AI Recommendation Result</h3>
              </div>
              <p style={{ fontSize: 15, color: '#94a3b8', lineHeight: 1.7, marginLeft: 52 }}>{result.notes}</p>
            </div>

            {/* Recommended + Avoid columns */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
              {/* Recommended Foods */}
              <div className="glass-card" style={{ padding: 28 }}>
                <h4 style={{ fontSize: 16, fontWeight: 600, color: 'white', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10, fontFamily: 'Outfit, sans-serif' }}>
                  <CheckCircle style={{ width: 20, height: 20, color: '#4ade80' }} /> Recommended Foods
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {result.recommended?.map((food: string, i: number) => (
                    <motion.div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 16px', borderRadius: 12, background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.12)' }}
                      initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#4ade80', flexShrink: 0 }} />
                      <span style={{ fontSize: 14, color: '#e2e8f0' }}>{food}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Foods to Avoid */}
              <div className="glass-card" style={{ padding: 28 }}>
                <h4 style={{ fontSize: 16, fontWeight: 600, color: 'white', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10, fontFamily: 'Outfit, sans-serif' }}>
                  <XCircle style={{ width: 20, height: 20, color: '#f87171' }} /> Foods to Avoid
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {result.avoid?.map((food: string, i: number) => (
                    <motion.div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 16px', borderRadius: 12, background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.12)' }}
                      initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#f87171', flexShrink: 0 }} />
                      <span style={{ fontSize: 14, color: '#e2e8f0' }}>{food}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sample Meal Plan */}
            {result.mealPlan && (
              <div className="glass-card" style={{ padding: 32 }}>
                <h4 style={{ fontSize: 16, fontWeight: 600, color: 'white', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 10, fontFamily: 'Outfit, sans-serif' }}>
                  <Utensils style={{ width: 20, height: 20, color: '#f59e0b' }} /> Sample Meal Plan
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                  {[
                    { title: '🌅 Breakfast', content: result.mealPlan.breakfast, color: '#f59e0b' },
                    { title: '☀️ Lunch', content: result.mealPlan.lunch, color: '#22c55e' },
                    { title: '🌙 Dinner', content: result.mealPlan.dinner, color: '#8b5cf6' },
                    { title: '🍎 Snacks', content: result.mealPlan.snacks, color: '#ef4444' },
                  ].map((meal, i) => (
                    <motion.div key={i} style={{ padding: 20, borderRadius: 14, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.1 }}>
                      <h5 style={{ fontSize: 15, fontWeight: 600, color: 'white', marginBottom: 10 }}>{meal.title}</h5>
                      <p style={{ fontSize: 14, color: '#94a3b8', lineHeight: 1.7 }}>{meal.content}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
