'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Banner, Channel } from '@/lib/supabase';
import ImageInput from '@/components/admin/ImageInput';
import { Trash2, Plus, X, Pencil } from 'lucide-react';

type FormState = {
  id?: string;
  image_url: string;
  title: string;
  description: string;
  channel_id: string;
  is_active: boolean;
};

const emptyForm: FormState = {
  image_url: '',
  title: '',
  description: '',
  channel_id: '',
  is_active: true,
};

export default function BannersAdminPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    const [bannersRes, channelsRes] = await Promise.all([
      supabase
        .from('banners')
        .select('*, channels(*)')
        .order('sort_order', { ascending: true }),
      supabase.from('channels').select('*').order('name', { ascending: true }),
    ]);
    setBanners((bannersRes.data || []) as Banner[]);
    setChannels((channelsRes.data || []) as Channel[]);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const openNew = () => {
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEdit = (banner: Banner) => {
    setForm({
      id: banner.id,
      image_url: banner.image_url,
      title: banner.title || '',
      description: banner.description || '',
      channel_id: banner.channel_id || '',
      is_active: banner.is_active,
    });
    setShowForm(true);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.image_url.trim()) return;
    setSaving(true);

    const payload = {
      image_url: form.image_url.trim(),
      title: form.title.trim() || null,
      description: form.description.trim() || null,
      channel_id: form.channel_id || null,
      is_active: form.is_active,
    };

    if (form.id) {
      await supabase.from('banners').update(payload).eq('id', form.id);
    } else {
      const maxOrder = banners.reduce((m, b) => Math.max(m, b.sort_order), 0);
      await supabase.from('banners').insert({ ...payload, sort_order: maxOrder + 1 });
    }

    setSaving(false);
    setShowForm(false);
    load();
  };

  const deleteBanner = async (id: string) => {
    if (!confirm('Delete this banner?')) return;
    await supabase.from('banners').delete().eq('id', id);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
        <h2 className="font-heading font-extrabold text-2xl">Banners ({banners.length})</h2>
        <button
          onClick={openNew}
          className="btn-brut bg-primary px-4 py-2 rounded-brut font-heading font-bold flex items-center gap-2"
        >
          <Plus size={18} strokeWidth={3} />
          Add Banner
        </button>
      </div>

      {showForm && (
        <div className="card-brut bg-[#15151f] p-4 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading font-bold">{form.id ? 'Edit Banner' : 'New Banner'}</h3>
            <button onClick={() => setShowForm(false)} aria-label="Close">
              <X size={20} />
            </button>
          </div>
          <form onSubmit={save} className="flex flex-col gap-4">
            <ImageInput
              label="Banner Image"
              value={form.image_url}
              onChange={(url) => setForm({ ...form, image_url: url })}
            />
            <div>
              <label className="block text-sm font-heading font-bold mb-2">Title</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full bg-[#0a0a0f] border-2 border-black rounded-brut px-4 py-2.5 text-white focus:outline-none focus:shadow-brut-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-heading font-bold mb-2">Short Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={2}
                className="w-full bg-[#0a0a0f] border-2 border-black rounded-brut px-4 py-2.5 text-white focus:outline-none focus:shadow-brut-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-heading font-bold mb-2">
                Promote Channel (Watch Now redirects here)
              </label>
              <select
                value={form.channel_id}
                onChange={(e) => setForm({ ...form, channel_id: e.target.value })}
                className="w-full bg-[#0a0a0f] border-2 border-black rounded-brut px-4 py-2.5 text-white focus:outline-none focus:shadow-brut-sm"
              >
                <option value="">No channel link</option>
                {channels.map((ch) => (
                  <option key={ch.id} value={ch.id}>
                    {ch.name}
                  </option>
                ))}
              </select>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                className="w-5 h-5 accent-primary"
              />
              <span className="font-heading font-bold text-sm">Active (show on homepage)</span>
            </label>
            <button
              type="submit"
              disabled={saving}
              className="btn-brut bg-accent text-black py-2.5 rounded-brut font-heading font-extrabold disabled:opacity-50"
            >
              {saving ? 'Saving...' : form.id ? 'Update Banner' : 'Add Banner'}
            </button>
          </form>
        </div>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="flex flex-col gap-2">
          {banners.map((banner) => (
            <div
              key={banner.id}
              className="card-brut bg-[#15151f] p-3 flex items-center justify-between gap-2"
            >
              <div className="flex items-center gap-3 min-w-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={banner.image_url}
                  alt={banner.title || 'Banner'}
                  className="w-20 h-12 object-cover bg-[#0a0a0f] border-2 border-black rounded-brut flex-shrink-0"
                />
                <div className="min-w-0">
                  <p className="font-heading font-bold truncate">{banner.title || 'Untitled'}</p>
                  <p className="text-xs text-gray-400 truncate">
                    {banner.channels?.name ? `→ ${banner.channels.name}` : 'No channel link'}
                    {!banner.is_active && ' · Inactive'}
                  </p>
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button
                  onClick={() => openEdit(banner)}
                  className="btn-brut bg-primary p-2 rounded-brut"
                  aria-label="Edit"
                >
                  <Pencil size={16} strokeWidth={2.5} />
                </button>
                <button
                  onClick={() => deleteBanner(banner.id)}
                  className="btn-brut bg-highlight text-black p-2 rounded-brut"
                  aria-label="Delete"
                >
                  <Trash2 size={16} strokeWidth={2.5} />
                </button>
              </div>
            </div>
          ))}
          {banners.length === 0 && <p className="text-gray-400">No banners yet.</p>}
        </div>
      )}
    </div>
  );
}
