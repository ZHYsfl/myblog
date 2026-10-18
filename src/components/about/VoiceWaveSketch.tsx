import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import waveData from '@/data/voiceWave.json';
import {
  buildVoiceScene,
  readPalette,
  type Palette,
  type SceneHandles,
} from '@/components/about/voice-scene';

export function VoiceWaveSketch() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let palette: Palette = readPalette();
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(0, 1, 0, 1, -10, 10);
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const coarse = window.matchMedia('(pointer: coarse)').matches;
    // lite mode: touch / small screen / reduced motion → reveal once, then freeze
    const lite = reduced || coarse || window.innerWidth < 640;
    const renderer = new THREE.WebGLRenderer({ antialias: !lite, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, lite ? 1.5 : 2));
    mount.appendChild(renderer.domElement);

    const world = new THREE.Group();
    scene.add(world);

    let disposeFns: Array<() => void> = [];
    let handles: SceneHandles | null = null;
    let needleX = 0;
    let revealed = false;
    let progress = 0;

    const build = () => {
      // teardown old scene content
      disposeFns.forEach((fn) => fn());
      disposeFns = [];
      world.clear();
      handles = null;

      const w = mount.clientWidth;
      const h = mount.clientHeight;
      renderer.setSize(w, h);
      camera.left = -w / 2;
      camera.right = w / 2;
      camera.top = h / 2;
      camera.bottom = -h / 2;
      camera.updateProjectionMatrix();

      if (revealed) progress = 1;
      handles = buildVoiceScene({ world, palette, w, h, revealed, progress, disposeFns });

      // guarantee a static frame even when the loop is stopped
      renderer.render(scene, camera);
    };

    build();

    const ptsCount = waveData.points.length;
    const clock = new THREE.Clock();
    let raf = 0;
    let targetRX = 0;
    let targetRY = 0;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      const t = clock.getElapsedTime();
      if (revealed && progress < 1) {
        progress = Math.min(1, progress + 0.006);
        handles?.waveGeo.setDrawRange(0, Math.floor(ptsCount * progress));
      }
      if (handles) {
        const { needleLine, needleDot, waveW } = handles;
        const cycle = lite ? 0.5 : (t % 9) / 9;
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
      // lite mode: freeze after the reveal completes — same picture, zero GPU drain
      if (lite && progress >= 1) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    };
    const startLoop = () => {
      if (raf === 0) raf = requestAnimationFrame(tick);
    };
    const stopLoop = () => {
      if (raf !== 0) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    };

    // reveal + run only while on screen
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          revealed = true;
          startLoop();
        } else {
          stopLoop();
        }
      },
      { threshold: 0.3 }
    );
    io.observe(mount);

    // pointer parallax (desktop only)
    const onPointer = (e: PointerEvent) => {
      const rect = mount.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const ny = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      targetRY = nx * 0.06;
      targetRX = -ny * 0.04;
    };
    if (!coarse) mount.addEventListener('pointermove', onPointer);

    // theme change → rebuild with new palette
    const mo = new MutationObserver(() => {
      palette = readPalette();
      build();
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    const onResize = () => build();
    window.addEventListener('resize', onResize);

    return () => {
      stopLoop();
      io.disconnect();
      mo.disconnect();
      if (!coarse) mount.removeEventListener('pointermove', onPointer);
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
