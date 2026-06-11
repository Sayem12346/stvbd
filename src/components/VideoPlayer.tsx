'use client';

import { useEffect, useRef, useState } from 'react';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import type Player from 'video.js/dist/types/player';
import { X } from 'lucide-react';

export default function VideoPlayer({
  streamUrl,
  channelName,
  poster,
}: {
  streamUrl: string;
  channelName: string;
  poster?: string | null;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<Player | null>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [isMini, setIsMini] = useState(false);
  const [closed, setClosed] = useState(false);

  // Initialize Video.js player once
  useEffect(() => {
    if (!videoRef.current) return;

    const player = videojs(videoRef.current, {
      controls: true,
      autoplay: true,
      preload: 'auto',
      fluid: false,
      responsive: true,
      poster: poster || undefined,
      sources: [
        {
          src: streamUrl,
          type: 'application/x-mpegURL',
        },
      ],
    });

    playerRef.current = player;

    return () => {
      player.dispose();
      playerRef.current = null;
    };
  }, [streamUrl, poster]);

  // Detect when player scrolls out of view to enable mini player
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsMini(!entry.isIntersecting);
      },
      { threshold: 0 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  if (closed) {
    return <div ref={sentinelRef} className="w-full aspect-video bg-black" />;
  }

  return (
    <>
      {/* Sentinel marks the original position; reserves space when player goes fixed */}
      <div ref={sentinelRef} className="w-full aspect-video relative">
        <div
          className={
            isMini
              ? 'fixed bottom-4 right-4 w-[260px] sm:w-[340px] aspect-video z-50 card-brut bg-black overflow-hidden'
              : 'absolute inset-0 bg-black overflow-hidden'
          }
        >
          {isMini && (
            <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between bg-primary/90 px-2 py-1 border-b-2 border-black">
              <span className="font-heading font-bold text-xs truncate text-white">
                {channelName}
              </span>
              <button onClick={() => setClosed(true)} aria-label="Close player">
                <X size={16} strokeWidth={3} className="text-white" />
              </button>
            </div>
          )}
          <div data-vjs-player className="w-full h-full">
            <video
              ref={videoRef}
              className="video-js vjs-big-play-centered w-full h-full"
              playsInline
            />
          </div>
        </div>
      </div>
    </>
  );
}
