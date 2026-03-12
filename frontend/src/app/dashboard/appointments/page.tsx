'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarDays, Plus, Trash2, Edit2, X, Clock, CheckCircle, XCircle } from 'lucide-react';
import { appointmentsAPI, patientsAPI } from '@/lib/api';

const statusColors: Record<string, { bg: string; text: string }> = {
  Scheduled: { bg: 'rgba(59,130,246,0.1)', text: '#3b82f6' },
  Completed: { bg: 'rgba(34,197,94,0.1)', text: '#22c55e' },
  Cancelled: { bg: 'rgba(239,68,68,0.1)', text: '#ef4444' },
};

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ patientId: '', date: '', time: '', notes: '', status: 'Scheduled' });

  const fetchData = async () => {
    try {
      const [aRes, pRes] = await Promise.all([appointmentsAPI.getAll(), patientsAPI.getAll()]);
      setAppointments(aRes.data);
      setPatients(pRes.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editId) await appointmentsAPI.update(editId, form);
      else await appointmentsAPI.create(form);
      setShowModal(false);
      setEditId(null);
      setForm({ patientId: '', date: '', time: '', notes: '', status: 'Scheduled' });
      fetchData();
    } catch (err) { console.error(err); }
  };

  const handleEdit = (a: any) => {
    setEditId(a._id);
    setForm({ patientId: a.patientId?._id || '', date: a.date, time: a.time, notes: a.notes || '', status: a.status });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this appointment?')) return;
    try { await appointmentsAPI.delete(id); fetchData(); } catch (err) { console.error(err); }
  };

  const upcoming = appointments.filter(a => a.status === 'Scheduled');
  const completed = appointments.filter(a => a.status === 'Completed');

  if (loading) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 256 }}><div style={{ width: 32, height: 32, border: '2px solid #f59e0b', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} /></div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: 'white', fontFamily: 'Outfit, sans-serif' }}>Appointment Scheduler</h1>
          <p style={{ fontSize: 14, color: '#94a3b8', marginTop: 6 }}>{upcoming.length} upcoming · {completed.length} completed</p>
        </div>
        <button onClick={() => { setEditId(null); setForm({ patientId: '', date: '', time: '', notes: '', status: 'Scheduled' }); setShowModal(true); }}
          className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Plus style={{ width: 16, height: 16 }} /> Schedule Appointment
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
        {[
          { label: 'Scheduled', count: upcoming.length, icon: Clock, color: '#3b82f6' },
          { label: 'Completed', count: completed.length, icon: CheckCircle, color: '#22c55e' },
          { label: 'Cancelled', count: appointments.filter(a => a.status === 'Cancelled').length, icon: XCircle, color: '#ef4444' },
        ].map((s, i) => (
          <div key={i} className="glass-card" style={{ padding: 24, display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', background: `${s.color}18` }}>
              <s.icon style={{ width: 22, height: 22, color: s.color }} />
            </div>
            <div>
              <p style={{ fontSize: 24, fontWeight: 700, color: 'white' }}>{s.count}</p>
              <p style={{ fontSize: 13, color: '#94a3b8' }}>{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Appointments List */}
      <div className="glass-card overflow-hidden">
        <table className="data-table">
          <thead>
            <tr>
              <th>Patient</th>
              <th>Date</th>
              <th>Time</th>
              <th>Status</th>
              <th>Notes</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((a, i) => {
              const sc = statusColors[a.status] || statusColors.Scheduled;
              return (
                <motion.tr key={a._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}>
                  <td className="text-white font-medium">{a.patientId?.name || 'N/A'}</td>
                  <td className="text-gray-300">{a.date}</td>
                  <td className="text-gray-300">{a.time}</td>
                  <td>
                    <span className="inline-flex px-2.5 py-1 rounded-md text-xs font-medium" style={{ background: sc.bg, color: sc.text }}>
                      {a.status}
                    </span>
                  </td>
                  <td className="text-gray-400 text-xs max-w-[200px] truncate">{a.notes || '—'}</td>
                  <td>
                    <div className="flex gap-1">
                      <button onClick={() => handleEdit(a)} className="p-1.5 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white"><Edit2 className="w-3.5 h-3.5" /></button>
                      <button onClick={() => handleDelete(a._id)} className="p-1.5 rounded-lg hover:bg-red-500/10 text-gray-400 hover:text-red-400"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
        {appointments.length === 0 && <div className="p-12 text-center text-gray-400">No appointments scheduled</div>}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div className="modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="glass-card" style={{ padding: 28, width: '100%', maxWidth: 480, margin: '0 16px', background: '#1f1035' }}
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white font-['Outfit']">{editId ? 'Edit' : 'Schedule'} Appointment</h2>
                <button onClick={() => setShowModal(false)} className="p-2 rounded-lg hover:bg-white/5"><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Patient *</label>
                  <select required className="input-field" value={form.patientId} onChange={e => setForm({...form, patientId: e.target.value})}>
                    <option value="">Select patient...</option>
                    {patients.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Date *</label>
                    <input required type="date" className="input-field" value={form.date} onChange={e => setForm({...form, date: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Time *</label>
                    <input required type="time" className="input-field" value={form.time} onChange={e => setForm({...form, time: e.target.value})} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Status</label>
                  <select className="input-field" value={form.status} onChange={e => setForm({...form, status: e.target.value})}>
                    <option>Scheduled</option><option>Completed</option><option>Cancelled</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">Notes</label>
                  <textarea className="input-field" rows={3} value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} placeholder="Appointment notes..." />
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setShowModal(false)} className="btn-secondary flex-1">Cancel</button>
                  <button type="submit" className="btn-primary flex-1">{editId ? 'Update' : 'Schedule'}</button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
