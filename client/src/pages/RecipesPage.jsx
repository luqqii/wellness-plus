import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Clock, Flame, ChefHat, Star, Plus, CheckCircle2, Filter, BookOpen } from 'lucide-react';
import api from '../services/api';

// Real AI-generated recipe images (base64 paths to artifacts dir)
const IMG_SALMON = `/images/recipe_salmon_quinoa_1775954500413.png`;
const IMG_MEDITERRANEAN = `/images/recipe_mediterranean_bowl_1775954514722.png`;
const IMG_SMOOTHIE = `/images/recipe_protein_smoothie_1775954538191.png`;
const IMG_AVOCADO = `/images/recipe_avocado_toast_1775954552090.png`;
const IMG_STIRFRY = `/images/recipe_chicken_stir_fry_1775954571098.png`;
const IMG_GREEK = `/images/recipe_greek_salad_1775954614702.png`;
const IMG_TURKEY = `/images/recipe_turkey_wrap.png`;

const RECIPES = [
  {
    id: 1, name: 'Grilled Salmon & Quinoa', category: 'High Protein', cookTime: '25 min', difficulty: 'Easy', rating: 4.9,
    calories: 480, protein: 42, carbs: 35, fat: 14, fiber: 4,
    image: IMG_SALMON,
    emoji: '🐟',
    description: 'A restaurant-quality meal packed with omega-3s and complete protein. Perfectly grilled salmon over fluffy quinoa with roasted asparagus.',
    tags: ['High Protein', 'Omega-3', 'Gluten Free'],
    ingredients: ['2 salmon fillets (150g each)', '1 cup quinoa', '1 bunch asparagus', '2 tbsp olive oil', '1 lemon', 'Salt, pepper, garlic powder'],
    instructions: ['Cook quinoa with 2 cups water (15 min).', 'Season salmon with salt, pepper, and garlic.', 'Grill salmon 4 min each side.', 'Roast asparagus with olive oil at 200°C for 12 min.', 'Serve over quinoa with lemon wedge.'],
  },
  {
    id: 2, name: 'Mediterranean Veggie Bowl', category: 'Plant Based', cookTime: '15 min', difficulty: 'Easy', rating: 4.8,
    calories: 420, protein: 18, carbs: 48, fat: 16, fiber: 9,
    image: IMG_MEDITERRANEAN,
    emoji: '🥗',
    description: 'Vibrant plant-based bowl loaded with fresh vegetables, creamy hummus, falafel, and olives. A complete protein powerhouse.',
    tags: ['Plant Based', 'Vegan', 'High Fiber'],
    ingredients: ['4 falafel balls', '3 tbsp hummus', '½ cucumber', '6 cherry tomatoes', '10 Kalamata olives', 'Fresh herbs, lemon'],
    instructions: ['Arrange hummus in bowl base.', 'Warm falafel in oven 8 min.', 'Chop cucumber and halve tomatoes.', 'Arrange all ingredients.', 'Drizzle with olive oil and lemon.'],
  },
  {
    id: 3, name: 'Protein Smoothie Bowl', category: 'Quick & Easy', cookTime: '5 min', difficulty: 'Easy', rating: 4.7,
    calories: 350, protein: 28, carbs: 42, fat: 8, fiber: 6,
    image: IMG_SMOOTHIE,
    emoji: '🍓',
    description: 'Thick, creamy smoothie bowl loaded with fresh fruits, granola, and complete protein. The perfect post-workout breakfast.',
    tags: ['High Protein', 'Post-Workout', 'Breakfast'],
    ingredients: ['1 scoop protein powder', '1 frozen banana', '100g mixed berries', '½ cup almond milk', 'Granola, coconut flakes', 'Fresh fruit for topping'],
    instructions: ['Blend protein powder, banana, berries, and milk until thick.', 'Pour into bowl.', 'Top with granola, fresh fruit, and coconut flakes.', 'Serve immediately.'],
  },
  {
    id: 4, name: 'Avocado Toast + Poached Eggs', category: 'Weight Loss', cookTime: '10 min', difficulty: 'Easy', rating: 4.8,
    calories: 380, protein: 22, carbs: 30, fat: 20, fiber: 7,
    image: IMG_AVOCADO,
    emoji: '🥑',
    description: 'Elevated avocado toast with perfectly poached eggs on sourdough. Rich in healthy fats and complete protein for sustained energy.',
    tags: ['Weight Loss', 'High Fiber', 'Breakfast'],
    ingredients: ['2 slices sourdough', '1 ripe avocado', '2 eggs', 'Red chili flakes', 'Microgreens', 'Salt, pepper, lemon'],
    instructions: ['Toast sourdough bread.', 'Mash avocado with lemon, salt, and pepper.', 'Poach eggs in simmering water for 3 min.', 'Spread avocado on toast.', 'Top with eggs, chili flakes, and microgreens.'],
  },
  {
    id: 5, name: 'Chicken Stir Fry', category: 'Quick & Easy', cookTime: '20 min', difficulty: 'Medium', rating: 4.7,
    calories: 440, protein: 38, carbs: 40, fat: 12, fiber: 5,
    image: IMG_STIRFRY,
    emoji: '🍗',
    description: 'A colorful, protein-rich stir fry with tender chicken and crispy vegetables over steamed brown rice. Ready in under 20 minutes.',
    tags: ['High Protein', 'Meal Prep', 'Quick'],
    ingredients: ['300g chicken breast', '2 cups mixed vegetables', '1 cup brown rice', '2 tbsp soy sauce', '1 tbsp sesame oil', 'Garlic, ginger, sesame seeds'],
    instructions: ['Cook brown rice per package.', 'Slice chicken and season.', 'Heat oil in wok on high heat.', 'Stir fry chicken 5 min.', 'Add vegetables and soy sauce, cook 5 min.', 'Serve over rice with sesame seeds.'],
  },
  {
    id: 6, name: 'Classic Greek Salad', category: 'Weight Loss', cookTime: '10 min', difficulty: 'Easy', rating: 4.6,
    calories: 280, protein: 10, carbs: 15, fat: 20, fiber: 3,
    image: IMG_GREEK,
    emoji: '🫒',
    description: 'Authentic Greek salad with creamy feta, Kalamata olives, and fresh vegetables. Light, refreshing and packed with Mediterranean flavor.',
    tags: ['Weight Loss', 'Low Carb', 'Keto Friendly'],
    ingredients: ['1 large tomato', '½ cucumber', '½ red onion', '100g feta cheese', 'Kalamata olives', 'Olive oil, oregano, salt'],
    instructions: ['Chop tomatoes and cucumber into chunks.', 'Slice red onion.', 'Combine in bowl.', 'Place whole block of feta on top.', 'Add olives, drizzle olive oil, sprinkle oregano.'],
  },
  {
    id: 7, name: 'Turkey & Veggie Wrap', category: 'Low Carb', cookTime: '5 min', difficulty: 'Easy', rating: 4.5,
    calories: 320, protein: 30, carbs: 22, fat: 10, fiber: 4,
    image: IMG_TURKEY, emoji: '🌯',
    description: 'Lean turkey with fresh vegetables wrapped in a whole wheat tortilla. Perfect on-the-go lunch packed with protein.',
    tags: ['Low Carb', 'High Protein', 'Lunch'],
    ingredients: ['150g sliced turkey breast', '1 whole wheat tortilla', 'Lettuce, tomato, cucumber', '2 tbsp Greek yogurt sauce', 'Mustard, salt, pepper'],
    instructions: ['Lay tortilla flat.', 'Spread Greek yogurt sauce and mustard.', 'Layer turkey and vegetables.', 'Roll tightly and cut in half.'],
  },
  {
    id: 8, name: 'Overnight Oats', category: 'Breakfast', cookTime: '5 min prep', difficulty: 'Easy', rating: 4.7,
    calories: 380, protein: 18, carbs: 58, fat: 10, fiber: 8,
    image: IMG_SMOOTHIE, emoji: '🥣',
    description: 'Prep in 5 minutes the night before for a perfect, no-cook breakfast. Creamy, satisfying, and endlessly customizable.',
    tags: ['High Fiber', 'Meal Prep', 'Breakfast'],
    ingredients: ['½ cup rolled oats', '½ cup almond milk', '2 tbsp chia seeds', '1 scoop protein powder', 'Berries, honey for topping'],
    instructions: ['Combine oats, milk, chia seeds, protein in jar.', 'Stir well and seal.', 'Refrigerate overnight.', 'In morning, top with berries and honey.'],
  },
  {
    id: 9, name: 'Lentil Power Soup', category: 'High Fiber', cookTime: '30 min', difficulty: 'Easy', rating: 4.8,
    calories: 340, protein: 20, carbs: 52, fat: 6, fiber: 16,
    image: IMG_MEDITERRANEAN, emoji: '🍲',
    description: 'Hearty red lentil soup with aromatic spices. Incredibly filling, high in plant protein and fiber. Great for meal prep.',
    tags: ['High Fiber', 'Plant Based', 'Vegan'],
    ingredients: ['1 cup red lentils', '1 can diced tomatoes', '1 onion', 'Cumin, paprika, turmeric', 'Vegetable broth', 'Lemon juice, cilantro'],
    instructions: ['Sauté onion with spices 5 min.', 'Add lentils and broth.', 'Simmer 20 min until lentils soft.', 'Add tomatoes, cook 5 min.', 'Finish with lemon juice and cilantro.'],
  },
  {
    id: 10, name: 'Black Bean Tacos', category: 'Plant Based', cookTime: '15 min', difficulty: 'Easy', rating: 4.6,
    calories: 400, protein: 16, carbs: 58, fat: 12, fiber: 14,
    image: IMG_MEDITERRANEAN, emoji: '🌮',
    description: 'Crispy corn tacos loaded with seasoned black beans, fresh salsa, avocado, and lime. Satisfying plant-based Mexican food.',
    tags: ['Plant Based', 'High Fiber', 'Vegan'],
    ingredients: ['1 can black beans', '4 corn tortillas', '1 avocado', 'Pico de gallo', 'Lime, cumin, chili powder', 'Fresh cilantro'],
    instructions: ['Season black beans with cumin and chili.', 'Warm tortillas.', 'Mash half the avocado.', 'Fill tacos with beans, avocado.', 'Top with pico de gallo, lime, cilantro.'],
  },
];

const CATEGORIES = ['All', 'High Protein', 'Plant Based', 'Weight Loss', 'Quick & Easy', 'Low Carb', 'High Fiber', 'Breakfast'];
const DIFFICULTY_COLORS = { Easy: 'var(--c-teal)', Medium: 'var(--c-orange)', Hard: 'var(--c-red)' };

export default function RecipesPage() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [addedRecipes, setAddedRecipes] = useState({});
  const [addingId, setAddingId] = useState(null);

  const filtered = RECIPES.filter(r => {
    const matchesSearch = r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.description.toLowerCase().includes(search.toLowerCase()) ||
      r.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory = activeCategory === 'All' || r.tags.includes(activeCategory) || r.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const addToDiary = async (recipe, mealType = 'lunch') => {
    setAddingId(recipe.id);
    const today = new Date().toISOString().split('T')[0];
    try {
      await api.post(`/nutrition/log/${today}`, {
        mealType,
        customFood: { name: recipe.name, calories: recipe.calories, protein: recipe.protein, carbs: recipe.carbs, fat: recipe.fat, fiber: recipe.fiber },
        servingsConsumed: 1,
      });
      setAddedRecipes(prev => ({ ...prev, [recipe.id]: true }));
      setSelectedRecipe(null);
    } catch (e) {
      console.error('Add recipe error:', e);
    } finally {
      setAddingId(null);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 1100 }}>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="glass-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
          <div style={{ width: 44, height: 44, borderRadius: 14, background: 'linear-gradient(135deg, #ff7940, #ff5b5b)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ChefHat size={20} color="white" />
          </div>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 800, color: 'var(--c-text-primary)', margin: 0 }}>Recipe Library</h1>
            <p style={{ fontSize: 12, color: 'var(--c-text-muted)', margin: '2px 0 0' }}>{RECIPES.length} healthy recipes · Add any meal directly to your diary</p>
          </div>
        </div>

        {/* Search */}
        <div style={{ position: 'relative', marginBottom: 16 }}>
          <Search size={15} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: 'var(--c-text-muted)' }} />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search recipes, ingredients, or tags…"
            style={{ width: '100%', padding: '11px 38px', background: 'rgba(255,255,255,0.06)', border: '1px solid var(--c-border-strong)', borderRadius: 12, color: 'var(--c-text-primary)', outline: 'none', fontSize: 14 }}
            onFocus={e => { e.target.style.borderColor = 'rgba(255,121,64,0.4)'; e.target.style.boxShadow = '0 0 0 3px rgba(255,121,64,0.08)'; }}
            onBlur={e => { e.target.style.borderColor = 'var(--c-border-strong)'; e.target.style.boxShadow = 'none'; }}
          />
          {search && (
            <button onClick={() => setSearch('')} style={{ position: 'absolute', right: 11, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: '50%', width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--c-text-muted)' }}>
              <X size={11} />
            </button>
          )}
        </div>

        {/* Category filters */}
        <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4 }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                flexShrink: 0, padding: '6px 14px', borderRadius: 20,
                background: activeCategory === cat ? 'linear-gradient(135deg, #ff7940, #ff5b5b)' : 'rgba(255,255,255,0.04)',
                border: `1px solid ${activeCategory === cat ? 'transparent' : 'var(--c-border)'}`,
                color: activeCategory === cat ? 'white' : 'var(--c-text-muted)',
                fontSize: 12, fontWeight: activeCategory === cat ? 700 : 500,
                cursor: 'pointer', transition: 'all 150ms',
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Results count */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <BookOpen size={14} color="var(--c-text-muted)" />
        <span style={{ fontSize: 13, color: 'var(--c-text-muted)' }}>{filtered.length} recipe{filtered.length !== 1 ? 's' : ''} found</span>
      </div>

      {/* Recipe Grid */}
      <div className="responsive-grid-3">
        <AnimatePresence>
          {filtered.map((recipe, i) => {
            const isAdded = addedRecipes[recipe.id];
            return (
              <motion.div
                key={recipe.id}
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: Math.min(i * 0.04, 0.2) }}
                className="glass-card"
                style={{ padding: 0, overflow: 'hidden', cursor: 'pointer' }}
                onClick={() => setSelectedRecipe(recipe)}
              >
                {/* Image / Placeholder */}
                <div style={{ height: 160, background: recipe.image ? `url(${recipe.image}) center/cover` : `linear-gradient(135deg, rgba(255,121,64,0.15), rgba(155,109,255,0.15))`, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {!recipe.image && <span style={{ fontSize: 56 }}>{recipe.emoji}</span>}
                  {/* Category badge */}
                  <div style={{ position: 'absolute', top: 10, left: 10 }}>
                    <span style={{ padding: '3px 8px', borderRadius: 20, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)', fontSize: 11, fontWeight: 600, color: 'white', border: '1px solid rgba(255,255,255,0.15)' }}>
                      {recipe.category}
                    </span>
                  </div>
                  {/* Rating */}
                  <div style={{ position: 'absolute', top: 10, right: 10, display: 'flex', alignItems: 'center', gap: 3, padding: '3px 8px', borderRadius: 20, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.15)' }}>
                    <Star size={10} color="#ffc107" fill="#ffc107" />
                    <span style={{ fontSize: 11, fontWeight: 700, color: 'white' }}>{recipe.rating}</span>
                  </div>
                  {isAdded && (
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,212,170,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <CheckCircle2 size={40} color="white" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div style={{ padding: '14px 16px' }}>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: 'var(--c-text-primary)', margin: '0 0 6px', lineHeight: 1.3 }}>{recipe.name}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Clock size={11} color="var(--c-text-muted)" />
                      <span style={{ fontSize: 11, color: 'var(--c-text-muted)' }}>{recipe.cookTime}</span>
                    </div>
                    <span style={{ fontSize: 11, color: DIFFICULTY_COLORS[recipe.difficulty] || 'var(--c-teal)', fontWeight: 600 }}>{recipe.difficulty}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginLeft: 'auto' }}>
                      <Flame size={11} color="var(--c-orange)" />
                      <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--c-orange)' }}>{recipe.calories}</span>
                      <span style={{ fontSize: 11, color: 'var(--c-text-muted)' }}>cal</span>
                    </div>
                  </div>

                  {/* Macros */}
                  <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
                    {[
                      { label: 'P', val: recipe.protein, c: '#ff7940' },
                      { label: 'C', val: recipe.carbs, c: '#00d4aa' },
                      { label: 'F', val: recipe.fat, c: '#9b6dff' },
                    ].map(m => (
                      <span key={m.label} style={{ flex: 1, textAlign: 'center', padding: '4px', borderRadius: 8, background: 'rgba(255,255,255,0.04)', border: '1px solid var(--c-border)', fontSize: 11 }}>
                        <span style={{ color: m.c, fontWeight: 700 }}>{m.val}g</span>
                        <span style={{ color: 'var(--c-text-muted)', display: 'block', fontSize: 10 }}>{m.label}</span>
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={e => { e.stopPropagation(); addToDiary(recipe); }}
                    disabled={isAdded || addingId === recipe.id}
                    style={{ width: '100%', padding: '9px', borderRadius: 10, background: isAdded ? 'rgba(0,212,170,0.12)' : 'rgba(255,121,64,0.1)', border: `1px solid ${isAdded ? 'rgba(0,212,170,0.3)' : 'rgba(255,121,64,0.25)'}`, color: isAdded ? 'var(--c-teal)' : 'var(--c-orange)', fontSize: 12, fontWeight: 700, cursor: isAdded ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}
                  >
                    {isAdded ? <><CheckCircle2 size={13} /> Added to Diary</> : <><Plus size={13} /> Add to Diary</>}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🍽️</div>
          <p style={{ fontSize: 16, fontWeight: 600, color: 'var(--c-text-secondary)' }}>No recipes found</p>
          <p style={{ fontSize: 13, color: 'var(--c-text-muted)' }}>Try a different search term or category</p>
        </div>
      )}

      {/* Recipe Detail Modal */}
      <AnimatePresence>
        {selectedRecipe && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(10px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
            onClick={e => { if (e.target === e.currentTarget) setSelectedRecipe(null); }}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              style={{ background: 'rgba(18,20,28,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 24, width: '100%', maxWidth: 560, maxHeight: '90vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
            >
              {/* Hero image */}
              <div style={{ height: 200, background: selectedRecipe.image ? `url(${selectedRecipe.image}) center/cover` : `linear-gradient(135deg, rgba(255,121,64,0.2), rgba(155,109,255,0.2))`, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {!selectedRecipe.image && <span style={{ fontSize: 72 }}>{selectedRecipe.emoji}</span>}
                <button onClick={() => setSelectedRecipe(null)} style={{ position: 'absolute', top: 14, right: 14, width: 32, height: 32, borderRadius: '50%', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                  <X size={15} />
                </button>
                {/* Star + Time + Difficulty */}
                <div style={{ position: 'absolute', bottom: 12, left: 14, display: 'flex', gap: 8 }}>
                  {[
                    { icon: Star, val: selectedRecipe.rating, color: '#ffc107' },
                    { icon: Clock, val: selectedRecipe.cookTime, color: 'white' },
                  ].map((item, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '4px 8px', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)', borderRadius: 20 }}>
                      <item.icon size={11} color={item.color} fill={i===0 ? '#ffc107' : 'none'} />
                      <span style={{ fontSize: 11, color: 'white', fontWeight: 600 }}>{item.val}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ padding: '20px 22px', overflowY: 'auto', flex: 1 }}>
                <h2 style={{ fontSize: 20, fontWeight: 800, color: 'white', margin: '0 0 6px' }}>{selectedRecipe.name}</h2>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6, marginBottom: 16 }}>{selectedRecipe.description}</p>

                {/* Tags */}
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 18 }}>
                  {selectedRecipe.tags.map(tag => (
                    <span key={tag} style={{ padding: '3px 10px', borderRadius: 20, background: 'rgba(255,121,64,0.12)', border: '1px solid rgba(255,121,64,0.25)', fontSize: 11, color: 'var(--c-orange)', fontWeight: 600 }}>{tag}</span>
                  ))}
                </div>

                {/* Macros */}
                <div className="responsive-grid-4" style={{ marginBottom: 18 }}>
                  {[
                    { label: 'Calories', val: selectedRecipe.calories, color: 'var(--c-orange)' },
                    { label: 'Protein', val: `${selectedRecipe.protein}g`, color: '#ff7940' },
                    { label: 'Carbs', val: `${selectedRecipe.carbs}g`, color: 'var(--c-teal)' },
                    { label: 'Fat', val: `${selectedRecipe.fat}g`, color: 'var(--c-purple)' },
                  ].map(m => (
                    <div key={m.label} style={{ textAlign: 'center', padding: '10px 4px', background: 'rgba(255,255,255,0.04)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.07)' }}>
                      <div style={{ fontSize: 18, fontWeight: 800, color: m.color }}>{m.val}</div>
                      <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)' }}>{m.label}</div>
                    </div>
                  ))}
                </div>

                {/* Ingredients */}
                <h3 style={{ fontSize: 14, fontWeight: 700, color: 'white', marginBottom: 10 }}>Ingredients</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 18 }}>
                  {selectedRecipe.ingredients.map((ing, i) => (
                    <span key={i} style={{ padding: '4px 10px', borderRadius: 8, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>{ing}</span>
                  ))}
                </div>

                {/* Instructions */}
                <h3 style={{ fontSize: 14, fontWeight: 700, color: 'white', marginBottom: 10 }}>Instructions</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
                  {selectedRecipe.instructions.map((step, i) => (
                    <div key={i} style={{ display: 'flex', gap: 10 }}>
                      <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'linear-gradient(135deg, #ff7940, #ff5b5b)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 11, fontWeight: 800, color: 'white' }}>{i+1}</div>
                      <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', margin: 0, lineHeight: 1.6, paddingTop: 2 }}>{step}</p>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <button
                  onClick={() => addToDiary(selectedRecipe)}
                  disabled={addedRecipes[selectedRecipe.id] || addingId === selectedRecipe.id}
                  style={{ width: '100%', padding: '13px', borderRadius: 12, background: addedRecipes[selectedRecipe.id] ? 'rgba(0,212,170,0.15)' : 'linear-gradient(135deg, #ff7940, #ff5b5b)', border: addedRecipes[selectedRecipe.id] ? '1px solid rgba(0,212,170,0.3)' : 'none', color: addedRecipes[selectedRecipe.id] ? 'var(--c-teal)' : 'white', fontSize: 14, fontWeight: 700, cursor: addedRecipes[selectedRecipe.id] ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                >
                  {addedRecipes[selectedRecipe.id] ? <><CheckCircle2 size={16} /> Added to Today's Diary</> : <><Plus size={16} /> Add to Today's Diary</>}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
