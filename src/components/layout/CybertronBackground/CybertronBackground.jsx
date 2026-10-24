import { useEffect, useRef } from 'react';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import styles from './CybertronBackground.module.css';

/**
 * Animated Transformers / Cybertronian mechanical background.
 * Supports:
 *  - variant="dark" (default): fixed full-viewport dark Cybertronian backdrop
 *  - variant="light": high-contrast gunmetal, molten-orange & cobalt-blue
 *    animated Cybertronian layer for translucent white/platinum sections
 *    so the hex lattice, rotating planetary gears, circuit pulses, and sparks
 *    pop with crisp contrast on light backgrounds too.
 */
export default function CybertronBackground({ variant = 'dark' }) {
  const canvasRef = useRef(null);
  const reducedMotion = usePrefersReducedMotion();
  const isLight = variant === 'light';

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return undefined;

    let animId = 0;
    const parent = isLight ? canvas.parentElement : null;
    let width = parent ? parent.clientWidth : window.innerWidth;
    let height = parent ? parent.clientHeight : window.innerHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, 1.75);

    const pointer = { x: width * 0.72, y: height * 0.35, active: false };
    let scrollY = window.scrollY || 0;

    // 1. Floating Cybertronian Forge Sparks & AllSpark Motes
    const PARTICLE_COUNT = isLight ? 52 : 72;
    const particles = Array.from({ length: PARTICLE_COUNT }, (_, i) => {
      const isBlue = i % 4 === 0;
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: -(0.28 + Math.random() * 0.65),
        size: isLight ? 1.4 + Math.random() * 2.3 : 1.1 + Math.random() * 2.2,
        alpha: isLight ? 0.35 + Math.random() * 0.55 : 0.25 + Math.random() * 0.65,
        color: isLight
          ? isBlue
            ? '#0284c7'
            : i % 2 === 0
              ? '#ea580c'
              : '#334155'
          : isBlue
            ? '#38a8ff'
            : i % 2 === 0
              ? '#ff7a1f'
              : '#ffb838',
        phase: Math.random() * Math.PI * 2,
      };
    });

    // 2. High-Speed Energy Pulses Traveling Along Angular Cybertronian Conduits
    const PULSE_COUNT = isLight ? 12 : 14;
    const createPulse = (w, h) => {
      const horizontalFirst = Math.random() > 0.4;
      const startX = Math.random() * w;
      const startY = Math.random() * h;
      const dirX = Math.random() > 0.5 ? 1 : -1;
      const dirY = Math.random() > 0.5 ? 1 : -1;
      const seg1 = 90 + Math.random() * 160;
      const seg2 = 60 + Math.random() * 110;
      const seg3 = 80 + Math.random() * 150;
      const pts = [{ x: startX, y: startY }];
      if (horizontalFirst) {
        pts.push({ x: startX + dirX * seg1, y: startY });
        pts.push({
          x: startX + dirX * (seg1 + seg2 * 0.7),
          y: startY + dirY * seg2 * 0.7,
        });
        pts.push({
          x: startX + dirX * (seg1 + seg2 * 0.7 + seg3),
          y: startY + dirY * seg2 * 0.7,
        });
      } else {
        pts.push({ x: startX, y: startY + dirY * seg1 });
        pts.push({
          x: startX + dirX * seg2 * 0.7,
          y: startY + dirY * (seg1 + seg2 * 0.7),
        });
        pts.push({
          x: startX + dirX * seg2 * 0.7,
          y: startY + dirY * (seg1 + seg2 * 0.7 + seg3),
        });
      }
      return {
        pts,
        progress: Math.random(),
        speed: 0.004 + Math.random() * 0.006,
        isBlue: Math.random() > 0.68,
      };
    };

    let pulses = Array.from({ length: PULSE_COUNT }, () => createPulse(width, height));

    const resize = () => {
      width = parent ? parent.clientWidth : window.innerWidth;
      height = parent ? parent.clientHeight : window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();

    const onPointerMove = (e) => {
      if (parent) {
        const rect = parent.getBoundingClientRect();
        pointer.x = e.clientX - rect.left;
        pointer.y = e.clientY - rect.top;
      } else {
        pointer.x = e.clientX;
        pointer.y = e.clientY;
      }
      pointer.active = true;
    };

    const onScroll = () => {
      scrollY = window.scrollY || 0;
    };

    window.addEventListener('resize', resize, { passive: true });
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });

    const drawHex = (cx, cy, r) => {
      ctx.beginPath();
      for (let i = 0; i < 6; i += 1) {
        const angle = (Math.PI / 3) * i + Math.PI / 6;
        const hx = cx + r * Math.cos(angle);
        const hy = cy + r * Math.sin(angle);
        if (i === 0) ctx.moveTo(hx, hy);
        else ctx.lineTo(hx, hy);
      }
      ctx.closePath();
    };

    const drawCybertronGear = (cx, cy, baseR, time, dir = 1, accent = '#ff7a1f') => {
      ctx.save();
      ctx.translate(cx, cy);

      // Outer segmented telemetry ring
      ctx.save();
      ctx.rotate(time * 0.12 * dir);
      ctx.strokeStyle = isLight
        ? 'rgba(30, 41, 59, 0.22)'
        : 'rgba(206, 218, 235, 0.13)';
      ctx.lineWidth = isLight ? 1.5 : 1.2;
      ctx.setLineDash([18, 10, 6, 10]);
      ctx.beginPath();
      ctx.arc(0, 0, baseR, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // Notched mechanical gear teeth ring
      ctx.save();
      ctx.rotate(-time * 0.2 * dir);
      const teeth = 16;
      ctx.strokeStyle = isLight
        ? accent === '#38a8ff'
          ? 'rgba(2, 132, 199, 0.28)'
          : 'rgba(234, 88, 12, 0.32)'
        : accent === '#38a8ff'
          ? 'rgba(56, 168, 255, 0.18)'
          : 'rgba(255, 138, 36, 0.2)';
      ctx.lineWidth = 1.6;
      ctx.setLineDash([]);
      for (let i = 0; i < teeth; i += 1) {
        const a = (i / teeth) * Math.PI * 2;
        ctx.beginPath();
        ctx.moveTo(Math.cos(a) * (baseR * 0.78), Math.sin(a) * (baseR * 0.78));
        ctx.lineTo(Math.cos(a) * (baseR * 0.86), Math.sin(a) * (baseR * 0.86));
        ctx.stroke();
      }
      ctx.beginPath();
      ctx.arc(0, 0, baseR * 0.78, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // Inner hexagonal Cybertronian core frame
      ctx.save();
      ctx.rotate(time * 0.28 * dir);
      ctx.strokeStyle = isLight
        ? 'rgba(217, 119, 6, 0.28)'
        : 'rgba(255, 184, 56, 0.16)';
      ctx.lineWidth = 1.3;
      ctx.beginPath();
      const sides = 6;
      for (let i = 0; i <= sides; i += 1) {
        const a = (i / sides) * Math.PI * 2;
        const px = Math.cos(a) * (baseR * 0.52);
        const py = Math.sin(a) * (baseR * 0.52);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();
      ctx.restore();

      ctx.restore();
    };

    const startTime = performance.now();

    const render = (now) => {
      const t = (now - startTime) * 0.001;
      ctx.clearRect(0, 0, width, height);

      // 1. Parallax hexagonal Cybertronian armor grid
      const hexR = 38;
      const hexW = Math.sqrt(3) * hexR;
      const hexH = 1.5 * hexR;
      const parallaxY = isLight ? 0 : (scrollY * 0.18) % (hexH * 2);

      const cols = Math.ceil(width / hexW) + 2;
      const rows = Math.ceil(height / hexH) + 3;

      ctx.lineWidth = 1;
      for (let r = -1; r < rows; r += 1) {
        const cy = r * hexH - parallaxY;
        const xOffset = (r & 1) ? hexW * 0.5 : 0;
        for (let c = -1; c < cols; c += 1) {
          const cx = c * hexW + xOffset;
          const dx = cx - pointer.x;
          const dy = cy - pointer.y;
          const dist = Math.hypot(dx, dy);

          const wave = Math.sin(cx * 0.006 + cy * 0.006 + t * 1.1);
          if (dist < 240) {
            const intensity = (1 - dist / 240) * (isLight ? 0.42 : 0.34);
            drawHex(cx, cy, hexR - 2);
            ctx.strokeStyle = isLight
              ? `rgba(234, 88, 12, ${0.12 + intensity})`
              : `rgba(255, 146, 43, ${0.06 + intensity})`;
            ctx.stroke();
            if (dist < 110) {
              ctx.fillStyle = isLight
                ? `rgba(234, 88, 12, ${(1 - dist / 110) * 0.08})`
                : `rgba(255, 122, 31, ${(1 - dist / 110) * 0.055})`;
              ctx.fill();
            }
          } else if (wave > 0.72) {
            drawHex(cx, cy, hexR - 2);
            ctx.strokeStyle = isLight
              ? `rgba(30, 41, 59, ${(wave - 0.72) * 0.32})`
              : `rgba(206, 218, 235, ${(wave - 0.72) * 0.22})`;
            ctx.stroke();
          } else if ((r + c) % 3 === 0) {
            drawHex(cx, cy, hexR - 2);
            ctx.strokeStyle = isLight
              ? 'rgba(30, 41, 59, 0.065)'
              : 'rgba(200, 214, 232, 0.032)';
            ctx.stroke();
          }
        }
      }

      // 2. Rotating Cybertronian Planetary Gears in blank right-hand & side zones
      const gearShiftY = isLight ? 0 : (scrollY * 0.12) % height;
      drawCybertronGear(
        width * 0.8,
        isLight ? 195 : (height * 0.24 - gearShiftY + height) % height,
        195,
        t,
        1,
        '#ff7a1f',
      );
      drawCybertronGear(
        width * 0.14,
        isLight ? height * 0.58 : (height * 0.68 - gearShiftY * 0.7 + height) % height,
        155,
        t,
        -1,
        '#38a8ff',
      );
      drawCybertronGear(
        width * 0.76,
        isLight ? height * 0.78 : (height * 0.82 - gearShiftY * 0.5 + height) % height,
        140,
        t * 0.85,
        1,
        '#ffb838',
      );

      // 3. Angular Cybertronian Circuit Traces & Traveling Energy Pulses
      for (let i = 0; i < pulses.length; i += 1) {
        const p = pulses[i];
        if (!reducedMotion) {
          p.progress += p.speed;
          if (p.progress >= 1) {
            pulses[i] = createPulse(width, height);
            continue;
          }
        }

        const pts = p.pts;
        const shiftY = isLight ? 0 : -((scrollY * 0.15) % height);

        ctx.beginPath();
        for (let j = 0; j < pts.length; j += 1) {
          const py = (((pts[j].y + shiftY) % height) + height) % height;
          if (j === 0) ctx.moveTo(pts[j].x, py);
          else if (
            Math.abs(py - ((((pts[j - 1].y + shiftY) % height) + height) % height)) < 300
          ) {
            ctx.lineTo(pts[j].x, py);
          } else {
            ctx.moveTo(pts[j].x, py);
          }
        }
        ctx.strokeStyle = isLight
          ? p.isBlue
            ? 'rgba(2, 132, 199, 0.18)'
            : 'rgba(234, 88, 12, 0.2)'
          : p.isBlue
            ? 'rgba(56, 168, 255, 0.09)'
            : 'rgba(255, 138, 36, 0.1)';
        ctx.lineWidth = isLight ? 1.4 : 1.2;
        ctx.stroke();

        const segIdx = Math.min(pts.length - 2, Math.floor(p.progress * (pts.length - 1)));
        const localT = p.progress * (pts.length - 1) - segIdx;
        const a = pts[segIdx];
        const b = pts[segIdx + 1];
        const hx = a.x + (b.x - a.x) * localT;
        const hy = (((a.y + (b.y - a.y) * localT + shiftY) % height) + height) % height;

        const grad = ctx.createRadialGradient(hx, hy, 0, hx, hy, 14);
        if (p.isBlue) {
          grad.addColorStop(0, isLight ? 'rgba(2, 132, 199, 0.9)' : 'rgba(92, 200, 255, 0.85)');
          grad.addColorStop(1, 'rgba(56, 168, 255, 0)');
        } else {
          grad.addColorStop(0, isLight ? 'rgba(234, 88, 12, 0.92)' : 'rgba(255, 184, 56, 0.9)');
          grad.addColorStop(1, 'rgba(255, 114, 31, 0)');
        }
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(hx, hy, 14, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = isLight ? (p.isBlue ? '#0369a1' : '#c2410c') : '#ffffff';
        ctx.beginPath();
        ctx.arc(hx, hy, 2.4, 0, Math.PI * 2);
        ctx.fill();
      }

      // 4. Rising Molten Forge Sparks & AllSpark Particles
      for (let i = 0; i < particles.length; i += 1) {
        const pt = particles[i];
        if (!reducedMotion) {
          pt.x += pt.vx + Math.sin(t * 1.4 + pt.phase) * 0.22;
          pt.y += pt.vy;

          const dx = pt.x - pointer.x;
          const dy = pt.y - pointer.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 150 && dist > 1) {
            pt.x += (dx / dist) * 0.85;
            pt.y += (dy / dist) * 0.85;
          }

          if (pt.y < -10) {
            pt.y = height + 10;
            pt.x = Math.random() * width;
          }
          if (pt.x < -10) pt.x = width + 10;
          if (pt.x > width + 10) pt.x = -10;
        }

        const flicker = 0.65 + 0.35 * Math.sin(t * 3.2 + pt.phase);
        ctx.globalAlpha = pt.alpha * flicker;
        ctx.fillStyle = pt.color;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      if (!reducedMotion) {
        animId = window.requestAnimationFrame(render);
      }
    };

    animId = window.requestAnimationFrame(render);

    return () => {
      window.cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('scroll', onScroll);
    };
  }, [reducedMotion, isLight]);

  if (isLight) {
    return (
      <div className={styles.sectionBackdropRoot} aria-hidden="true">
        <canvas ref={canvasRef} className={styles.canvas} />
      </div>
    );
  }

  return (
    <div className={styles.backdropRoot} aria-hidden="true">
      <div className={styles.ambientNebula} />
      <div className={styles.diagonalStruts} />
      <canvas ref={canvasRef} className={styles.canvas} />
      <div className={styles.scanlines} />
    </div>
  );
}
