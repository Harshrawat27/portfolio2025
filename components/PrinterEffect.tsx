'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

/**
 * A large isometric "blueprint" of a printer — crisp white line-art on a
 * blueprint grid, with dimension lines, leader labels and a title block.
 * A sheet feeds out of the front slot the further you scroll.
 */

// ---- Isometric projection --------------------------------------------------
const COS = Math.cos(Math.PI / 6);
const SIN = Math.sin(Math.PI / 6);
type P3 = [number, number, number];

// Model bounding volume (used to auto-fit into the viewBox).
const VB_W = 1600;
const VB_H = 1000;
const PAD = 150;

// Raw iso (before fit)
const rawIso = (x: number, y: number, z: number): [number, number] => [
  (x - y) * COS,
  (x + y) * SIN - z,
];

// Compute a fit transform from a bounding box of the whole model.
function computeFit(bounds: { x: [number, number]; y: [number, number]; z: [number, number] }) {
  const corners: P3[] = [];
  for (const x of bounds.x) for (const y of bounds.y) for (const z of bounds.z) corners.push([x, y, z]);
  let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
  for (const [x, y, z] of corners) {
    const [ix, iy] = rawIso(x, y, z);
    minX = Math.min(minX, ix); maxX = Math.max(maxX, ix);
    minY = Math.min(minY, iy); maxY = Math.max(maxY, iy);
  }
  const s = Math.min((VB_W - PAD * 2) / (maxX - minX), (VB_H - PAD * 2) / (maxY - minY));
  const ox = VB_W / 2 - ((minX + maxX) / 2) * s;
  const oy = VB_H / 2 - ((minY + maxY) / 2) * s;
  return { s, ox, oy };
}

const BOUNDS = { x: [-30, 300] as [number, number], y: [-30, 250] as [number, number], z: [-16, 168] as [number, number] };
const FIT = computeFit(BOUNDS);
const P = (x: number, y: number, z: number): [number, number] => {
  const [ix, iy] = rawIso(x, y, z);
  return [FIT.ox + ix * FIT.s, FIT.oy + iy * FIT.s];
};
const poly = (pts: P3[]) => pts.map(([x, y, z]) => P(x, y, z).map((n) => n.toFixed(1)).join(',')).join(' ');
const line = (a: P3, b: P3) => {
  const [ax, ay] = P(...a);
  const [bx, by] = P(...b);
  return { x1: ax, y1: ay, x2: bx, y2: by };
};

// Colours
const C = {
  bg: '#1552d6',
  gridMinor: 'rgba(255,255,255,0.07)',
  gridMajor: 'rgba(255,255,255,0.15)',
  faceTop: '#1c5ce6',
  faceLeft: '#1550cf',
  faceRight: '#1044b8',
  stroke: '#eef4ff',
  soft: 'rgba(238,244,255,0.55)',
  dim: 'rgba(238,244,255,0.7)',
};

// ---- Geometry helpers ------------------------------------------------------
type Face = { pts: P3[]; fill: string };

function boxFaces(o: P3, s: P3): Face[] {
  const [x, y, z] = o;
  const [sx, sy, sz] = s;
  const top: P3[] = [[x, y, z + sz], [x + sx, y, z + sz], [x + sx, y + sy, z + sz], [x, y + sy, z + sz]];
  const left: P3[] = [[x, y + sy, z], [x + sx, y + sy, z], [x + sx, y + sy, z + sz], [x, y + sy, z + sz]];
  const right: P3[] = [[x + sx, y, z], [x + sx, y + sy, z], [x + sx, y + sy, z + sz], [x + sx, y, z + sz]];
  return [
    { pts: top, fill: C.faceTop },
    { pts: left, fill: C.faceLeft },
    { pts: right, fill: C.faceRight },
  ];
}
function boxEdges(o: P3, s: P3): [P3, P3][] {
  const [x, y, z] = o;
  const [sx, sy, sz] = s;
  const c: P3[] = [
    [x, y, z], [x + sx, y, z], [x + sx, y + sy, z], [x, y + sy, z],
    [x, y, z + sz], [x + sx, y, z + sz], [x + sx, y + sy, z + sz], [x, y + sy, z + sz],
  ];
  // only the visible edges (top ring + the two front verticals + the two front-bottom edges)
  return [
    [c[4], c[5]], [c[5], c[6]], [c[6], c[7]], [c[7], c[4]], // top
    [c[1], c[5]], [c[2], c[6]], [c[3], c[7]], // verticals (front three)
    [c[1], c[2]], [c[2], c[3]], // bottom front two
  ];
}

function isoCirclePath(cx: number, cy: number, z: number, r: number, seg = 64) {
  let d = '';
  for (let i = 0; i <= seg; i++) {
    const t = (i / seg) * Math.PI * 2;
    const [px, py] = P(cx + Math.cos(t) * r, cy + Math.sin(t) * r, z);
    d += (i === 0 ? 'M' : 'L') + px.toFixed(1) + ' ' + py.toFixed(1);
  }
  return d + 'Z';
}

export default function PrinterEffect() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [contentH, setContentH] = useState(1100);
  const [vh, setVh] = useState(800);

  useEffect(() => {
    const onScroll = () => {
      const el = sectionRef.current;
      if (!el) return;
      const total = el.offsetHeight - window.innerHeight;
      setProgress(total > 0 ? Math.min(1, Math.max(0, -el.getBoundingClientRect().top / total)) : 0);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const measure = () => {
      if (contentRef.current) setContentH(contentRef.current.scrollHeight);
      setVh(window.innerHeight);
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (contentRef.current) ro.observe(contentRef.current);
    window.addEventListener('resize', measure);
    return () => { ro.disconnect(); window.removeEventListener('resize', measure); };
  }, []);

  // ---- Build the printer geometry -----------------------------------------
  const model = useMemo(() => {
    const faces: Face[] = [];
    const edges: { seg: [P3, P3]; w?: number; dash?: string; c?: string }[] = [];
    const E = (a: P3, b: P3, opts: { w?: number; dash?: string; c?: string } = {}) => edges.push({ seg: [a, b], ...opts });

    // Body
    const BODY_O: P3 = [0, 0, 0];
    const BODY_S: P3 = [260, 190, 110];
    faces.push(...boxFaces(BODY_O, BODY_S));
    for (const e of boxEdges(BODY_O, BODY_S)) E(e[0], e[1], { w: 2 });

    // subtle panel seams on the two front faces
    E([0, 190, 88], [260, 190, 88], { c: C.soft });
    E([260, 0, 88], [260, 190, 88], { c: C.soft });
    E([200, 190, 0], [200, 190, 88], { c: C.soft });

    // Imaging drum — a short cylinder on the top-left of the lid
    const DC: [number, number] = [78, 96];
    const DZ = 110;
    const R_OUT = 58, R_IN = 34, RING_H = 12;
    // ring wall (outer)
    edges.push({ seg: [[0, 0, 0], [0, 0, 0]], c: 'none' }); // placeholder no-op keeps types happy
    // Top-left drum ellipses handled in overlay via paths (below)

    // Output tray — a recessed rectangle on the lid (right-center) with stacked sheets
    const TX0 = 132, TX1 = 246, TY0 = 40, TY1 = 168, TZ = 110, DEPTH = 16;
    // recess opening (on lid)
    E([TX0, TY0, TZ], [TX1, TY0, TZ]); E([TX1, TY0, TZ], [TX1, TY1, TZ]);
    E([TX1, TY1, TZ], [TX0, TY1, TZ]); E([TX0, TY1, TZ], [TX0, TY0, TZ]);
    // recess floor
    E([TX0, TY0, TZ - DEPTH], [TX1, TY0, TZ - DEPTH], { c: C.soft });
    E([TX1, TY0, TZ - DEPTH], [TX1, TY1, TZ - DEPTH], { c: C.soft });
    E([TX1, TY1, TZ - DEPTH], [TX0, TY1, TZ - DEPTH], { c: C.soft });
    // recess walls (visible corners)
    E([TX1, TY0, TZ], [TX1, TY0, TZ - DEPTH], { c: C.soft });
    E([TX1, TY1, TZ], [TX1, TY1, TZ - DEPTH], { c: C.soft });
    E([TX0, TY1, TZ], [TX0, TY1, TZ - DEPTH], { c: C.soft });
    // stacked sheets (ridges)
    for (let i = 1; i <= 5; i++) {
      const yy = TY0 + (i * (TY1 - TY0)) / 6;
      E([TX0 + 6, yy, TZ - DEPTH + 2], [TX1 - 6, yy, TZ - DEPTH + 2], { c: C.soft, w: 1 });
    }

    // Control panel — a raised wedge on the back-right of the lid
    const CP_O: P3 = [186, 8, 110];
    const CP_S: P3 = [66, 46, 20];
    faces.push(...boxFaces(CP_O, CP_S));
    for (const e of boxEdges(CP_O, CP_S)) E(e[0], e[1], { w: 1.6 });
    // screen + buttons on the panel top
    E([196, 16, 130], [232, 16, 130], { c: C.soft }); E([232, 16, 130], [244, 30, 130], { c: C.soft });
    E([244, 30, 130], [208, 30, 130], { c: C.soft }); E([208, 30, 130], [196, 16, 130], { c: C.soft });

    // Paper cassette — a drawer protruding from the front-left face
    const CAS_O: P3 = [24, 190, 8];
    const CAS_S: P3 = [200, 40, 40];
    faces.push(...boxFaces(CAS_O, CAS_S));
    for (const e of boxEdges(CAS_O, CAS_S)) E(e[0], e[1], { w: 1.6 });
    // drawer handle line
    E([44, 230, 30], [204, 230, 30], { c: C.soft });

    // Output slot on the front-LEFT face (y = 190). Paper drapes down this
    // face, so it lives on the isometric plane rather than flat on screen.
    const SLOT_Z = 86;
    const SLOT_X0 = 40, SLOT_X1 = 190;
    E([SLOT_X0, 190, SLOT_Z], [SLOT_X1, 190, SLOT_Z], { w: 2 });
    E([SLOT_X0, 190, SLOT_Z - 9], [SLOT_X1, 190, SLOT_Z - 9], { w: 2 });
    E([SLOT_X0, 190, SLOT_Z], [SLOT_X0, 190, SLOT_Z - 9], { c: C.soft });
    E([SLOT_X1, 190, SLOT_Z], [SLOT_X1, 190, SLOT_Z - 9], { c: C.soft });

    // Feet
    for (const [fx, fy] of [[6, 6], [246, 6], [6, 178], [246, 178]] as [number, number][]) {
      faces.push(...boxFaces([fx, fy, -10], [8, 8, 10]));
    }

    return { faces, edges, DC, DZ, R_OUT, R_IN, RING_H, SLOT_Z, SLOT_X0 };
  }, []);

  // Drum paths (drawn as overlay so the ellipses stay crisp)
  const drum = useMemo(() => {
    const { DC, DZ, R_OUT, R_IN, RING_H } = model;
    return {
      outerTop: isoCirclePath(DC[0], DC[1], DZ + RING_H, R_OUT),
      outerBottom: isoCirclePath(DC[0], DC[1], DZ, R_OUT),
      innerTop: isoCirclePath(DC[0], DC[1], DZ + RING_H, R_IN),
      // ring wall verticals at the widest screen points (left/right of ellipse)
      wallA: line([DC[0] - R_OUT, DC[1], DZ], [DC[0] - R_OUT, DC[1], DZ + RING_H]),
      wallB: line([DC[0] + R_OUT, DC[1], DZ], [DC[0] + R_OUT, DC[1], DZ + RING_H]),
      centerH: [P(DC[0] - R_OUT - 26, DC[1], DZ + RING_H), P(DC[0] + R_OUT + 26, DC[1], DZ + RING_H)],
      centerV: [P(DC[0], DC[1] - R_OUT - 26, DZ + RING_H), P(DC[0], DC[1] + R_OUT + 26, DZ + RING_H)],
    };
  }, [model]);

  // ---- Paper streaming out of the slot (on the isometric plane) -----------
  const PAPER_W = 200; // viewBox units
  const windowH = Math.max(280, Math.min(620, vh * 0.66));
  const tailPad = 40;
  const revealed = progress * (contentH + tailPad);
  const sheetH = Math.max(4, Math.min(revealed, windowH));
  const contentShift = Math.max(0, revealed - windowH);
  const paperAnchor = P(model.SLOT_X0, 190, model.SLOT_Z - 2); // top-left, in viewBox space
  const streaming = sheetH >= windowH - 1;

  return (
    <div
      ref={sectionRef}
      style={{
        height: '460vh',
        position: 'relative',
        left: '50%',
        width: '100vw',
        transform: 'translateX(-50%)',
      }}
    >
      <div
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          background: `radial-gradient(120% 100% at 50% 40%, #1a5ce6 0%, ${C.bg} 55%, #113fac 100%)`,
          overflow: 'hidden',
        }}
      >
        <svg
          viewBox={`0 0 ${VB_W} ${VB_H}`}
          preserveAspectRatio="xMidYMid meet"
          width="100%"
          height="100%"
          style={{ display: 'block', position: 'absolute', inset: 0 }}
        >
          <defs>
            <pattern id="bp-fine" width="26" height="26" patternUnits="userSpaceOnUse">
              <path d="M26 0H0V26" fill="none" stroke={C.gridMinor} strokeWidth="1" />
            </pattern>
            <pattern id="bp-major" width="130" height="130" patternUnits="userSpaceOnUse">
              <rect width="130" height="130" fill="url(#bp-fine)" />
              <path d="M130 0H0V130" fill="none" stroke={C.gridMajor} strokeWidth="1.4" />
            </pattern>
            <filter id="bp-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#bcd4ff" floodOpacity="0.5" />
            </filter>
          </defs>

          {/* grid */}
          <rect x="0" y="0" width={VB_W} height={VB_H} fill="url(#bp-major)" />

          {/* ground center-lines (dashed) */}
          <g stroke={C.soft} strokeWidth="1.2" strokeDasharray="10 8" vectorEffect="non-scaling-stroke" opacity={0.5}>
            <line {...line([-30, 95, 0], [320, 95, 0])} />
            <line {...line([130, -30, 0], [130, 260, 0])} />
          </g>

          {/* MODEL */}
          <g filter="url(#bp-glow)">
            {/* filled faces (occlusion) */}
            {model.faces.map((f, i) => (
              <polygon key={`f${i}`} points={poly(f.pts)} fill={f.fill} stroke="none" />
            ))}
            {/* drum cylinder */}
            <path d={drum.outerBottom} fill={C.faceRight} stroke="none" />
            <path d={drum.outerTop} fill={C.faceTop} stroke="none" />
            <path d={drum.innerTop} fill={C.faceLeft} stroke="none" />

            {/* crisp edges */}
            {model.edges.map((e, i) =>
              e.c === 'none' ? null : (
                <line
                  key={`e${i}`}
                  {...line(e.seg[0], e.seg[1])}
                  stroke={e.c || C.stroke}
                  strokeWidth={e.w || 1.4}
                  strokeDasharray={e.dash}
                  vectorEffect="non-scaling-stroke"
                  strokeLinecap="round"
                />
              )
            )}
            {/* drum outlines */}
            <g fill="none" stroke={C.stroke} strokeWidth="1.6" vectorEffect="non-scaling-stroke">
              <path d={drum.outerTop} />
              <path d={drum.innerTop} />
              <path d={drum.outerBottom} opacity={0.6} />
              <line x1={drum.wallA.x1} y1={drum.wallA.y1} x2={drum.wallA.x2} y2={drum.wallA.y2} />
              <line x1={drum.wallB.x1} y1={drum.wallB.y1} x2={drum.wallB.x2} y2={drum.wallB.y2} />
            </g>
            {/* drum centre-lines */}
            <g stroke={C.soft} strokeWidth="1" strokeDasharray="8 6" vectorEffect="non-scaling-stroke" opacity={0.7}>
              <line x1={drum.centerH[0][0]} y1={drum.centerH[0][1]} x2={drum.centerH[1][0]} y2={drum.centerH[1][1]} />
              <line x1={drum.centerV[0][0]} y1={drum.centerV[0][1]} x2={drum.centerV[1][0]} y2={drum.centerV[1][1]} />
            </g>
          </g>

          {/* DIMENSION LINES + LABELS (overlay) */}
          <g
            stroke={C.dim}
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
            fontFamily="var(--font-mono), ui-monospace, monospace"
          >
            {/* width dim along the right-front bottom edge */}
            <DimLine a={[0, 190, 0]} b={[260, 190, 0]} off={[0, 44, 0]} label="260" />
            {/* height dim on the right face */}
            <DimLine a={[260, 190, 0]} b={[260, 190, 110]} off={[36, 24, 0]} label="110" />
            {/* depth dim */}
            <DimLine a={[260, 0, 0]} b={[260, 190, 0]} off={[36, 0, 0]} label="190" />
          </g>

          {/* leader labels */}
          <g
            fontFamily="var(--font-mono), ui-monospace, monospace"
            fontSize="17"
            fill={C.stroke}
            stroke="none"
            letterSpacing="1.5"
          >
            <Leader at={[78, 96, 122]} to={[-70, -60]} text="IMAGING DRUM" />
            <Leader at={[190, 104, 110]} to={[40, -160]} text="OUTPUT TRAY" flip />
            <Leader at={[190, 210, 28]} to={[150, 40]} text="PAPER CASSETTE" flip />
            <Leader at={[115, 190, 86]} to={[-120, -40]} text="OUTPUT SLOT" />
          </g>

          {/* TITLE BLOCK */}
          <g transform={`translate(${VB_W - 430}, ${VB_H - 150})`}>
            <rect x="0" y="0" width="410" height="120" fill="rgba(9,32,90,0.35)" stroke={C.stroke} strokeWidth="1.4" vectorEffect="non-scaling-stroke" />
            <line x1="0" y1="46" x2="410" y2="46" stroke={C.stroke} strokeWidth="1" vectorEffect="non-scaling-stroke" />
            <line x1="270" y1="46" x2="270" y2="120" stroke={C.stroke} strokeWidth="1" vectorEffect="non-scaling-stroke" />
            <text x="18" y="31" fill={C.stroke} fontFamily="var(--font-mono), monospace" fontSize="24" letterSpacing="3">THE MACHINE</text>
            <text x="18" y="72" fill={C.soft} fontFamily="var(--font-mono), monospace" fontSize="14" letterSpacing="2">DRAWING № 07</text>
            <text x="18" y="98" fill={C.soft} fontFamily="var(--font-mono), monospace" fontSize="14" letterSpacing="2">ISOMETRIC · WIP</text>
            <text x="288" y="72" fill={C.soft} fontFamily="var(--font-mono), monospace" fontSize="14" letterSpacing="2">SCALE</text>
            <text x="288" y="98" fill={C.stroke} fontFamily="var(--font-mono), monospace" fontSize="18" letterSpacing="2">1 : 1</text>
          </g>

          {/* Paper feeding out of the slot — sheared onto the isometric plane
              so it drapes down the front face in 3D, not flat on screen. */}
          <foreignObject
            x={0}
            y={0}
            width={PAPER_W}
            height={Math.max(1, sheetH)}
            transform={`translate(${paperAnchor[0]} ${paperAnchor[1]}) matrix(${COS.toFixed(4)} ${SIN.toFixed(4)} 0 1 0 0)`}
            style={{ overflow: 'visible' }}
          >
            <div
              style={{
                width: PAPER_W,
                height: sheetH,
                overflow: 'hidden',
                background: 'linear-gradient(#f2f6ff,#e6eefb)',
                boxShadow: '10px 22px 40px -14px rgba(3,20,70,0.85), 0 0 0 1px rgba(255,255,255,0.4)',
                position: 'relative',
              }}
            >
              <div
                ref={contentRef}
                style={{
                  transform: `translateY(${-contentShift}px)`,
                  fontFamily: 'var(--font-mono), ui-monospace, monospace',
                  fontSize: 13,
                  lineHeight: 1.65,
                  color: '#173a86',
                  padding: '9px 16px 0',
                }}
              >
                <Receipt />
              </div>
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 16, background: 'linear-gradient(rgba(3,20,70,0.32), rgba(0,0,0,0))', pointerEvents: 'none' }} />
              {streaming && (
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 24, background: 'linear-gradient(rgba(230,238,251,0), rgba(230,238,251,0.92))', pointerEvents: 'none' }} />
              )}
            </div>
          </foreignObject>
        </svg>

        {/* scroll hint */}
        <div
          style={{
            position: 'absolute',
            bottom: 22,
            left: 24,
            fontFamily: 'var(--font-mono), monospace',
            fontSize: 11,
            letterSpacing: '0.18em',
            color: 'rgba(238,244,255,0.7)',
            opacity: progress > 0.02 ? 0 : 1,
            transition: 'opacity 0.4s',
          }}
        >
          SCROLL TO PRINT ↓
        </div>
      </div>
    </div>
  );
}

// ---- Dimension line component ----------------------------------------------
function DimLine({ a, b, off, label }: { a: P3; b: P3; off: P3; label: string }) {
  const ao: P3 = [a[0] + off[0], a[1] + off[1], a[2] + off[2]];
  const bo: P3 = [b[0] + off[0], b[1] + off[1], b[2] + off[2]];
  const [ax, ay] = P(...ao);
  const [bx, by] = P(...bo);
  const [eax, eay] = P(...a);
  const [ebx, eby] = P(...b);
  const mx = (ax + bx) / 2, my = (ay + by) / 2;
  const tick = (x: number, y: number) => `M${x - 4} ${y - 4} L${x + 4} ${y + 4}`;
  return (
    <g vectorEffect="non-scaling-stroke">
      <line x1={eax} y1={eay} x2={ax} y2={ay} opacity={0.5} />
      <line x1={ebx} y1={eby} x2={bx} y2={by} opacity={0.5} />
      <line x1={ax} y1={ay} x2={bx} y2={by} />
      <path d={tick(ax, ay)} />
      <path d={tick(bx, by)} />
      <g>
        <rect x={mx - 22} y={my - 24} width="44" height="22" rx="3" fill={C.bg} opacity={0.85} stroke="none" />
        <text x={mx} y={my - 8} fill={C.stroke} stroke="none" fontSize="16" textAnchor="middle" letterSpacing="1">
          {label}
        </text>
      </g>
    </g>
  );
}

function Leader({ at, to, text, flip }: { at: P3; to: [number, number]; text: string; flip?: boolean }) {
  const [ax, ay] = P(...at);
  const ex = ax + to[0], ey = ay + to[1];
  const tx = ex + (flip ? 8 : -8);
  return (
    <g>
      <circle cx={ax} cy={ay} r={3} fill={C.stroke} />
      <line x1={ax} y1={ay} x2={ex} y2={ey} stroke={C.soft} strokeWidth="1" vectorEffect="non-scaling-stroke" />
      <text x={tx} y={ey + 5} textAnchor={flip ? 'start' : 'end'} fill={C.stroke}>
        {text}
      </text>
    </g>
  );
}

// ---- Receipt content -------------------------------------------------------
function Receipt() {
  const Sep = () => <div style={{ borderTop: '1px dashed rgba(23,58,134,0.4)', margin: '7px 0' }} />;
  const Row = ({ a, b }: { a: string; b: string }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
      <span>{a}</span>
      <span style={{ whiteSpace: 'nowrap' }}>{b}</span>
    </div>
  );
  return (
    <>
      <div style={{ height: 14 }} />
      <div style={{ textAlign: 'center', fontWeight: 700, fontSize: 14, letterSpacing: '0.08em' }}>THE THOUGHT PRINTER</div>
      <div style={{ textAlign: 'center', fontSize: 10, opacity: 0.7 }}>est. MMXXVI · Delhi · Bharat</div>
      <Sep />
      <div style={{ textAlign: 'center', fontSize: 10, opacity: 0.7 }}>NOW PRINTING — DO NOT TEAR</div>
      <Sep />
      <Row a="01  a small game" b="dragon" />
      <Row a="02  this portfolio" b="rev. 7" />
      <Row a="03  late-night ideas" b="×∞" />
      <Row a="04  unfinished drafts" b="×12" />
      <Row a="05  one more try" b="always" />
      <Sep />
      <div style={{ textAlign: 'center' }}>— fig. 1 —</div>
      <div>Designed flat. Then a line</div>
      <div>or two, and it stands up:</div>
      <div>a box pretending to be a room,</div>
      <div>a room pretending to think.</div>
      <Sep />
      <Row a="INK LEVEL" b="████░ 78%" />
      <Row a="PAPER" b="endless" />
      <Row a="MODE" b="experiment" />
      <Sep />
      <div style={{ textAlign: 'center' }}>“keep scrolling —</div>
      <div style={{ textAlign: 'center' }}>it is still printing.”</div>
      <Sep />
      <Row a="TOTAL" b="one more try" />
      <Sep />
      <div style={{ display: 'flex', gap: 2, justifyContent: 'center', alignItems: 'flex-end', height: 34, margin: '8px 0' }}>
        {Array.from({ length: 34 }).map((_, b) => (
          <div key={b} style={{ width: (b * 37) % 3 === 0 ? 3 : 1.5, height: 34, background: '#173a86' }} />
        ))}
      </div>
      <div style={{ textAlign: 'center' }}>thank you for experimenting</div>
      <div style={{ textAlign: 'center' }}>without expectation.</div>
      <div style={{ height: 30 }} />
    </>
  );
}
