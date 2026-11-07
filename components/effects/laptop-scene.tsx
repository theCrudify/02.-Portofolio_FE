'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

/** Resolved theme colours (rgb() strings) — three.js cannot parse the oklch tokens directly. */
export interface LaptopPalette {
  body: string;
  deck: string;
  key: string;
  screenBg: string;
  screenFg: string;
  muted: string;
  primary: string;
  success: string;
  warning: string;
  danger: string;
}

export interface LaptopCode {
  name: string;
  role: string;
  stack: string[];
  location: string | null;
  available: boolean;
}

export interface LaptopSceneProps {
  palette: LaptopPalette;
  code: LaptopCode;
  /** Image URLs for screens after the code screen (already sized). */
  images: string[];
  active: number;
  reducedMotion: boolean;
  paused: boolean;
}

const LID_CLOSED = Math.PI / 2;
const LID_OPEN = -0.24;
const SCREEN_W = 1024;
const SCREEN_H = 640;
const CHARS_PER_SECOND = 70;

type Tone = 'kw' | 'str' | 'fg' | 'mut' | 'warn';
type Token = [string, Tone];

function buildCodeLines(code: LaptopCode): Token[][] {
  const stackLines: Token[][] = [];
  for (let i = 0; i < code.stack.length; i += 3) {
    const chunk = code.stack
      .slice(i, i + 3)
      .map((s) => `'${s}'`)
      .join(', ');
    stackLines.push([
      ['    ', 'fg'],
      [chunk, 'str'],
      [',', 'mut'],
    ]);
  }
  return [
    [
      ['const ', 'kw'],
      ['engineer', 'fg'],
      [' = {', 'mut'],
    ],
    [
      ['  name: ', 'fg'],
      [`'${code.name}'`, 'str'],
      [',', 'mut'],
    ],
    [
      ['  role: ', 'fg'],
      [`'${code.role}'`, 'str'],
      [',', 'mut'],
    ],
    [['  stack: [', 'fg']],
    ...stackLines,
    [['  ],', 'fg']],
    ...(code.location
      ? ([
          [
            ['  location: ', 'fg'],
            [`'${code.location}'`, 'str'],
            [',', 'mut'],
          ],
        ] as Token[][])
      : []),
    [
      ['  available: ', 'fg'],
      [String(code.available), 'kw'],
      [',', 'mut'],
    ],
    [['};', 'mut']],
    [],
    [
      ['engineer', 'fg'],
      ['.', 'mut'],
      ['ship', 'warn'],
      ['();', 'mut'],
    ],
  ];
}

function drawCodeScreen(
  ctx: CanvasRenderingContext2D,
  lines: Token[][],
  palette: LaptopPalette,
  visibleChars: number,
  cursorOn: boolean,
) {
  const tone: Record<Tone, string> = {
    kw: palette.primary,
    str: palette.success,
    fg: palette.screenFg,
    mut: palette.muted,
    warn: palette.warning,
  };
  ctx.fillStyle = palette.screenBg;
  ctx.fillRect(0, 0, SCREEN_W, SCREEN_H);

  // Title bar with traffic lights and a file tab.
  ctx.globalAlpha = 0.08;
  ctx.fillStyle = palette.screenFg;
  ctx.fillRect(0, 0, SCREEN_W, 56);
  ctx.globalAlpha = 1;
  [palette.danger, palette.warning, palette.success].forEach((c, i) => {
    ctx.fillStyle = c;
    ctx.beginPath();
    ctx.arc(32 + i * 28, 28, 9, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.font = '600 22px ui-monospace, SFMono-Regular, Menlo, monospace';
  ctx.fillStyle = palette.screenFg;
  ctx.fillText('engineer.ts', 140, 36);
  ctx.fillStyle = palette.primary;
  ctx.fillRect(132, 52, 150, 4);

  ctx.font = '600 31px ui-monospace, SFMono-Regular, Menlo, monospace';
  const lineH = 45;
  const left = 78;
  const maxW = SCREEN_W - left - 30;
  let remaining = visibleChars;
  let cursor: [number, number] | null = null;

  lines.forEach((line, row) => {
    const y = 106 + row * lineH;
    ctx.fillStyle = palette.muted;
    ctx.globalAlpha = 0.55;
    ctx.fillText(String(row + 1).padStart(2, ' '), 18, y);
    ctx.globalAlpha = 1;
    let x = left;
    for (const [text, t] of line) {
      if (remaining <= 0) break;
      let shown = text.slice(0, remaining);
      remaining -= shown.length;
      // Long strings (headline) are clipped with an ellipsis so they never leave the screen.
      while (shown.length > 1 && x + ctx.measureText(shown).width > maxW) {
        shown = `${shown.slice(0, -2)}…`;
      }
      ctx.fillStyle = tone[t];
      ctx.fillText(shown, x, y);
      x += ctx.measureText(shown).width;
    }
    if (remaining > 0)
      remaining -= 1; // the newline costs one "keystroke"
    else if (!cursor) cursor = [x, y];
  });

  if (cursorOn) {
    const [cx, cy]: [number, number] = cursor ?? [left, 106 + lines.length * lineH];
    ctx.fillStyle = palette.primary;
    ctx.fillRect(cx + 2, cy - 27, 15, 34);
  }
}

function drawKeyboard(palette: LaptopPalette): HTMLCanvasElement {
  const c = document.createElement('canvas');
  c.width = 1024;
  c.height = 360;
  const ctx = c.getContext('2d')!;
  ctx.fillStyle = palette.deck;
  ctx.fillRect(0, 0, c.width, c.height);
  ctx.fillStyle = palette.key;
  const rows = 5;
  const gap = 10;
  const keyH = (c.height - gap * (rows + 1)) / rows;
  for (let r = 0; r < rows; r++) {
    const cols = r === rows - 1 ? 9 : 14;
    const keyW = (c.width - gap * (cols + 1)) / cols;
    for (let k = 0; k < cols; k++) {
      // Space bar: merge the middle keys of the bottom row.
      if (r === rows - 1 && k > 2 && k < 6) continue;
      const w = r === rows - 1 && k === 2 ? keyW * 4 + gap * 3 : keyW;
      ctx.beginPath();
      ctx.roundRect(gap + k * (keyW + gap), gap + r * (keyH + gap), w, keyH, 8);
      ctx.fill();
    }
  }
  return c;
}

/** Rounded slab, centred, thickness along Y. */
function roundedSlab(w: number, d: number, h: number, r: number): THREE.ExtrudeGeometry {
  const s = new THREE.Shape();
  const x = -w / 2;
  const y = -d / 2;
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y);
  s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + d - r);
  s.quadraticCurveTo(x + w, y + d, x + w - r, y + d);
  s.lineTo(x + r, y + d);
  s.quadraticCurveTo(x, y + d, x, y + d - r);
  s.lineTo(x, y + r);
  s.quadraticCurveTo(x, y, x + r, y);
  const g = new THREE.ExtrudeGeometry(s, {
    depth: h,
    bevelEnabled: true,
    bevelThickness: 0.015,
    bevelSize: 0.015,
    bevelSegments: 3,
    curveSegments: 10,
  });
  g.center();
  g.rotateX(-Math.PI / 2);
  return g;
}

function useWindowPointer() {
  const pointer = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, []);
  return pointer;
}

function Laptop({
  palette,
  code,
  images,
  active,
  reducedMotion,
}: Omit<LaptopSceneProps, 'paused'>) {
  const root = useRef<THREE.Group>(null);
  const hinge = useRef<THREE.Group>(null);
  const openProgress = useRef(reducedMotion ? 1 : 0);
  const lastChars = useRef(-1);
  const lastCursor = useRef<boolean | null>(null);
  const pointer = useWindowPointer();
  const invalidate = useThree((s) => s.invalidate);

  const lines = useMemo(() => buildCodeLines(code), [code]);
  const totalChars = useMemo(
    () => lines.reduce((n, l) => n + l.reduce((m, [t]) => m + t.length, 0) + 1, 0),
    [lines],
  );

  const codeCanvas = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = SCREEN_W;
    c.height = SCREEN_H;
    return c;
  }, []);
  const codeTexture = useMemo(() => {
    const t = new THREE.CanvasTexture(codeCanvas);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 4;
    return t;
  }, [codeCanvas]);

  const keyboardTexture = useMemo(() => {
    const t = new THREE.CanvasTexture(drawKeyboard(palette));
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, [palette]);

  const imageTextures = useMemo(() => {
    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin('anonymous');
    return images.map((url) => {
      const t = loader.load(url, () => invalidate());
      t.colorSpace = THREE.SRGBColorSpace;
      return t;
    });
  }, [images, invalidate]);

  useEffect(
    () => () => {
      codeTexture.dispose();
      keyboardTexture.dispose();
      imageTextures.forEach((t) => t.dispose());
    },
    [codeTexture, keyboardTexture, imageTextures],
  );

  // Palette change (theme toggle) or reduced motion: repaint the code screen in full.
  useEffect(() => {
    const ctx = codeCanvas.getContext('2d');
    if (!ctx) return;
    lastChars.current = reducedMotion ? totalChars : -1;
    drawCodeScreen(ctx, lines, palette, reducedMotion ? totalChars : 0, false);
    codeTexture.needsUpdate = true;
    invalidate();
  }, [codeCanvas, codeTexture, lines, palette, reducedMotion, totalChars, invalidate]);

  const baseGeo = useMemo(() => roundedSlab(3.2, 2.2, 0.1, 0.12), []);
  const lidGeo = useMemo(() => roundedSlab(3.2, 2.1, 0.06, 0.12), []);
  useEffect(
    () => () => {
      baseGeo.dispose();
      lidGeo.dispose();
    },
    [baseGeo, lidGeo],
  );

  const screenMap =
    active === 0 ? codeTexture : (imageTextures[active - 1] ?? codeTexture);

  useFrame((state, delta) => {
    const g = root.current;
    const h = hinge.current;
    if (!g || !h) return;
    const t = state.clock.elapsedTime;

    if (!reducedMotion) {
      openProgress.current = Math.min(1, openProgress.current + delta / 1.6);
      g.rotation.y = THREE.MathUtils.damp(
        g.rotation.y,
        -0.42 + pointer.current.x * 0.35,
        3,
        delta,
      );
      g.rotation.x = THREE.MathUtils.damp(
        g.rotation.x,
        pointer.current.y * 0.08,
        3,
        delta,
      );
      g.position.y = Math.sin(t * 1.1) * 0.05;
    } else {
      g.rotation.y = -0.42;
    }
    const eased = 1 - Math.pow(1 - openProgress.current, 3);
    h.rotation.x = THREE.MathUtils.lerp(LID_CLOSED, LID_OPEN, eased);

    // Typing animation starts once the lid is mostly open.
    if (!reducedMotion && active === 0) {
      const typingT = Math.max(0, t - 1.2);
      const chars = Math.min(totalChars, Math.floor(typingT * CHARS_PER_SECOND));
      const cursorOn = Math.floor(t * 2) % 2 === 0;
      if (chars !== lastChars.current || cursorOn !== lastCursor.current) {
        const ctx = codeCanvas.getContext('2d');
        if (ctx) {
          drawCodeScreen(ctx, lines, palette, chars, cursorOn);
          codeTexture.needsUpdate = true;
        }
        lastChars.current = chars;
        lastCursor.current = cursorOn;
      }
    }
  });

  return (
    <group ref={root} rotation={[0, -0.42, 0]}>
      {/* Base */}
      <mesh geometry={baseGeo}>
        <meshStandardMaterial color={palette.body} metalness={0.15} roughness={0.42} />
      </mesh>
      <mesh position={[0, 0.067, -0.28]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2.85, 1.0]} />
        <meshStandardMaterial map={keyboardTexture} roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.067, 0.68]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.05, 0.58]} />
        <meshStandardMaterial color={palette.body} metalness={0.05} roughness={0.25} />
      </mesh>

      {/* Lid, pivoting on the back edge */}
      <group ref={hinge} position={[0, 0.075, -1.08]} rotation={[LID_CLOSED, 0, 0]}>
        <mesh
          geometry={lidGeo}
          rotation={[Math.PI / 2, 0, 0]}
          position={[0, 1.05, -0.03]}
        >
          <meshStandardMaterial color={palette.body} metalness={0.15} roughness={0.42} />
        </mesh>
        {/* Bezel + screen on the inner face */}
        <mesh position={[0, 1.05, 0.02]}>
          <planeGeometry args={[3.08, 1.98]} />
          <meshBasicMaterial color={palette.screenBg} />
        </mesh>
        <mesh position={[0, 1.07, 0.022]}>
          <planeGeometry args={[2.92, 1.825]} />
          <meshBasicMaterial map={screenMap} toneMapped={false} />
        </mesh>
        {/* Glowing badge on the back of the lid */}
        <mesh position={[0, 1.05, -0.08]} rotation={[0, Math.PI, 0]}>
          <circleGeometry args={[0.16, 40]} />
          <meshBasicMaterial color={palette.primary} toneMapped={false} />
        </mesh>
      </group>
    </group>
  );
}

export default function LaptopScene({
  paused,
  reducedMotion,
  ...rest
}: LaptopSceneProps) {
  // Phones: high-DPR screens make full-res + MSAA far too costly for a mobile GPU.
  const [touch] = useState(() => window.matchMedia('(pointer: coarse)').matches);
  return (
    <Canvas
      dpr={touch ? [1, 1.25] : [1, 1.75]}
      frameloop={paused ? 'never' : reducedMotion ? 'demand' : 'always'}
      camera={{ position: [0, 2.2, 5.7], fov: 34 }}
      gl={{ antialias: !touch, alpha: true, powerPreference: 'low-power' }}
      onCreated={({ camera }) => camera.lookAt(0, 0.75, 0)}
    >
      <ambientLight intensity={0.9} />
      <directionalLight position={[3, 5, 4]} intensity={1.8} />
      <directionalLight
        position={[-4, 2, -3]}
        intensity={0.6}
        color={rest.palette.primary}
      />
      <Laptop reducedMotion={reducedMotion} {...rest} />
    </Canvas>
  );
}
