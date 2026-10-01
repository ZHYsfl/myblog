import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import waveData from '@/data/voiceWave.json';

interface Palette {
  ink: string;
  muted: string;
  accent: string;
  hairline: string;
}

function readPalette(): Palette {
  const cs = getComputedStyle(document.documentElement);
  return {
    ink: cs.getPropertyValue('--fg').trim() || '#1c1c1a',
    muted: cs.getPropertyValue('--muted').trim() || '#6f6f6a',
    accent: cs.getPropertyValue('--accent').trim() || '#dc4c3a',
    hairline: cs.getPropertyValue('--border').trim() || '#e9e9e6',
  };
}

function makeTextSprite(text: string, color: string, px = 22): THREE.Sprite {
  const pad = 16;
  const c = document.createElement('canvas');
  const ctx = c.getContext('2d')!;
  const font = `${px}px Georgia, "Noto Serif SC", "Songti SC", serif`;
  ctx.font = font;
  const w = Math.ceil(ctx.measureText(text).width) + pad * 2;
  const h = px + pad * 2;
  c.width = w * 2;
  c.height = h * 2;
  ctx.scale(2, 2);
  ctx.font = font;
  ctx.fillStyle = color;
  ctx.textBaseline = 'middle';
  ctx.fillText(text, pad, h / 2);
  const tex = new THREE.CanvasTexture(c);
  tex.anisotropy = 4;
  const sprite = new THREE.Sprite(
    new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: false })
  );
  sprite.scale.set((w / h) * px, px, 1);
  return sprite;
}

/** wobbly hand-drawn circle */
function roughCircle(r: number, seed: number, segments = 160): THREE.Vector3[] {
  const pts: THREE.Vector3[] = [];
  for (let i = 0; i <= segments; i++) {
    const a = (i / segments) * Math.PI * 2;
    const wob =
      Math.sin(a * 3 + seed) * r * 0.012 +
      Math.sin(a * 7 + seed * 2.7) * r * 0.008 +
      Math.sin(a * 13 + seed * 1.3) * r * 0.004;
    pts.push(new THREE.Vector3(Math.cos(a) * (r + wob), Math.sin(a) * (r + wob), 0));
  }
  return pts;
}

function pencilLine(pts: THREE.Vector3[], color: string, opacity: number): THREE.Line {
  const geo = new THREE.BufferGeometry().setFromPoints(pts);
  const mat = new THREE.LineBasicMaterial({ color, transparent: true, opacity });
  return new THREE.Line(geo, mat);
}

/** second, slightly offset translucent pass = pencil double-stroke */
function jitterCopy(line: THREE.Line, amount: number): THREE.Line {
  const src = line.geometry.getAttribute('position');
  const pts: THREE.Vector3[] = [];
  for (let i = 0; i < src.count; i++) {
    pts.push(
      new THREE.Vector3(
        src.getX(i) + (Math.random() - 0.5) * amount,
        src.getY(i) + (Math.random() - 0.5) * amount,
        src.getZ(i)
      )
    );
  }
  const mat = line.material as THREE.LineBasicMaterial;
  return pencilLine(pts, `#${mat.color.getHexString()}`, mat.opacity * 0.4);
}

export function VoiceWaveSketch() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let palette = readPalette();
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(0, 1, 0, 1, -10, 10);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    const world = new THREE.Group();
    scene.add(world);

    let disposeFns: Array<() => void> = [];
    let needleX = 0;
    let needleLine: THREE.Line | null = null;
    let needleDot: THREE.Mesh | null = null;
    let waveGroup: THREE.Group | null = null;
    let waveGeo: THREE.BufferGeometry | null = null;
    let jittered: THREE.Line | null = null;
    let revealed = false;
    let progress = 0;
    let waveW = 0;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const build = () => {
      // teardown old scene content
      disposeFns.forEach((fn) => fn());
      disposeFns = [];
      world.clear();
      needleLine = null;
      needleDot = null;
      waveGroup = null;
      waveGeo = null;
      jittered = null;

      const w = mount.clientWidth;
      const h = mount.clientHeight;
      renderer.setSize(w, h);
      camera.left = -w / 2;
      camera.right = w / 2;
      camera.top = h / 2;
      camera.bottom = -h / 2;
      camera.updateProjectionMatrix();

      // ---- dot grid (graph paper) ----
      const gap = 26;
      const gridPts: THREE.Vector3[] = [];
      for (let gx = -w / 2; gx <= w / 2; gx += gap) {
        for (let gy = -h / 2; gy <= h / 2; gy += gap) {
          gridPts.push(new THREE.Vector3(gx, gy, -1));
        }
      }
      const gridGeo = new THREE.BufferGeometry().setFromPoints(gridPts);
      const grid = new THREE.Points(
        gridGeo,
        new THREE.PointsMaterial({
          color: palette.hairline,
          size: 2,
          transparent: true,
          opacity: 0.55,
          sizeAttenuation: false,
        })
      );
      world.add(grid);
      disposeFns.push(() => gridGeo.dispose());

      // ---- orbit rings with projects ----
      const r2 = Math.min(h * 0.62, w * 0.3);
      const r1 = r2 * 0.66;
      const outer = pencilLine(roughCircle(r2, 1.7), palette.muted, 0.35);
      const inner = pencilLine(roughCircle(r1, 4.2), palette.muted, 0.22);
      world.add(outer, jitterCopy(outer, 1.6), inner, jitterCopy(inner, 1.6));
      disposeFns.push(() => outer.geometry.dispose());

      const projects = [
        { name: 'AudioCC Lab', angle: 152 },
        { name: 'VoxFlow', angle: 38 },
        { name: 'SCRIBE', angle: -42 },
        { name: 'AgentGenesis', angle: -138 },
      ];
      for (const p of projects) {
        const a = (p.angle * Math.PI) / 180;
        const x = Math.cos(a) * r2;
        const y = Math.sin(a) * r2;
        const dotGeo = new THREE.CircleGeometry(3, 24);
        const dot = new THREE.Mesh(dotGeo, new THREE.MeshBasicMaterial({ color: palette.muted }));
        dot.position.set(x, y, 0);
        world.add(dot);
        const label = makeTextSprite(p.name, palette.muted);
        const lx = x + Math.sign(x || 1) * (label.scale.x / 2 + 16);
        label.position.set(lx, y, 0);
        world.add(label);
        disposeFns.push(() => dotGeo.dispose());
      }

      // ---- the voice: real waveform of his own cover ----
      const pts: number[] = waveData.points;
      const n = pts.length;
      waveW = Math.min(w * 0.8, r2 * 2.28);
      const amp = r1 * 0.78;
      const wavePts: THREE.Vector3[] = [];
      for (let i = 0; i < n; i++) {
        const x = -waveW / 2 + (i / (n - 1)) * waveW;
        const carrier = Math.sin((i / n) * Math.PI * 2 * 11 + Math.sin(i * 0.011) * 2.2);
        const hand = Math.sin(i * 1.7) * 0.9 + Math.sin(i * 0.31) * 0.7;
        const y = carrier * pts[i] * amp + hand * pts[i] * 2.2;
        wavePts.push(new THREE.Vector3(x, y, 0.1));
      }
      waveGeo = new THREE.BufferGeometry().setFromPoints(wavePts);
      const wave = new THREE.Line(
        waveGeo,
        new THREE.LineBasicMaterial({ color: palette.ink, transparent: true, opacity: 0.9 })
      );
      jittered = jitterCopy(wave, 1.3);
      waveGroup = new THREE.Group();
      waveGroup.add(wave, jittered);
      world.add(waveGroup);
      if (revealed) progress = 1;
      waveGeo.setDrawRange(0, Math.floor(n * progress));

      // center axis
      const axisGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-waveW / 2 - 14, 0, 0),
        new THREE.Vector3(waveW / 2 + 14, 0, 0),
      ]);
      world.add(
        new THREE.Line(
          axisGeo,
          new THREE.LineBasicMaterial({ color: palette.hairline, transparent: true, opacity: 0.9 })
        )
      );
      disposeFns.push(() => axisGeo.dispose());

      // ---- needle (playhead) ----
      const needleGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, -amp * 1.12, 0.2),
        new THREE.Vector3(0, amp * 1.12, 0.2),
      ]);
      needleLine = new THREE.Line(
        needleGeo,
        new THREE.LineBasicMaterial({ color: palette.accent, transparent: true, opacity: 0.5 })
      );
      needleDot = new THREE.Mesh(
        new THREE.CircleGeometry(3.6, 32),
        new THREE.MeshBasicMaterial({ color: palette.accent })
      );
      needleDot.position.z = 0.3;
      world.add(needleLine, needleDot);
      disposeFns.push(() => needleGeo.dispose());

      // ---- annotations ----
      const start = waveData.segmentStart;
      const mm = (s: number) =>
        `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
      const a1 = makeTextSprite(
        `《${waveData.song}》 · ${waveData.artist} 翻唱自 ${waveData.coverOf}`,
        palette.ink
      );
      a1.position.set(-w / 2 + 20 + a1.scale.x / 2, -h / 2 + 20, 0);
      const a2 = makeTextSprite(
        `${mm(start)} — ${mm(start + waveData.segmentSeconds)} · ${waveData.segmentSeconds} 秒`,
        palette.muted,
        19
      );
      a2.position.set(w / 2 - 20 - a2.scale.x / 2, -h / 2 + 20, 0);
      const a3 = makeTextSprite('voice — 我研究它，也用它唱歌', palette.muted, 19);
      a3.position.set(0, h / 2 - 20, 0);
      world.add(a1, a2, a3);
    };

    build();

    // reveal on scroll
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          revealed = true;
        }
      },
      { threshold: 0.3 }
    );
    io.observe(mount);

    // pointer parallax
    let targetRX = 0;
    let targetRY = 0;
    const onPointer = (e: PointerEvent) => {
      const rect = mount.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      targetRY = nx * 0.06;
      targetRX = -ny * 0.04;
    };
    mount.addEventListener('pointermove', onPointer);

    // theme change → rebuild with new palette
    const mo = new MutationObserver(() => {
      palette = readPalette();
      build();
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    const onResize = () => build();
    window.addEventListener('resize', onResize);

    const ptsCount = waveData.points.length;
    const clock = new THREE.Clock();
    let raf = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      const t = clock.getElapsedTime();
      if (revealed && progress < 1) {
        progress = Math.min(1, progress + 0.006);
        waveGeo?.setDrawRange(0, Math.floor(ptsCount * progress));
      }
      if (needleLine && needleDot) {
        const cycle = reduced ? 0.5 : (t % 9) / 9;
        needleX = -waveW / 2 + cycle * waveW;
        needleLine.position.x = needleX;
        needleDot.position.x = needleX;
        needleDot.position.y = 0;
        (needleLine.material as THREE.LineBasicMaterial).opacity =
          progress >= 1 ? 0.45 : progress * 0.45;
        (needleDot.material as THREE.MeshBasicMaterial).opacity = progress >= 1 ? 1 : progress;
        (needleDot.material as THREE.MeshBasicMaterial).transparent = true;
      }
      world.rotation.x += (targetRX - world.rotation.x) * 0.05;
      world.rotation.y += (targetRY - world.rotation.y) * 0.05;
      renderer.render(scene, camera);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      mo.disconnect();
      mount.removeEventListener('pointermove', onPointer);
      window.removeEventListener('resize', onResize);
      disposeFns.forEach((fn) => fn());
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="mb-16 h-[320px] w-full overflow-hidden rounded-2xl border border-border bg-surface sm:h-[380px]"
      aria-hidden="true"
    />
  );
}
