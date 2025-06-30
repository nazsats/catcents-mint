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
  const targetDate = new Date(Date.UTC(2025, 6, 10, 12, 0, 0));

  // State for the remaining time
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // State for mute toggle
  const [muted, setMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Calculate and tick down every second
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

  // Sync mute state to audio element
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
        {/* Background audio */}
        <audio ref={audioRef} src="/sound.mp3" autoPlay loop />

        {/* Mute/unmute */}
        <button
          onClick={() => setMuted((prev) => !prev)}
          className="absolute top-6 right-6 z-20 p-3 bg-black/40 backdrop-blur-sm rounded-full text-white text-2xl"
          aria-label={muted ? 'Unmute' : 'Mute'}
        >
          {muted ? '🔇' : '🔊'}
        </button>

        {/* Video background */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover -z-10"
        >
          <source src="/video-bg.mp4" type="video/mp4" />
        </video>

        {/* Bottom stack: countdown → socials → whitelist */}
        <div className="absolute bottom-8 left-0 w-full flex flex-col items-center space-y-10 z-10 px-4">
          {/* Countdown */}
          <div className="bg-black/70 backdrop-blur-sm rounded-2xl px-6 py-5 flex gap-8 text-white">
            {(['Days','Hours','Mins','Secs'] as const).map((label, i) => {
              const val = [
                timeLeft.days,
                timeLeft.hours,
                timeLeft.minutes,
                timeLeft.seconds,
              ][i];
              return (
                <div key={label} className="flex flex-col items-center">
                  <span className="text-5xl md:text-6xl font-extrabold">
                    {String(val).padStart(2, '0')}
                  </span>
                  <span className="uppercase text-sm tracking-wide">{label}</span>
                </div>
              );
            })}
          </div>

          {/* Social buttons */}
          <div className="flex flex-wrap justify-center gap-6">
            <a
              href="https://x.com/CatCentsio/"
              target="_blank"
              rel="noopener noreferrer"
              className="
                px-8 py-3 font-semibold rounded-full
                bg-gradient-to-br from-blue-400 to-blue-600
                text-white shadow-lg
                hover:scale-105 hover:from-blue-300 hover:to-blue-500
                transition-transform duration-300
              "
            >
              Follow on X
            </a>
            <a
              href="https://discord.com/invite/TXPbt7ztMC"
              target="_blank"
              rel="noopener noreferrer"
              className="
                px-8 py-3 font-semibold rounded-full
                bg-gradient-to-br from-indigo-500 to-indigo-700
                text-white shadow-lg
                hover:scale-105 hover:from-indigo-400 hover:to-indigo-600
                transition-transform duration-300
              "
            >
              Join Discord
            </a>
          </div>

          {/* Check whitelist */}
          <a
            href="https://meowlab.catcents.io/"
            target="_blank"
            rel="noopener noreferrer"
            className="
              px-10 py-4 font-bold rounded-full
              bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500
              text-white uppercase tracking-wider
              shadow-2xl
              animate-pulse hover:animate-none
              hover:-translate-y-1 hover:scale-110
              transition-all duration-300
            "
          >
            Check Whitelist
          </a>
        </div>
      </div>
    </>
  );
}
