require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { MongoMemoryServer } = require('mongodb-memory-server');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/patients', require('./routes/patients'));
app.use('/api/diet', require('./routes/dietPlans'));
app.use('/api/appointments', require('./routes/appointments'));
app.use('/api/foods', require('./routes/foods'));
app.use('/api/ai', require('./routes/ai'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'VedicMedic API is running', timestamp: new Date().toISOString() });
});

// Seed function
async function seedDatabase() {
  const User = require('./models/User');
  const Patient = require('./models/Patient');
  const DietPlan = require('./models/DietPlan');
  const Appointment = require('./models/Appointment');
  const FoodDatabase = require('./models/FoodDatabase');
  const { generateDietPlan } = require('./services/dietService');

  const existing = await User.countDocuments();
  if (existing > 0) return console.log('📦 Database already seeded');

  const foods = [
    { foodName: 'Ginger', category: 'Spice', nutritionalValues: { calories: 80, protein: 1.8, fiber: 2, carbs: 18, fat: 0.8 }, ayurvedicEffect: 'Heating', doshaImpact: 'Reduces Vata & Kapha', taste: 'Pungent', season: ['Winter', 'Monsoon'], description: 'A warming spice that aids digestion and reduces Vata.' },
    { foodName: 'Cucumber', category: 'Vegetable', nutritionalValues: { calories: 16, protein: 0.7, fiber: 0.5, carbs: 3.6, fat: 0.1 }, ayurvedicEffect: 'Cooling', doshaImpact: 'Reduces Pitta', taste: 'Sweet', season: ['Summer'], description: 'A hydrating cooling vegetable ideal for Pitta dosha.' },
    { foodName: 'Turmeric', category: 'Spice', nutritionalValues: { calories: 312, protein: 9.7, fiber: 22.7, carbs: 67.1, fat: 3.3 }, ayurvedicEffect: 'Detoxifying', doshaImpact: 'Balances all Doshas', taste: 'Bitter & Astringent', season: ['All'], description: 'The golden spice with powerful anti-inflammatory and detoxifying properties.' },
    { foodName: 'Ghee', category: 'Fat', nutritionalValues: { calories: 900, protein: 0, fiber: 0, carbs: 0, fat: 100 }, ayurvedicEffect: 'Nourishing', doshaImpact: 'Balances Vata & Pitta', taste: 'Sweet', season: ['All'], description: 'Clarified butter that nourishes all tissues and aids digestion.' },
    { foodName: 'Mung Dal', category: 'Legume', nutritionalValues: { calories: 347, protein: 23.9, fiber: 16.3, carbs: 62.6, fat: 1.2 }, ayurvedicEffect: 'Balancing', doshaImpact: 'Balances all Doshas', taste: 'Sweet & Astringent', season: ['All'], description: 'The most easily digestible legume in Ayurveda, suitable for all doshas.' },
    { foodName: 'Ashwagandha', category: 'Herb', nutritionalValues: { calories: 245, protein: 3.9, fiber: 32.3, carbs: 49.9, fat: 0.3 }, ayurvedicEffect: 'Nourishing', doshaImpact: 'Reduces Vata & Kapha', taste: 'Bitter & Sweet', season: ['Winter'], description: 'A powerful adaptogenic herb for stress relief and vitality.' },
    { foodName: 'Cardamom', category: 'Spice', nutritionalValues: { calories: 311, protein: 10.8, fiber: 28, carbs: 68.5, fat: 6.7 }, ayurvedicEffect: 'Balancing', doshaImpact: 'Balances all Doshas', taste: 'Sweet & Pungent', season: ['All'], description: 'Queen of spices, excellent for digestion and respiratory health.' },
    { foodName: 'Coconut', category: 'Fruit', nutritionalValues: { calories: 354, protein: 3.3, fiber: 9, carbs: 15.2, fat: 33.5 }, ayurvedicEffect: 'Cooling', doshaImpact: 'Reduces Pitta & Vata', taste: 'Sweet', season: ['Summer'], description: 'A cooling, nourishing fruit ideal for Pitta pacification.' },
    { foodName: 'Black Pepper', category: 'Spice', nutritionalValues: { calories: 251, protein: 10.4, fiber: 25.3, carbs: 63.9, fat: 3.3 }, ayurvedicEffect: 'Heating', doshaImpact: 'Reduces Kapha & Vata', taste: 'Pungent', season: ['Winter', 'Monsoon'], description: 'A bioavailability enhancer and digestive stimulant.' },
    { foodName: 'Honey', category: 'Sweetener', nutritionalValues: { calories: 304, protein: 0.3, fiber: 0.2, carbs: 82.4, fat: 0 }, ayurvedicEffect: 'Detoxifying', doshaImpact: 'Reduces Kapha', taste: 'Sweet & Astringent', season: ['All'], description: 'A natural scraping agent that reduces Kapha when used correctly.' },
    { foodName: 'Basmati Rice', category: 'Grain', nutritionalValues: { calories: 360, protein: 7, fiber: 1.6, carbs: 78, fat: 0.6 }, ayurvedicEffect: 'Nourishing', doshaImpact: 'Balances Vata & Pitta', taste: 'Sweet', season: ['All'], description: 'A light, easily digestible grain that is sattvic in nature.' },
    { foodName: 'Fennel Seeds', category: 'Spice', nutritionalValues: { calories: 345, protein: 15.8, fiber: 39.8, carbs: 52.3, fat: 14.9 }, ayurvedicEffect: 'Cooling', doshaImpact: 'Balances all Doshas', taste: 'Sweet & Bitter', season: ['All'], description: 'A cooling digestive spice, excellent after meals.' },
    { foodName: 'Amla (Indian Gooseberry)', category: 'Fruit', nutritionalValues: { calories: 44, protein: 0.9, fiber: 4.3, carbs: 10.2, fat: 0.6 }, ayurvedicEffect: 'Balancing', doshaImpact: 'Balances all Doshas', taste: 'Sour, Sweet, Astringent', season: ['Winter'], description: 'The richest natural source of Vitamin C, balances all three doshas.' },
    { foodName: 'Sesame Seeds', category: 'Seed', nutritionalValues: { calories: 573, protein: 17.7, fiber: 11.8, carbs: 23.4, fat: 49.7 }, ayurvedicEffect: 'Heating', doshaImpact: 'Reduces Vata', taste: 'Sweet & Bitter', season: ['Winter'], description: 'Warming seeds that nourish bones and reduce Vata.' },
    { foodName: 'Cumin', category: 'Spice', nutritionalValues: { calories: 375, protein: 17.8, fiber: 10.5, carbs: 44.2, fat: 22.3 }, ayurvedicEffect: 'Heating', doshaImpact: 'Reduces Vata & Kapha', taste: 'Pungent & Bitter', season: ['All'], description: 'A digestive powerhouse, commonly used in Ayurvedic cooking.' },
    { foodName: 'Pomegranate', category: 'Fruit', nutritionalValues: { calories: 83, protein: 1.7, fiber: 4, carbs: 18.7, fat: 1.2 }, ayurvedicEffect: 'Cooling', doshaImpact: 'Balances Pitta & Vata', taste: 'Sweet & Astringent', season: ['Summer', 'Winter'], description: 'A blood-building, heart-healthy fruit with cooling properties.' },
    { foodName: 'Coriander', category: 'Herb', nutritionalValues: { calories: 23, protein: 2.1, fiber: 2.8, carbs: 3.7, fat: 0.5 }, ayurvedicEffect: 'Cooling', doshaImpact: 'Reduces Pitta', taste: 'Astringent & Sweet', season: ['Summer'], description: 'A cooling herb that aids digestion and reduces Pitta.' },
    { foodName: 'Jaggery', category: 'Sweetener', nutritionalValues: { calories: 383, protein: 0.4, fiber: 0, carbs: 98, fat: 0.1 }, ayurvedicEffect: 'Nourishing', doshaImpact: 'Reduces Vata', taste: 'Sweet', season: ['Winter'], description: 'An unrefined sugar that is heating and nourishing, good for Vata.' },
    { foodName: 'Mint', category: 'Herb', nutritionalValues: { calories: 70, protein: 3.8, fiber: 8, carbs: 14.9, fat: 0.9 }, ayurvedicEffect: 'Cooling', doshaImpact: 'Reduces Pitta & Kapha', taste: 'Pungent', season: ['Summer'], description: 'A refreshing cooling herb that aids digestion.' },
    { foodName: 'Triphala', category: 'Herb', nutritionalValues: { calories: 150, protein: 2, fiber: 30, carbs: 45, fat: 1 }, ayurvedicEffect: 'Detoxifying', doshaImpact: 'Balances all Doshas', taste: 'All six tastes', season: ['All'], description: 'The most famous Ayurvedic formulation for digestive health and detoxification.' }
  ];

  const patients = [
    { name: 'Arjun Sharma', age: 35, gender: 'Male', weight: 72, height: 175, doshaType: 'Vata', medicalConditions: ['Joint pain', 'Insomnia'], allergies: ['Peanuts'], dietRestrictions: ['No gluten'], phone: '+91-9876543210', email: 'arjun@example.com' },
    { name: 'Priya Patel', age: 28, gender: 'Female', weight: 58, height: 162, doshaType: 'Pitta', medicalConditions: ['Acid reflux', 'Skin inflammation'], allergies: [], dietRestrictions: ['Vegetarian'], phone: '+91-9876543211', email: 'priya@example.com' },
    { name: 'Rohan Gupta', age: 42, gender: 'Male', weight: 88, height: 180, doshaType: 'Kapha', medicalConditions: ['Obesity', 'Diabetes Type 2'], allergies: ['Dairy'], dietRestrictions: ['Low sugar'], phone: '+91-9876543212', email: 'rohan@example.com' },
    { name: 'Ananya Reddy', age: 31, gender: 'Female', weight: 55, height: 158, doshaType: 'Vata-Pitta', medicalConditions: ['Anxiety', 'Digestive issues'], allergies: ['Shellfish'], dietRestrictions: ['No spicy food'], phone: '+91-9876543213', email: 'ananya@example.com' },
    { name: 'Vikram Singh', age: 50, gender: 'Male', weight: 78, height: 170, doshaType: 'Pitta-Kapha', medicalConditions: ['Hypertension', 'High cholesterol'], allergies: [], dietRestrictions: ['Low salt'], phone: '+91-9876543214', email: 'vikram@example.com' },
    { name: 'Meera Iyer', age: 25, gender: 'Female', weight: 48, height: 155, doshaType: 'Vata', medicalConditions: ['Underweight', 'Dry skin'], allergies: ['Soy'], dietRestrictions: [], phone: '+91-9876543215', email: 'meera@example.com' }
  ];

  const user = await User.create({ name: 'Dr. Ayush Kumar', email: 'demo@vedicmedic.com', password: 'demo123', role: 'dietitian' });
  console.log('✅ Created demo user: demo@vedicmedic.com / demo123');

  await FoodDatabase.insertMany(foods);
  console.log(`✅ Seeded ${foods.length} food items`);

  const createdPatients = await Patient.insertMany(patients.map(p => ({ ...p, createdBy: user._id })));
  console.log(`✅ Seeded ${createdPatients.length} patients`);

  for (const patient of createdPatients.slice(0, 3)) {
    const plan = generateDietPlan(patient, 'All');
    await DietPlan.create({ patientId: patient._id, doshaType: patient.doshaType, season: 'All', ...plan, createdBy: user._id });
  }
  console.log('✅ Generated diet plans for 3 patients');

  const today = new Date();
  const appointments = [
    { patientId: createdPatients[0]._id, date: new Date(today.getTime() + 86400000).toISOString().split('T')[0], time: '10:00', notes: 'Follow-up on Vata-balancing diet', status: 'Scheduled', createdBy: user._id },
    { patientId: createdPatients[1]._id, date: new Date(today.getTime() + 2 * 86400000).toISOString().split('T')[0], time: '14:00', notes: 'Review Pitta diet plan effectiveness', status: 'Scheduled', createdBy: user._id },
    { patientId: createdPatients[2]._id, date: new Date(today.getTime() + 3 * 86400000).toISOString().split('T')[0], time: '11:30', notes: 'Kapha weight management check-in', status: 'Scheduled', createdBy: user._id },
    { patientId: createdPatients[3]._id, date: new Date(today.getTime() + 5 * 86400000).toISOString().split('T')[0], time: '09:00', notes: 'Initial Vata-Pitta assessment', status: 'Scheduled', createdBy: user._id },
    { patientId: createdPatients[0]._id, date: new Date(today.getTime() - 86400000).toISOString().split('T')[0], time: '15:00', notes: 'Completed initial assessment', status: 'Completed', createdBy: user._id }
  ];
  await Appointment.insertMany(appointments);
  console.log(`✅ Seeded ${appointments.length} appointments`);
  console.log('\n🌿 Database seeded successfully!');
}

// Start server with in-memory MongoDB
const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    // Try connecting to local MongoDB first
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/vedicmedic';
    try {
      await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 3000 });
      console.log('✅ Connected to MongoDB (local)');
    } catch (localErr) {
      // Fall back to in-memory MongoDB
      console.log('⚠️  Local MongoDB not available, starting in-memory MongoDB...');
      const mongod = await MongoMemoryServer.create();
      const uri = mongod.getUri();
      await mongoose.connect(uri);
      console.log('✅ Connected to in-memory MongoDB');
    }

    // Auto-seed
    await seedDatabase();

    app.listen(PORT, () => {
      console.log(`🌿 VedicMedic API running on port ${PORT}`);
    });
  } catch (err) {
    console.error('❌ Server startup error:', err.message);
    process.exit(1);
  }
}

startServer();
