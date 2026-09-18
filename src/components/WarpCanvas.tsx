import { useEffect, useRef } from "react";

type Layer = { x: number; y: number; z: number; hue: number; mag: boolean };
type Streak = { x: number; y: number; life: number; len: number; hue: number };

/**
 * Starfield navigation engine.
 *  · 3-depth parallax starfield drifting with pointer + scroll
 *  · Warp streaks that fire on `warp` events (nav jumps / mission select)
 *  · Gravity lens rings that bend starlight around a focal mass
 *  · Slow nebula bloom that reacts subtly to the cursor
 */
export function WarpCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;

    let w = 0;
    let h = 0;
    let dpr = Math.min(devicePixelRatio || 1, 1.6);
    const resize = () => {
      w = innerWidth;
      h = innerHeight;
      dpr = Math.min(devicePixelRatio || 1, 1.6);
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    addEventListener("resize", resize);

    const ptr = { x: 0.5, y: 0.42, tx: 0.5, ty: 0.42 };
    const onMove = (e: PointerEvent) => {
      ptr.tx = e.clientX / w;
      ptr.ty = e.clientY / h;
    };
    addEventListener("pointermove", onMove, { passive: true });

    let scrollP = 0;
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - h;
      scrollP = max > 0 ? scrollY / max : 0;
    };
    onScroll();
    addEventListener("scroll", onScroll, { passive: true });

    const layers: Layer[] = [];
    const count = w < 700 ? 150 : 260;
    for (let i = 0; i < count; i++) {
      layers.push({
        x: Math.random(),
        y: Math.random(),
        z: 0.25 + Math.random() * 1.0,
        hue: 190 + Math.random() * 90,
        mag: Math.random() > 0.93,
      });
    }

    const streaks: Streak[] = [];

    const fire = () => {
      const n = 26;
      for (let i = 0; i < n; i++) {
        streaks.push({
          x: w / 2 + (Math.random() - 0.5) * w * 0.5,
          y: h / 2 + (Math.random() - 0.5) * h * 0.5,
          life: 1,
          len: 40 + Math.random() * 130,
          hue: Math.random() > 0.5 ? 190 : 268,
        });
      }
    };
    addEventListener("warp", fire);

    let t = 0;
    let raf = 0;
    let running = true;
    const onVis = () => {
      running = !document.hidden;
      if (running) loop();
    };
    document.addEventListener("visibilitychange", onVis);

    const loop = () => {
      if (!running) return;
      t += reduced ? 0 : 1;

      ptr.x += (ptr.tx - ptr.x) * 0.05;
      ptr.y += (ptr.ty - ptr.y) * 0.05;

      ctx.clearRect(0, 0, w, h);

      /* ---- nebula bloom (gravity lens haze) ---- */
      const cx = w * 0.5 + (ptr.x - 0.5) * 40;
      const cy = h * 0.4 + (ptr.y - 0.5) * 30;
      const bloom = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(w, h) * 0.55);
      bloom.addColorStop(0, "rgba(30,60,140,0.16)");
      bloom.addColorStop(0.35, "rgba(70,40,150,0.09)");
      bloom.addColorStop(1, "rgba(1,3,10,0)");
      ctx.fillStyle = bloom;
      ctx.fillRect(0, 0, w, h);

      /* ---- gravity lens rings bending starlight ---- */
      const lensR = Math.min(w, h) * (0.3 + Math.sin(t * 0.004) * 0.02);
      for (let i = 0; i < 3; i++) {
        ctx.beginPath();
        ctx.ellipse(cx, cy, lensR * (1 - i * 0.18), lensR * (0.62 - i * 0.1), (ptr.x - 0.5) * 0.35, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(${i === 1 ? "185,140,255" : "86,216,255"},${0.09 - i * 0.02})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      // Einstein ring highlight
      ctx.beginPath();
      ctx.ellipse(cx, cy, lensR * 0.82, lensR * 0.52, 0, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(86,216,255,0.13)";
      ctx.lineWidth = 1.6;
      ctx.stroke();

      /* ---- parallax starfield ---- */
      for (const s of layers) {
        if (!reduced) {
          s.y += 0.00016 * s.z;
          if (s.y > 1.05) s.y -= 1.05;
        }
        const px = (s.x * w + (ptr.x - 0.5) * 46 * s.z + w) % w;
        const py = (s.y * h + (ptr.y - 0.5) * 26 * s.z - scrollP * 90 * s.z + h * 2) % h;
        const r = s.z * (s.mag ? 1.9 : 1.25);
        const alpha = 0.28 + s.z * 0.55;
        ctx.beginPath();
        ctx.arc(px, py, r, 0, Math.PI * 2);
        ctx.fillStyle = s.mag ? `rgba(255,140,235,${alpha})` : `hsla(${s.hue},95%,78%,${alpha})`;
        if (s.z > 0.85) {
          ctx.shadowColor = s.mag ? "rgba(255,140,235,0.9)" : "rgba(86,216,255,0.9)";
          ctx.shadowBlur = 8;
        }
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      /* ---- warp streaks ---- */
      for (let i = streaks.length - 1; i >= 0; i--) {
        const s = streaks[i];
        const dx = s.x - w / 2;
        const dy = s.y - h / 2;
        const d = Math.hypot(dx, dy) || 1;
        s.x += (dx / d) * 16;
        s.y += (dy / d) * 16;
        s.life -= 0.03;
        const tailX = s.x - (dx / d) * s.len;
        const tailY = s.y - (dy / d) * s.len;
        const grad = ctx.createLinearGradient(tailX, tailY, s.x, s.y);
        grad.addColorStop(0, `hsla(${s.hue},100%,72%,0)`);
        grad.addColorStop(1, `hsla(${s.hue},100%,80%,${Math.max(0, s.life)})`);
        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(s.x, s.y);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.6;
        ctx.stroke();
        if (s.life <= 0 || s.x < -200 || s.x > w + 200 || s.y < -200 || s.y > h + 200) streaks.splice(i, 1);
      }

      raf = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      removeEventListener("resize", resize);
      removeEventListener("pointermove", onMove);
      removeEventListener("scroll", onScroll);
      removeEventListener("warp", fire);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
      <canvas ref={ref} className="block h-full w-full opacity-80" />
      {/* warp tunnel rings */}
      <div className="warp-tunnel opacity-45" />
      {/* HUD vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 75% 55% at 50% 42%, transparent 42%, rgba(1,3,10,0.62) 88%)",
        }}
      />
    </div>
  );
}

/** Fires a warp streak burst across the starfield. */
export function engageWarp() {
  window.dispatchEvent(new CustomEvent("warp"));
}
