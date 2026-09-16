import React, { useState, useEffect } from 'react';
import { FoodItem, Category } from '../../types';
import { db } from '../../services/db';
import { Modal } from '../../components/common/Modal';
import { ConfirmationModal } from '../../components/common/ConfirmationModal';
import {
  UtensilsCrossed,
  Plus,
  Search,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Flame,
  Clock,
  Sparkles
} from 'lucide-react';

export const AdminMenuManager: React.FC = () => {
  const [foods, setFoods] = useState<FoodItem[]>(db.getFoodItems());
  const [categories, setCategories] = useState<Category[]>(db.getCategories());
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  // Edit / Add Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFood, setEditingFood] = useState<FoodItem | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number>(300);
  const [cost, setCost] = useState<number>(180);
  const [prepTime, setPrepTime] = useState<number>(10);
  const [imageUrl, setImageUrl] = useState('');
  const [calories, setCalories] = useState<number>(450);
  const [tagsInput, setTagsInput] = useState('');
  const [ingredientsInput, setIngredientsInput] = useState('');
  const [allergensInput, setAllergensInput] = useState('');

  // Delete modal
  const [deleteConfirmFood, setDeleteConfirmFood] = useState<FoodItem | null>(null);

  useEffect(() => {
    const refresh = () => {
      setFoods(db.getFoodItems());
      setCategories(db.getCategories());
    };
    refresh();
    const unsub = db.subscribe(refresh);
    return unsub;
  }, []);

  const openCreateModal = () => {
    setEditingFood(null);
    setName('');
    setCategoryId(categories[0]?.id || 'cat-1');
    setDescription('');
    setPrice(300);
    setCost(180);
    setPrepTime(10);
    setImageUrl('https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop');
    setCalories(450);
    setTagsInput('Popular');
    setIngredientsInput('Rice, Spices, Chicken');
    setAllergensInput('');
    setIsModalOpen(true);
  };

  const openEditModal = (food: FoodItem) => {
    setEditingFood(food);
    setName(food.name);
    setCategoryId(food.categoryId);
    setDescription(food.description);
    setPrice(food.price);
    setCost(food.cost);
    setPrepTime(food.preparationMinutes);
    setImageUrl(food.imageUrl);
    setCalories(food.calories || 450);
    setTagsInput(food.tags ? food.tags.join(', ') : '');
    setIngredientsInput(food.ingredients ? food.ingredients.join(', ') : '');
    setAllergensInput(food.allergens ? food.allergens.join(', ') : '');
    setIsModalOpen(true);
  };

  const handleSaveFood = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);
    const ingredients = ingredientsInput
      .split(',')
      .map((i) => i.trim())
      .filter(Boolean);
    const allergens = allergensInput
      .split(',')
      .map((a) => a.trim())
      .filter(Boolean);

    if (editingFood) {
      db.updateFoodItem(editingFood.id, {
        name: name.trim(),
        categoryId,
        description: description.trim(),
        price: Number(price),
        cost: Number(cost),
        preparationMinutes: Number(prepTime),
        imageUrl: imageUrl.trim() || editingFood.imageUrl,
        calories: Number(calories),
        tags,
        ingredients,
        allergens
      });
    } else {
      db.createFoodItem({
        name: name.trim(),
        categoryId,
        description: description.trim(),
        price: Number(price),
        cost: Number(cost),
        preparationMinutes: Number(prepTime),
        imageUrl: imageUrl.trim() || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop',
        calories: Number(calories),
        isAvailable: true,
        tags,
        ingredients,
        allergens
      });
    }

    setIsModalOpen(false);
  };

  const handleToggleAvailability = (foodId: string, current: boolean) => {
    db.updateFoodItem(foodId, { isAvailable: !current });
  };

  const handleDeleteFood = () => {
    if (!deleteConfirmFood) return;
    db.deleteFoodItem(deleteConfirmFood.id);
    setDeleteConfirmFood(null);
  };

  const filteredFoods = foods.filter((food) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      if (!food.name.toLowerCase().includes(q) && !food.description.toLowerCase().includes(q)) {
        return false;
      }
    }
    if (categoryFilter !== 'ALL' && food.categoryId !== categoryFilter) {
      return false;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 animate-in fade-in duration-300">
      {/* Title & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-stone-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-['Outfit']">
            Cafeteria Menu Manager
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Add dishes, configure pricing & food cost, toggle stock availability instantly.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="py-2.5 px-4 bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Dish</span>
        </button>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search menu by name or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-3 py-2 rounded-xl border border-stone-200 text-xs font-semibold bg-white text-stone-700"
        >
          <option value="ALL">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Menu Table / Cards */}
      <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-400 uppercase font-bold text-[10px]">
              <tr>
                <th className="py-3.5 px-4">Dish</th>
                <th className="py-3.5 px-3">Category</th>
                <th className="py-3.5 px-3">Price</th>
                <th className="py-3.5 px-3">Cost</th>
                <th className="py-3.5 px-3">Margin</th>
                <th className="py-3.5 px-3">Prep</th>
                <th className="py-3.5 px-3 text-center">Live Availability</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-700">
              {filteredFoods.map((food) => {
                const cat = categories.find((c) => c.id === food.categoryId);
                const margin = food.price > 0 ? Math.round(((food.price - food.cost) / food.price) * 100) : 0;

                return (
                  <tr key={food.id} className="hover:bg-stone-50/70 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={food.imageUrl}
                          alt={food.name}
                          className="w-10 h-10 rounded-xl object-cover bg-stone-100 shrink-0"
                        />
                        <div>
                          <span className="font-bold text-stone-900 block">{food.name}</span>
                          <span className="text-[11px] text-stone-400 line-clamp-1 max-w-xs">
                            {food.description}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 text-[11px] font-semibold">
                        {cat?.name || 'Unassigned'}
                      </span>
                    </td>

                    <td className="py-3 px-3 font-mono font-bold text-stone-900">
                      Rs. {food.price.toLocaleString()}
                    </td>

                    <td className="py-3 px-3 font-mono text-stone-500">
                      Rs. {food.cost.toLocaleString()}
                    </td>

                    <td className="py-3 px-3 font-mono font-bold text-emerald-700">
                      {margin}%
                    </td>

                    <td className="py-3 px-3 text-stone-500 font-medium">
                      ~{food.preparationMinutes}m
                    </td>

                    <td className="py-3 px-3 text-center">
                      <button
                        onClick={() => handleToggleAvailability(food.id, food.isAvailable)}
                        className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-colors inline-flex items-center gap-1 ${
                          food.isAvailable
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-rose-50 hover:text-rose-700'
                            : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-emerald-50 hover:text-emerald-700'
                        }`}
                      >
                        {food.isAvailable ? 'Available' : 'Unavailable'}
                      </button>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditModal(food)}
                          className="p-1.5 text-stone-500 hover:text-amber-700 hover:bg-stone-100 rounded-lg transition-colors"
                          title="Edit Dish"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmFood(food)}
                          className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-stone-100 rounded-lg transition-colors"
                          title="Deactivate / Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Food Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingFood ? 'Edit Dish Information' : 'Create New Menu Item'}
        subtitle="Manage cafeteria catalog, pricing, and ingredients"
        maxWidth="lg"
      >
        <form onSubmit={handleSaveFood} className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Dish Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Chicken Biryani Plate"
                className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Food Category *
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-medium bg-white"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
              Description
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Freshly cooked long grain basmati rice..."
              className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-medium"
            ></textarea>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Selling Price (Rs.) *
              </label>
              <input
                type="number"
                required
                min="10"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-bold font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Unit Food Cost (Rs.) *
              </label>
              <input
                type="number"
                required
                min="0"
                value={cost}
                onChange={(e) => setCost(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Prep Time (Mins)
              </label>
              <input
                type="number"
                required
                min="1"
                value={prepTime}
                onChange={(e) => setPrepTime(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Image URL (Unsplash or CDN)
              </label>
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://..."
                className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Calories (kcal)
              </label>
              <input
                type="number"
                value={calories}
                onChange={(e) => setCalories(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
              Tags (comma separated)
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="Popular, Chef Special, Vegetarian..."
              className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-medium"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Ingredients (comma separated)
              </label>
              <input
                type="text"
                value={ingredientsInput}
                onChange={(e) => setIngredientsInput(e.target.value)}
                placeholder="Chicken, Basmati Rice, Yogurt..."
                className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Allergens (comma separated)
              </label>
              <input
                type="text"
                value={allergensInput}
                onChange={(e) => setAllergensInput(e.target.value)}
                placeholder="Gluten, Dairy, Peanuts..."
                className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-medium"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs shadow-md transition-colors mt-2"
          >
            {editingFood ? 'Save Dish Updates' : 'Add Item to Cafeteria Menu'}
          </button>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!deleteConfirmFood}
        onClose={() => setDeleteConfirmFood(null)}
        onConfirm={handleDeleteFood}
        title="Remove Menu Item?"
        description={`Are you sure you want to deactivate "${deleteConfirmFood?.name}"? Students will no longer see it on the daily menu.`}
        confirmText="Confirm Deactivation"
        variant="danger"
      />
    </div>
  );
};
