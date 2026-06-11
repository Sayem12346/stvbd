'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { Category } from '@/lib/supabase';
import { parseM3U, slugify } from '@/lib/m3u-parser';
import { Loader2, Upload, FileText } from 'lucide-react';

export default function ImportPage() {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    channelsAdded: number;
    categoriesAdded: number;
  } | null>(null);
  const [error, setError] = useState('');

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setContent((ev.target?.result as string) || '');
    reader.readAsText(file);
  };

  const handleImport = async () => {
    if (!content.trim()) return;
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const parsed = parseM3U(content);
      if (parsed.length === 0) {
        setError('No channels found in this playlist. Please check the format.');
        setLoading(false);
        return;
      }

      // Fetch existing categories
      const { data: existingCats } = await supabase.from('categories').select('*');
      const categoryMap = new Map<string, Category>();
      (existingCats || []).forEach((c) => categoryMap.set(c.slug, c as Category));

      let categoriesAdded = 0;
      let maxCatOrder = (existingCats || []).reduce(
        (m, c) => Math.max(m, c.sort_order),
        0
      );

      // Get existing channel stream URLs to avoid duplicates
      const { data: existingChannels } = await supabase
        .from('channels')
        .select('stream_url');
      const existingUrls = new Set((existingChannels || []).map((c) => c.stream_url));

      let maxChanOrder = 0;
      const { data: maxOrderData } = await supabase
        .from('channels')
        .select('sort_order')
        .order('sort_order', { ascending: false })
        .limit(1);
      if (maxOrderData && maxOrderData.length > 0) {
        maxChanOrder = maxOrderData[0].sort_order;
      }

      let channelsAdded = 0;
      const newChannels = [];

      for (const ch of parsed) {
        if (existingUrls.has(ch.streamUrl)) continue; // skip duplicates

        const slug = slugify(ch.groupTitle);
        let category = categoryMap.get(slug);

        if (!category) {
          maxCatOrder += 1;
          const { data: newCat, error: catError } = await supabase
            .from('categories')
            .insert({ name: ch.groupTitle, slug, sort_order: maxCatOrder })
            .select()
            .single();

          if (catError || !newCat) continue;
          category = newCat as Category;
          categoryMap.set(slug, category);
          categoriesAdded++;
        }

        maxChanOrder += 1;
        newChannels.push({
          name: ch.name,
          stream_url: ch.streamUrl,
          logo_url: ch.logoUrl,
          category_id: category.id,
          is_live: true,
          is_trending: false,
          is_recent: true,
          sort_order: maxChanOrder,
        });
        existingUrls.add(ch.streamUrl);
        channelsAdded++;
      }

      if (newChannels.length > 0) {
        const { error: insertError } = await supabase.from('channels').insert(newChannels);
        if (insertError) {
          setError('Error saving channels: ' + insertError.message);
          setLoading(false);
          return;
        }
      }

      setResult({ channelsAdded, categoriesAdded });
      setContent('');
    } catch (err) {
      setError('Failed to parse playlist: ' + (err as Error).message);
    }

    setLoading(false);
  };

  return (
    <div>
      <h2 className="font-heading font-extrabold text-2xl mb-2">M3U / M3U8 Import</h2>
      <p className="text-sm text-gray-400 mb-6">
        Paste an M3U playlist or upload a file. Channels and categories will be created
        automatically and instantly visible to all viewers - no need to do this per browser.
      </p>

      <div className="card-brut bg-[#15151f] p-4 mb-4">
        <label className="flex items-center gap-2 mb-3 cursor-pointer w-fit btn-brut bg-primary px-4 py-2 rounded-brut font-heading font-bold text-sm">
          <Upload size={16} strokeWidth={2.5} />
          Upload M3U File
          <input type="file" accept=".m3u,.m3u8,text/plain" onChange={handleFile} className="hidden" />
        </label>

        <label className="block text-sm font-heading font-bold mb-2">
          Or paste playlist content
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={10}
          placeholder="#EXTM3U&#10;#EXTINF:-1 group-title=&quot;Sports&quot; tvg-logo=&quot;...&quot;,T Sports&#10;https://example.com/tsports.m3u8"
          className="w-full bg-[#0a0a0f] border-2 border-black rounded-brut px-4 py-2.5 text-white font-mono text-xs focus:outline-none focus:shadow-brut-sm"
        />

        <button
          onClick={handleImport}
          disabled={loading || !content.trim()}
          className="btn-brut bg-accent text-black w-full mt-4 py-2.5 rounded-brut font-heading font-extrabold disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={18} /> Importing...
            </>
          ) : (
            <>
              <FileText size={18} /> Import Playlist
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="card-brut bg-highlight text-black p-4 mb-4 font-bold">{error}</div>
      )}

      {result && (
        <div className="card-brut bg-accent text-black p-4 mb-4 font-bold">
          Import complete! Added {result.channelsAdded} channel(s) and{' '}
          {result.categoriesAdded} new categor{result.categoriesAdded === 1 ? 'y' : 'ies'}.
          <br />
          All viewers will see these instantly.
        </div>
      )}
    </div>
  );
}
