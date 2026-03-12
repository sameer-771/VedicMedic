'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Edit2, Trash2, X, User } from 'lucide-react';
import { patientsAPI } from '@/lib/api';

const doshaColors: Record<string, string> = {
  Vata: '#3b82f6', Pitta: '#ef4444', Kapha: '#22c55e',
  'Vata-Pitta': '#8b5cf6', 'Pitta-Kapha': '#f59e0b', 'Vata-Kapha': '#06b6d4', Tridosha: '#d4a853'
};
const doshaOptions = ['Vata', 'Pitta', 'Kapha', 'Vata-Pitta', 'Pitta-Kapha', 'Vata-Kapha', 'Tridosha'];

const emptyForm = { name: '', age: '', gender: 'Male', weight: '', height: '', doshaType: 'Vata', medicalConditions: '', allergies: '', dietRestrictions: '', phone: '', email: '' };

export default function PatientsPage() {
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const fetchPatients = async () => {
    try { const { data } = await patientsAPI.getAll(); setPatients(data); }
    catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchPatients(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...form,
      age: Number(form.age),
      weight: Number(form.weight),
      height: Number(form.height),
      medicalConditions: form.medicalConditions ? form.medicalConditions.split(',').map(s => s.trim()) : [],
      allergies: form.allergies ? form.allergies.split(',').map(s => s.trim()) : [],
      dietRestrictions: form.dietRestrictions ? form.dietRestrictions.split(',').map(s => s.trim()) : [],
    };
    try {
      if (editId) await patientsAPI.update(editId, payload);
      else await patientsAPI.create(payload);
      setShowModal(false);
      setEditId(null);
      setForm(emptyForm);
      fetchPatients();
    } catch (err) { console.error(err); }
  };

  const handleEdit = (p: any) => {
    setEditId(p._id);
    setForm({
      name: p.name, age: String(p.age), gender: p.gender, weight: String(p.weight), height: String(p.height),
      doshaType: p.doshaType, medicalConditions: (p.medicalConditions || []).join(', '),
      allergies: (p.allergies || []).join(', '), dietRestrictions: (p.dietRestrictions || []).join(', '),
      phone: p.phone || '', email: p.email || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this patient?')) return;
    try { await patientsAPI.delete(id); fetchPatients(); } catch (err) { console.error(err); }
  };

  const filtered = patients.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.doshaType.toLowerCase().includes(search.toLowerCase()));

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white font-['Outfit']">Patient Records</h1>
          <p className="text-sm text-gray-400 mt-1">{patients.length} patients registered</p>
        </div>
        <button onClick={() => { setEditId(null); setForm(emptyForm); setShowModal(true); }} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Patient
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        <input className="input-field pl-10" placeholder="Search patients by name or dosha..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {/* Patients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((p, i) => {
          const dColor = doshaColors[p.doshaType?.split('-')[0]] || '#d4a853';
          return (
            <motion.div key={p._id} className="glass-card glass-card-hover p-5 transition-all duration-300"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold"
                    style={{ background: `${dColor}15`, color: dColor }}>
                    {p.name?.[0]}
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">{p.name}</h3>
                    <p className="text-xs text-gray-500">{p.gender} · {p.age} years</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => handleEdit(p)} className="p-1.5 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white"><Edit2 className="w-3.5 h-3.5" /></button>
                  <button onClick={() => handleDelete(p._id)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-gray-400 hover:text-red-400"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
              <div className="inline-flex px-2.5 py-1 rounded-md text-xs font-medium mb-3"
                style={{ background: `${dColor}15`, color: dColor, border: `1px solid ${dColor}30` }}>
                {p.doshaType}
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="text-gray-400">Weight: <span className="text-gray-200">{p.weight} kg</span></div>
                <div className="text-gray-400">Height: <span className="text-gray-200">{p.height} cm</span></div>
              </div>
              {p.medicalConditions?.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1">
                  {p.medicalConditions.slice(0, 3).map((c: string, j: number) => (
                    <span key={j} className="px-2 py-0.5 rounded text-xs bg-white/5 text-gray-400">{c}</span>
                  ))}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
      {filtered.length === 0 && <div className="glass-card p-12 text-center"><User className="w-12 h-12 text-gray-600 mx-auto mb-3" /><p className="text-gray-400">No patients found</p></div>}

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="glass-card p-6 w-full max-w-lg mx-4 max-h-[85vh] overflow-y-auto"
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              style={{ background: '#1f1035' }}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white font-['Outfit']">{editId ? 'Edit Patient' : 'Add New Patient'}</h2>
                <button onClick={() => setShowModal(false)} className="p-2 rounded-lg hover:bg-white/5"><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Full Name *</label>
                    <input required className="input-field" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Age *</label>
                    <input required type="number" className="input-field" value={form.age} onChange={e => setForm({...form, age: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Gender *</label>
                    <select className="input-field" value={form.gender} onChange={e => setForm({...form, gender: e.target.value})}>
                      <option>Male</option><option>Female</option><option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Weight (kg) *</label>
                    <input required type="number" className="input-field" value={form.weight} onChange={e => setForm({...form, weight: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Height (cm) *</label>
                    <input required type="number" className="input-field" value={form.height} onChange={e => setForm({...form, height: e.target.value})} />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Dosha Type *</label>
                    <select className="input-field" value={form.doshaType} onChange={e => setForm({...form, doshaType: e.target.value})}>
                      {doshaOptions.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Medical Conditions</label>
                    <input className="input-field" placeholder="Comma separated" value={form.medicalConditions} onChange={e => setForm({...form, medicalConditions: e.target.value})} />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Allergies</label>
                    <input className="input-field" placeholder="Comma separated" value={form.allergies} onChange={e => setForm({...form, allergies: e.target.value})} />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Diet Restrictions</label>
                    <input className="input-field" placeholder="Comma separated" value={form.dietRestrictions} onChange={e => setForm({...form, dietRestrictions: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Phone</label>
                    <input className="input-field" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Email</label>
                    <input type="email" className="input-field" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1">Cancel</button>
                  <button type="submit" className="btn-primary flex-1">{editId ? 'Update' : 'Add'} Patient</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
