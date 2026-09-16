import React, { useState, useEffect } from 'react';
import { FoodItem, Category, StudentUser } from '../../types';
import { db } from '../../services/db';
import { FoodDetailsModal } from './FoodDetailsModal';
import {
  Search,
  Star,
  Clock,
  Plus,
  Filter,
  SlidersHorizontal,
  Bookmark,
  Check,
  AlertCircle
} from 'lucide-react';

interface StudentMenuProps {
  student: StudentUser;
  initialCategory?: string;
  onNavigateToCart: () => void;
}

export const StudentMenu: React.FC<StudentMenuProps> = ({
  student,
  initialCategory,
  onNavigateToCart
}) => {
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'ALL');
  const [sortBy, setSortBy] = useState<'POPULAR' | 'PRICE_LOW' | 'PRICE_HIGH' | 'RATING' | 'PREP_TIME'>('POPULAR');
  const [filterAvailability, setFilterAvailability] = useState<'ALL' | 'AVAILABLE_ONLY'>('ALL');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);

  useEffect(() => {
    const refresh = () => {
      setFoods(db.getFoodItems());
      setCategories(db.getCategories());
      setFavorites(db.getFavorites(student.id));
    };
    refresh();
    const unsub = db.subscribe(refresh);
    return unsub;
  }, [student.id]);

  useEffect(() => {
    if (initialCategory) {
      const match = categories.find((c) => c.slug === initialCategory);
      if (match) setSelectedCategory(match.id);
    }
  }, [initialCategory, categories]);

  const handleToggleFavorite = (foodId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    db.toggleFavorite(student.id, foodId);
    setFavorites(db.getFavorites(student.id));
  };

  // Filter & Sort
  const filteredFoods = foods.filter((food) => {
    if (food.isDeactivated) return false;

    // Search query matches name, description, tags, ingredients
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = food.name.toLowerCase().includes(q);
      const matchDesc = food.description.toLowerCase().includes(q);
      const matchTags = food.tags?.some((t) => t.toLowerCase().includes(q));
      const matchIngredients = food.ingredients?.some((i) => i.toLowerCase().includes(q));
      if (!matchName && !matchDesc && !matchTags && !matchIngredients) return false;
    }

    // Category filter
    if (selectedCategory !== 'ALL' && food.categoryId !== selectedCategory) {
      return false;
    }

    // Availability filter
    if (filterAvailability === 'AVAILABLE_ONLY' && !food.isAvailable) {
      return false;
    }

    return true;
  });

  // Sorting
  filteredFoods.sort((a, b) => {
    if (sortBy === 'PRICE_LOW') return a.price - b.price;
    if (sortBy === 'PRICE_HIGH') return b.price - a.price;
    if (sortBy === 'RATING') return b.rating - a.rating;
    if (sortBy === 'PREP_TIME') return a.preparationMinutes - b.preparationMinutes;
    // POPULAR default
    const aPop = a.tags?.includes('Popular') ? 1 : 0;
    const bPop = b.tags?.includes('Popular') ? 1 : 0;
    return bPop - aPop || b.reviewCount - a.reviewCount;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 animate-in fade-in duration-300">
      {/* Title & Subtitle */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-['Outfit']">
          Today's Menu
        </h1>
        <p className="text-sm text-stone-500 mt-1">
          Choose your favorite meal and select a pickup time.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search food, ingredients, tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
            />
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-stone-500 hidden sm:inline">Sort:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 rounded-xl border border-stone-200 text-xs font-semibold text-stone-700 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="POPULAR">Most Popular</option>
              <option value="PRICE_LOW">Price: Low to High</option>
              <option value="PRICE_HIGH">Price: High to Low</option>
              <option value="RATING">Highest Rated</option>
              <option value="PREP_TIME">Quickest Prep Time</option>
            </select>

            {/* Availability Toggle */}
            <button
              onClick={() =>
                setFilterAvailability(
                  filterAvailability === 'ALL' ? 'AVAILABLE_ONLY' : 'ALL'
                )
              }
              className={`px-3 py-2 rounded-xl border text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                filterAvailability === 'AVAILABLE_ONLY'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                  : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Available Only</span>
            </button>
          </div>
        </div>

        {/* Categories Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar">
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 ${
              selectedCategory === 'ALL'
                ? 'bg-amber-600 text-white shadow-2xs'
                : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
            }`}
          >
            All Items ({foods.filter((f) => !f.isDeactivated).length})
          </button>
          {categories
            .filter((c) => c.isActive)
            .map((cat) => {
              const count = foods.filter(
                (f) => !f.isDeactivated && f.categoryId === cat.id
              ).length;
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 ${
                    isSelected
                      ? 'bg-amber-600 text-white shadow-2xs'
                      : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                  }`}
                >
                  {cat.name} ({count})
                </button>
              );
            })}
        </div>
      </div>

      {/* Food Cards Grid */}
      {filteredFoods.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-stone-200">
          <AlertCircle className="w-12 h-12 text-stone-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-stone-800">No food items found</h3>
          <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search query or switching categories.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('ALL');
              setFilterAvailability('ALL');
            }}
            className="mt-4 px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold rounded-xl"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredFoods.map((food) => {
            const isFav = favorites.includes(food.id);
            const isUnavailable = !food.isAvailable || food.isDeactivated;

            return (
              <div
                key={food.id}
                className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                {/* Image Container */}
                <div
                  className="relative h-48 overflow-hidden bg-stone-100 cursor-pointer"
                  onClick={() => setSelectedFood(food)}
                >
                  <img
                    src={food.imageUrl}
                    alt={food.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />

                  {/* Badges */}
                  <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1">
                    {food.tags?.map((tag) => (
                      <span
                        key={tag}
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-xs ${
                          tag === 'Popular'
                            ? 'bg-amber-600 text-white'
                            : tag === 'Chef Special'
                            ? 'bg-rose-600 text-white'
                            : tag === 'Vegetarian'
                            ? 'bg-emerald-600 text-white'
                            : 'bg-stone-900/80 text-white'
                        }`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Favorite Button */}
                  <button
                    type="button"
                    onClick={(e) => handleToggleFavorite(food.id, e)}
                    className="absolute top-2.5 right-2.5 p-2 bg-white/90 hover:bg-white rounded-full text-stone-700 shadow-sm transition-colors"
                    title={isFav ? 'Remove from favorites' : 'Add to favorites'}
                    aria-label="Toggle Favorite"
                  >
                    <Bookmark
                      className={`w-4 h-4 ${
                        isFav ? 'fill-amber-500 text-amber-500' : 'text-stone-400'
                      }`}
                    />
                  </button>

                  {/* Rating & Prep overlay */}
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-[11px] font-bold text-white">
                    <span className="bg-stone-900/80 backdrop-blur-xs px-2 py-0.5 rounded-md flex items-center gap-1">
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                      <span>{food.rating}</span>
                      <span className="text-stone-300 font-normal">({food.reviewCount})</span>
                    </span>

                    <span className="bg-stone-900/80 backdrop-blur-xs px-2 py-0.5 rounded-md flex items-center gap-1">
                      <Clock className="w-3 h-3 text-stone-300" />
                      <span>{food.preparationMinutes}m</span>
                    </span>
                  </div>

                  {/* Unavailable overlay */}
                  {isUnavailable && (
                    <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-2xs flex items-center justify-center">
                      <span className="bg-rose-600 text-white text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-xl shadow-md">
                        Currently Unavailable
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3
                      onClick={() => setSelectedFood(food)}
                      className="font-bold text-stone-900 text-base hover:text-amber-600 cursor-pointer line-clamp-1 font-['Outfit']"
                    >
                      {food.name}
                    </h3>
                    <p className="text-xs text-stone-500 mt-1 line-clamp-2 leading-relaxed">
                      {food.description}
                    </p>
                  </div>

                  {/* Price & Action */}
                  <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                    <div>
                      <span className="text-base font-extrabold text-stone-900 font-['Outfit']">
                        Rs. {food.price.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setSelectedFood(food)}
                        className="py-1.5 px-2.5 text-xs font-semibold text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors"
                      >
                        Details
                      </button>

                      <button
                        onClick={() => setSelectedFood(food)}
                        disabled={isUnavailable}
                        className={`py-1.5 px-3 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 ${
                          isUnavailable
                            ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                            : 'bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white shadow-2xs'
                        }`}
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Food Details Modal */}
      <FoodDetailsModal
        foodItem={selectedFood}
        isOpen={!!selectedFood}
        onClose={() => setSelectedFood(null)}
      />
    </div>
  );
};
