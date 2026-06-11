'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import ChannelCard from './ChannelCard';
import type { Channel } from '@/lib/supabase';

export default function ChannelRow({
  title,
  channels,
  viewAllHref,
}: {
  title: string;
  channels: Channel[];
  viewAllHref?: string;
}) {
  if (!channels || channels.length === 0) return null;

  return (
    <section className="mb-6">
      <div className="flex items-center justify-between px-4 mb-3">
        <h3 className="font-heading font-extrabold text-lg tracking-tight">{title}</h3>
        {viewAllHref && (
          <Link
            href={viewAllHref}
            className="flex items-center gap-1 text-sm font-heading font-bold text-accent"
          >
            View all <ChevronRight size={16} strokeWidth={3} />
          </Link>
        )}
      </div>
      <div className="flex gap-3 overflow-x-auto scroll-row px-4 pb-2">
        {channels.map((channel) => (
          <ChannelCard key={channel.id} channel={channel} />
        ))}
      </div>
    </section>
  );
}
