import React, { useState } from 'react';
import { FoodItem } from '../../types';
import { Modal } from '../../components/common/Modal';
import { cart } from '../../services/cart';
import {
  Star,
  Clock,
  Flame,
  Minus,
  Plus,
  ShoppingBag,
  AlertCircle,
  ShieldAlert,
  Check
} from 'lucide-react';

interface FoodDetailsModalProps {
  foodItem: FoodItem | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCartSuccess?: () => void;
}

export const FoodDetailsModal: React.FC<FoodDetailsModalProps> = ({
  foodItem,
  isOpen,
  onClose,
  onAddToCartSuccess
}) => {
  const [quantity, setQuantity] = useState(1);
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [addedNotice, setAddedNotice] = useState(false);

  if (!foodItem) return null;

  const isUnavailable = !foodItem.isAvailable || foodItem.isDeactivated;

  const handleAddToCart = () => {
    if (isUnavailable) return;
    const res = cart.addItem(foodItem, quantity, specialInstructions);
    if (res.success) {
      setAddedNotice(true);
      setTimeout(() => {
        setAddedNotice(false);
        onClose();
        if (onAddToCartSuccess) onAddToCartSuccess();
      }, 700);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={foodItem.name}
      subtitle={`Rs. ${foodItem.price.toLocaleString()} • ${foodItem.preparationMinutes} mins prep`}
      maxWidth="lg"
    >
      <div className="flex flex-col gap-5">
        {/* Large Food Image */}
        <div className="relative w-full h-56 rounded-2xl overflow-hidden bg-stone-100 border border-stone-200">
          <img
            src={foodItem.imageUrl}
            alt={foodItem.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          {foodItem.tags && foodItem.tags.length > 0 && (
            <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
              {foodItem.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-600/90 backdrop-blur-xs text-white shadow-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          {isUnavailable && (
            <div className="absolute inset-0 bg-stone-900/60 backdrop-blur-2xs flex items-center justify-center">
              <span className="bg-rose-600 text-white text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-xl shadow-md">
                Currently Unavailable
              </span>
            </div>
          )}
        </div>

        {/* Rating & Prep stats */}
        <div className="flex items-center justify-between text-xs text-stone-600 pb-3 border-b border-stone-100">
          <div className="flex items-center gap-1 text-amber-600 font-bold">
            <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
            <span>{foodItem.rating}</span>
            <span className="text-stone-400 font-normal">({foodItem.reviewCount} reviews)</span>
          </div>

          <div className="flex items-center gap-1.5 font-medium">
            <Clock className="w-4 h-4 text-stone-400" />
            <span>Prep: ~{foodItem.preparationMinutes} minutes</span>
          </div>

          {foodItem.calories && (
            <div className="flex items-center gap-1 font-medium text-stone-500">
              <Flame className="w-4 h-4 text-orange-500" />
              <span>{foodItem.calories} kcal</span>
            </div>
          )}
        </div>

        {/* Description */}
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-1">
            Description
          </h4>
          <p className="text-sm text-stone-700 leading-relaxed">{foodItem.description}</p>
        </div>

        {/* Ingredients & Allergens */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-stone-50 p-4 rounded-2xl border border-stone-200/80">
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1.5">
              Fresh Ingredients
            </h4>
            <div className="flex flex-wrap gap-1">
              {foodItem.ingredients.map((ing) => (
                <span
                  key={ing}
                  className="px-2 py-0.5 rounded-md bg-white border border-stone-200 text-stone-700 text-xs font-medium"
                >
                  {ing}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1.5">
              Allergen Notice
            </h4>
            {foodItem.allergens && foodItem.allergens.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {foodItem.allergens.map((all) => (
                  <span
                    key={all}
                    className="px-2 py-0.5 rounded-md bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium"
                  >
                    Contains {all}
                  </span>
                ))}
              </div>
            ) : (
              <span className="text-xs text-stone-500">No common allergens declared</span>
            )}
          </div>
        </div>

        {/* Special Customization Instructions */}
        <div>
          <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
            Special Instructions / Kitchen Customization
          </label>
          <input
            type="text"
            placeholder="e.g. Less spicy, no onions, extra garlic mayo sauce..."
            value={specialInstructions}
            onChange={(e) => setSpecialInstructions(e.target.value)}
            disabled={isUnavailable}
            className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs disabled:opacity-50"
          />
        </div>

        {/* Quantity Controls & Add to Cart button */}
        <div className="flex items-center justify-between gap-4 pt-3 border-t border-stone-100 mt-2">
          {/* Quantity */}
          <div className="flex items-center border border-stone-200 rounded-xl bg-stone-50 p-1">
            <button
              type="button"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1 || isUnavailable}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-stone-600 hover:bg-white transition-colors disabled:opacity-30"
              aria-label="Decrease quantity"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-10 text-center font-bold text-stone-900 text-sm">{quantity}</span>
            <button
              type="button"
              onClick={() => setQuantity(quantity + 1)}
              disabled={isUnavailable}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-stone-600 hover:bg-white transition-colors disabled:opacity-30"
              aria-label="Increase quantity"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Add Button */}
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isUnavailable}
            className={`flex-1 py-3 px-5 rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 ${
              isUnavailable
                ? 'bg-stone-300 text-stone-500 cursor-not-allowed'
                : addedNotice
                ? 'bg-emerald-600 text-white'
                : 'bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white'
            }`}
          >
            {addedNotice ? (
              <>
                <Check className="w-4 h-4" />
                <span>Added to Cart!</span>
              </>
            ) : isUnavailable ? (
              <>
                <AlertCircle className="w-4 h-4" />
                <span>Currently Unavailable</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Cart • Rs. {(foodItem.price * quantity).toLocaleString()}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};
