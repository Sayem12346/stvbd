'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { Channel } from '@/lib/supabase';
import ChannelCard from './ChannelCard';
import { Loader2 } from 'lucide-react';

const PAGE_SIZE = 12;

export default function InfiniteChannelGrid({
  excludeChannelId,
  categoryId,
  title = 'More Channels',
}: {
  excludeChannelId?: string;
  categoryId?: string | null;
  title?: string;
}) {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const observerRef = useRef<HTMLDivElement>(null);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    let query = supabase
      .from('channels')
      .select('*, categories(*)')
      .order('sort_order', { ascending: true })
      .range(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE - 1);

    if (excludeChannelId) {
      query = query.neq('id', excludeChannelId);
    }
    if (categoryId) {
      query = query.eq('category_id', categoryId);
    }

    const { data, error } = await query;

    if (!error && data) {
      if (data.length < PAGE_SIZE) setHasMore(false);
      setChannels((prev) => [...prev, ...(data as Channel[])]);
      setPage((p) => p + 1);
    } else {
      setHasMore(false);
    }
    setLoading(false);
  }, [page, loading, hasMore, excludeChannelId, categoryId]);

  useEffect(() => {
    loadMore();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const el = observerRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { rootMargin: '200px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [loadMore]);

  return (
    <section className="px-4">
      {title && <h3 className="font-heading font-extrabold text-lg tracking-tight mb-3">{title}</h3>}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {channels.map((channel) => (
          <div key={channel.id} className="w-full">
            <ChannelCard channel={channel} fixedWidth={false} />
          </div>
        ))}
      </div>

      {hasMore && (
        <div ref={observerRef} className="flex justify-center py-6">
          {loading && <Loader2 className="animate-spin text-primary" size={28} />}
        </div>
      )}

      {!hasMore && channels.length === 0 && (
        <p className="text-center text-gray-400 py-8">No channels found</p>
      )}
    </section>
  );
}
