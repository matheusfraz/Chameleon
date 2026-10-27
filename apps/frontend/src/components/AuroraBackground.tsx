import { useEffect, useRef, type ReactNode } from "react";

const GRAIN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`;

const SCALE =
  "radial-gradient(circle at 50% 100%, transparent 58%, rgba(52,211,153,.6) 59%, rgba(52,211,153,.6) 63%, transparent 64%)";
const SCALES_MASK =
  "radial-gradient(340px circle at var(--mx, 50%) var(--my, 50%), black, transparent 70%)";
const DOTS_MASK =
  "radial-gradient(ellipse at center, black 15%, transparent 65%)";

// Posições fixas (sem Math.random, para não mudar a cada renderização)
const PARTICLES = Array.from({ length: 20 }, (_, i) => ({
  left: (i * 53 + 7) % 100,
  size: 2 + (i % 3),
  duration: 14 + (i % 6) * 3,
  delay: -((i * 1.9) % 18),
}));

export function AuroraBackground({ children }: { children: ReactNode }) {
  useEffect(() => {
    const color = "#030D2B";
    const root = document.documentElement;
    const prevRoot = root.style.backgroundColor;
    const prevBody = document.body.style.backgroundColor;

    root.style.backgroundColor = color;
    document.body.style.backgroundColor = color;

    return () => {
      root.style.backgroundColor = prevRoot;
      document.body.style.backgroundColor = prevBody;
    };
  }, []);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      return;

    let raf = 0;
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.setProperty("--mx", `${e.clientX}px`);
        el.style.setProperty("--my", `${e.clientY}px`);
      });
    };

    window.addEventListener("pointermove", onMove);
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="relative isolate min-h-screen overflow-hidden bg-[#030D2B]"
    >
      <div
        aria-hidden
        className="pointer-events-none opacity-60 absolute inset-0 -z-10"
      >
        {/* 1. Luzes saturadas em tons de azul, com um toque do verde da logo */}
        <div className="absolute inset-0 animate-hue-drift motion-reduce:animate-none">
          <div className="absolute left-[8%] top-[12%] size-[42vmax] animate-aurora-a rounded-full bg-blue-700/40 mix-blend-screen blur-[95px] will-change-transform motion-reduce:animate-none" />
          <div className="absolute bottom-[15%] right-[8%] size-[40vmax] animate-aurora-b rounded-full bg-sky-600/25 mix-blend-screen blur-[100px] will-change-transform motion-reduce:animate-none" />
          <div className="absolute right-[18%] top-[20%] size-[32vmax] animate-aurora-c rounded-full bg-indigo-600/30 mix-blend-screen blur-[95px] will-change-transform motion-reduce:animate-none" />
          <div className="absolute bottom-[8%] left-[22%] size-[24vmax] animate-aurora-a rounded-full bg-emerald-500/15 mix-blend-screen blur-[90px] will-change-transform motion-reduce:animate-none" />
        </div>

        {/* 2. Feixe de luz girando devagar */}
        <div
          className="absolute left-1/2 top-1/2 size-[140vmax] -translate-x-1/2 -translate-y-1/2 animate-spin-slow opacity-60 blur-3xl motion-reduce:animate-none"
          style={{
            background:
              "conic-gradient(from 0deg, transparent 0deg, rgba(37,99,235,.3) 40deg, transparent 90deg, rgba(52,211,153,.14) 200deg, transparent 260deg)",
          }}
        />

        {/* 3. Horizonte de brilho no rodapé */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 85% 38% at 50% 108%, rgba(37,99,235,.45), transparent 70%)",
          }}
        />

        {/* 4. Pontos sutis que somem nas bordas */}
        <div
          className="absolute inset-0 opacity-50"
          style={{
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.16) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
            maskImage: DOTS_MASK,
            WebkitMaskImage: DOTS_MASK,
          }}
        />

        {/* 5. Escamas de camaleão reveladas pelo mouse */}
        <div
          className="absolute inset-0 animate-hue-drift motion-reduce:animate-none"
          style={{
            backgroundImage: `${SCALE}, ${SCALE}`,
            backgroundSize: "48px 24px",
            backgroundPosition: "0 0, 24px 12px",
            maskImage: SCALES_MASK,
            WebkitMaskImage: SCALES_MASK,
          }}
        />

        {/* 6. Partículas subindo */}
        <div className="absolute inset-0 motion-reduce:hidden">
          {PARTICLES.map((p, i) => (
            <span
              key={i}
              className="absolute -bottom-3 animate-float-up rounded-full bg-emerald-300"
              style={{
                left: `${p.left}%`,
                width: p.size,
                height: p.size,
                animationDuration: `${p.duration}s`,
                animationDelay: `${p.delay}s`,
                boxShadow: "0 0 10px 2px rgba(110,231,183,.7)",
              }}
            />
          ))}
        </div>

        {/* 7. Granulado */}
        <div
          className="absolute inset-0 opacity-[0.14] mix-blend-overlay"
          style={{ backgroundImage: GRAIN }}
        />

        {/* 8. Vinheta em azul-marinho: escurece sem virar preto */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 30%, rgba(3,13,43,0.9) 100%)",
          }}
        />
      </div>

      {children}
    </div>
  );
}
