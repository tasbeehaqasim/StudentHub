import React, { useState, useEffect } from 'react';
import { Category } from '../../types';
import { db } from '../../services/db';
import { Modal } from '../../components/common/Modal';
import { ConfirmationModal } from '../../components/common/ConfirmationModal';
import { Plus, Edit2, Trash2, Layers, CheckCircle2 } from 'lucide-react';

export const AdminCategoriesManager: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>(db.getCategories());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deleteCategory, setDeleteCategory] = useState<Category | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('Utensils');

  useEffect(() => {
    const refresh = () => setCategories(db.getCategories());
    refresh();
    const unsub = db.subscribe(refresh);
    return unsub;
  }, []);

  const openCreate = () => {
    setEditingCategory(null);
    setName('');
    setDescription('');
    setIcon('Utensils');
    setIsModalOpen(true);
  };

  const openEdit = (cat: Category) => {
    setEditingCategory(cat);
    setName(cat.name);
    setDescription(cat.description);
    setIcon(cat.icon);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingCategory) {
      db.updateCategory(editingCategory.id, {
        name: name.trim(),
        description: description.trim(),
        icon
      });
    } else {
      db.createCategory({
        name: name.trim(),
        slug: name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description: description.trim(),
        icon,
        displayOrder: categories.length + 1,
        isActive: true
      });
    }

    setIsModalOpen(false);
  };

  const handleDelete = () => {
    if (!deleteCategory) return;
    db.deleteCategory(deleteCategory.id);
    setDeleteCategory(null);
  };

  const handleToggleActive = (id: string, current: boolean) => {
    db.updateCategory(id, { isActive: !current });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-stone-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-['Outfit']">
            Food Categories
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Organize cafeteria menus into intuitive browsing sections for students.
          </p>
        </div>

        <button
          onClick={openCreate}
          className="py-2.5 px-4 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs shadow-md transition-colors flex items-center justify-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>New Category</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="bg-white rounded-3xl p-5 border border-stone-200 shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-sm">
                  <Layers className="w-5 h-5" />
                </div>

                <button
                  onClick={() => handleToggleActive(cat.id, cat.isActive)}
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    cat.isActive
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-stone-100 text-stone-500 border border-stone-200'
                  }`}
                >
                  {cat.isActive ? 'Active' : 'Hidden'}
                </button>
              </div>

              <h3 className="font-bold text-stone-900 text-base font-['Outfit']">{cat.name}</h3>
              <p className="text-xs text-stone-500 mt-1 line-clamp-2">{cat.description}</p>
            </div>

            <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-end gap-2">
              <button
                onClick={() => openEdit(cat)}
                className="p-1.5 text-stone-500 hover:text-amber-700 hover:bg-stone-50 rounded-lg transition-colors"
                title="Edit category"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setDeleteCategory(cat)}
                className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-stone-50 rounded-lg transition-colors"
                title="Delete category"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCategory ? 'Edit Category' : 'Create Category'}
        subtitle="Manage cafeteria menu groupings"
        maxWidth="sm"
      >
        <form onSubmit={handleSave} className="space-y-3.5">
          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
              Category Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Traditional Rice & Biryani"
              className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
              Description
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short description..."
              className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs"
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs shadow-md transition-colors mt-2"
          >
            {editingCategory ? 'Update Category' : 'Save Category'}
          </button>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmationModal
        isOpen={!!deleteCategory}
        onClose={() => setDeleteCategory(null)}
        onConfirm={handleDelete}
        title="Delete Category?"
        description={`Are you sure you want to remove "${deleteCategory?.name}"? Dishes in this category should be reassigned.`}
        confirmText="Confirm Delete"
        variant="danger"
      />
    </div>
  );
};
