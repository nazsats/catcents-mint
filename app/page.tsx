'use client';

import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export default function Home() {
  // Fixed UTC timestamp: July 10, 2025 @ 12:00 UTC
  const targetDate = new Date(Date.UTC(2025, 6, 10, 14, 0, 0));

  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [muted, setMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = muted;
      audioRef.current.play().catch(() => {});
    }

    const update = () => {
      const now = Date.now();
      const diff = Math.max(targetDate.getTime() - now, 0);
      setTimeLeft({
        days:    Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours:   Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };

    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [muted]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.muted = muted;
  }, [muted]);

  return (
    <>
      <Head>
        <title>NFT Mint Countdown</title>
        <meta name="description" content="Counting down to July 10, 2025 12:00 UTC" />
      </Head>

      <div className="relative min-h-screen w-full overflow-hidden">
        <audio ref={audioRef} src="/sound.mp3" autoPlay loop />

        <button
          onClick={() => setMuted((p) => !p)}
          className="absolute top-4 right-4 z-20 p-2 bg-black/40 backdrop-blur-sm rounded-full text-white text-lg"
          aria-label={muted ? 'Unmute' : 'Mute'}
        >
          {muted ? '🔇' : '🔊'}
        </button>

        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover -z-10"
        >
          <source src="/video-bg.mp4" type="video/mp4" />
        </video>

        <div className="absolute bottom-6 left-0 w-full flex flex-col items-center space-y-6 z-10 px-4">
          {/* Smaller countdown */}
          <div className="bg-black/70 backdrop-blur-sm rounded-xl px-4 py-3 flex gap-4 text-white">
            {(['Days','Hours','Mins','Secs'] as const).map((label, i) => {
              const val = [
                timeLeft.days,
                timeLeft.hours,
                timeLeft.minutes,
                timeLeft.seconds,
              ][i];
              return (
                <div key={label} className="flex flex-col items-center">
                  <span className="text-3xl md:text-4xl font-bold">
                    {String(val).padStart(2, '0')}
                  </span>
                  <span className="uppercase text-xs">{label}</span>
                </div>
              );
            })}
          </div>

          {/* Compact social buttons */}
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="https://x.com/CatCentsio/"
              target="_blank"
              rel="noopener noreferrer"
              className="
                px-4 py-1 text-xs font-semibold rounded-full
                bg-gradient-to-br from-blue-400 to-blue-600
                text-white shadow
                hover:scale-105
                transition-transform
              "
            >
              Follow on X
            </a>
            <a
              href="https://discord.com/invite/TXPbt7ztMC"
              target="_blank"
              rel="noopener noreferrer"
              className="
                px-4 py-1 text-xs font-semibold rounded-full
                bg-gradient-to-br from-indigo-500 to-indigo-700
                text-white shadow
                hover:scale-105
                transition-transform
              "
            >
              Join Discord
            </a>
          </div>

          {/* Smaller whitelist button */}
          <a
            href="https://meowlab.catcents.io/"
            target="_blank"
            rel="noopener noreferrer"
            className="
              px-6 py-2 text-sm font-bold rounded-full
              bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500
              text-white uppercase tracking-wide
              shadow-lg
              animate-pulse hover:animate-none
              hover:-translate-y-0.5 hover:scale-105
              transition-all
            "
          >
            Check Whitelist
          </a>
        </div>
      </div>
    </>
  );
}
