'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Channel, Category } from '@/lib/supabase';
import ImageInput from '@/components/admin/ImageInput';
import { Trash2, Plus, X, Pencil } from 'lucide-react';

type FormState = {
  id?: string;
  name: string;
  stream_url: string;
  logo_url: string;
  category_id: string;
  is_live: boolean;
  is_trending: boolean;
  is_recent: boolean;
};

const emptyForm: FormState = {
  name: '',
  stream_url: '',
  logo_url: '',
  category_id: '',
  is_live: true,
  is_trending: false,
  is_recent: true,
};

export default function ChannelsAdminPage() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');

  const load = async () => {
    setLoading(true);
    const [channelsRes, categoriesRes] = await Promise.all([
      supabase
        .from('channels')
        .select('*, categories(*)')
        .order('sort_order', { ascending: true }),
      supabase.from('categories').select('*').order('sort_order', { ascending: true }),
    ]);
    setChannels((channelsRes.data || []) as Channel[]);
    setCategories((categoriesRes.data || []) as Category[]);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const openNew = () => {
    setForm(emptyForm);
    setShowForm(true);
  };

  const openEdit = (channel: Channel) => {
    setForm({
      id: channel.id,
      name: channel.name,
      stream_url: channel.stream_url,
      logo_url: channel.logo_url || '',
      category_id: channel.category_id || '',
      is_live: channel.is_live,
      is_trending: channel.is_trending,
      is_recent: channel.is_recent,
    });
    setShowForm(true);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.stream_url.trim()) return;
    setSaving(true);

    const payload = {
      name: form.name.trim(),
      stream_url: form.stream_url.trim(),
      logo_url: form.logo_url.trim() || null,
      category_id: form.category_id || null,
      is_live: form.is_live,
      is_trending: form.is_trending,
      is_recent: form.is_recent,
    };

    if (form.id) {
      await supabase.from('channels').update(payload).eq('id', form.id);
    } else {
      const maxOrder = channels.reduce((m, c) => Math.max(m, c.sort_order), 0);
      await supabase.from('channels').insert({ ...payload, sort_order: maxOrder + 1 });
    }

    setSaving(false);
    setShowForm(false);
    load();
  };

  const deleteChannel = async (id: string) => {
    if (!confirm('Delete this channel?')) return;
    await supabase.from('channels').delete().eq('id', id);
    load();
  };

  const filtered = channels.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
        <h2 className="font-heading font-extrabold text-2xl">Channels ({channels.length})</h2>
        <button
          onClick={openNew}
          className="btn-brut bg-primary px-4 py-2 rounded-brut font-heading font-bold flex items-center gap-2"
        >
          <Plus size={18} strokeWidth={3} />
          Add Channel
        </button>
      </div>

      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search channels..."
        className="w-full bg-[#15151f] border-2 border-black rounded-brut px-4 py-2.5 mb-4 text-white focus:outline-none focus:shadow-brut-sm"
      />

      {showForm && (
        <div className="card-brut bg-[#15151f] p-4 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading font-bold">{form.id ? 'Edit Channel' : 'New Channel'}</h3>
            <button onClick={() => setShowForm(false)} aria-label="Close">
              <X size={20} />
            </button>
          </div>
          <form onSubmit={save} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-heading font-bold mb-2">Channel Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-[#0a0a0f] border-2 border-black rounded-brut px-4 py-2.5 text-white focus:outline-none focus:shadow-brut-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-heading font-bold mb-2">Stream URL (M3U8)</label>
              <input
                type="text"
                value={form.stream_url}
                onChange={(e) => setForm({ ...form, stream_url: e.target.value })}
                className="w-full bg-[#0a0a0f] border-2 border-black rounded-brut px-4 py-2.5 text-white focus:outline-none focus:shadow-brut-sm"
                required
              />
            </div>
            <ImageInput
              label="Channel Logo"
              value={form.logo_url}
              onChange={(url) => setForm({ ...form, logo_url: url })}
            />
            <div>
              <label className="block text-sm font-heading font-bold mb-2">Category</label>
              <select
                value={form.category_id}
                onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                className="w-full bg-[#0a0a0f] border-2 border-black rounded-brut px-4 py-2.5 text-white focus:outline-none focus:shadow-brut-sm"
              >
                <option value="">Uncategorized</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-wrap gap-4">
              <Checkbox
                label="Live"
                checked={form.is_live}
                onChange={(v) => setForm({ ...form, is_live: v })}
              />
              <Checkbox
                label="Trending"
                checked={form.is_trending}
                onChange={(v) => setForm({ ...form, is_trending: v })}
              />
              <Checkbox
                label="Recently Added"
                checked={form.is_recent}
                onChange={(v) => setForm({ ...form, is_recent: v })}
              />
            </div>
            <button
              type="submit"
              disabled={saving}
              className="btn-brut bg-accent text-black py-2.5 rounded-brut font-heading font-extrabold disabled:opacity-50"
            >
              {saving ? 'Saving...' : form.id ? 'Update Channel' : 'Add Channel'}
            </button>
          </form>
        </div>
      )}

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="flex flex-col gap-2">
          {filtered.map((channel) => (
            <div
              key={channel.id}
              className="card-brut bg-[#15151f] p-3 flex items-center justify-between gap-2"
            >
              <div className="flex items-center gap-3 min-w-0">
                {channel.logo_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={channel.logo_url}
                    alt={channel.name}
                    className="w-10 h-10 object-contain bg-[#0a0a0f] border-2 border-black rounded-brut flex-shrink-0"
                  />
                ) : (
                  <div className="w-10 h-10 bg-[#0a0a0f] border-2 border-black rounded-brut flex-shrink-0" />
                )}
                <div className="min-w-0">
                  <p className="font-heading font-bold truncate">{channel.name}</p>
                  <p className="text-xs text-gray-400 truncate">
                    {channel.categories?.name || 'Uncategorized'}
                    {channel.is_trending && ' · Trending'}
                  </p>
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button
                  onClick={() => openEdit(channel)}
                  className="btn-brut bg-primary p-2 rounded-brut"
                  aria-label="Edit"
                >
                  <Pencil size={16} strokeWidth={2.5} />
                </button>
                <button
                  onClick={() => deleteChannel(channel.id)}
                  className="btn-brut bg-highlight text-black p-2 rounded-brut"
                  aria-label="Delete"
                >
                  <Trash2 size={16} strokeWidth={2.5} />
                </button>
              </div>
            </div>
          ))}
          {filtered.length === 0 && <p className="text-gray-400">No channels found.</p>}
        </div>
      )}
    </div>
  );
}

function Checkbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-5 h-5 accent-primary"
      />
      <span className="font-heading font-bold text-sm">{label}</span>
    </label>
  );
}
