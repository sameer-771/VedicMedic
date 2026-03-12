import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('vedicmedic_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('vedicmedic_token');
      localStorage.removeItem('vedicmedic_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth
export const authAPI = {
  login: (data: { email: string; password: string }) => api.post('/auth/login', data),
  register: (data: { name: string; email: string; password: string; role?: string }) => api.post('/auth/register', data),
  getProfile: () => api.get('/auth/profile'),
};

// Patients
export const patientsAPI = {
  getAll: () => api.get('/patients'),
  getById: (id: string) => api.get(`/patients/${id}`),
  create: (data: any) => api.post('/patients', data),
  update: (id: string, data: any) => api.put(`/patients/${id}`, data),
  delete: (id: string) => api.delete(`/patients/${id}`),
};

// Diet Plans
export const dietAPI = {
  generate: (data: { patientId: string; season?: string }) => api.post('/diet/generate', data),
  getByPatient: (patientId: string) => api.get(`/diet/${patientId}`),
  getAll: () => api.get('/diet/all'),
};

// Appointments
export const appointmentsAPI = {
  getAll: () => api.get('/appointments'),
  create: (data: any) => api.post('/appointments', data),
  update: (id: string, data: any) => api.put(`/appointments/${id}`, data),
  delete: (id: string) => api.delete(`/appointments/${id}`),
};

// Foods
export const foodsAPI = {
  getAll: (params?: { search?: string; dosha?: string; effect?: string }) => api.get('/foods', { params }),
  create: (data: any) => api.post('/foods', data),
};

// AI
export const aiAPI = {
  getRecommendation: (data: { doshaType: string; symptoms?: string[]; season?: string }) =>
    api.post('/ai/diet-recommendation', data),
};

export default api;
