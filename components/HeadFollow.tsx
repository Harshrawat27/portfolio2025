'use client';

import { useEffect, useRef } from 'react';

/**
 * A head that follows the cursor in every direction. Frames come from five
 * left→right rotation clips at fixed pitch (up30 / up15 / level / down15 /
 * down30). Cursor X picks the yaw column, cursor Y picks the pitch row — a 2D
 * lookup, so any pointer position maps straight to the matching pose.
 */

const ROWS = 5; // up30, up15, level, down15, down30
const COLS = 30;
const LEVEL_ROW = 2;
// Each clip reliably sweeps left-profile → front in its first half (the right
// half is inconsistent AI footage), so we use frames 0..FRONT per row and
// mirror them for rightward cursor. FRONT is the front-facing column per row.
const FRONT = [16, 14, 14, 16, 13];

const FRAMES: string[][] = Array.from({ length: ROWS }, (_, r) =>
  Array.from(
    { length: COLS },
    (_, c) => `/head/r${r}_c${String(c).padStart(2, '0')}.jpg`
  )
);

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

export default function HeadFollow({ size = 300 }: { size?: number }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const last = useRef('');
  const lastFlip = useRef(1);

  useEffect(() => {
    // Preload the whole grid so scrubbing is instant.
    FRAMES.flat().forEach((src) => {
      const im = new window.Image();
      im.src = src;
    });

    const onMove = (e: MouseEvent) => {
      const el = wrapRef.current;
      const img = imgRef.current;
      if (!el || !img) return;
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      // distance from the head's centre, normalised to the reachable range
      // (vertical is tighter since the head sits near the top of the page)
      const dx = clamp((e.clientX - cx) / (size * 1.45), -1, 1);
      const dy = clamp((e.clientY - cy) / (size * 0.85), -1, 1);

      // pitch → row; yaw → column within this row's front→left range, mirrored
      // for the right side so we never rely on the inconsistent right footage.
      const row = clamp(Math.round(LEVEL_ROW + dy * LEVEL_ROW), 0, ROWS - 1);
      const fc = FRONT[row];
      const mag = Math.abs(dx);
      const col = clamp(Math.round(fc * (1 - mag)), 0, fc);
      const flip = dx > 0 ? -1 : 1;

      const src = FRAMES[row][col];
      if (src !== last.current) {
        img.src = src;
        last.current = src;
      }
      if (flip !== lastFlip.current) {
        img.style.transform = flip === -1 ? 'scaleX(-1)' : 'none';
        lastFlip.current = flip;
      }
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, []);

  return (
    <div ref={wrapRef} style={{ width: size, height: size }} aria-hidden>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={imgRef}
        src={FRAMES[LEVEL_ROW][FRONT[LEVEL_ROW]]}
        alt=""
        width={size}
        height={size}
        draggable={false}
        style={{
          display: 'block',
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      />
    </div>
  );
}
