import { supabase } from '@/lib/supabase';
import type { Channel, Banner, Category } from '@/lib/supabase';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BannerCarousel from '@/components/BannerCarousel';
import ChannelRow from '@/components/ChannelRow';
import InfiniteChannelGrid from '@/components/InfiniteChannelGrid';

export const revalidate = 0; // always fetch fresh data

async function getData() {
  const [bannersRes, trendingRes, recentRes, categoriesRes] = await Promise.all([
    supabase
      .from('banners')
      .select('*, channels(*)')
      .eq('is_active', true)
      .order('sort_order', { ascending: true }),
    supabase
      .from('channels')
      .select('*, categories(*)')
      .eq('is_trending', true)
      .order('sort_order', { ascending: true })
      .limit(12),
    supabase
      .from('channels')
      .select('*, categories(*)')
      .eq('is_recent', true)
      .order('created_at', { ascending: false })
      .limit(12),
    supabase
      .from('categories')
      .select('*')
      .order('sort_order', { ascending: true }),
  ]);

  return {
    banners: (bannersRes.data || []) as Banner[],
    trending: (trendingRes.data || []) as Channel[],
    recent: (recentRes.data || []) as Channel[],
    categories: (categoriesRes.data || []) as Category[],
  };
}

export default async function HomePage() {
  const { banners, trending, recent, categories } = await getData();

  // Fetch one row of channels per category (Sports & Bangladesh first)
  const priorityOrder = ['sports', 'bangladesh'];
  const sortedCategories = [...categories].sort((a, b) => {
    const aIdx = priorityOrder.indexOf(a.slug);
    const bIdx = priorityOrder.indexOf(b.slug);
    if (aIdx === -1 && bIdx === -1) return a.sort_order - b.sort_order;
    if (aIdx === -1) return 1;
    if (bIdx === -1) return -1;
    return aIdx - bIdx;
  });

  const categoryRows = await Promise.all(
    sortedCategories.map(async (cat) => {
      const { data } = await supabase
        .from('channels')
        .select('*, categories(*)')
        .eq('category_id', cat.id)
        .order('sort_order', { ascending: true })
        .limit(12);
      return { category: cat, channels: (data || []) as Channel[] };
    })
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <BannerCarousel banners={banners} />

        <div className="py-4">
          <ChannelRow title="Trending Now" channels={trending} />
          <ChannelRow title="Recently Added" channels={recent} />

          {categoryRows.map(
            ({ category, channels }) =>
              channels.length > 0 && (
                <ChannelRow
                  key={category.id}
                  title={category.name}
                  channels={channels}
                  viewAllHref={`/category/${category.slug}`}
                />
              )
          )}

          <InfiniteChannelGrid title="All Channels" />
        </div>
      </main>
      <Footer />
    </div>
  );
}
