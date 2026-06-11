'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';
import type { Banner } from '@/lib/supabase';

export default function BannerCarousel({ banners }: { banners: Banner[] }) {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % banners.length);
  }, [banners.length]);

  const prev = () => {
    setCurrent((p) => (p - 1 + banners.length) % banners.length);
  };

  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next, banners.length]);

  if (!banners || banners.length === 0) return null;

  const banner = banners[current];

  return (
    <div className="relative w-full aspect-[16/9] md:aspect-[21/9] max-h-[480px] overflow-hidden border-b-2 border-black">
      <Image
        src={banner.image_url}
        alt={banner.title || 'Banner'}
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />
      {/* Gradient overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-bgdark via-bgdark/40 to-transparent" />

      <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8 max-w-2xl">
        {banner.title && (
          <h2 className="font-heading font-extrabold text-2xl md:text-4xl mb-2 tracking-tight">
            {banner.title}
          </h2>
        )}
        {banner.description && (
          <p className="text-sm md:text-base mb-4 text-gray-200 line-clamp-2">
            {banner.description}
          </p>
        )}
        {banner.channel_id && (
          <Link
            href={`/watch/${banner.channel_id}`}
            className="btn-brut inline-flex items-center gap-2 bg-accent text-black font-heading font-extrabold px-5 py-2.5 rounded-brut"
          >
            <Play size={18} fill="black" />
            Watch Now
          </Link>
        )}
      </div>

      {banners.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 btn-brut bg-primary p-2 rounded-brut"
            aria-label="Previous banner"
          >
            <ChevronLeft size={20} strokeWidth={3} />
          </button>
          <button
            onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 btn-brut bg-primary p-2 rounded-brut"
            aria-label="Next banner"
          >
            <ChevronRight size={20} strokeWidth={3} />
          </button>

          {/* Dots */}
          <div className="absolute bottom-3 right-4 flex gap-2">
            {banners.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-3 h-3 border-2 border-black rounded-full ${
                  i === current ? 'bg-accent' : 'bg-white/50'
                }`}
                aria-label={`Go to banner ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
