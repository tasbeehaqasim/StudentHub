import React, { useState, useEffect } from 'react';
import { InventoryItem } from '../../types';
import { db } from '../../services/db';
import { InventoryStatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';
import {
  Boxes,
  Plus,
  AlertTriangle,
  RotateCcw,
  Search,
  CheckCircle2,
  PackagePlus,
  ArrowUpRight
} from 'lucide-react';

export const AdminInventoryManager: React.FC = () => {
  const [inventory, setInventory] = useState<InventoryItem[]>(db.getInventory());
  const [search, setSearch] = useState('');
  const [restockModalItem, setRestockModalItem] = useState<InventoryItem | null>(null);
  const [restockQty, setRestockQty] = useState<number>(20);
  const [supplierNote, setSupplierNote] = useState('Standard vendor delivery');
  const [restockSuccess, setRestockSuccess] = useState(false);

  // New Item Modal
  const [isNewItemModalOpen, setIsNewItemModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState('Grains & Staples');
  const [newStock, setNewStock] = useState<number>(50);
  const [newUnit, setNewUnit] = useState('kg');
  const [newThreshold, setNewThreshold] = useState<number>(15);
  const [newUnitCost, setNewUnitCost] = useState<number>(200);

  useEffect(() => {
    const refresh = () => {
      setInventory(db.getInventory());
    };
    refresh();
    const unsub = db.subscribe(refresh);
    return unsub;
  }, []);

  const lowStockItems = inventory.filter((i) => i.currentStock <= i.minimumThreshold);

  const handleRestockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!restockModalItem || restockQty <= 0) return;

    db.restockInventory(restockModalItem.id, restockQty, supplierNote);
    setRestockSuccess(true);
    setTimeout(() => {
      setRestockSuccess(false);
      setRestockModalItem(null);
      setRestockQty(20);
    }, 1000);
  };

  const handleCreateInventoryItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const status =
      newStock <= 0
        ? 'OUT_OF_STOCK'
        : newStock <= newThreshold
        ? 'LOW_STOCK'
        : 'IN_STOCK';

    const newItem: InventoryItem = {
      id: `inv-${Date.now()}`,
      name: newName.trim(),
      itemName: newName.trim(),
      category: newCategory,
      currentQuantity: Number(newStock),
      currentStock: Number(newStock),
      unit: newUnit,
      minimumThreshold: Number(newThreshold),
      costPerUnit: Number(newUnitCost),
      unitCost: Number(newUnitCost),
      status,
      lastRestocked: new Date().toISOString(),
      lastRestockedAt: new Date().toISOString()
    };

    db.addInventoryItem(newItem);
    setIsNewItemModalOpen(false);
    setNewName('');
  };

  const filteredInventory = inventory.filter((item) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        item.itemName.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 animate-in fade-in duration-300">
      {/* Title & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-stone-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-['Outfit']">
            Cafeteria Inventory & Stock Sync
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Monitor raw ingredient levels, track supplier costs, and restock supplies.
          </p>
        </div>

        <button
          onClick={() => setIsNewItemModalOpen(true)}
          className="py-2.5 px-4 bg-stone-900 hover:bg-black text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Add Raw Material / Stock</span>
        </button>
      </div>

      {/* Low Stock Alert Banner */}
      {lowStockItems.length > 0 && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-bold text-rose-900 text-xs uppercase tracking-wider">
              Stock Reorder Warnings ({lowStockItems.length} items low)
            </h4>
            <p className="text-xs text-rose-700 mt-0.5">
              The following ingredients are below minimum threshold:{' '}
              <span className="font-bold font-mono">
                {lowStockItems.map((i) => `${i.itemName} (${i.currentStock} ${i.unit})`).join(', ')}
              </span>
              . Please initiate supplier restock to prevent cafeteria order delays.
            </p>
          </div>
        </div>
      )}

      {/* Search Toolbar */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
        <input
          type="text"
          placeholder="Search raw materials or ingredients..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
        />
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-400 uppercase font-bold text-[10px]">
              <tr>
                <th className="py-3.5 px-4">Ingredient / Material</th>
                <th className="py-3.5 px-3">Category</th>
                <th className="py-3.5 px-3">Current Stock</th>
                <th className="py-3.5 px-3">Threshold</th>
                <th className="py-3.5 px-3">Unit Cost</th>
                <th className="py-3.5 px-3 text-center">Stock Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-stone-700">
              {filteredInventory.map((item) => {
                return (
                  <tr key={item.id} className="hover:bg-stone-50/70 transition-colors">
                    <td className="py-3 px-4 font-bold text-stone-900">{item.itemName}</td>
                    <td className="py-3 px-3 text-stone-500">{item.category}</td>
                    <td className="py-3 px-3 font-mono font-bold text-stone-900">
                      {item.currentStock} {item.unit}
                    </td>
                    <td className="py-3 px-3 font-mono text-stone-500">
                      {item.minimumThreshold} {item.unit}
                    </td>
                    <td className="py-3 px-3 font-mono text-stone-700">
                      Rs. {item.unitCost.toLocaleString()} / {item.unit}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <InventoryStatusBadge status={item.status} />
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => {
                          setRestockModalItem(item);
                          setRestockQty(25);
                          setSupplierNote('Standard delivery');
                        }}
                        className="py-1.5 px-3 bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold rounded-lg transition-colors inline-flex items-center gap-1"
                      >
                        <PackagePlus className="w-3.5 h-3.5" />
                        <span>Restock</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Restock Modal */}
      <Modal
        isOpen={!!restockModalItem}
        onClose={() => setRestockModalItem(null)}
        title="Restock Inventory Material"
        subtitle={`Item: ${restockModalItem?.itemName} (${restockModalItem?.currentStock} ${restockModalItem?.unit} currently)`}
        maxWidth="sm"
      >
        {restockSuccess ? (
          <div className="p-6 text-center space-y-2">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
            <h4 className="font-bold text-stone-900 text-sm">Inventory Updated!</h4>
            <p className="text-xs text-stone-500">
              Stock levels synchronized with live kitchen capacity.
            </p>
          </div>
        ) : (
          <form onSubmit={handleRestockSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Quantity to Add ({restockModalItem?.unit}) *
              </label>
              <input
                type="number"
                required
                min="1"
                value={restockQty}
                onChange={(e) => setRestockQty(Number(e.target.value))}
                className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs font-bold font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Supplier Note / PO Number
              </label>
              <input
                type="text"
                value={supplierNote}
                onChange={(e) => setSupplierNote(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs font-medium"
              />
            </div>

            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-600 flex justify-between">
              <span>Estimated Cost:</span>
              <span className="font-bold font-mono text-stone-900">
                Rs. {((restockModalItem?.unitCost || 0) * restockQty).toLocaleString()}
              </span>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs shadow-md transition-colors"
            >
              Confirm Restock Addition
            </button>
          </form>
        )}
      </Modal>

      {/* Add New Stock Item Modal */}
      <Modal
        isOpen={isNewItemModalOpen}
        onClose={() => setIsNewItemModalOpen(false)}
        title="Add New Inventory Item"
        subtitle="Track ingredient levels and reorder limits"
        maxWidth="sm"
      >
        <form onSubmit={handleCreateInventoryItem} className="space-y-3.5">
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
              Material Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Basmati Rice Extra Long"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
              Category
            </label>
            <input
              type="text"
              required
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Initial Stock
              </label>
              <input
                type="number"
                required
                min="0"
                value={newStock}
                onChange={(e) => setNewStock(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Unit (kg, liters, units)
              </label>
              <input
                type="text"
                required
                value={newUnit}
                onChange={(e) => setNewUnit(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Minimum Alert Threshold
              </label>
              <input
                type="number"
                required
                min="1"
                value={newThreshold}
                onChange={(e) => setNewThreshold(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Unit Cost (Rs.)
              </label>
              <input
                type="number"
                required
                min="0"
                value={newUnitCost}
                onChange={(e) => setNewUnitCost(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-mono"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-stone-900 hover:bg-black text-white font-bold rounded-xl text-xs shadow-md transition-colors mt-2"
          >
            Create Inventory Record
          </button>
        </form>
      </Modal>
    </div>
  );
};
