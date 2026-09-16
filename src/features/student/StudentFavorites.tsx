import React, { useState, useEffect } from 'react';
import { FoodItem, StudentUser } from '../../types';
import { db } from '../../services/db';
import { cart } from '../../services/cart';
import { FoodDetailsModal } from './FoodDetailsModal';
import { Bookmark, Star, Clock, Plus, Trash2, UtensilsCrossed } from 'lucide-react';

interface StudentFavoritesProps {
  student: StudentUser;
  onNavigateToMenu: () => void;
}

export const StudentFavorites: React.FC<StudentFavoritesProps> = ({
  student,
  onNavigateToMenu
}) => {
  const [favoriteFoods, setFavoriteFoods] = useState<FoodItem[]>([]);
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);

  useEffect(() => {
    const refresh = () => {
      const favIds = db.getFavorites(student.id);
      const allFoods = db.getFoodItems();
      const favs = allFoods.filter((f) => favIds.includes(f.id));
      setFavoriteFoods(favs);
    };
    refresh();
    const unsub = db.subscribe(refresh);
    return unsub;
  }, [student.id]);

  const handleRemoveFavorite = (foodId: string) => {
    db.toggleFavorite(student.id, foodId);
    setFavoriteFoods((prev) => prev.filter((f) => f.id !== foodId));
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 animate-in fade-in duration-300">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-['Outfit']">
          Saved Favorites
        </h1>
        <p className="text-xs text-stone-500 mt-1">
          Quickly re-order your favorite cafeteria dishes with one click.
        </p>
      </div>

      {favoriteFoods.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-stone-200">
          <Bookmark className="w-12 h-12 text-stone-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-stone-800">No favorite meals saved yet</h3>
          <p className="text-xs text-stone-500 mt-1 mb-4">
            Click the bookmark icon on any dish in the menu to add it here.
          </p>
          <button
            onClick={onNavigateToMenu}
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl"
          >
            Explore Today's Menu
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {favoriteFoods.map((food) => (
            <div
              key={food.id}
              className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="relative h-44 overflow-hidden bg-stone-100">
                <img
                  src={food.imageUrl}
                  alt={food.name}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => handleRemoveFavorite(food.id)}
                  className="absolute top-2.5 right-2.5 p-2 bg-white/90 hover:bg-rose-50 text-rose-600 rounded-full shadow-xs transition-colors"
                  title="Remove from favorites"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-stone-900 text-sm font-['Outfit']">{food.name}</h3>
                  <p className="text-xs text-stone-500 mt-1 line-clamp-2">{food.description}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                  <span className="text-sm font-extrabold text-stone-900 font-['Outfit']">
                    Rs. {food.price.toLocaleString()}
                  </span>

                  <button
                    onClick={() => setSelectedFood(food)}
                    className="py-1.5 px-3 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1 shadow-2xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Order</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <FoodDetailsModal
        foodItem={selectedFood}
        isOpen={!!selectedFood}
        onClose={() => setSelectedFood(null)}
      />
    </div>
  );
};
