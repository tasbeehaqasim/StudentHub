import { CartItem, FoodItem } from '../types';

const CART_KEY = 'campusbite_student_cart';

type CartListener = (items: CartItem[]) => void;

class CartService {
  private items: CartItem[] = [];
  private listeners: CartListener[] = [];

  constructor() {
    this.restore();
  }

  private restore() {
    try {
      const raw = localStorage.getItem(CART_KEY);
      if (raw) {
        this.items = JSON.parse(raw);
      }
    } catch {
      this.items = [];
    }
  }

  private persist() {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(this.items));
    } catch {
      // ignore
    }
    this.listeners.forEach((l) => l(this.items));
  }

  public subscribe(listener: CartListener): () => void {
    this.listeners.push(listener);
    listener(this.items);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  public getItems(): CartItem[] {
    return [...this.items];
  }

  public addItem(foodItem: FoodItem, quantity: number = 1, specialInstructions?: string): { success: boolean; error?: string } {
    if (!foodItem.isAvailable || foodItem.isDeactivated) {
      return { success: false, error: 'This item is currently unavailable.' };
    }
    if (quantity <= 0) return { success: false, error: 'Quantity must be at least 1.' };

    const cleanInstructions = specialInstructions?.trim() || '';
    const existingIndex = this.items.findIndex(
      (i) => i.foodItem.id === foodItem.id && (i.specialInstructions || '') === cleanInstructions
    );

    if (existingIndex > -1) {
      this.items[existingIndex].quantity += quantity;
    } else {
      this.items.push({
        foodItem,
        quantity,
        specialInstructions: cleanInstructions || undefined
      });
    }

    this.persist();
    return { success: true };
  }

  public updateQuantity(index: number, newQty: number): void {
    if (index < 0 || index >= this.items.length) return;
    if (newQty <= 0) {
      this.removeItem(index);
    } else {
      this.items[index].quantity = newQty;
      this.persist();
    }
  }

  public removeItem(index: number): void {
    if (index >= 0 && index < this.items.length) {
      this.items.splice(index, 1);
      this.persist();
    }
  }

  public clearCart(): void {
    this.items = [];
    this.persist();
  }

  public getSubtotal(): number {
    return this.items.reduce((sum, item) => sum + item.foodItem.price * item.quantity, 0);
  }

  public getTotalItemCount(): number {
    return this.items.reduce((count, item) => count + item.quantity, 0);
  }
}

export const cart = new CartService();
