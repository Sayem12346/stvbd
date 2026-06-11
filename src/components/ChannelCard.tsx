'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Tv } from 'lucide-react';
import type { Channel } from '@/lib/supabase';

export default function ChannelCard({
  channel,
  fixedWidth = true,
}: {
  channel: Channel;
  fixedWidth?: boolean;
}) {
  return (
    <Link
      href={`/watch/${channel.id}`}
      className={`card-brut bg-[#15151f] overflow-hidden group hover:translate-x-1 hover:translate-y-1 hover:shadow-brut-sm transition-all ${
        fixedWidth ? 'flex-shrink-0 w-[140px] sm:w-[160px]' : 'w-full'
      }`}
    >
      <div className="relative w-full aspect-video bg-[#1f1f2e] flex items-center justify-center border-b-2 border-black">
        {channel.logo_url ? (
          <Image
            src={channel.logo_url}
            alt={channel.name}
            fill
            className="object-contain p-2"
            sizes="160px"
          />
        ) : (
          <Tv size={32} className="text-gray-500" />
        )}
        {channel.is_live && (
          <span className="absolute top-1 left-1 bg-highlight text-black text-[10px] font-heading font-extrabold px-1.5 py-0.5 border border-black rounded">
            LIVE
          </span>
        )}
      </div>
      <div className="p-2">
        <p className="font-heading font-bold text-xs truncate">{channel.name}</p>
        {channel.categories && (
          <p className="text-[10px] text-gray-400 truncate">{channel.categories.name}</p>
        )}
      </div>
    </Link>
  );
}
