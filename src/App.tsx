import { useEffect, useState } from "react";
import { Download, Rocket } from "lucide-react";
import metricsData from "./data/metrics.json";
import projectsData from "./data/projects.json";
import tradeoffsData from "./data/tradeoffs.json";
import experienceData from "./data/experience.json";

import { WarpCanvas, engageWarp } from "./components/WarpCanvas";
import { BridgeHud, DECKS } from "./components/BridgeHud";
import { Bridge } from "./components/Bridge";
import { MissionLogs } from "./components/MissionLogs";
import { WarpCore } from "./components/WarpCore";
import { Logbook } from "./components/Logbook";
import { DockingBay } from "./components/DockingBay";
import { StarshipComputer } from "./components/StarshipComputer";
import { soundFx } from "./lib/soundFx";

import { useReveal } from "./lib/hooks";
import { downloadResumeSheet } from "./lib/resumeDownload";
import type { ExperienceItem, MetricsConfig, ProjectItem, TradeoffItem } from "./types/portfolio";

const config = metricsData as MetricsConfig;
const projects = projectsData as ProjectItem[];
const tradeoffs = tradeoffsData as TradeoffItem[];
const experience = experienceData as ExperienceItem[];

export default function App() {
  const [computerOpen, setComputerOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useReveal();

  // ⌘K wakes the starship computer · "/" engages warp · Escape closes panels.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing = ["INPUT", "TEXTAREA"].includes((e.target as HTMLElement)?.tagName ?? "");
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        engageWarp();
        setComputerOpen((v) => !v);
        return;
      }
      if (e.key === "Escape") {
        setComputerOpen(false);
        setMenuOpen(false);
      }
      if (e.key === "/" && !typing) {
        e.preventDefault();
        engageWarp();
        setComputerOpen(true);
      }
    };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, []);

  const resume = () => downloadResumeSheet(config.profile, projects, experience);

  const jump = (id: string) => {
    setMenuOpen(false);
    engageWarp();
    soundFx.playSynthwaveLaser();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden" style={{ background: "var(--void)" }}>
      <a
        href="#missions"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:px-4 focus:py-2 focus:font-mono focus:font-bold"
        style={{ background: "var(--cyan)", color: "var(--void)" }}
      >
        Skip to mission logs
      </a>

      {/* starfield + warp tunnel + gravity lens */}
      <WarpCanvas />

      {/* spacecraft navigation HUD */}
      <BridgeHud profile={config.profile} onResume={resume} />

      {/* mobile deck drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 xl:hidden" onClick={() => setMenuOpen(false)}>
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <nav
            aria-label="Mobile decks"
            className="hud-strong absolute right-3 top-[72px] w-[240px] rounded-2xl p-3"
            onClick={(e) => e.stopPropagation()}
          >
            {DECKS.map((d) => (
              <button
                key={d.id}
                onClick={() => jump(d.id)}
                className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left font-tech text-[14px] transition-colors hover:bg-white/5"
                style={{ color: "var(--text)" }}
              >
                {d.label}
                <span className="label text-[9px]">{d.short}</span>
              </button>
            ))}
            <button onClick={() => { setMenuOpen(false); resume(); }} className="btn btn-ghost mt-2 w-full justify-center">
              <Download className="h-4 w-4" /> Mission CV
            </button>
          </nav>
        </div>
      )}

      <main className="relative z-10">
        <Bridge profile={config.profile} ticker={config.ticker} onOpenComputer={() => setComputerOpen(true)} />
        <MissionLogs projects={projects} />
        <WarpCore tradeoffs={tradeoffs} />
        <Logbook experience={experience} />
        <DockingBay profile={config.profile} onResume={resume} />
      </main>

      {/* floating starship computer */}
      {!menuOpen && (
        <button
          onClick={() => { setMenuOpen(true); engageWarp(); }}
          aria-label="Open deck menu"
          className="micro-pulse fixed bottom-[86px] right-5 z-40 hidden h-11 w-11 place-items-center rounded-full border border-[var(--line-strong)] sm:grid"
          style={{ background: "var(--panel-solid)", color: "var(--cyan)" }}
        >
          <Rocket className="h-4 w-4" />
        </button>
      )}

      <StarshipComputer open={computerOpen} onOpenChange={setComputerOpen} />
    </div>
  );
}
