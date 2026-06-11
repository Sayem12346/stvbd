'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Upload, Link as LinkIcon, Loader2 } from 'lucide-react';

export default function ImageInput({
  value,
  onChange,
  label = 'Image',
}: {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}) {
  const [mode, setMode] = useState<'url' | 'upload'>('url');
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const ext = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const { error } = await supabase.storage.from('media').upload(fileName, file);

    if (error) {
      alert('Upload failed: ' + error.message);
      setUploading(false);
      return;
    }

    const { data } = supabase.storage.from('media').getPublicUrl(fileName);
    onChange(data.publicUrl);
    setUploading(false);
  };

  return (
    <div>
      <label className="block text-sm font-heading font-bold mb-2">{label}</label>

      <div className="flex gap-2 mb-2">
        <button
          type="button"
          onClick={() => setMode('url')}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-brut border-2 border-black text-xs font-heading font-bold ${
            mode === 'url' ? 'bg-primary' : 'bg-[#15151f]'
          }`}
        >
          <LinkIcon size={14} />
          Image URL
        </button>
        <button
          type="button"
          onClick={() => setMode('upload')}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-brut border-2 border-black text-xs font-heading font-bold ${
            mode === 'upload' ? 'bg-primary' : 'bg-[#15151f]'
          }`}
        >
          <Upload size={14} />
          Upload from Device
        </button>
      </div>

      {mode === 'url' ? (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://example.com/image.png"
          className="w-full bg-[#0a0a0f] border-2 border-black rounded-brut px-4 py-2.5 text-white focus:outline-none focus:shadow-brut-sm"
        />
      ) : (
        <div className="flex items-center gap-2">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="text-sm"
          />
          {uploading && <Loader2 className="animate-spin text-primary" size={20} />}
        </div>
      )}

      {value && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={value}
          alt="Preview"
          className="mt-2 h-20 w-auto border-2 border-black rounded-brut object-contain bg-[#0a0a0f]"
        />
      )}
    </div>
  );
}
