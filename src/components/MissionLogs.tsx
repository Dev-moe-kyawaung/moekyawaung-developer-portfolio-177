import { useState } from "react";
import { ChevronDown, FolderGit2, Orbit, Satellite } from "lucide-react";
import { GithubIcon, PlayStoreIcon } from "./icons";
import { engageWarp } from "./WarpCanvas";
import { soundFx } from "../lib/soundFx";
import type { ProjectItem } from "../types/portfolio";

interface MissionLogsProps {
  projects: ProjectItem[];
}

const MISSION_META = [
  { code: "MSN-101", sector: "SECTOR 7G · BANGKOK CORRIDOR", orbit: "LEO · 480km", crew: "4 ENGINEERS", status: "OPERATIONAL" },
  { code: "MSN-102", sector: "SECTOR 3A · SUKHUMVIT LINE", orbit: "MEO · 2,400km", crew: "3 ENGINEERS", status: "OPERATIONAL" },
  { code: "MSN-103", sector: "SECTOR 5C · YANGON GRID", orbit: "GEO · 35,786km", crew: "6 ENGINEERS", status: "SECURED" },
  { code: "MSN-104", sector: "SECTOR 9F · TACHILEIK HIGHLANDS", orbit: "POLAR · 1,280m", crew: "SOLO", status: "ACTIVE R&D" },
];

/** Orbital path diagram — the mission's flight plan drawn as concentric rings. */
function OrbitalChart({ seed, radius }: { seed: number; radius: number }) {
  return (
    <svg viewBox="0 0 140 140" className="h-full w-full" aria-hidden="true">
      <defs>
        <radialGradient id={`star-${seed}`}>
          <stop offset="0%" stopColor="var(--cyan)" />
          <stop offset="100%" stopColor="var(--warp)" />
        </radialGradient>
      </defs>
      {[58, 42, 26].map((r, i) => (
        <circle key={r} cx="70" cy="70" r={r} fill="none" stroke="var(--line)" strokeWidth="0.8" strokeDasharray={i === 1 ? "3 4" : undefined} />
      ))}
      <circle cx="70" cy="70" r="9" fill={`url(#star-${seed})`} opacity="0.9" />
      {[58, 42, 26].map((r, i) => {
        const a = ((seed * 40 + i * 120) * Math.PI) / 180;
        return (
          <g key={r} className="orbit" style={{ transformOrigin: "70px 70px", animationDuration: `${12 + i * 7}s`, animationDirection: i % 2 ? "reverse" : "normal" }}>
            <circle cx={70 + Math.cos(a) * r} cy={70 + Math.sin(a) * r} r={3 - i * 0.4} fill={i === 0 ? "var(--cyan)" : i === 1 ? "var(--warp)" : "var(--shield)"} />
          </g>
        );
      })}
      <circle cx="70" cy="70" r={radius} fill="none" stroke="var(--c-amber)" strokeWidth="0" />
    </svg>
  );
}

function MissionCard({ p, index }: { p: ProjectItem; index: number }) {
  const [open, setOpen] = useState(false);
  const meta = MISSION_META[index % MISSION_META.length];
  const wide = p.span === "wide";

  return (
    <article
      className={`mission-in hud hud-frame scanlines overflow-hidden ${wide ? "lg:col-span-7" : "lg:col-span-5"}`}
      style={{ animationDelay: `${index * 70}ms` }}
    >
      {/* mission header band */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--line)] px-5 py-3">
        <div className="flex items-center gap-2.5">
          <Satellite className="h-3.5 w-3.5 text-[var(--cyan)]" />
          <span className="mono text-[10px] text-[var(--text)]">{meta.code}</span>
          <span className="mono text-[9.5px] text-[var(--muted)]">· {meta.sector}</span>
        </div>
        <span
          className="rounded px-2 py-0.5 mono text-[9px] font-bold uppercase"
          style={{
            background: "rgba(94,255,200,0.14)",
            color: "var(--shield)",
          }}
        >
          {meta.status}
        </span>
      </div>

      <div className="p-5 sm:p-6">
        <div className={wide ? "grid gap-5 md:grid-cols-[1fr_150px]" : ""}>
          <div>
            <div className="flex items-start gap-4">
              <div className="relative grid h-14 w-14 shrink-0 place-items-center rounded-xl border border-[var(--line-strong)] bg-[rgba(86,216,255,0.09)] font-display text-lg font-bold text-[var(--cyan)]">
                {p.monogram}
                <span className="ring-ping absolute inset-0 rounded-xl border border-[var(--cyan)]" />
              </div>
              <div className="min-w-0">
                <p className="label text-[9px]">{p.category}</p>
                <h3 className="mt-1 font-display text-lg font-semibold leading-tight text-[var(--text)]">{p.name}</h3>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2 mono text-[10px]">
              <div className="rounded-lg border border-[var(--line)] bg-black/25 px-2.5 py-1.5">
                <div style={{ color: "var(--muted)" }}>ORBIT</div>
                <div className="mt-0.5 text-[var(--cyan)]">{meta.orbit}</div>
              </div>
              <div className="rounded-lg border border-[var(--line)] bg-black/25 px-2.5 py-1.5">
                <div style={{ color: "var(--muted)" }}>CREW</div>
                <div className="mt-0.5 text-[var(--warp)]">{meta.crew}</div>
              </div>
              <div className="rounded-lg border border-[var(--line)] bg-black/25 px-2.5 py-1.5">
                <div style={{ color: "var(--muted)" }}>INTEGRITY</div>
                <div className="mt-0.5 text-[var(--shield)]">99.92%</div>
              </div>
            </div>

            <p className="mt-4 text-[13.5px] leading-relaxed" style={{ color: "var(--body)" }}>
              <span className="mono text-[10px] text-[var(--ion)]">ANOMALY&gt; </span>
              {p.problem}
            </p>
          </div>

          {wide && (
            <div className="hidden rounded-2xl border border-[var(--line)] bg-black/30 p-2 md:block">
              <OrbitalChart seed={index + 1} radius={0} />
              <p className="pb-1 text-center mono text-[8.5px]" style={{ color: "var(--muted)" }}>FLIGHT PATH · 3 BODIES</p>
            </div>
          )}
        </div>

        <div
          className="mt-4 flex items-center gap-2 rounded-lg border px-3 py-2 mono text-[11px]"
          style={{ borderColor: "var(--line-strong)", background: "rgba(94,255,200,0.06)", color: "var(--text)" }}
        >
          <Orbit className="h-3.5 w-3.5 shrink-0 text-[var(--shield)]" />
          <span className="font-semibold" style={{ color: "var(--shield)" }}>MISSION RESULT&gt; </span>
          <span className="truncate">{p.outcome}</span>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2">
          {p.metrics.map((m) => (
            <div key={m.label} className="rounded-lg border border-[var(--line)] bg-black/25 p-2.5 text-center">
              <div className="font-display text-[15px] font-bold text-[var(--text)]">{m.value}</div>
              <div className="mt-0.5 mono text-[8.5px] uppercase text-[var(--muted)]">{m.label}</div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {p.stack.map((s) => (
            <span key={s} className="rounded border border-[var(--line)] bg-black/30 px-2 py-0.5 mono text-[10px] text-[var(--body)]">{s}</span>
          ))}
        </div>

        <button
          onClick={() => {
            setOpen((v) => !v);
            soundFx.playCircuitProbe();
          }}
          aria-expanded={open}
          className="mt-4 flex items-center gap-2 mono text-[11px] text-[var(--cyan)]"
        >
          <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
          {open ? "stow flight plan" : "deploy flight plan (architecture)"}
        </button>

        <div className={`expand ${open ? "open" : ""}`} aria-hidden={!open}>
          <div className="mt-3">
            <div className="min-h-16 rounded-lg border border-[var(--line)] bg-black/35 p-3 mono text-[11.5px] leading-relaxed" style={{ color: "var(--body)" }}>
              <span className="text-[var(--shield)]">FLIGHT PLAN&gt; </span>
              {p.architectureHighlight}
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap gap-2 border-t border-[var(--line)] pt-4">
          <a
            href={p.playStoreUrl}
            target="_blank"
            rel="noreferrer"
            onClick={() => { engageWarp(); soundFx.playPlasmaBurst(); }}
            className="btn btn-primary flex-1 !py-2.5 !text-[12px]"
          >
            <PlayStoreIcon className="h-4 w-4" /> Play Store
          </a>
          <a
            href={p.githubUrl}
            target="_blank"
            rel="noreferrer"
            onClick={() => soundFx.playSynthwaveLaser()}
            className="btn btn-ghost flex-1 !py-2.5 !text-[12px]"
          >
            <GithubIcon className="h-4 w-4" /> Source
          </a>
        </div>
      </div>
    </article>
  );
}

export function MissionLogs({ projects }: MissionLogsProps) {
  return (
    <section id="missions" className="relative z-10 border-t border-[var(--line)] px-4 py-24 sm:px-6">
      <div className="mx-auto max-w-[1340px]">
        <header className="fade-up mb-12 max-w-2xl">
          <div className="label flex items-center gap-2"><FolderGit2 className="h-4 w-4" /> deck 02 · mission logs</div>
          <h2 className="section-title mt-3">Four missions, <span className="warp-text">flown to completion.</span></h2>
          <p className="mt-3 text-[14px] text-[var(--muted)]">
            Each log records the anomaly encountered, the flight plan deployed, and the verified outcome
            beamed back from production. Deploy a flight plan to inspect the architecture.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
          {projects.map((p, i) => (
            <MissionCard key={p.id} p={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
