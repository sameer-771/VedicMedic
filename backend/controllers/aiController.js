// Mock AI Diet Recommendation Service
// Returns intelligent Ayurvedic recommendations based on dosha, symptoms, and season

const recommendations = {
    Vata: {
        Summer: {
            recommended: ['Sweet fruits', 'Coconut water', 'Basmati rice', 'Ghee', 'Warm milk', 'Avocado', 'Sweet potatoes', 'Zucchini'],
            avoid: ['Raw salads', 'Cold drinks', 'Dry crackers', 'Bitter vegetables', 'Caffeine', 'Popcorn'],
            mealPlan: {
                breakfast: 'Warm oatmeal with ghee, dates, and cinnamon. Almond milk chai.',
                lunch: 'Basmati rice with mung dal, steamed sweet potatoes, and ginger buttermilk.',
                dinner: 'Khichdi with ghee, sautéed zucchini, and warm turmeric milk before bed.',
                snacks: 'Soaked almonds, dates, or a ripe banana.'
            }
        },
        Winter: {
            recommended: ['Sesame oil', 'Root vegetables', 'Warm soups', 'Nuts', 'Ghee', 'Whole wheat', 'Warm spices', 'Cooked grains'],
            avoid: ['Cold foods', 'Raw vegetables', 'Frozen foods', 'Dry fruits without soaking', 'Beans (gas-producing)'],
            mealPlan: {
                breakfast: 'Warm porridge with ghee, walnuts, and jaggery. Ginger tea.',
                lunch: 'Whole wheat roti with root vegetable curry, hot dal, and rice.',
                dinner: 'Thick vegetable soup with warm bread, followed by warm spiced milk.',
                snacks: 'Warm roasted nuts, halwa, or energy balls with dates.'
            }
        },
        Monsoon: {
            recommended: ['Light soups', 'Ginger', 'Turmeric', 'Cooked vegetables', 'Moong dal', 'Warm herbal teas'],
            avoid: ['Heavy foods', 'Fried foods', 'Raw salads', 'Yogurt', 'Leafy greens (uncooked)'],
            mealPlan: {
                breakfast: 'Poha with peanuts and turmeric. Ginger-lemon tea.',
                lunch: 'Light khichdi with cumin tempering and steamed vegetables.',
                dinner: 'Moong dal soup with a small portion of rice.',
                snacks: 'Roasted makhana or dry ginger cookies.'
            }
        }
    },
    Pitta: {
        Summer: {
            recommended: ['Cucumber', 'Watermelon', 'Coconut', 'Mint', 'Coriander', 'Fennel seeds', 'Sweet fruits', 'Basmati rice'],
            avoid: ['Spicy foods', 'Fermented foods', 'Sour fruits', 'Tomatoes', 'Hot peppers', 'Alcohol'],
            mealPlan: {
                breakfast: 'Coconut chia pudding with fresh berries. Rose water lassi.',
                lunch: 'Coriander rice with mild coconut curry, cucumber raita.',
                dinner: 'Moong dal soup with cilantro, steamed asparagus.',
                snacks: 'Fresh watermelon, coconut water, or sweet grapes.'
            }
        },
        Winter: {
            recommended: ['Sweet potatoes', 'Warm milk', 'Moderate spices', 'Ghee', 'Wheat', 'Rice', 'Green beans'],
            avoid: ['Excess sour', 'Excess salt', 'Very hot spices', 'Garlic (excess)', 'Vinegar'],
            mealPlan: {
                breakfast: 'Warm sweet potato porridge with cardamom and ghee.',
                lunch: 'Rice with mild vegetable curry and green beans.',
                dinner: 'Chapati with paneer in mild cream sauce.',
                snacks: 'Sweet dates, figs, or warm milk with saffron.'
            }
        },
        Monsoon: {
            recommended: ['Light warm foods', 'Cumin', 'Coriander', 'Fennel', 'Cooked greens', 'Mung beans'],
            avoid: ['Heavy oily foods', 'Sour foods', 'Pickles', 'Fermented foods'],
            mealPlan: {
                breakfast: 'Upma with coriander and mild spices. Fennel tea.',
                lunch: 'Rice with mung dal and lightly spiced cooked greens.',
                dinner: 'Vegetable clear soup with a piece of bread.',
                snacks: 'Pomegranate or roasted sunflower seeds.'
            }
        }
    },
    Kapha: {
        Summer: {
            recommended: ['Bitter greens', 'Light grains', 'Honey', 'Ginger', 'Black pepper', 'Leafy vegetables', 'Millet'],
            avoid: ['Sweet heavy foods', 'Dairy', 'Fried foods', 'Cold desserts', 'Wheat (excess)', 'Sugar'],
            mealPlan: {
                breakfast: 'Quinoa upma with vegetables and ginger tea.',
                lunch: 'Millet with bitter gourd curry and spiced lentil soup.',
                dinner: 'Steamed vegetables with turmeric and black pepper.',
                snacks: 'Roasted chickpeas or apple with cinnamon.'
            }
        },
        Winter: {
            recommended: ['Warm spices', 'Light soups', 'Honey', 'Barley', 'Corn', 'Mustard greens', 'Hot spices'],
            avoid: ['Cold dairy', 'Sweet desserts', 'Heavy grains', 'Bananas', 'Excess rice', 'White sugar'],
            mealPlan: {
                breakfast: 'Barley porridge with honey and dry ginger powder.',
                lunch: 'Corn roti with mustard greens and radish salad.',
                dinner: 'Hot vegetable soup with pepper and turmeric.',
                snacks: 'Warm honey-lemon water or roasted seeds.'
            }
        },
        Monsoon: {
            recommended: ['Warm light foods', 'Dry ginger', 'Pepper', 'Turmeric', 'Aged honey', 'Light grains'],
            avoid: ['Heavy foods', 'Dairy', 'Cold foods', 'Sweets', 'Deep-fried items'],
            mealPlan: {
                breakfast: 'Bajra roti with green chutney and ginger tea.',
                lunch: 'Light dal with jowar roti and steamed vegetables.',
                dinner: 'Clear vegetable broth with pepper and cumin.',
                snacks: 'Roasted flax seeds or warm herbal tea.'
            }
        }
    }
};

exports.getAIRecommendation = async (req, res) => {
    try {
        const { doshaType, symptoms, season } = req.body;
        const baseDoshaType = doshaType.split('-')[0];
        const seasonKey = season || 'Summer';

        const doshaRecs = recommendations[baseDoshaType] || recommendations.Vata;
        const seasonRecs = doshaRecs[seasonKey] || doshaRecs.Summer;

        let extraNotes = '';
        if (symptoms && symptoms.length > 0) {
            extraNotes = `\n\nBased on reported symptoms (${symptoms.join(', ')}), additional care should be taken to follow the recommended foods strictly and increase intake of warm herbal teas and easily digestible foods.`;
        }

        res.json({
            doshaType,
            season: seasonKey,
            recommended: seasonRecs.recommended,
            avoid: seasonRecs.avoid,
            mealPlan: seasonRecs.mealPlan,
            notes: `AI-powered Ayurvedic recommendation for ${doshaType} constitution in ${seasonKey} season.${extraNotes}`
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
