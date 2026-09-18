import { useState } from "react";
import { Calendar, Cpu, MapPin, Rocket } from "lucide-react";
import type { ExperienceItem, MilestoneType } from "../types/portfolio";

const FILTERS: { id: "all" | MilestoneType; label: string }[] = [
  { id: "all", label: "ALL ENTRIES" },
  { id: "shipped", label: "DEPLOYED" },
  { id: "architecture", label: "REFIT" },
];

export function Logbook({ experience }: { experience: ExperienceItem[] }) {
  const [filter, setFilter] = useState<"all" | MilestoneType>("all");

  return (
    <section id="logbook" className="relative z-10 border-t border-[var(--line)] px-4 py-24 sm:px-6">
      <div className="mx-auto max-w-[1180px]">
        <header className="fade-up mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <div className="label">deck 04 · captain's logbook</div>
            <h2 className="section-title mt-3">Eight years in <span className="warp-text">deep-space deployment.</span></h2>
            <p className="mt-3 text-[14px]" style={{ color: "var(--muted)" }}>
              Reverse-chronological service record. Filter between systems deployed to production and the
              refits that made them flight-worthy.
            </p>
          </div>
          <div className="flex gap-1 rounded-xl border border-[var(--line)] bg-[var(--panel)] p-1 mono text-[11px]">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                aria-pressed={filter === f.id}
                className="rounded-lg px-3 py-1.5 font-semibold transition-all"
                style={{
                  background: filter === f.id ? "var(--cyan)" : "transparent",
                  color: filter === f.id ? "var(--void)" : "var(--body)",
                }}
              >
                {f.label}
              </button>
            ))}
          </div>
        </header>

        <div className="relative space-y-8 pl-8 sm:pl-12">
          <span
            className="absolute bottom-4 left-2.5 top-3 w-px sm:left-4"
            style={{ background: "linear-gradient(to bottom, var(--cyan), var(--warp), transparent)" }}
          />

          {experience.map((entry, idx) => {
            const items = entry.milestones.filter((m) => filter === "all" || m.type === filter);
            return (
              <div key={entry.id} className="fade-up relative">
                <span
                  className="absolute -left-[26px] top-6 grid h-5 w-5 place-items-center rounded-full border-2 sm:-left-[38px]"
                  style={{
                    borderColor: idx === 0 ? "var(--cyan)" : "var(--line-strong)",
                    background: "var(--void)",
                    boxShadow: idx === 0 ? "var(--glow-cyan)" : "none",
                  }}
                >
                  {idx === 0 ? (
                    <Rocket className="h-2.5 w-2.5 text-[var(--cyan)]" />
                  ) : (
                    <span className="h-1.5 w-1.5 rounded-full" style={{ background: "var(--muted)" }} />
                  )}
                </span>

                <article className="hud hud-frame p-5 sm:p-6">
                  <div className="flex flex-col justify-between gap-2 border-b border-[var(--line)] pb-4 sm:flex-row sm:items-center">
                    <div>
                      <h3 className="font-display text-lg font-semibold text-[var(--text)] sm:text-xl">{entry.role}</h3>
                      <div className="mt-1 flex flex-wrap items-center gap-2 mono text-[12px]" style={{ color: "var(--body)" }}>
                        <span className="font-semibold text-[var(--cyan)]">{entry.company}</span>
                        <span>·</span>
                        <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {entry.location}</span>
                      </div>
                    </div>
                    <span className="flex w-fit items-center gap-1.5 rounded-lg border border-[var(--line)] px-2.5 py-1 mono text-[11px] font-semibold text-[var(--shield)]">
                      <Calendar className="h-3 w-3" /> {entry.dates}
                    </span>
                  </div>

                  <p className="mt-4 text-[13.5px] leading-relaxed" style={{ color: "var(--body)" }}>{entry.summary}</p>

                  <div className="mt-4 space-y-2.5">
                    {items.map((m, mi) => (
                      <div key={mi} className="flex items-start gap-2 rounded-lg border border-[var(--line)] bg-black/25 p-3">
                        <span
                          className="mt-0.5 flex shrink-0 items-center gap-1.5 rounded px-2 py-0.5 mono text-[9px] font-bold uppercase"
                          style={
                            m.type === "shipped"
                              ? { background: "rgba(94,255,200,0.14)", color: "var(--shield)" }
                              : { background: "rgba(185,140,255,0.14)", color: "var(--warp)" }
                          }
                        >
                          {m.type === "shipped" ? <><Rocket className="h-3 w-3" /> DEPLOYED</> : <><Cpu className="h-3 w-3" /> REFIT</>}
                        </span>
                        <p className="text-[12.5px] leading-relaxed" style={{ color: "var(--text)" }}>{m.text}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-1.5 border-t border-[var(--line)] pt-4">
                    <span className="mr-1 mono text-[10px] text-[var(--muted)]">FITTED SYSTEMS //</span>
                    {entry.stack.map((s) => (
                      <span key={s} className="rounded border border-[var(--line)] px-2 py-0.5 mono text-[10.5px] text-[var(--body)]">{s}</span>
                    ))}
                  </div>
                </article>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
