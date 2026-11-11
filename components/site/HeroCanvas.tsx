'use client';

import React, { useEffect, useRef } from 'react';

export default function HeroCanvas({
  burstTrigger = 0,
}: {
  burstTrigger?: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const burstFnRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (burstFnRef.current && burstTrigger > 0) {
      burstFnRef.current();
    }
  }, [burstTrigger]);

  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv || !cv.getContext) return;
    const heroEl = cv.closest('.hero') as HTMLElement | null;
    if (!heroEl) return;

    const cx = cv.getContext('2d');
    if (!cx) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let W = 0;
    let Hh = 0;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    let mx = 0;
    let my = 0;
    let tmx = 0;
    let tmy = 0;
    let sp = 0;
    const bursts: number[] = [];
    const t0 = performance.now();
    let vis = true;
    let animId: number;

    function size() {
      if (!heroEl || !cv || !cx) return;
      const r = heroEl.getBoundingClientRect();
      W = r.width;
      Hh = r.height;
      cv.width = W * dpr;
      cv.height = Hh * dpr;
      cv.style.width = W + 'px';
      cv.style.height = Hh + 'px';
      cx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function arch(x: number, y: number, w: number, h: number) {
      if (!cx) return;
      const r = w / 2;
      cx.beginPath();
      cx.moveTo(x - r, y);
      cx.lineTo(x - r, y - h * 0.5);
      cx.bezierCurveTo(x - r, y - h * 0.78, x - r * 0.55, y - h * 0.94, x, y - h);
      cx.bezierCurveTo(x + r * 0.55, y - h * 0.94, x + r, y - h * 0.78, x + r, y - h * 0.5);
      cx.lineTo(x + r, y);
    }

    const N = 16;

    if (reduce) {
      size();
      cx.clearRect(0, 0, W, Hh);
      for (let i = 0; i < N; i++) {
        const p = i / N;
        const e = p * p * p;
        const w = 12 + e * Math.max(W, Hh) * 1.35;
        cx.strokeStyle = 'rgba(119,113,106,.25)';
        arch(W * 0.56, Hh + 8, w, w * 1.12);
        cx.stroke();
      }
      return;
    }

    function frame(now: number) {
      if (!cx) return;
      if (!vis) {
        animId = requestAnimationFrame(frame);
        return;
      }
      if (heroEl && (Math.abs(heroEl.clientWidth - W) > 1 || Math.abs(heroEl.clientHeight - Hh) > 1)) {
        size();
      }
      if (!W) {
        animId = requestAnimationFrame(frame);
        return;
      }

      const t = (now - t0) / 1000;
      mx += (tmx - mx) * 0.06;
      my += (tmy - my) * 0.06;
      cx.clearRect(0, 0, W, Hh);

      const mob = W < 900;
      const ox = (mob ? W * 0.5 : W * 0.56) + mx * 40;
      const oy = Hh + 8;
      const max = Math.max(W, Hh) * 1.35;
      const speed = 0.045 + sp * 0.5;

      for (let i = 0; i < N; i++) {
        const p = (t * speed + i / N) % 1;
        const e = p * p * p;
        const w = 12 + e * max;
        const h = w * 1.12;
        const a = Math.sin(p * Math.PI) * 0.55;
        cx.strokeStyle =
          i % 5 === 0
            ? 'rgba(211,228,91,' + (a * 0.38).toFixed(3) + ')'
            : 'rgba(170,162,150,' + (a * 0.42).toFixed(3) + ')';
        cx.lineWidth = i % 5 === 0 ? 1.3 : 1;
        arch(ox + mx * e * 120, oy + my * e * 40, w, h);
        cx.stroke();
      }

      for (let b = bursts.length - 1; b >= 0; b--) {
        const q = (now - bursts[b]) / 1400;
        if (q > 1) {
          bursts.splice(b, 1);
          continue;
        }
        const ee = 1 - Math.pow(1 - q, 3);
        const bw = 40 + ee * max * 0.9;
        cx.strokeStyle = 'rgba(211,228,91,' + ((1 - q) * 0.7).toFixed(3) + ')';
        cx.lineWidth = 1.6;
        arch(ox, oy, bw, bw * 1.12);
        cx.stroke();
      }

      const gq = (Math.sin(t * 1.3) + 1) / 2;
      cx.fillStyle = 'rgba(211,228,91,' + (0.05 + gq * 0.04).toFixed(3) + ')';
      arch(ox, oy, 46, 52);
      cx.closePath();
      cx.fill();

      animId = requestAnimationFrame(frame);
    }

    size();
    window.addEventListener('resize', size);

    const onMouseMove = (e: MouseEvent) => {
      if (!heroEl) return;
      const r = heroEl.getBoundingClientRect();
      tmx = (e.clientX - r.left) / r.width - 0.5;
      tmy = (e.clientY - r.top) / r.height - 0.5;
    };
    heroEl.addEventListener('mousemove', onMouseMove);

    burstFnRef.current = () => {
      bursts.push(performance.now());
    };
    (window as any).__heroBurst = burstFnRef.current;

    const onScroll = () => {
      if (!heroEl) return;
      const y = Math.min(1, Math.max(0, window.scrollY / Math.max(1, Hh)));
      sp = y;
      heroEl.style.setProperty('--hsc', y.toFixed(3));
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    let observer: IntersectionObserver | null = null;
    if ('IntersectionObserver' in window) {
      observer = new IntersectionObserver((entries) => {
        vis = entries[0].isIntersecting;
      });
      observer.observe(heroEl);
    }

    // Initial burst on load
    const burstTimer = setTimeout(() => {
      if (burstFnRef.current) burstFnRef.current();
    }, 350);

    animId = requestAnimationFrame(frame);

    return () => {
      window.removeEventListener('resize', size);
      heroEl.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('scroll', onScroll);
      if (observer) observer.disconnect();
      clearTimeout(burstTimer);
      cancelAnimationFrame(animId);
      delete (window as any).__heroBurst;
    };
  }, []);

  return <canvas className="hcv" ref={canvasRef} aria-hidden="true" />;
}
