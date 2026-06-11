'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Channel } from '@/lib/supabase';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ChannelCard from '@/components/ChannelCard';
import { Search as SearchIcon, Loader2 } from 'lucide-react';

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setSearched(true);

    const { data } = await supabase
      .from('channels')
      .select('*, categories(*)')
      .ilike('name', `%${query.trim()}%`)
      .order('sort_order', { ascending: true })
      .limit(30);

    setResults((data || []) as Channel[]);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 px-4 py-4">
        <form onSubmit={handleSearch} className="flex gap-2 mb-6">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search channels"
            className="flex-1 bg-[#15151f] border-2 border-black rounded-brut px-4 py-2.5 font-body text-white placeholder-gray-500 focus:outline-none focus:shadow-brut-sm"
          />
          <button
            type="submit"
            className="btn-brut bg-primary px-4 py-2.5 rounded-brut font-heading font-bold flex items-center gap-2"
          >
            <SearchIcon size={18} strokeWidth={2.5} />
            Search
          </button>
        </form>

        {loading && (
          <div className="flex justify-center py-12">
            <Loader2 className="animate-spin text-primary" size={32} />
          </div>
        )}

        {!loading && searched && results.length === 0 && (
          <p className="text-center text-gray-400 py-12">No channels found</p>
        )}

        {!loading && results.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {results.map((channel) => (
              <ChannelCard key={channel.id} channel={channel} fixedWidth={false} />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
