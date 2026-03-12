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

  if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 256 }}><div style={{ width: 32, height: 32, border: '2px solid #f59e0b', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} /></div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: 'white', fontFamily: 'Outfit, sans-serif' }}>Patient Records</h1>
          <p style={{ fontSize: 14, color: '#94a3b8', marginTop: 6 }}>{patients.length} patients registered</p>
        </div>
        <button onClick={() => { setEditId(null); setForm(emptyForm); setShowModal(true); }} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Plus style={{ width: 16, height: 16 }} /> Add Patient
        </button>
      </div>

      {/* Search */}
      <div className="input-icon-wrapper" style={{ maxWidth: 480 }}>
        <Search className="input-icon" />
        <input className="input-field" placeholder="Search patients by name or dosha..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {/* Patients Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
        {filtered.map((p, i) => {
          const dColor = doshaColors[p.doshaType?.split('-')[0]] || '#d4a853';
          return (
            <motion.div key={p._id} className="glass-card glass-card-hover" style={{ padding: 24, transition: 'all 0.3s' }}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 700, background: `${dColor}18`, color: dColor }}>
                    {p.name?.[0]}
                  </div>
                  <div>
                    <h3 style={{ fontSize: 15, fontWeight: 600, color: 'white' }}>{p.name}</h3>
                    <p style={{ fontSize: 13, color: '#6b7280' }}>{p.gender} · {p.age} years</p>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 4 }}>
                  <button onClick={() => handleEdit(p)} style={{ padding: 8, borderRadius: 8, background: 'transparent', border: 'none', color: '#9ca3af', cursor: 'pointer' }}><Edit2 style={{ width: 16, height: 16 }} /></button>
                  <button onClick={() => handleDelete(p._id)} style={{ padding: 8, borderRadius: 8, background: 'transparent', border: 'none', color: '#9ca3af', cursor: 'pointer' }}><Trash2 style={{ width: 16, height: 16 }} /></button>
                </div>
              </div>
              <div style={{ display: 'inline-flex', padding: '5px 12px', borderRadius: 8, fontSize: 13, fontWeight: 500, marginBottom: 16, background: `${dColor}15`, color: dColor, border: `1px solid ${dColor}30` }}>
                {p.doshaType}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 13 }}>
                <div style={{ color: '#94a3b8' }}>Weight: <span style={{ color: '#e2e8f0' }}>{p.weight} kg</span></div>
                <div style={{ color: '#94a3b8' }}>Height: <span style={{ color: '#e2e8f0' }}>{p.height} cm</span></div>
              </div>
              {p.medicalConditions?.length > 0 && (
                <div style={{ marginTop: 14, display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {p.medicalConditions.slice(0, 3).map((c: string, j: number) => (
                    <span key={j} style={{ padding: '3px 10px', borderRadius: 6, fontSize: 12, background: 'rgba(255,255,255,0.05)', color: '#94a3b8' }}>{c}</span>
                  ))}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
      {filtered.length === 0 && <div className="glass-card" style={{ padding: 48, textAlign: 'center' }}><User style={{ width: 48, height: 48, color: '#4b5563', margin: '0 auto 12px' }} /><p style={{ color: '#94a3b8' }}>No patients found</p></div>}

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="glass-card" style={{ padding: 28, width: '100%', maxWidth: 540, margin: '0 16px', maxHeight: '85vh', overflowY: 'auto', background: '#1f1035' }}
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white font-['Outfit']">{editId ? 'Edit Patient' : 'Add New Patient'}</h2>
                <button onClick={() => setShowModal(false)} className="p-2 rounded-lg hover:bg-white/5"><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
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
