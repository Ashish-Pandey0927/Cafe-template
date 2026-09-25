import { cn } from "@/lib/utils";
import * as React from "react";

export interface RippleImageItem {
  src: string;
  x?: number;
  y?: number;
  widthScale?: number;
  heightScale?: number;
}

export interface ImageRippleEffectProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  className?: string;
  images?: RippleImageItem[];
  brushTextureUrl?: string;
  distortionStrength?: number;
  waveCount?: number;
  waveSize?: number;
  waveRotationSpeed?: number;
  waveFadeMultiplier?: number;
  waveGrowth?: number;
  waveSpawnThreshold?: number;
  children?: React.ReactNode;
}

// ─── Ripple circle state ───────────────────────────────────────────────────
interface Ripple {
  x: number;
  y: number;
  radius: number;
  opacity: number;
  maxRadius: number;
}

export function ImageRippleEffect({
  className,
  images = [],
  distortionStrength = 0.075,
  waveCount = 6,
  waveSize = 80,
  waveFadeMultiplier = 0.965,
  waveGrowth = 3,
  waveSpawnThreshold = 4,
  children,
  ...props
}: ImageRippleEffectProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const imgRef = React.useRef<HTMLImageElement | null>(null);
  const imgLoadedRef = React.useRef(false);
  const ripplesRef = React.useRef<Ripple[]>([]);
  const animFrameRef = React.useRef<number>(0);
  const lastPosRef = React.useRef<{ x: number; y: number } | null>(null);
  const distortionCanvasRef = React.useRef<HTMLCanvasElement | null>(null);

  // ── Load the source image ──────────────────────────────────────────────
  React.useEffect(() => {
    const src = images[0]?.src;
    if (!src) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      imgRef.current = img;
      imgLoadedRef.current = true;
    };
    img.onerror = () => {
      // Try without crossOrigin on error (same-origin images)
      const img2 = new Image();
      img2.onload = () => {
        imgRef.current = img2;
        imgLoadedRef.current = true;
      };
      img2.src = src;
    };
    img.src = src;
  }, [images]);

  // ── Build a soft radial brush stamp for displacement ──────────────────
  React.useEffect(() => {
    const sz = waveSize * 2;
    const dc = document.createElement("canvas");
    dc.width = sz;
    dc.height = sz;
    const ctx = dc.getContext("2d")!;
    const grad = ctx.createRadialGradient(sz / 2, sz / 2, 0, sz / 2, sz / 2, sz / 2);
    grad.addColorStop(0, "rgba(255,255,255,1)");
    grad.addColorStop(0.5, "rgba(255,255,255,0.4)");
    grad.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, sz, sz);
    distortionCanvasRef.current = dc;
  }, [waveSize]);

  // ── Render loop ────────────────────────────────────────────────────────
  React.useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Resize canvas to match container
    const resize = () => {
      const { width, height } = container.getBoundingClientRect();
      canvas.width = Math.round(width);
      canvas.height = Math.round(height);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);

    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;
      if (!w || !h) {
        animFrameRef.current = requestAnimationFrame(draw);
        return;
      }

      ctx.clearRect(0, 0, w, h);

      // ── Draw background image with ripple displacement ──────────────
      if (imgLoadedRef.current && imgRef.current) {
        const img = imgRef.current;

        // Cover-fill scale calculation
        const imgAspect = img.naturalWidth / img.naturalHeight;
        const canvasAspect = w / h;
        let drawW: number, drawH: number, drawX: number, drawY: number;
        if (canvasAspect > imgAspect) {
          drawW = w;
          drawH = w / imgAspect;
          drawX = 0;
          drawY = (h - drawH) / 2;
        } else {
          drawH = h;
          drawW = h * imgAspect;
          drawX = (w - drawW) / 2;
          drawY = 0;
        }

        if (ripplesRef.current.length === 0) {
          // No ripples — draw image directly
          ctx.drawImage(img, drawX, drawY, drawW, drawH);
        } else {
          // Draw image into an offscreen canvas, then sample per-pixel for distortion
          // For performance: do a fast per-tile displacement approach
          const offscreen = document.createElement("canvas");
          offscreen.width = w;
          offscreen.height = h;
          const octx = offscreen.getContext("2d")!;
          octx.drawImage(img, drawX, drawY, drawW, drawH);

          // Build displacement map from ripples
          const dispCanvas = document.createElement("canvas");
          dispCanvas.width = w;
          dispCanvas.height = h;
          const dctx = dispCanvas.getContext("2d")!;

          ripplesRef.current.forEach((r) => {
            const brush = distortionCanvasRef.current;
            if (!brush) return;
            const sz = r.radius * 2;
            dctx.globalAlpha = r.opacity;
            dctx.drawImage(brush, r.x - r.radius, r.y - r.radius, sz, sz);
          });
          dctx.globalAlpha = 1;

          // Sample displacement and draw distorted rows
          // Simplified: draw image normally then overlay displacement ripples as
          // a radial distortion using canvas compositing
          ctx.drawImage(offscreen, 0, 0);

          // Radial distort around each ripple center using clipping + translate
          ripplesRef.current.forEach((r) => {
            const strength = distortionStrength * r.opacity * r.radius;
            if (strength < 0.5) return;

            ctx.save();
            ctx.beginPath();
            ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
            ctx.clip();

            // Draw slightly scaled version of img centered on ripple (creates bulge)
            const scale = 1 + (strength / r.radius) * 0.5;
            const cx = r.x;
            const cy = r.y;
            ctx.translate(cx, cy);
            ctx.scale(scale, scale);
            ctx.translate(-cx, -cy);
            ctx.globalAlpha = r.opacity * 0.6;
            ctx.drawImage(img, drawX, drawY, drawW, drawH);
            ctx.restore();
          });
        }
      } else {
        // No image yet — render dark gradient placeholder
        const grad = ctx.createLinearGradient(0, 0, w, h);
        grad.addColorStop(0, "#1B1712");
        grad.addColorStop(1, "#2D2118");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
      }

      // ── Age ripples ─────────────────────────────────────────────────
      ripplesRef.current = ripplesRef.current
        .map((r) => ({
          ...r,
          radius: r.radius + waveGrowth,
          opacity: r.opacity * waveFadeMultiplier,
        }))
        .filter((r) => r.opacity > 0.01 && r.radius < r.maxRadius);

      animFrameRef.current = requestAnimationFrame(draw);
    };

    animFrameRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      ro.disconnect();
    };
  }, [distortionStrength, waveFadeMultiplier, waveGrowth]);

  // ── Pointer handler ───────────────────────────────────────────────────
  const handlePointerMove = React.useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;

      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const last = lastPosRef.current;
      const dist = last
        ? Math.hypot(x - last.x, y - last.y)
        : waveSpawnThreshold + 1;

      if (dist >= waveSpawnThreshold) {
        // Limit concurrent ripples
        if (ripplesRef.current.length >= waveCount) {
          ripplesRef.current.shift();
        }
        ripplesRef.current.push({
          x,
          y,
          radius: waveSize * 0.2,
          opacity: 0.9,
          maxRadius: waveSize * 3,
        });
        lastPosRef.current = { x, y };
      }
    },
    [waveCount, waveSize, waveSpawnThreshold],
  );

  const handlePointerLeave = React.useCallback(() => {
    lastPosRef.current = null;
  }, []);

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className={cn("relative h-[560px] w-full overflow-hidden", className)}
      {...props}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 h-full w-full"
        aria-hidden="true"
      />
      {children ? (
        <div className="pointer-events-none absolute inset-0 z-10">{children}</div>
      ) : null}
    </div>
  );
}
