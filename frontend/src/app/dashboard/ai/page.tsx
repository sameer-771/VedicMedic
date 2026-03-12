'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Sparkles, Sun, Snowflake, CloudRain, CheckCircle, XCircle, Utensils } from 'lucide-react';
import { aiAPI } from '@/lib/api';

const doshaOptions = ['Vata', 'Pitta', 'Kapha', 'Vata-Pitta', 'Pitta-Kapha', 'Vata-Kapha'];
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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white font-['Outfit']">AI Diet Recommendation</h1>
        <p className="text-sm text-gray-400 mt-1">Get intelligent Ayurvedic diet recommendations powered by AI</p>
      </div>

      {/* Input Form */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-white font-['Outfit'] mb-4 flex items-center gap-2">
          <Brain className="w-5 h-5 text-amber-400" /> Configure Recommendation
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Dosha Type */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">Dosha Type</label>
            <div className="grid grid-cols-3 gap-2">
              {doshaOptions.map(d => {
                const colors: Record<string, string> = { Vata: '#3b82f6', Pitta: '#ef4444', Kapha: '#22c55e', 'Vata-Pitta': '#8b5cf6', 'Pitta-Kapha': '#f59e0b', 'Vata-Kapha': '#06b6d4' };
                const c = colors[d] || '#d4a853';
                return (
                  <button key={d} onClick={() => setDoshaType(d)}
                    className={`p-2.5 rounded-xl text-xs font-medium transition-all border ${doshaType === d ? '' : 'bg-white/3 text-gray-400 border-white/5 hover:bg-white/5'}`}
                    style={doshaType === d ? { background: `${c}15`, color: c, borderColor: `${c}40` } : {}}>
                    {d}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Season */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">Season</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { name: 'Summer', icon: Sun, color: '#f59e0b' },
                { name: 'Winter', icon: Snowflake, color: '#3b82f6' },
                { name: 'Monsoon', icon: CloudRain, color: '#22c55e' },
              ].map(s => (
                <button key={s.name} onClick={() => setSeason(s.name)}
                  className={`p-3 rounded-xl text-xs font-medium transition-all border flex flex-col items-center gap-1.5 ${season === s.name ? '' : 'bg-white/3 text-gray-400 border-white/5 hover:bg-white/5'}`}
                  style={season === s.name ? { background: `${s.color}15`, color: s.color, borderColor: `${s.color}40` } : {}}>
                  <s.icon className="w-5 h-5" />
                  {s.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Symptoms */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-300 mb-3">Symptoms (Optional)</label>
          <div className="flex flex-wrap gap-2">
            {symptomOptions.map(s => (
              <button key={s} onClick={() => toggleSymptom(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${selectedSymptoms.includes(s) ? 'bg-amber-500/15 text-amber-400 border-amber-500/30' : 'bg-white/3 text-gray-400 border-white/5 hover:bg-white/5'}`}>
                {s}
              </button>
            ))}
          </div>
        </div>

        <button onClick={handleGenerate} disabled={loading} className="btn-primary mt-6 flex items-center gap-2">
          {loading ? 'Analyzing...' : <><Sparkles className="w-4 h-4" /> Get AI Recommendation</>}
        </button>
      </div>

      {/* Results */}
      <AnimatePresence>
        {result && (
          <motion.div className="space-y-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            {/* Header */}
            <div className="glass-card p-6 bg-gradient-to-r from-amber-500/5 to-purple-500/5">
              <h3 className="text-lg font-semibold text-white font-['Outfit'] mb-2 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-400" /> AI Recommendation Result
              </h3>
              <p className="text-sm text-gray-400">{result.notes}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Recommended Foods */}
              <div className="glass-card p-6">
                <h4 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-400" /> Recommended Foods
                </h4>
                <div className="space-y-2">
                  {result.recommended?.map((food: string, i: number) => (
                    <motion.div key={i} className="flex items-center gap-3 p-2.5 rounded-lg bg-green-500/5 border border-green-500/10"
                      initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                      <div className="w-2 h-2 rounded-full bg-green-400" />
                      <span className="text-sm text-gray-200">{food}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Foods to Avoid */}
              <div className="glass-card p-6">
                <h4 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
                  <XCircle className="w-5 h-5 text-red-400" /> Foods to Avoid
                </h4>
                <div className="space-y-2">
                  {result.avoid?.map((food: string, i: number) => (
                    <motion.div key={i} className="flex items-center gap-3 p-2.5 rounded-lg bg-red-500/5 border border-red-500/10"
                      initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                      <div className="w-2 h-2 rounded-full bg-red-400" />
                      <span className="text-sm text-gray-200">{food}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sample Meal Plan */}
            {result.mealPlan && (
              <div className="glass-card p-6">
                <h4 className="text-base font-semibold text-white mb-4 flex items-center gap-2">
                  <Utensils className="w-5 h-5 text-amber-400" /> Sample Meal Plan
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { title: '🌅 Breakfast', content: result.mealPlan.breakfast },
                    { title: '☀️ Lunch', content: result.mealPlan.lunch },
                    { title: '🌙 Dinner', content: result.mealPlan.dinner },
                    { title: '🍎 Snacks', content: result.mealPlan.snacks },
                  ].map((meal, i) => (
                    <motion.div key={i} className="p-4 rounded-xl bg-white/3 border border-white/5"
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.1 }}>
                      <h5 className="text-sm font-medium text-white mb-2">{meal.title}</h5>
                      <p className="text-xs text-gray-400 leading-relaxed">{meal.content}</p>
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
