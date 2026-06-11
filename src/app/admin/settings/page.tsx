'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Trash2, AlertTriangle } from 'lucide-react';

export default function SettingsPage() {
  const [siteName, setSiteName] = useState('Sayem TV');
  const [footerText, setFooterText] = useState('© Sayem');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from('settings').select('*');
      const map = new Map((data || []).map((s) => [s.key, s.value]));
      if (map.has('site_name')) setSiteName(map.get('site_name')!);
      if (map.has('footer_text')) setFooterText(map.get('footer_text')!);
      setLoading(false);
    };
    load();
  }, []);

  const save = async () => {
    setSaving(true);
    await supabase.from('settings').upsert([
      { key: 'site_name', value: siteName },
      { key: 'footer_text', value: footerText },
    ]);
    setSaving(false);
    alert('Settings saved');
  };

  const deleteAllChannels = async () => {
    if (!confirm('This will permanently delete ALL channels. Are you sure?')) return;
    if (!confirm('This action cannot be undone. Confirm deletion of all channels?')) return;

    setDeleting(true);
    await supabase.from('channels').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    setDeleting(false);
    alert('All channels deleted');
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2 className="font-heading font-extrabold text-2xl mb-6">Settings</h2>

      <div className="card-brut bg-[#15151f] p-4 mb-6">
        <h3 className="font-heading font-bold mb-4">General</h3>
        <div className="mb-4">
          <label className="block text-sm font-heading font-bold mb-2">Site Name</label>
          <input
            type="text"
            value={siteName}
            onChange={(e) => setSiteName(e.target.value)}
            className="w-full bg-[#0a0a0f] border-2 border-black rounded-brut px-4 py-2.5 text-white focus:outline-none focus:shadow-brut-sm"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-heading font-bold mb-2">Footer Text</label>
          <input
            type="text"
            value={footerText}
            onChange={(e) => setFooterText(e.target.value)}
            className="w-full bg-[#0a0a0f] border-2 border-black rounded-brut px-4 py-2.5 text-white focus:outline-none focus:shadow-brut-sm"
          />
        </div>
        <button
          onClick={save}
          disabled={saving}
          className="btn-brut bg-accent text-black px-4 py-2.5 rounded-brut font-heading font-extrabold disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>

      <div className="card-brut bg-[#15151f] p-4 border-highlight">
        <h3 className="font-heading font-bold mb-4 flex items-center gap-2 text-highlight">
          <AlertTriangle size={20} />
          Danger Zone
        </h3>
        <p className="text-sm text-gray-400 mb-4">
          This will permanently delete all channels from the database. Categories and banners
          will remain.
        </p>
        <button
          onClick={deleteAllChannels}
          disabled={deleting}
          className="btn-brut bg-highlight text-black px-4 py-2.5 rounded-brut font-heading font-extrabold flex items-center gap-2 disabled:opacity-50"
        >
          <Trash2 size={18} strokeWidth={2.5} />
          {deleting ? 'Deleting...' : 'Delete All Channels'}
        </button>
      </div>
    </div>
  );
}
