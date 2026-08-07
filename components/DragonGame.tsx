'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

/**
 * Dragon Run — a "Tiny Wings" / "Dragon, Fly!"–style momentum game.
 *
 * You're the baby dragon racing home across rolling hills. HOLD to dive:
 * riding a downhill while diving builds speed, and letting go near a crest
 * launches you into the sky. Land back down onto a DOWNSLOPE (while diving)
 * for a perfect landing — a speed boost that lets you fly even further. Botch
 * it by slamming into an uphill and you bleed all your momentum, and mom —
 * chasing from behind and forever getting faster — will catch you.
 */

type Phase = 'cover' | 'playing' | 'won' | 'lost';

// ---- World tuning (world pixels / seconds) --------------------------------
const FINISH_X = 200000; // long course — ~5 min of normal play (less if flawless)

// Light gravity while gliding = big floaty arcs; heavy while diving = snap down.
// Your speed comes ONLY from diving downhills well — there is no free forward
// drive, so playing badly bleeds momentum and mom catches you.
const GRAVITY_GLIDE = 620; // low glide gravity = long, high, soaring arcs
const GRAVITY_DIVE = 2650;
// Slopes are near-frictionless so momentum is CONSERVED: come into an uphill
// fast and you carry that speed up and over (and launch off the top). A slow
// entry crawls up. Speed changes come from gravity along the slope, not drag.
const GROUND_FRICTION = 0.99975;
const AIR_DRAG = 0.99965;
const MIN_VX = 95; // you can nearly stall — and get caught
const MAX_SPEED = 1420;
const START_SPEED = 300;

// Crest launch — the heart of flying. Cross a hilltop with speed and you're
// flung skyward; holding dive keeps you hugging the ground instead.
const CREST_LAUNCH = 0.85; // fraction of speed converted to upward kick — big arcs
const CREST_LAUNCH_DIVE = 0.18; // much weaker while diving (stay grounded)
const CREST_LAUNCH_MAX = 1000;
const CREST_MIN_CLIMB = 0.08; // only real hills fling you, not tiny bumps
const LAUNCH_MIN_SPEED = 240; // below this you just roll over the crest

const PERFECT_SLOPE = 0.14; // downslope steepness that counts as a good landing
const BAD_SLOPE = -0.12; // uphill steepness that punishes you
const PERFECT_BOOST = 1.16;

const MOM_START_GAP = 210; // mom starts close, on the baby's tail
const MOM_BASE_SPEED = 345;
const MOM_ACCEL = 1.7; // +px/s each second
const MOM_MAX = 820;
const MOM_GRACE = 2.2; // seconds mom eases up to full speed at the start
const CATCH_DIST = 46;

const OPEN_END = 1700; // world x where the scripted opening downhill ends
const GEM_SPACING = 88;
const GEM_LIFT = 30; // how far gems float above the ground line
const GEM_PICKUP = 46; // pickup radius
const DT = 1 / 120;

// ---- Colour "islands" the course passes through ---------------------------
const ISLANDS: string[][] = [
  ['#a7dd5f', '#8fce5a', '#7bbf49', '#69ad3c', '#589b31', '#457c26'],
  ['#f0b24a', '#e59d3c', '#d4882f', '#c07326', '#a75f1e', '#854817'], // autumn
  ['#63d6c0', '#4fc6b0', '#3fb39d', '#329e8b', '#278778', '#1c665b'], // teal
  ['#b79be6', '#a487db', '#9072cd', '#7d5ebc', '#684aa3', '#4d357a'], // dusk
  ['#f28fa8', '#e87b97', '#d96882', '#c6556f', '#ad445b', '#853043'], // rose
];
const ISLAND_LEN = 30000;

interface Vec {
  x: number;
  y: number;
}
interface Flash {
  text: string;
  good: boolean;
  born: number;
}
interface Pop {
  x: number;
  y: number;
  text: string;
  born: number;
}
interface GameState {
  player: Vec;
  vel: Vec;
  onGround: boolean;
  diving: boolean;
  prevSlope: number;
  climbSlope: number;
  momX: number;
  momSpeed: number;
  time: number;
  camX: number;
  zoom: number;
  gems: number;
  combo: number;
  bestCombo: number;
  wing: number;
  momWing: number;
  collected: Set<number>;
  flash: Flash | null;
  pops: Pop[];
  airTime: number;
}

function lerpColor(a: string, b: string, t: number) {
  const pa = [
    parseInt(a.slice(1, 3), 16),
    parseInt(a.slice(3, 5), 16),
    parseInt(a.slice(5, 7), 16),
  ];
  const pb = [
    parseInt(b.slice(1, 3), 16),
    parseInt(b.slice(3, 5), 16),
    parseInt(b.slice(5, 7), 16),
  ];
  const c = pa.map((v, i) => Math.round(v + (pb[i] - v) * t));
  return `rgb(${c[0]},${c[1]},${c[2]})`;
}

// ---- Tiny synth (no assets) ------------------------------------------------
class Sfx {
  private ctx: AudioContext | null = null;
  private ensure() {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AC =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      if (AC) this.ctx = new AC();
    }
    if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
    return this.ctx;
  }
  resume() {
    this.ensure();
  }
  private tone(
    freq: number,
    dur: number,
    type: OscillatorType,
    vol: number,
    delay = 0,
    glideTo?: number
  ) {
    const ctx = this.ensure();
    if (!ctx) return;
    const t0 = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);
    if (glideTo) osc.frequency.exponentialRampToValueAtTime(glideTo, t0 + dur);
    gain.gain.setValueAtTime(0.0001, t0);
    gain.gain.exponentialRampToValueAtTime(vol, t0 + 0.008);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(gain).connect(ctx.destination);
    osc.start(t0);
    osc.stop(t0 + dur + 0.02);
  }
  gem(combo: number) {
    const base = 720 * Math.pow(1.06, Math.min(combo, 12));
    this.tone(base, 0.12, 'triangle', 0.16);
    this.tone(base * 1.5, 0.1, 'triangle', 0.08, 0.02);
  }
  perfect() {
    this.tone(660, 0.1, 'square', 0.09);
    this.tone(990, 0.12, 'square', 0.09, 0.08);
    this.tone(1320, 0.16, 'square', 0.08, 0.16);
  }
  launch() {
    this.tone(320, 0.18, 'sine', 0.08, 0, 720);
  }
  oof() {
    this.tone(200, 0.18, 'sawtooth', 0.1, 0, 90);
  }
  win() {
    [523, 659, 784, 1046].forEach((f, i) =>
      this.tone(f, 0.22, 'triangle', 0.12, i * 0.12)
    );
  }
  caught() {
    [400, 300, 220, 160].forEach((f, i) =>
      this.tone(f, 0.24, 'sawtooth', 0.11, i * 0.12)
    );
  }
}

export default function DragonGame() {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sfxRef = useRef<Sfx | null>(null);
  if (!sfxRef.current && typeof window !== 'undefined') sfxRef.current = new Sfx();

  const phaseRef = useRef<Phase>('cover');
  const [phase, setPhase] = useState<Phase>('cover');
  const [hud, setHud] = useState({ dist: 0, gems: 0, combo: 0, gap: 100 });
  const finalRef = useRef({ dist: 0, gems: 0, bestCombo: 0, gap: 0 });

  const sizeRef = useRef({ w: 900, h: 520 });
  const stateRef = useRef<GameState | null>(null);
  const rafRef = useRef<number>(0);
  const lastRef = useRef<number>(0);
  const accRef = useRef<number>(0);

  const active = phase !== 'cover';

  // Rolling terrain. Lower y = higher on screen.
  const groundY = useCallback((x: number) => {
    const h = sizeRef.current.h;
    const base = h * 0.62;
    // Big, long, smooth sweeping hills — long descents build real speed and
    // long climbs throw you into a proper arc. Light high-frequency texture
    // keeps the surface from being dead-smooth without chopping momentum.
    const proc = (px: number) =>
      base +
      h * 0.22 * Math.sin(px * 0.00092) +
      h * 0.085 * Math.sin(px * 0.0025 + 2.1) +
      h * 0.024 * Math.sin(px * 0.0068 + 4.0);

    // Guaranteed opening: the baby starts high on a downhill ramp so it can
    // build momentum and pull away before mom is a threat. The scripted ramp
    // smoothly blends into the procedural hills by OPEN_END.
    if (x >= OPEN_END) return proc(x);
    const openTop = base - h * 0.4; // start high on the screen
    const endY = proc(OPEN_END);
    const t = Math.max(0, x) / OPEN_END; // flat plateau for x < 0 (behind start)
    const lin = openTop + t * (endY - openTop); // constant downhill
    const w = t * t * (3 - 2 * t); // smoothstep crossfade into the hills
    return lin * (1 - w) + proc(x) * w;
  }, []);

  const slopeAt = useCallback(
    (x: number) => (groundY(x + 1.5) - groundY(x - 1.5)) / 3,
    [groundY]
  );

  const setBoth = (p: Phase) => {
    phaseRef.current = p;
    setPhase(p);
  };

  const resetGame = useCallback(() => {
    const startX = 220;
    const sl = (groundY(startX + 1.5) - groundY(startX - 1.5)) / 3;
    const th = Math.atan(sl);
    stateRef.current = {
      player: { x: startX, y: groundY(startX) }, // start ON the ground, running
      vel: { x: START_SPEED * Math.cos(th), y: START_SPEED * Math.sin(th) },
      onGround: true,
      diving: false,
      prevSlope: sl,
      climbSlope: 0,
      momX: startX - MOM_START_GAP,
      momSpeed: MOM_BASE_SPEED,
      time: 0,
      camX: 0,
      zoom: 1,
      gems: 0,
      combo: 0,
      bestCombo: 0,
      wing: 0,
      momWing: 0,
      collected: new Set(),
      flash: null,
      pops: [],
      airTime: 0,
    };
    accRef.current = 0;
    lastRef.current = 0;
  }, [groundY]);

  const sizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const w = window.innerWidth;
    const h = window.innerHeight;
    sizeRef.current = { w, h };
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    const ctx = canvas.getContext('2d');
    if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }, []);

  const startGame = useCallback(() => {
    sfxRef.current?.resume(); // unlock audio on the user gesture
    resetGame();
    setBoth('playing');
  }, [resetGame]);

  const exitGame = useCallback(() => {
    if (typeof document !== 'undefined' && document.fullscreenElement)
      document.exitFullscreen().catch(() => {});
    setBoth('cover');
  }, []);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Size the canvas + request real fullscreen once the overlay is mounted.
  useEffect(() => {
    if (!active) return;
    sizeCanvas();
    const el = rootRef.current;
    if (el && el.requestFullscreen && !document.fullscreenElement) {
      el.requestFullscreen().catch(() => {});
    }
    window.addEventListener('resize', sizeCanvas);
    return () => window.removeEventListener('resize', sizeCanvas);
  }, [active, sizeCanvas]);

  // ---- Physics ------------------------------------------------------------
  const step = useCallback(
    (s: GameState) => {
      s.time += DT;

      // Mom eases up to speed over the first couple seconds so the opening
      // downhill gives you a real chance to build momentum and pull ahead.
      const grace = Math.min(1, 0.5 + s.time / MOM_GRACE);
      s.momSpeed = Math.min(MOM_MAX, MOM_BASE_SPEED * grace + MOM_ACCEL * s.time);
      s.momX += s.momSpeed * DT;

      const g = s.diving ? GRAVITY_DIVE : GRAVITY_GLIDE;
      const wasGround = s.onGround;

      // No free forward drive — speed is earned by diving downhills.
      s.vel.y += g * DT;

      let nx = s.player.x + s.vel.x * DT;
      let ny = s.player.y + s.vel.y * DT;

      const gy = groundY(nx);
      if (ny >= gy) {
        // ---- On / hitting the ground ----
        ny = gy;
        const slope = slopeAt(nx);
        const theta = Math.atan(slope);
        const cosT = Math.cos(theta);
        const sinT = Math.sin(theta);
        let speed: number;

        if (!wasGround && s.airTime > 0.06) {
          // LANDING — conserve the velocity ALONG the slope (your carried
          // momentum) and absorb only the slam INTO it, so dropping onto a
          // downslope keeps your speed while slamming an uphill kills it.
          // Landing on a downhill is a good landing (boost + combo); an uphill
          // breaks the chain.
          const along = s.vel.x * cosT + s.vel.y * sinT;
          speed = Math.max(0, along);

          if (slope > PERFECT_SLOPE) {
            speed *= PERFECT_BOOST;
            s.combo += 1;
            s.bestCombo = Math.max(s.bestCombo, s.combo);
            s.flash = {
              text: s.combo > 1 ? `PERFECT ×${s.combo}` : 'PERFECT!',
              good: true,
              born: s.time,
            };
            sfxRef.current?.perfect();
          } else if (slope < BAD_SLOPE) {
            s.flash = { text: 'OOF!', good: false, born: s.time };
            sfxRef.current?.oof();
            s.combo = 0;
          } else {
            s.combo = 0;
          }
          speed = Math.max(MIN_VX, Math.min(MAX_SPEED, speed));
        } else {
          // Rolling along the ground: keep momentum; gravity along the slope
          // accelerates you downhill (dive to accelerate hard) and bleeds off
          // uphill. Near-frictionless, so a fast entry carries up and over.
          speed = Math.hypot(s.vel.x, s.vel.y);
          speed += g * sinT * DT;
          speed *= GROUND_FRICTION;
          speed = Math.max(MIN_VX, Math.min(MAX_SPEED, speed));
        }

        s.vel.x = speed * cosT;
        s.vel.y = speed * sinT;
        s.onGround = true;
        s.airTime = 0;

        // Track the steepest part of the current climb (slope < 0 == uphill).
        if (slope < s.climbSlope) s.climbSlope = slope;

        // Crest launch — at a hilltop (slope crosses from up to down), if you
        // climbed a real hill with speed you're flung into the sky, scaled by
        // how steep the climb was. Holding dive keeps you glued to the ground.
        if (s.prevSlope < 0 && slope >= 0) {
          if (s.climbSlope < -CREST_MIN_CLIMB && speed > LAUNCH_MIN_SPEED) {
            const steep = Math.min(1, 0.4 - s.climbSlope / 0.4);
            const factor = s.diving ? CREST_LAUNCH_DIVE : CREST_LAUNCH;
            const pop = Math.min(CREST_LAUNCH_MAX, speed * factor * steep);
            s.vel.y -= pop;
            s.onGround = false;
            s.airTime = 0.0001;
            if (!s.diving && pop > 200) sfxRef.current?.launch();
          }
          s.climbSlope = 0;
        }
      } else {
        // ---- In the air ----
        s.onGround = false;
        s.airTime += DT;
        s.vel.x = Math.max(MIN_VX, Math.min(MAX_SPEED, s.vel.x * AIR_DRAG));
      }

      s.player.x = nx;
      s.player.y = ny;
      s.prevSlope = slopeAt(s.player.x);

      s.wing += (s.onGround ? 7 : 16) * DT;
      s.momWing += 13 * DT;

      // Gem pickups near the player. Anchor to the dragon's body centre
      // (drawn ~6px above player.y) so ground-running sweeps up the gem line.
      const bodyY = s.player.y - 10;
      const gi0 = Math.floor((s.player.x - GEM_PICKUP) / GEM_SPACING);
      const gi1 = Math.ceil((s.player.x + GEM_PICKUP) / GEM_SPACING);
      for (let i = gi0; i <= gi1; i++) {
        if (i < 2 || s.collected.has(i)) continue;
        const gx = i * GEM_SPACING;
        const gy2 = groundY(gx) - GEM_LIFT;
        if (Math.hypot(gx - s.player.x, gy2 - bodyY) < GEM_PICKUP) {
          s.collected.add(i);
          const val = 1 + s.combo;
          s.gems += val;
          s.pops.push({
            x: gx,
            y: gy2,
            text: `+${val}`,
            born: s.time,
          });
          if (s.pops.length > 24) s.pops.shift();
          sfxRef.current?.gem(s.combo);
        }
      }

      const gap = s.player.x - s.momX;
      if (s.player.x >= FINISH_X) {
        finalRef.current = {
          dist: FINISH_X,
          gems: s.gems,
          bestCombo: s.bestCombo,
          gap,
        };
        sfxRef.current?.win();
        setBoth('won');
      } else if (gap <= CATCH_DIST) {
        finalRef.current = {
          dist: s.player.x,
          gems: s.gems,
          bestCombo: s.bestCombo,
          gap,
        };
        sfxRef.current?.caught();
        setBoth('lost');
      }
    },
    [groundY, slopeAt]
  );

  // ---- Rendering ----------------------------------------------------------
  const drawDragon = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number,
      angle: number,
      scale: number,
      wing: number,
      body: string,
      belly: string,
      wingCol: string,
      line: string
    ) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.scale(scale, scale);
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      const flap = Math.sin(wing);

      // Tail
      ctx.beginPath();
      ctx.moveTo(-14, 2);
      ctx.quadraticCurveTo(-40, -4 + 8 * flap, -54, 4);
      ctx.lineTo(-62, -6);
      ctx.lineTo(-56, 4);
      ctx.lineTo(-62, 12);
      ctx.closePath();
      ctx.fillStyle = body;
      ctx.strokeStyle = line;
      ctx.lineWidth = 3;
      ctx.fill();
      ctx.stroke();

      // Back wing (behind body)
      ctx.beginPath();
      ctx.moveTo(-4, -4);
      ctx.quadraticCurveTo(-24, -30 - 18 * flap, 2, -40 - 22 * flap);
      ctx.quadraticCurveTo(6, -18, 12, -6);
      ctx.closePath();
      ctx.fillStyle = wingCol;
      ctx.fill();
      ctx.stroke();

      // Body
      ctx.beginPath();
      ctx.ellipse(0, 0, 24, 18, 0, 0, Math.PI * 2);
      ctx.fillStyle = body;
      ctx.fill();
      ctx.stroke();

      // Belly
      ctx.beginPath();
      ctx.ellipse(4, 7, 15, 10, 0, 0, Math.PI * 2);
      ctx.fillStyle = belly;
      ctx.fill();

      // Back spikes
      ctx.fillStyle = line;
      for (let i = 0; i < 3; i++) {
        const sx = -12 + i * 9;
        ctx.beginPath();
        ctx.moveTo(sx, -16);
        ctx.lineTo(sx + 4, -24);
        ctx.lineTo(sx + 8, -16);
        ctx.closePath();
        ctx.fill();
      }

      // Head
      ctx.beginPath();
      ctx.ellipse(20, -8, 14, 13, 0, 0, Math.PI * 2);
      ctx.fillStyle = body;
      ctx.fill();
      ctx.stroke();

      // Snout
      ctx.beginPath();
      ctx.ellipse(32, -4, 8, 6, 0, 0, Math.PI * 2);
      ctx.fillStyle = body;
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(35, -5, 1.4, 0, Math.PI * 2);
      ctx.fillStyle = line;
      ctx.fill();

      // Horns
      ctx.fillStyle = belly;
      ctx.beginPath();
      ctx.moveTo(14, -18);
      ctx.lineTo(11, -30);
      ctx.lineTo(19, -19);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Eye
      ctx.beginPath();
      ctx.arc(22, -11, 5.5, 0, Math.PI * 2);
      ctx.fillStyle = '#fff';
      ctx.fill();
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(24, -11, 2.4, 0, Math.PI * 2);
      ctx.fillStyle = '#1a1a1a';
      ctx.fill();

      // Smile
      ctx.beginPath();
      ctx.arc(28, -2, 5, 0.1, Math.PI - 0.4);
      ctx.strokeStyle = line;
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.restore();
    },
    []
  );

  const draw = useCallback(
    (ctx: CanvasRenderingContext2D, s: GameState) => {
      const { w, h } = sizeRef.current;

      // ---- Camera: follow X, and ZOOM OUT as the dragon flies high so the
      // whole soaring arc, the hills and mom all stay in frame (Racing Penguin
      // style). Everything is drawn in world coordinates through this transform.
      const px = s.player.x;
      const py = s.player.y - 6;
      const groundUnder = groundY(px);
      const topW = Math.min(py, groundUnder) - 80;
      const botW = Math.max(py, groundUnder) + 140;
      const neededSpan = Math.max(1, botW - topW);
      const baseSpan = h * 0.52; // world px shown vertically at zoom 1
      const targetZoom = Math.max(0.36, Math.min(1, baseSpan / neededSpan));
      s.zoom += (targetZoom - s.zoom) * 0.07;
      const zoom = s.zoom;
      const focusX = px;
      const focusY = (topW + botW) / 2;
      const anchorX = w * 0.33;
      const anchorY = h * 0.5;
      s.camX = focusX;

      const leftW = focusX - anchorX / zoom - 30;
      const rightW = focusX + (w - anchorX) / zoom + 30;
      const botFill = focusY + (h - anchorY) / zoom + 400;
      // world -> screen (for background parallax & screen-space text)
      const sX = (wx: number) => (wx - focusX) * zoom + anchorX;
      const sY = (wy: number) => (wy - focusY) * zoom + anchorY;

      // Which island are we on (with a soft crossfade near the seam)
      const fx = focusX / ISLAND_LEN;
      const iA = Math.floor(fx) % ISLANDS.length;
      const iB = (iA + 1) % ISLANDS.length;
      const frac = fx - Math.floor(fx);
      const blend = frac > 0.85 ? (frac - 0.85) / 0.15 : 0;
      const palette = (k: number) =>
        blend > 0
          ? lerpColor(
              ISLANDS[(iA + ISLANDS.length) % ISLANDS.length][k],
              ISLANDS[iB][k],
              blend
            )
          : ISLANDS[(iA + ISLANDS.length) % ISLANDS.length][k];

      // ---- Screen-space background (sky, sun, clouds) ----
      const sky = ctx.createLinearGradient(0, 0, 0, h);
      sky.addColorStop(0, '#afe4f7');
      sky.addColorStop(1, '#e3f6ff');
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, w, h);

      ctx.save();
      ctx.fillStyle = '#fff4c2';
      ctx.beginPath();
      ctx.arc(w * 0.82, h * 0.16, 40, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      ctx.save();
      ctx.fillStyle = 'rgba(255,255,255,0.9)';
      for (let i = 0; i < 8; i++) {
        const seed = i * 4231.7;
        const cx =
          ((seed - focusX * 0.1) % (w + 400) + (w + 400)) % (w + 400) - 200;
        const cy = h * 0.1 + ((seed * 1.7) % (h * 0.26));
        ctx.beginPath();
        ctx.ellipse(cx, cy, 46, 22, 0, 0, Math.PI * 2);
        ctx.ellipse(cx + 34, cy + 6, 34, 18, 0, 0, Math.PI * 2);
        ctx.ellipse(cx - 30, cy + 8, 30, 16, 0, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // ---- World transform (pan + zoom) ----
      ctx.save();
      ctx.translate(anchorX, anchorY);
      ctx.scale(zoom, zoom);
      ctx.translate(-focusX, -focusY);

      // Sample the foreground contour once (in world space, across the view).
      const stepW = (rightW - leftW) / 200;
      const cols: { x: number; y: number }[] = [];
      for (let wx = leftW; wx <= rightW + stepW; wx += stepW) {
        cols.push({ x: wx, y: groundY(wx) });
      }

      // Distant range (behind, with parallax + haze)
      ctx.save();
      ctx.fillStyle = 'rgba(255,255,255,0.26)';
      ctx.beginPath();
      ctx.moveTo(leftW, botFill);
      for (const c of cols) {
        const sx = 0.5 * c.x + 0.5 * focusX; // parallax: scrolls at half rate
        const y =
          groundUnder -
          h * 0.28 +
          h * 0.08 * Math.sin(sx * 0.0016 + 1.1) +
          h * 0.035 * Math.sin(sx * 0.0043 + 3.0);
        ctx.lineTo(c.x, y);
      }
      ctx.lineTo(rightW, botFill);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // Foreground strata bands
      const bh = h * 0.05;
      const N = 6;
      for (let k = 0; k < N; k++) {
        ctx.fillStyle = palette(k);
        ctx.beginPath();
        ctx.moveTo(cols[0].x, cols[0].y + k * bh);
        for (let c = 0; c < cols.length; c++) {
          ctx.lineTo(cols[c].x, cols[c].y + k * bh);
        }
        if (k === N - 1) {
          ctx.lineTo(rightW, botFill);
          ctx.lineTo(leftW, botFill);
        } else {
          for (let c = cols.length - 1; c >= 0; c--) {
            ctx.lineTo(cols[c].x, cols[c].y + (k + 1) * bh);
          }
        }
        ctx.closePath();
        ctx.fill();
      }
      // Crisp grass line on top
      ctx.beginPath();
      ctx.moveTo(cols[0].x, cols[0].y);
      for (const c of cols) ctx.lineTo(c.x, c.y);
      ctx.strokeStyle = 'rgba(255,255,255,0.5)';
      ctx.lineWidth = 2 / zoom;
      ctx.stroke();

      // Pumpkins (decorative) on some hilltops
      for (
        let i = Math.floor(leftW / 1600);
        i <= Math.floor(rightW / 1600) + 1;
        i++
      ) {
        const pxWorld = i * 1600 + ((i * 733) % 400);
        if (pxWorld < leftW || pxWorld > rightW) continue;
        ctx.save();
        ctx.translate(pxWorld, groundY(pxWorld) - 10);
        ctx.fillStyle = '#e8792b';
        ctx.strokeStyle = '#8a4413';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(0, 0, 15, 12, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.beginPath();
        ctx.ellipse(0, 0, 6, 12, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.strokeStyle = '#4c7c2b';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(0, -12);
        ctx.lineTo(-2, -20);
        ctx.stroke();
        ctx.restore();
      }

      // Gems
      const gi0 = Math.floor(leftW / GEM_SPACING);
      const gi1 = Math.ceil(rightW / GEM_SPACING);
      for (let i = gi0; i <= gi1; i++) {
        if (i < 2 || s.collected.has(i)) continue;
        const gx = i * GEM_SPACING;
        const gy = groundY(gx) - GEM_LIFT + Math.sin(s.time * 3 + i) * 2;
        ctx.save();
        ctx.translate(gx, gy);
        ctx.beginPath();
        ctx.moveTo(0, -9);
        ctx.lineTo(7, -1);
        ctx.lineTo(0, 10);
        ctx.lineTo(-7, -1);
        ctx.closePath();
        ctx.fillStyle = '#6fd6ff';
        ctx.fill();
        ctx.strokeStyle = '#2b8fd6';
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, -9);
        ctx.lineTo(-3, -1);
        ctx.lineTo(0, 10);
        ctx.closePath();
        ctx.fillStyle = 'rgba(255,255,255,0.55)';
        ctx.fill();
        ctx.restore();
      }

      // Finish flag
      if (FINISH_X > leftW - 80 && FINISH_X < rightW + 80) {
        const fy = groundY(FINISH_X);
        ctx.save();
        ctx.strokeStyle = '#5a3a1a';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(FINISH_X, fy);
        ctx.lineTo(FINISH_X, fy - 150);
        ctx.stroke();
        ctx.fillStyle = '#e8412e';
        ctx.beginPath();
        ctx.moveTo(FINISH_X, fy - 150);
        ctx.lineTo(FINISH_X + 56, fy - 132);
        ctx.lineTo(FINISH_X, fy - 114);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = '#5a3a1a';
        ctx.font = '600 15px ui-monospace, monospace';
        ctx.textAlign = 'center';
        ctx.fillText('HOME', FINISH_X, fy - 160);
        ctx.restore();
      }

      // Mom (bigger, behind)
      drawDragon(
        ctx,
        s.momX,
        groundY(s.momX) - 54,
        0.06 * Math.sin(s.time * 2.4),
        1.7,
        s.momWing,
        '#e0556f',
        '#ffc2cf',
        '#c23e59',
        '#5e1626'
      );

      // Speed streaks
      const sp = Math.hypot(s.vel.x, s.vel.y);
      if (sp > 620) {
        ctx.save();
        ctx.globalAlpha = Math.min(0.4, (sp - 620) / 900);
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        for (let i = 0; i < 4; i++) {
          const oy = py - 16 + i * 10;
          ctx.beginPath();
          ctx.moveTo(px - 30, oy);
          ctx.lineTo(px - 30 - 30 - i * 10, oy);
          ctx.stroke();
        }
        ctx.restore();
      }

      // Son
      const ang = Math.atan2(s.vel.y, s.vel.x) * (s.onGround ? 0.7 : 0.92);
      drawDragon(
        ctx,
        px,
        py,
        Math.max(-1.15, Math.min(1.15, ang)),
        1.05,
        s.wing,
        '#f28d3c',
        '#ffdca8',
        '#e0742a',
        '#7a3d12'
      );

      ctx.restore(); // end world transform

      // ---- Screen-space overlays anchored to world points (crisp text) ----
      if (s.flash) {
        const age = s.time - s.flash.born;
        if (age < 0.9) {
          ctx.save();
          ctx.globalAlpha = 1 - age / 0.9;
          ctx.font = '700 24px ui-monospace, monospace';
          ctx.textAlign = 'center';
          ctx.fillStyle = s.flash.good ? '#2f9e44' : '#e03131';
          ctx.strokeStyle = 'rgba(255,255,255,0.9)';
          ctx.lineWidth = 4;
          const tx = sX(px);
          const ty = sY(py) - 54 - age * 40;
          ctx.strokeText(s.flash.text, tx, ty);
          ctx.fillText(s.flash.text, tx, ty);
          ctx.restore();
        } else {
          s.flash = null;
        }
      }

      if (s.pops.length) {
        ctx.save();
        ctx.font = '700 16px ui-monospace, monospace';
        ctx.textAlign = 'center';
        for (let i = s.pops.length - 1; i >= 0; i--) {
          const p = s.pops[i];
          const age = s.time - p.born;
          if (age > 0.7) {
            s.pops.splice(i, 1);
            continue;
          }
          ctx.globalAlpha = 1 - age / 0.7;
          ctx.fillStyle = '#2b8fd6';
          ctx.strokeStyle = 'rgba(255,255,255,0.9)';
          ctx.lineWidth = 3;
          const tx = sX(p.x);
          const ty = sY(p.y) - 8 - age * 46;
          ctx.strokeText(p.text, tx, ty);
          ctx.fillText(p.text, tx, ty);
        }
        ctx.restore();
      }
    },
    [groundY, drawDragon]
  );

  // ---- Main loop ----------------------------------------------------------
  useEffect(() => {
    const loop = (t: number) => {
      rafRef.current = requestAnimationFrame(loop);
      const canvas = canvasRef.current;
      const s = stateRef.current;
      if (!canvas || !s) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      if (!lastRef.current) lastRef.current = t;
      let frame = (t - lastRef.current) / 1000;
      lastRef.current = t;
      if (frame > 0.2) frame = 0.2;

      if (phaseRef.current === 'playing') {
        accRef.current += frame;
        let guard = 0;
        while (accRef.current >= DT && guard < 600) {
          step(s);
          accRef.current -= DT;
          guard++;
          if (phaseRef.current !== 'playing') break;
        }
        setHud({
          dist: Math.min(100, (s.player.x / FINISH_X) * 100),
          gems: s.gems,
          combo: s.combo,
          gap: Math.max(0, Math.round(s.player.x - s.momX)),
        });
      }
      draw(ctx, s);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [step, draw]);

  // ---- Input --------------------------------------------------------------
  useEffect(() => {
    const dive = (on: boolean) => {
      const s = stateRef.current;
      if (s) s.diving = on;
    };
    const down = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowDown') {
        e.preventDefault();
        if (phaseRef.current === 'cover') startGame();
        else if (phaseRef.current === 'playing') dive(true);
        else startGame(); // restart from won/lost
      } else if (e.code === 'Escape' && phaseRef.current !== 'cover') {
        exitGame();
      }
    };
    const up = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'ArrowDown') dive(false);
    };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
    };
  }, [startGame, exitGame]);

  // Return to cover if the browser leaves fullscreen unexpectedly.
  useEffect(() => {
    const onFs = () => {
      if (!document.fullscreenElement && phaseRef.current === 'playing') {
        // keep playing in the fixed overlay; nothing to do
      }
    };
    document.addEventListener('fullscreenchange', onFs);
    return () => document.removeEventListener('fullscreenchange', onFs);
  }, []);

  const onDown = () => {
    sfxRef.current?.resume();
    const s = stateRef.current;
    if (phaseRef.current === 'playing' && s) s.diving = true;
  };
  const onUp = () => {
    const s = stateRef.current;
    if (s) s.diving = false;
  };

  const stats = finalRef.current;

  // ---- Cover (in-page) ----------------------------------------------------
  if (!active) {
    return (
      <div
        ref={rootRef}
        className='rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] px-8 py-12 text-center'
      >
        <div className='mx-auto max-w-md'>
          <div className='mb-4 text-5xl'>🐉</div>
          <h3 className='mb-3 text-2xl font-medium tracking-tight'>
            Dragon Run
          </h3>
          <p className='mb-6 text-[0.98rem] leading-relaxed text-[var(--text-secondary)]'>
            Mom starts right on your tail. Your only speed comes from the hills:{' '}
            <em>hold</em> to dive down a slope and build momentum, then let go at
            the crest to <em>launch into the sky</em>. Hold again to dive back
            down — land on a <em>downslope</em> and you keep flying faster; slam
            into an uphill and you lose everything. Grab gems, chain perfect
            landings, and don&apos;t let mom catch you.
          </p>
          <button
            onClick={startGame}
            className='rounded-lg bg-[var(--text-primary)] px-6 py-2.5 text-[0.98rem] font-medium text-[var(--background)] transition-opacity hover:opacity-80'
          >
            Start — go fullscreen
          </button>
          <p className='mt-5 meta'>
            Hold mouse / Space / ↓ to dive &nbsp;·&nbsp; Esc to exit
          </p>
        </div>
      </div>
    );
  }

  // ---- Active (fullscreen overlay, portalled to <body>) -------------------
  if (!mounted) return null;

  return createPortal(
    <div
      ref={rootRef}
      className='fixed inset-0 z-[100] bg-[#afe4f7] overflow-hidden'
    >
      <canvas
        ref={canvasRef}
        onPointerDown={onDown}
        onPointerUp={onUp}
        onPointerLeave={onUp}
        onContextMenu={(e) => e.preventDefault()}
        className='block h-full w-full touch-none cursor-pointer'
      />

      {/* HUD */}
      <div className='pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-4 sm:p-6 font-mono text-[#2a3a1a]'>
        <div className='rounded-lg bg-white/55 px-3 py-2 backdrop-blur-sm'>
          <div className='text-xs uppercase tracking-[0.12em] opacity-70'>
            Home
          </div>
          <div className='text-lg font-semibold tabular-nums'>
            {hud.dist.toFixed(1)}%
          </div>
        </div>
        <div className='rounded-lg bg-white/55 px-3 py-2 text-right backdrop-blur-sm'>
          <div className='text-lg font-semibold tabular-nums'>
            💎 {hud.gems}
            {hud.combo > 1 && (
              <span className='ml-2 text-green-700'>×{hud.combo}</span>
            )}
          </div>
          <div className='text-xs uppercase tracking-[0.12em] opacity-70'>
            {hud.gap < 120 ? '⚠ mom close!' : `mom ${hud.gap}px back`}
          </div>
        </div>
      </div>

      {/* Mom-proximity bar — fuller & greener = safer */}
      <div className='pointer-events-none absolute inset-x-0 bottom-4 flex justify-center'>
        <div className='h-2 w-56 overflow-hidden rounded-full bg-white/50'>
          <div
            className='h-full rounded-full transition-[width] duration-100'
            style={{
              width: `${Math.max(4, Math.min(100, (hud.gap / 500) * 100))}%`,
              background:
                hud.gap < 120 ? '#e03131' : hud.gap < 260 ? '#f59f00' : '#2f9e44',
            }}
          />
        </div>
      </div>

      {/* Exit */}
      <button
        onClick={exitGame}
        className='absolute right-4 top-20 rounded-md bg-white/55 px-3 py-1 font-mono text-xs text-[#2a3a1a] backdrop-blur-sm hover:bg-white/80'
      >
        ✕ Exit
      </button>

      {/* Win / Lose overlay */}
      {(phase === 'won' || phase === 'lost') && (
        <div className='absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-[2px]'>
          <div className='max-w-sm rounded-xl bg-white px-8 py-8 text-center text-[#161615] shadow-2xl'>
            <div className='mb-3 text-4xl'>{phase === 'won' ? '🏆' : '🐉'}</div>
            <h3 className='mb-2 text-2xl font-semibold tracking-tight'>
              {phase === 'won' ? 'You made it home!' : 'Mom caught you!'}
            </h3>
            <p className='mb-5 text-[0.95rem] leading-relaxed text-[#6b6a64]'>
              {phase === 'won'
                ? `You outran mom the whole way and collected ${stats.gems} gems.`
                : `You got ${((stats.dist / FINISH_X) * 100).toFixed(
                    0
                  )}% of the way home with ${stats.gems} gems.`}{' '}
              Best combo ×{stats.bestCombo}.
            </p>
            <div className='flex justify-center gap-3'>
              <button
                onClick={startGame}
                className='rounded-lg bg-[#161615] px-5 py-2 text-[0.95rem] font-medium text-white transition-opacity hover:opacity-80'
              >
                Run again
              </button>
              <button
                onClick={exitGame}
                className='rounded-lg border border-[#e6e5e1] px-5 py-2 text-[0.95rem] font-medium transition-colors hover:bg-[#f5f5f3]'
              >
                Exit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>,
    document.body
  );
}
