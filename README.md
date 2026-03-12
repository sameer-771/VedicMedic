# 🌿 VedicMedic – Ayurvedic Diet & Practice Management Platform

> A cloud-based healthcare platform for Ayurvedic dietitians to manage patients, generate personalized diet plans, track nutritional intake, and schedule appointments.

Built during a hackathon using AI-assisted development.

---

## ✨ Features

- **Patient Management** – CRUD operations with Dosha profiling, medical history & allergies
- **Ayurvedic Diet Plan Builder** – Generate personalized diet plans based on Dosha type & season
- **Nutrient Analytics Dashboard** – Pie charts, weekly trend lines, and daily intake progress bars
- **Dosha Balance Meter** – Animated circular visualizations for Vata, Pitta & Kapha
- **AI Diet Recommendations** – Smart diet suggestions based on Dosha, symptoms & season
- **Appointment Scheduler** – Schedule, track & manage follow-up appointments
- **Ayurvedic Food Database** – Searchable food intelligence with Ayurvedic classifications
- **Seasonal Diet Recommendations** – Summer, Winter & Monsoon diet adaptations

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js, React, TypeScript, Tailwind CSS |
| **Animations** | Framer Motion |
| **Charts** | Recharts |
| **Icons** | Lucide React |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB, Mongoose |
| **Auth** | JWT (JSON Web Tokens) |
| **AI** | Mock AI Engine (Ayurvedic rules-based) |

---

## 📁 Project Structure

```
VedicMedic/
├── backend/
│   ├── controllers/     # API business logic
│   ├── models/          # Mongoose schemas
│   ├── routes/          # Express routes
│   ├── services/        # Diet generation service
│   ├── middleware/       # JWT auth middleware
│   ├── server.js        # Express entry point
│   └── seed.js          # Sample data seeder
├── frontend/
│   └── src/
│       ├── app/         # Next.js App Router pages
│       │   ├── dashboard/
│       │   │   ├── patients/
│       │   │   ├── diet/
│       │   │   ├── nutrition/
│       │   │   ├── appointments/
│       │   │   ├── foods/
│       │   │   └── ai/
│       │   ├── login/
│       │   └── register/
│       └── lib/         # API & auth utilities
└── README.md
```

---

## 🚀 Setup Instructions

### Prerequisites
- **Node.js** 18+
- **MongoDB** running locally (default: `mongodb://localhost:27017`)

### 1. Clone the Repository
```bash
git clone https://github.com/sameer-771/VedicMedic.git
cd VedicMedic
```

### 2. Backend Setup
```bash
cd backend
npm install
npm run seed    # Seeds the database with sample data
npm start       # Starts API on http://localhost:5000
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev     # Starts Next.js on http://localhost:3000
```

### 4. Demo Login
```
Email:    demo@vedicmedic.com
Password: demo123
```

---

## 🎯 Demo Flow

1. **Login** with demo credentials
2. **Dashboard** – View stats, dosha distribution, upcoming appointments
3. **Patients** – Browse, add, edit patient profiles with Dosha types
4. **Diet Plans** – Select patient & season → Generate Ayurvedic diet plan
5. **Nutrition** – Analyze macronutrients with pie/line/bar charts
6. **Appointments** – Schedule & manage follow-up visits
7. **Food Database** – Explore Ayurvedic food classifications
8. **AI Recommend** – Get AI-powered diet recommendations

---

## 🎨 Design Highlights

- **Dark theme** with glassmorphism effects
- **Gold gradient** accents inspired by Ayurvedic aesthetics
- **Dosha color-coding**: Vata (blue), Pitta (red), Kapha (green)
- **Framer Motion** animations throughout
- **Responsive** design for all screen sizes
- **Premium card-based** layout with soft shadows

---

## 📝 License

MIT License

---

*Built with ❤️ during a hackathon using AI-assisted development.*
