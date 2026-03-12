// Ayurvedic Diet Plan Generation Service
// Generates realistic diet plans based on dosha type and season

const doshaFoods = {
    Vata: {
        breakfast: [
            { name: 'Warm Oatmeal with Ghee & Cinnamon', calories: 320, protein: 8, fiber: 5, carbs: 52, fat: 12, ayurvedicClassification: 'Warm & Grounding', doshaCompatibility: 'Balances Vata' },
            { name: 'Stewed Apples with Cardamom', calories: 150, protein: 1, fiber: 3, carbs: 38, fat: 1, ayurvedicClassification: 'Warm & Sweet', doshaCompatibility: 'Reduces Vata' },
            { name: 'Almond Milk Chai', calories: 120, protein: 3, fiber: 0, carbs: 15, fat: 5, ayurvedicClassification: 'Heating & Nourishing', doshaCompatibility: 'Calms Vata' }
        ],
        lunch: [
            { name: 'Basmati Rice with Mung Dal', calories: 420, protein: 14, fiber: 6, carbs: 72, fat: 8, ayurvedicClassification: 'Warm & Nourishing', doshaCompatibility: 'Grounds Vata' },
            { name: 'Steamed Vegetables with Sesame Oil', calories: 180, protein: 4, fiber: 5, carbs: 18, fat: 11, ayurvedicClassification: 'Warm & Oily', doshaCompatibility: 'Balances Vata' },
            { name: 'Ginger Buttermilk', calories: 80, protein: 3, fiber: 0, carbs: 8, fat: 3, ayurvedicClassification: 'Digestive & Warm', doshaCompatibility: 'Aids Vata digestion' }
        ],
        dinner: [
            { name: 'Khichdi with Ghee', calories: 380, protein: 12, fiber: 4, carbs: 58, fat: 12, ayurvedicClassification: 'Light & Warm', doshaCompatibility: 'Soothes Vata' },
            { name: 'Roasted Root Vegetables', calories: 200, protein: 3, fiber: 6, carbs: 35, fat: 6, ayurvedicClassification: 'Grounding & Warm', doshaCompatibility: 'Stabilizes Vata' }
        ],
        snacks: [
            { name: 'Dates with Almonds', calories: 180, protein: 4, fiber: 3, carbs: 30, fat: 8, ayurvedicClassification: 'Sweet & Nourishing', doshaCompatibility: 'Calms Vata' },
            { name: 'Warm Turmeric Milk', calories: 140, protein: 5, fiber: 0, carbs: 16, fat: 6, ayurvedicClassification: 'Healing & Warm', doshaCompatibility: 'Reduces Vata' }
        ]
    },
    Pitta: {
        breakfast: [
            { name: 'Coconut Chia Pudding', calories: 280, protein: 7, fiber: 8, carbs: 32, fat: 14, ayurvedicClassification: 'Cooling & Sweet', doshaCompatibility: 'Cools Pitta' },
            { name: 'Fresh Pomegranate & Mint Smoothie', calories: 160, protein: 3, fiber: 4, carbs: 36, fat: 1, ayurvedicClassification: 'Cooling & Astringent', doshaCompatibility: 'Reduces Pitta' },
            { name: 'Cucumber Raita', calories: 90, protein: 4, fiber: 1, carbs: 8, fat: 4, ayurvedicClassification: 'Cooling & Light', doshaCompatibility: 'Soothes Pitta' }
        ],
        lunch: [
            { name: 'Coriander Rice with Coconut Curry', calories: 440, protein: 10, fiber: 5, carbs: 68, fat: 15, ayurvedicClassification: 'Cooling & Balanced', doshaCompatibility: 'Balances Pitta' },
            { name: 'Mixed Green Salad with Lime Dressing', calories: 150, protein: 4, fiber: 6, carbs: 18, fat: 7, ayurvedicClassification: 'Cooling & Light', doshaCompatibility: 'Cools Pitta' },
            { name: 'Rose Water Lassi', calories: 120, protein: 5, fiber: 0, carbs: 18, fat: 3, ayurvedicClassification: 'Sweet & Cooling', doshaCompatibility: 'Calms Pitta' }
        ],
        dinner: [
            { name: 'Moong Dal Soup with Cilantro', calories: 320, protein: 16, fiber: 5, carbs: 48, fat: 6, ayurvedicClassification: 'Light & Cooling', doshaCompatibility: 'Balances Pitta' },
            { name: 'Steamed Asparagus with Coconut Oil', calories: 140, protein: 4, fiber: 4, carbs: 12, fat: 9, ayurvedicClassification: 'Cooling & Nourishing', doshaCompatibility: 'Reduces Pitta' }
        ],
        snacks: [
            { name: 'Fresh Watermelon Cubes', calories: 90, protein: 2, fiber: 1, carbs: 22, fat: 0, ayurvedicClassification: 'Cooling & Hydrating', doshaCompatibility: 'Cools Pitta' },
            { name: 'Coconut Water', calories: 60, protein: 1, fiber: 0, carbs: 14, fat: 0, ayurvedicClassification: 'Hydrating & Cooling', doshaCompatibility: 'Soothes Pitta' }
        ]
    },
    Kapha: {
        breakfast: [
            { name: 'Warm Quinoa with Honey & Ginger', calories: 260, protein: 8, fiber: 4, carbs: 45, fat: 6, ayurvedicClassification: 'Light & Stimulating', doshaCompatibility: 'Reduces Kapha' },
            { name: 'Green Detox Smoothie', calories: 140, protein: 4, fiber: 5, carbs: 28, fat: 2, ayurvedicClassification: 'Light & Cleansing', doshaCompatibility: 'Balances Kapha' },
            { name: 'Herbal Ginger Tea', calories: 30, protein: 0, fiber: 0, carbs: 7, fat: 0, ayurvedicClassification: 'Heating & Stimulating', doshaCompatibility: 'Activates Kapha' }
        ],
        lunch: [
            { name: 'Millet & Vegetable Stir Fry', calories: 380, protein: 10, fiber: 7, carbs: 58, fat: 12, ayurvedicClassification: 'Light & Dry', doshaCompatibility: 'Reduces Kapha' },
            { name: 'Spiced Lentil Soup', calories: 220, protein: 14, fiber: 8, carbs: 34, fat: 4, ayurvedicClassification: 'Warm & Light', doshaCompatibility: 'Balances Kapha' },
            { name: 'Cumin Detox Water', calories: 10, protein: 0, fiber: 0, carbs: 2, fat: 0, ayurvedicClassification: 'Digestive & Warm', doshaCompatibility: 'Stimulates Kapha' }
        ],
        dinner: [
            { name: 'Steamed Broccoli & Cauliflower with Turmeric', calories: 180, protein: 8, fiber: 7, carbs: 24, fat: 6, ayurvedicClassification: 'Light & Detoxifying', doshaCompatibility: 'Reduces Kapha' },
            { name: 'Barley Vegetable Stew', calories: 280, protein: 9, fiber: 6, carbs: 46, fat: 6, ayurvedicClassification: 'Warm & Drying', doshaCompatibility: 'Balances Kapha' }
        ],
        snacks: [
            { name: 'Roasted Chickpeas with Black Pepper', calories: 140, protein: 7, fiber: 4, carbs: 22, fat: 3, ayurvedicClassification: 'Dry & Light', doshaCompatibility: 'Reduces Kapha' },
            { name: 'Apple Slices with Cinnamon', calories: 80, protein: 0, fiber: 3, carbs: 20, fat: 0, ayurvedicClassification: 'Light & Astringent', doshaCompatibility: 'Balances Kapha' }
        ]
    }
};

const seasonalModifiers = {
    Summer: { note: 'Summer diet: Focus on cooling foods, hydration, and lighter meals. Favor sweet, bitter, and astringent tastes.' },
    Winter: { note: 'Winter diet: Emphasize warming, nourishing, and grounding foods. Favor sweet, sour, and salty tastes.' },
    Monsoon: { note: 'Monsoon diet: Focus on easily digestible, warm foods. Avoid raw foods and favor lightly spiced cooked meals.' },
    All: { note: 'Balanced diet suitable for all seasons with dosha-specific adjustments.' }
};

function generateDietPlan(patient, season) {
    const baseDoshaType = patient.doshaType.split('-')[0]; // Get primary dosha
    const foods = doshaFoods[baseDoshaType] || doshaFoods.Vata;

    const breakfast = foods.breakfast;
    const lunch = foods.lunch;
    const dinner = foods.dinner;
    const snacks = foods.snacks;

    const allItems = [...breakfast, ...lunch, ...dinner, ...snacks];
    const totalNutrients = {
        calories: allItems.reduce((s, i) => s + i.calories, 0),
        protein: allItems.reduce((s, i) => s + i.protein, 0),
        fiber: allItems.reduce((s, i) => s + i.fiber, 0),
        carbs: allItems.reduce((s, i) => s + i.carbs, 0),
        fat: allItems.reduce((s, i) => s + i.fat, 0)
    };

    const seasonInfo = seasonalModifiers[season] || seasonalModifiers.All;

    return {
        breakfast,
        lunch,
        dinner,
        snacks,
        totalNutrients,
        notes: `Diet plan for ${patient.name} (${patient.doshaType} constitution). ${seasonInfo.note}`
    };
}

module.exports = { generateDietPlan, doshaFoods, seasonalModifiers };
