'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Category } from '@/lib/supabase';
import { slugify } from '@/lib/m3u-parser';
import { Trash2, Plus } from 'lucide-react';

export default function CategoriesAdminPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('categories')
      .select('*')
      .order('sort_order', { ascending: true });
    setCategories((data || []) as Category[]);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const addCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const maxOrder = categories.reduce((m, c) => Math.max(m, c.sort_order), 0);

    await supabase.from('categories').insert({
      name: name.trim(),
      slug: slugify(name.trim()),
      sort_order: maxOrder + 1,
    });

    setName('');
    load();
  };

  const deleteCategory = async (id: string) => {
    if (!confirm('Delete this category? Channels in it will become uncategorized.')) return;
    await supabase.from('categories').delete().eq('id', id);
    load();
  };

  const moveCategory = async (index: number, direction: -1 | 1) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= categories.length) return;

    const a = categories[index];
    const b = categories[newIndex];

    await Promise.all([
      supabase.from('categories').update({ sort_order: b.sort_order }).eq('id', a.id),
      supabase.from('categories').update({ sort_order: a.sort_order }).eq('id', b.id),
    ]);

    load();
  };

  return (
    <div>
      <h2 className="font-heading font-extrabold text-2xl mb-6">Categories</h2>

      <form onSubmit={addCategory} className="flex gap-2 mb-6">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New category name"
          className="flex-1 bg-[#15151f] border-2 border-black rounded-brut px-4 py-2.5 text-white focus:outline-none focus:shadow-brut-sm"
        />
        <button
          type="submit"
          className="btn-brut bg-primary px-4 py-2.5 rounded-brut font-heading font-bold flex items-center gap-2"
        >
          <Plus size={18} strokeWidth={3} />
          Add
        </button>
      </form>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="flex flex-col gap-2">
          {categories.map((cat, i) => (
            <div
              key={cat.id}
              className="card-brut bg-[#15151f] p-3 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="flex flex-col">
                  <button
                    onClick={() => moveCategory(i, -1)}
                    disabled={i === 0}
                    className="text-xs disabled:opacity-30"
                  >
                    ▲
                  </button>
                  <button
                    onClick={() => moveCategory(i, 1)}
                    disabled={i === categories.length - 1}
                    className="text-xs disabled:opacity-30"
                  >
                    ▼
                  </button>
                </div>
                <span className="font-heading font-bold">{cat.name}</span>
                <span className="text-xs text-gray-400">/{cat.slug}</span>
              </div>
              <button
                onClick={() => deleteCategory(cat.id)}
                className="btn-brut bg-highlight text-black p-2 rounded-brut"
                aria-label="Delete category"
              >
                <Trash2 size={16} strokeWidth={2.5} />
              </button>
            </div>
          ))}
          {categories.length === 0 && (
            <p className="text-gray-400">No categories yet. Add one above.</p>
          )}
        </div>
      )}
    </div>
  );
}
