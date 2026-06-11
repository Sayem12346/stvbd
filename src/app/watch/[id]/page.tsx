import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import type { Channel } from '@/lib/supabase';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import VideoPlayer from '@/components/VideoPlayer';
import ChannelRow from '@/components/ChannelRow';
import InfiniteChannelGrid from '@/components/InfiniteChannelGrid';

export const revalidate = 0;

async function getChannel(id: string) {
  const { data, error } = await supabase
    .from('channels')
    .select('*, categories(*)')
    .eq('id', id)
    .single();

  if (error || !data) return null;
  return data as Channel;
}

async function getRelated(categoryId: string | null, excludeId: string) {
  if (!categoryId) return [];
  const { data } = await supabase
    .from('channels')
    .select('*, categories(*)')
    .eq('category_id', categoryId)
    .neq('id', excludeId)
    .order('sort_order', { ascending: true })
    .limit(8);
  return (data || []) as Channel[];
}

export default async function WatchPage({ params }: { params: { id: string } }) {
  const channel = await getChannel(params.id);
  if (!channel) notFound();

  const related = await getRelated(channel.category_id, channel.id);

  // Increment view count (fire and forget)
  supabase
    .from('channels')
    .update({ view_count: (channel.view_count || 0) + 1 })
    .eq('id', channel.id)
    .then(() => {});

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <VideoPlayer
          streamUrl={channel.stream_url}
          channelName={channel.name}
          poster={channel.logo_url}
        />

        <div className="px-4 py-4 border-b-2 border-black">
          <h1 className="font-heading font-extrabold text-xl tracking-tight">{channel.name}</h1>
          {channel.categories && (
            <span className="inline-block mt-2 bg-primary border-2 border-black rounded-brut px-2 py-0.5 text-xs font-heading font-bold">
              {channel.categories.name}
            </span>
          )}
        </div>

        <div className="py-4">
          {related.length > 0 && (
            <ChannelRow title="Related Channels" channels={related} />
          )}
          <InfiniteChannelGrid
            excludeChannelId={channel.id}
            title="More Channels"
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}
