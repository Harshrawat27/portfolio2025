'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * The self-portrait SVG, brought to life: the head tilts in 3D toward the
 * cursor (parallax), the eyes track the pointer, and it blinks now and then.
 * Smoothing is done with CSS transitions (no rAF / no GSAP needed).
 */

// --- tunables (percentages of the square face box) ---
const EYES = {
  left: { x: 40.3, y: 44.4 }, // viewer's left (subject's right)
  right: { x: 56.0, y: 43.9 },
};
const EYE_W_PCT = 8.0; // eye-opening width
const EYE_H_PCT = 4.6; // eye-opening height
const IRIS_PCT = 4.2; // iris diameter
const MAX_TILT = 8; // deg of head parallax
const IRIS_TRAVEL = 0.78; // how far the iris can drift within the opening

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

export default function FaceFollow({
  size = 264,
  debug = false,
}: {
  size?: number;
  debug?: boolean;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const headRef = useRef<HTMLDivElement>(null);
  const irisRefs = [useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null)];
  const [blink, setBlink] = useState(false);

  // Pointer → head tilt + iris drift
  useEffect(() => {
    const eyeBoxW = (size * EYE_W_PCT) / 100;
    const eyeBoxH = (size * EYE_H_PCT) / 100;
    const irisR = (size * IRIS_PCT) / 100 / 2;
    const travelX = (eyeBoxW / 2 - irisR) * IRIS_TRAVEL;
    const travelY = (eyeBoxH / 2 - irisR) * IRIS_TRAVEL;

    const onMove = (e: MouseEvent) => {
      const el = wrapRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = clamp((e.clientX - cx) / (window.innerWidth * 0.5), -1, 1);
      const dy = clamp((e.clientY - cy) / (window.innerHeight * 0.55), -1, 1);

      if (headRef.current) {
        headRef.current.style.transform = `rotateY(${dx * MAX_TILT}deg) rotateX(${-dy * MAX_TILT}deg)`;
      }
      for (const ref of irisRefs) {
        if (ref.current) {
          ref.current.style.transform = `translate(calc(-50% + ${dx * travelX}px), calc(-50% + ${dy * travelY}px))`;
        }
      }
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [size]);

  // Natural, randomised blinking
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const schedule = () => {
      timer = setTimeout(() => {
        setBlink(true);
        setTimeout(() => setBlink(false), 130);
        // occasional double-blink
        if (Math.random() < 0.25) {
          setTimeout(() => setBlink(true), 260);
          setTimeout(() => setBlink(false), 390);
        }
        schedule();
      }, 2200 + Math.random() * 3800);
    };
    schedule();
    return () => clearTimeout(timer);
  }, []);

  const eye = (which: 'left' | 'right', i: number) => {
    const pos = EYES[which];
    return (
      <div
        key={which}
        style={{
          position: 'absolute',
          left: `${pos.x}%`,
          top: `${pos.y}%`,
          width: `${EYE_W_PCT}%`,
          height: `${EYE_H_PCT}%`,
          transform: 'translate(-50%, -50%) translateZ(6px)',
          borderRadius: '50%',
          overflow: 'hidden',
          outline: debug ? '1px solid red' : 'none',
        }}
      >
        {/* erase the drawn iris with the eye-white */}
        <div style={{ position: 'absolute', inset: '-6% -2%', background: '#fdfdfd' }} />
        {/* moving iris + pupil */}
        <div
          ref={irisRefs[i]}
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            width: `${(IRIS_PCT / EYE_W_PCT) * 100}%`,
            aspectRatio: '1',
            transform: 'translate(-50%, -50%)',
            transition: 'transform 0.16s cubic-bezier(0.22,1,0.36,1)',
            borderRadius: '50%',
            background:
              'radial-gradient(circle at 35% 32%, #3a3a38 0 42%, #111 44% 100%)',
          }}
        >
          {/* catch-light */}
          <div
            style={{
              position: 'absolute',
              left: '26%',
              top: '22%',
              width: '26%',
              height: '26%',
              borderRadius: '50%',
              background: '#fff',
              opacity: 0.9,
            }}
          />
        </div>
        {/* eyelid (blink) */}
        <div
          style={{
            position: 'absolute',
            left: '-4%',
            right: '-4%',
            top: 0,
            height: '112%',
            background: '#fdfdfd',
            borderBottom: '2px solid #111',
            transform: blink ? 'translateY(0)' : 'translateY(-112%)',
            transition: 'transform 0.09s ease-in',
          }}
        />
      </div>
    );
  };

  return (
    <div
      ref={wrapRef}
      style={{
        width: size,
        height: size,
        perspective: size * 2.6,
        userSelect: 'none',
      }}
      aria-hidden
    >
      <div
        ref={headRef}
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          transformStyle: 'preserve-3d',
          transition: 'transform 0.22s ease-out',
          willChange: 'transform',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/self.svg"
          alt=""
          width={size}
          height={size}
          draggable={false}
          style={{ display: 'block', width: '100%', height: '100%', pointerEvents: 'none' }}
        />
        {eye('left', 0)}
        {eye('right', 1)}
      </div>
    </div>
  );
}
