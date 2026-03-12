'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Utensils, ChefHat, Leaf, Sun, Snowflake, CloudRain, Sparkles } from 'lucide-react';
import { patientsAPI, dietAPI } from '@/lib/api';

const seasonIcons: Record<string, any> = { Summer: Sun, Winter: Snowflake, Monsoon: CloudRain };

export default function DietPage() {
  const [patients, setPatients] = useState<any[]>([]);
  const [selectedPatient, setSelectedPatient] = useState('');
  const [season, setSeason] = useState('All');
  const [dietPlan, setDietPlan] = useState<any>(null);
  const [allPlans, setAllPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const [pRes, dRes] = await Promise.all([patientsAPI.getAll(), dietAPI.getAll()]);
        setPatients(pRes.data);
        setAllPlans(dRes.data);
      } catch (err) { console.error(err); }
    };
    fetch();
  }, []);

  const handleGenerate = async () => {
    if (!selectedPatient) return;
    setGenerating(true);
    try {
      const { data } = await dietAPI.generate({ patientId: selectedPatient, season: season === 'All' ? undefined : season });
      setDietPlan(data);
      const dRes = await dietAPI.getAll();
      setAllPlans(dRes.data);
    } catch (err) { console.error(err); }
    finally { setGenerating(false); }
  };

  const mealSections = dietPlan ? [
    { title: 'Breakfast', icon: '🌅', items: dietPlan.breakfast, color: '#f59e0b' },
    { title: 'Lunch', icon: '☀️', items: dietPlan.lunch, color: '#22c55e' },
    { title: 'Dinner', icon: '🌙', items: dietPlan.dinner, color: '#8b5cf6' },
    { title: 'Snacks', icon: '🍎', items: dietPlan.snacks, color: '#ef4444' },
  ] : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white font-['Outfit']">Ayurvedic Diet Plan Builder</h1>
        <p className="text-sm text-gray-400 mt-1">Generate personalized diet plans based on Dosha type and season</p>
      </div>

      {/* Generator */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-white font-['Outfit'] mb-4 flex items-center gap-2">
          <ChefHat className="w-5 h-5 text-amber-400" /> Generate Diet Plan
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Select Patient</label>
            <select className="input-field" value={selectedPatient} onChange={e => setSelectedPatient(e.target.value)}>
              <option value="">Choose patient...</option>
              {patients.map(p => <option key={p._id} value={p._id}>{p.name} ({p.doshaType})</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Season</label>
            <select className="input-field" value={season} onChange={e => setSeason(e.target.value)}>
              <option value="All">All Seasons</option>
              <option value="Summer">Summer ☀️</option>
              <option value="Winter">Winter ❄️</option>
              <option value="Monsoon">Monsoon 🌧️</option>
            </select>
          </div>
          <div className="flex items-end">
            <button onClick={handleGenerate} disabled={!selectedPatient || generating} className="btn-primary w-full flex items-center justify-center gap-2">
              {generating ? 'Generating...' : <><Sparkles className="w-4 h-4" /> Generate Plan</>}
            </button>
          </div>
        </div>
      </div>

      {/* Diet Plan Display */}
      {dietPlan && (
        <motion.div className="space-y-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Summary */}
          <div className="glass-card p-6 bg-gradient-to-r from-amber-500/5 to-green-500/5">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <div>
                <h3 className="text-lg font-semibold text-white font-['Outfit']">Diet Plan Generated</h3>
                <p className="text-sm text-gray-400 mt-1">{dietPlan.notes}</p>
              </div>
              <div className="flex gap-3 text-center">
                {[
                  { label: 'Calories', value: dietPlan.totalNutrients?.calories, color: '#f59e0b' },
                  { label: 'Protein', value: `${dietPlan.totalNutrients?.protein}g`, color: '#3b82f6' },
                  { label: 'Fiber', value: `${dietPlan.totalNutrients?.fiber}g`, color: '#22c55e' },
                ].map((n, i) => (
                  <div key={i} className="px-4 py-2 rounded-xl" style={{ background: `${n.color}10` }}>
                    <p className="text-lg font-bold" style={{ color: n.color }}>{n.value}</p>
                    <p className="text-xs text-gray-400">{n.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Meals */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mealSections.map((meal, i) => (
              <motion.div key={i} className="meal-card" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                <h4 className="text-base font-semibold text-white mb-3 flex items-center gap-2">
                  <span className="text-lg">{meal.icon}</span> {meal.title}
                </h4>
                <div className="space-y-3">
                  {meal.items?.map((item: any, j: number) => (
                    <div key={j} className="p-3 rounded-lg bg-white/3 border border-white/5">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-medium text-white">{item.name}</p>
                        <span className="text-xs px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 whitespace-nowrap">{item.calories} cal</span>
                      </div>
                      <div className="flex flex-wrap gap-3 mt-2 text-xs text-gray-400">
                        <span>P: {item.protein}g</span>
                        <span>F: {item.fiber}g</span>
                        <span>C: {item.carbs}g</span>
                        <span>Fat: {item.fat}g</span>
                      </div>
                      <p className="text-xs mt-1.5 text-gray-500">{item.ayurvedicClassification} · {item.doshaCompatibility}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Recent Plans */}
      {allPlans.length > 0 && (
        <div className="glass-card p-6">
          <h3 className="text-lg font-semibold text-white font-['Outfit'] mb-4 flex items-center gap-2">
            <Utensils className="w-5 h-5 text-green-400" /> Recent Diet Plans
          </h3>
          <div className="space-y-2">
            {allPlans.slice(0, 5).map((plan, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg hover:bg-white/3 transition-colors cursor-pointer"
                onClick={() => setDietPlan(plan)}>
                <div className="flex items-center gap-3">
                  <Leaf className="w-4 h-4 text-green-400" />
                  <div>
                    <p className="text-sm font-medium text-white">{plan.patientId?.name || 'Patient'}</p>
                    <p className="text-xs text-gray-500">{plan.doshaType} · {plan.season} · {new Date(plan.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <span className="text-xs text-amber-400">{plan.totalNutrients?.calories} cal</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
