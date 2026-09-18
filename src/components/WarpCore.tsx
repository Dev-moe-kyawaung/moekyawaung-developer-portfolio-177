import { useState } from "react";
import { Check, ChevronDown, Gauge, Zap } from "lucide-react";
import { engageWarp } from "./WarpCanvas";
import { soundFx } from "../lib/soundFx";
import type { TradeoffItem } from "../types/portfolio";

/** Dilithium chamber schematic — drawn when a chamber is engaged. */
function ChamberSchematic({ index }: { index: number }) {
  return (
    <svg viewBox="0 0 360 130" className="mt-4 w-full" aria-hidden="true">
      <g fill="none" strokeWidth="1.6">
        <path className="bp-line" pathLength={1} d="M20 65 H100 M140 65 H220 M260 65 H340" stroke="var(--cyan)" />
        <path className="bp-line" pathLength={1} d="M100 65 V32 H140" stroke="var(--warp)" />
        <path className="bp-line" pathLength={1} d="M220 65 V98 H260" stroke="var(--ion)" />
      </g>
      {[
        { x: 20, c: "var(--cyan)" },
        { x: 120, c: "var(--warp)" },
        { x: 240, c: "var(--ion)" },
        { x: 340, c: "var(--shield)" },
      ].map((n, i) => (
        <g key={i} className="bp-node">
          <circle cx={n.x} cy={65} r="5.5" fill={n.c} />
          <text x={n.x} y={i === 2 ? 88 : 52} textAnchor="middle" fontSize="8.5" fontFamily="JetBrains Mono, monospace" fill="var(--muted)">
            {["HAZARD", "ROUTES", "COMMIT", "PROOF"][i]}
          </text>
        </g>
      ))}
      <text x="180" y="124" textAnchor="middle" fontSize="8.5" fontFamily="JetBrains Mono, monospace" fill="var(--muted)">
        CHAMBER {index + 1} · DILITHIUM MATRIX ALIGNED
      </text>
    </svg>
  );
}

export function WarpCore({ tradeoffs }: { tradeoffs: TradeoffItem[] }) {
  const [open, setOpen] = useState<string | null>(tradeoffs[0]?.id ?? null);

  return (
    <section
      id="warpcore"
      className="relative z-10 border-t border-[var(--line)] px-4 py-24 sm:px-6"
      style={{ background: "rgba(4,8,26,0.55)" }}
    >
      <div className="mx-auto max-w-[1180px]">
        <header className="fade-up mb-12 max-w-2xl">
          <div className="label flex items-center gap-2"><Gauge className="h-4 w-4" /> deck 03 · warp core engineering</div>
          <h2 className="section-title mt-3">
            Four chambers of <span className="warp-text">verified judgement.</span>
          </h2>
          <p className="mt-3 text-[14px]" style={{ color: "var(--muted)" }}>
            Engage a dilithium chamber to read the hazard, the routes evaluated, the configuration committed,
            and the production proof that validated it.
          </p>
        </header>

        <div className="space-y-4">
          {tradeoffs.map((rfc, i) => {
            const isOpen = open === rfc.id;
            return (
              <article key={rfc.id} className="mission-in hud hud-frame overflow-hidden" style={{ animationDelay: `${i * 60}ms` }}>
                <button
                  onClick={() => {
                    const next = isOpen ? null : rfc.id;
                    setOpen(next);
                    soundFx.playCircuitProbe();
                    if (next) engageWarp();
                  }}
                  aria-expanded={isOpen}
                  className="flex w-full items-start justify-between gap-4 p-5 text-left sm:items-center sm:p-6"
                >
                  <div className="flex flex-1 flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-4">
                    <span className="rounded border border-[var(--line-strong)] bg-[rgba(86,216,255,0.1)] px-2 py-1 mono text-[10px] font-bold text-[var(--cyan)]">
                      {rfc.rfcNumber}
                    </span>
                    <h3 className="font-display text-base font-semibold sm:text-lg text-[var(--text)]">{rfc.title}</h3>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <span className="hidden rounded border border-[var(--line)] px-2 py-1 mono text-[9.5px] text-[var(--shield)] md:inline-block">
                      {rfc.metricImpact}
                    </span>
                    <ChevronDown className={`h-5 w-5 text-[var(--cyan)] transition-transform ${isOpen ? "rotate-180" : ""}`} />
                  </div>
                </button>

                {isOpen && (
                  <div className="border-t border-[var(--line)] px-5 pb-6 pt-4 sm:px-6">
                    <div className="grid gap-6 lg:grid-cols-2">
                      <div className="space-y-4">
                        <div>
                          <p className="label flex items-center gap-1.5"><Zap className="h-3 w-3" /> 01 · Hazard detected</p>
                          <p className="mt-2 rounded-lg border border-[var(--line)] bg-black/30 p-3 text-[13px] leading-relaxed" style={{ color: "var(--body)" }}>
                            {rfc.context}
                          </p>
                        </div>
                        <div>
                          <p className="label">02 · Routes evaluated</p>
                          <div className="mt-2 space-y-2">
                            {rfc.options.map((o) => (
                              <div
                                key={o.name}
                                className="rounded-lg border p-3"
                                style={{
                                  borderColor: o.selected ? "var(--line-strong)" : "var(--line)",
                                  background: o.selected ? "rgba(86,216,255,0.09)" : "var(--panel)",
                                }}
                              >
                                <div className="flex items-center justify-between gap-2">
                                  <span className={`mono text-[11px] font-semibold ${o.selected ? "text-[var(--cyan)]" : "text-[var(--text)]"}`}>{o.name}</span>
                                  {o.selected && <Check className="h-3.5 w-3.5 text-[var(--shield)]" />}
                                </div>
                                <p className="mt-1 text-[11.5px] leading-relaxed" style={{ color: "var(--muted)" }}>{o.summary}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <p className="label">03 · Configuration committed</p>
                          <p className="mt-2 border-l-2 border-[var(--shield)] pl-3 text-[13px] leading-relaxed" style={{ color: "var(--text)" }}>
                            {rfc.decision}
                          </p>
                        </div>
                        <div>
                          <p className="label">04 · Production proof</p>
                          <ol className="mt-2 space-y-2">
                            {rfc.why.map((w, wi) => (
                              <li key={wi} className="flex gap-2 rounded-lg border border-[var(--line)] bg-black/25 p-2.5 text-[12px] leading-relaxed" style={{ color: "var(--body)" }}>
                                <span className="mono text-[var(--cyan)]">0{wi + 1}</span>
                                {w}
                              </li>
                            ))}
                          </ol>
                        </div>
                        <ChamberSchematic index={i} />
                      </div>
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
