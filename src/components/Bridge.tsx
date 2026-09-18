import { ArrowDown, Radio, Satellite, Sparkles, Terminal } from "lucide-react";
import type { ProfileData, TickerMetric } from "../types/portfolio";
import { useParallax, useTypewriter } from "../lib/hooks";
import { soundFx } from "../lib/soundFx";
import { engageWarp } from "./WarpCanvas";

interface BridgeProps {
  profile: ProfileData;
  ticker: TickerMetric[];
  onOpenComputer: () => void;
}

const SYSTEM_CALLS = [
  "$ ./engage --warp 9.9 --target play-store",
  "$ adb shell dumpsys gfxinfo com.moekyawaung",
  "$ ./verify --keystore strongbox --integrity",
  "$ tail -f gtfs-realtime.stream | conflated-flow",
  "$ ./mission-report --metrics --verified",
];

/** Rotating orbital ring cluster — the ship's warp nacelle indicator. */
function NacelleRings({ tilt }: { tilt: number }) {
  return (
    <div
      className="absolute inset-0"
      style={{ transform: `perspective(900px) rotateX(${60 + tilt * 8}deg)` }}
      aria-hidden="true"
    >
      {[0.55, 0.72, 0.9].map((s, i) => (
        <div
          key={i}
          className="orbit absolute rounded-full border"
          style={{
            inset: `${(1 - s) * 50}%`,
            borderColor: i === 0 ? "var(--line-strong)" : "var(--line)",
            borderStyle: i === 1 ? "dashed" : "solid",
            animationDuration: `${16 + i * 9}s`,
            animationDirection: i % 2 ? "reverse" : "normal",
          }}
        >
          <span
            className="absolute -top-[4px] left-1/2 h-2 w-2 -translate-x-1/2 rounded-full"
            style={{
              background: i === 0 ? "var(--cyan)" : i === 1 ? "var(--warp)" : "var(--shield)",
              boxShadow: "var(--glow-soft)",
            }}
          />
        </div>
      ))}
    </div>
  );
}

export function Bridge({ profile, ticker, onOpenComputer }: BridgeProps) {
  const stage = useParallax<HTMLDivElement>();
  const typed = useTypewriter(SYSTEM_CALLS[0], 26, 400);

  return (
    <section id="bridge" className="relative min-h-screen overflow-hidden px-4 pb-16 pt-24 sm:px-6">
      <div ref={stage} className="relative mx-auto max-w-[1340px]">
        <div className="grid min-h-[calc(100vh-6rem)] items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          {/* ---------- flight deck copy ---------- */}
          <div
            className="relative z-20"
            style={{ transform: "translate3d(calc(var(--px)*14px), calc(var(--py)*14px), 0)" }}
          >
            <div className="mb-5 flex flex-wrap items-center gap-2">
              <span className="hud inline-flex items-center gap-2 rounded-full px-3 py-1.5">
                <span className="live-blink h-2 w-2 rounded-full bg-[var(--shield)]" />
                <span className="label text-[9.5px]">ALL SYSTEMS NOMINAL · {profile.availability}</span>
              </span>
              <span className="hud inline-flex items-center gap-1.5 rounded-full px-3 py-1.5">
                <Satellite className="h-3.5 w-3.5 text-[var(--cyan)]" />
                <span className="label text-[9.5px]">SUBSPACE UPLINK</span>
              </span>
            </div>

            <p className="label mb-3">{profile.title}</p>
            <h1 className="headline">
              Piloting Android
              <br />
              <span className="warp-text">beyond light speed.</span>
            </h1>

            <p className="mt-6 max-w-xl text-[16px] leading-relaxed sm:text-[17px]" style={{ color: "var(--body)" }}>
              {profile.positioning} Every system below is a logged mission — charted, flown, and
              verified in production across Southeast Asian transit, fintech, and on-device AI.
            </p>

            {/* spacecraft terminal */}
            <div className="hud hud-frame scanlines mt-6 inline-flex max-w-full items-center gap-2.5 rounded-xl px-3.5 py-2.5">
              <Terminal className="h-4 w-4 shrink-0 text-[var(--cyan)]" />
              <span className="mono truncate text-[12.5px] text-[var(--shield)]">{typed}</span>
              <span className="cursor-blink" />
            </div>

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button
                onClick={() => {
                  engageWarp();
                  soundFx.playPlasmaCharge();
                  document.getElementById("missions")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="btn btn-primary"
              >
                Engage Mission Logs
                <ArrowDown className="h-4 w-4" />
              </button>
              <button onClick={onOpenComputer} className="btn btn-ghost">
                <Sparkles className="h-4 w-4" />
                Wake Starship Computer
              </button>
            </div>
          </div>

          {/* ---------- parallax visual ---------- */}
          <div
            className="relative z-10 flex items-center justify-center"
            style={{ transform: "translate3d(calc(var(--px)*-20px), calc(var(--py)*-20px), 0)" }}
          >
            {/* orbital rings behind */}
            <div className="absolute inset-0 flex items-center justify-center">
              <NacelleRings tilt={0} />
            </div>

            {/* gravity-lens viewport around the captain */}
            <div
              className="lens hud-frame relative z-10 w-[268px] rounded-3xl border border-[var(--line-strong)] p-2 sm:w-[300px]"
              style={{
                transform: "translate3d(calc(var(--px)*52px), calc(var(--py)*52px), 0)",
                boxShadow: "var(--glow-cyan)",
              }}
            >
              <div className="relative overflow-hidden rounded-2xl">
                <img
                  src={profile.avatarUrl}
                  alt={profile.name}
                  className="h-full w-full object-cover"
                  style={{ filter: "saturate(1.1) contrast(1.06)" }}
                />
                <div className="scanlines absolute inset-0" />
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{ background: "linear-gradient(180deg, transparent 48%, rgba(86,216,255,0.28))" }}
                />
                {/* targeting reticle */}
                <div className="pointer-events-none absolute inset-0" aria-hidden="true">
                  <span className="absolute left-1/2 top-[8%] h-[8%] w-px -translate-x-1/2" style={{ background: "var(--cyan)" }} />
                  <span className="absolute bottom-[8%] left-1/2 h-[8%] w-px -translate-x-1/2" style={{ background: "var(--cyan)" }} />
                  <span className="absolute left-[8%] top-1/2 h-px w-[8%] -translate-y-1/2" style={{ background: "var(--cyan)" }} />
                  <span className="absolute right-[8%] top-1/2 h-px w-[8%] -translate-y-1/2" style={{ background: "var(--cyan)" }} />
                </div>
              </div>

              {/* captain telemetry */}
              <div className="space-y-1.5 px-2 py-2.5 font-mono text-[10px]">
                <div className="flex justify-between"><span style={{ color: "var(--muted)" }}>CAPTAIN</span><span style={{ color: "var(--text)" }}>{profile.handle}</span></div>
                <div className="flex justify-between"><span style={{ color: "var(--muted)" }}>POST</span><span style={{ color: "var(--cyan)" }}>SENIOR ANDROID</span></div>
                <div className="flex justify-between"><span style={{ color: "var(--muted)" }}>CLEARANCE</span><span style={{ color: "var(--shield)" }}>MASVS-L2</span></div>
              </div>
            </div>

            {/* warp nacelle core overlapping */}
            <div
              className="float-drift pointer-events-none absolute -right-2 top-8 h-28 w-28 sm:h-36 sm:w-36"
              style={{ transform: "translate3d(calc(var(--px)*76px), calc(var(--py)*76px), 0)" }}
            >
              <div className="relative grid h-full w-full place-items-center rounded-full">
                <span className="absolute inset-0 rounded-full border border-[var(--line-strong)] orbit" style={{ animationDuration: "14s" }} />
                <span className="absolute inset-[16%] rounded-full border border-[var(--warp)] opacity-60 orbit" style={{ animationDuration: "9s", animationDirection: "reverse" }} />
                <span
                  className="core-plasma relative h-[46%] w-[46%] rounded-full"
                  style={{
                    background: "radial-gradient(circle at 34% 30%, #fff, var(--cyan) 38%, var(--warp) 78%, transparent)",
                    boxShadow: "0 0 42px rgba(86,216,255,0.7), 0 0 78px rgba(185,140,255,0.45)",
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* ---------- ship telemetry strip ---------- */}
        <div className="mt-14 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {ticker.map((m, i) => (
            <div key={m.id} className="hud hud-frame mission-in p-4" style={{ animationDelay: `${i * 60}ms` }}>
              <div className="mb-1.5 flex items-center justify-between">
                <span className="label text-[8.5px]">TLM-{String(i + 1).padStart(2, "0")}</span>
                <Radio className="h-3 w-3 text-[var(--cyan)]" />
              </div>
              <div className="font-display text-xl font-bold text-[var(--text)]">{m.value}</div>
              <div className="mt-0.5 font-mono text-[10px] leading-tight text-[var(--muted)]">{m.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
