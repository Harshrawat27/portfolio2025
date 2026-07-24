'use client';

import { useEffect, useRef } from 'react';

// Plays a short mechanical tick when a link is pressed, synthesized with the
// Web Audio API so no audio file is needed. The AudioContext is created on the
// first press because browsers only allow audio after a user gesture.
export default function ClickSound() {
  const ctxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    const play = (e: PointerEvent) => {
      const target = e.target as Element | null;
      if (!target?.closest('a')) return;
      const AC =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;
      if (!AC) return;

      if (!ctxRef.current) ctxRef.current = new AC();
      const ctx = ctxRef.current;
      if (ctx.state === 'suspended') ctx.resume();

      const t = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(2400, t);
      osc.frequency.exponentialRampToValueAtTime(800, t + 0.02);

      gain.gain.setValueAtTime(0.05, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.035);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.04);
    };

    window.addEventListener('pointerdown', play);
    return () => window.removeEventListener('pointerdown', play);
  }, []);

  return null;
}
