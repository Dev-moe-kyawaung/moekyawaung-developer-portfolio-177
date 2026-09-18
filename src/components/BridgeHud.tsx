import { useEffect, useMemo, useState } from "react";
import { Download, Menu, Rocket, X } from "lucide-react";
import { engageWarp } from "./WarpCanvas";
import { soundFx } from "../lib/soundFx";
import { useClock, useScrollSpy } from "../lib/hooks";
import type { ProfileData } from "../types/portfolio";

export const DECKS = [
  { id: "bridge", label: "Bridge", short: "BRG" },
  { id: "missions", label: "Missions", short: "MSN" },
  { id: "warpcore", label: "Warp Core", short: "WRC" },
  { id: "logbook", label: "Logbook", short: "LGB" },
  { id: "docking", label: "Docking", short: "DCK" },
];

interface BridgeHudProps {
  profile: ProfileData;
  onResume: () => void;
}

/** Spacecraft heads-up navigation bar with a live warp-factor gauge. */
export function BridgeHud({ profile, onResume }: BridgeHudProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  const [sfx, setSfx] = useState(soundFx.enabled);
  const ids = useMemo(() => DECKS.map((d) => d.id), []);
  const active = useScrollSpy(ids);
  const clock = useClock();

  useEffect(() => {
    const onScroll = () => setScrolled(scrollY > 12);
    onScroll();
    addEventListener("scroll", onScroll, { passive: true });
    return () => removeEventListener("scroll", onScroll);
  }, []);

  // Warp factor scales with reading depth — 1.0 at top, 9.9 near the end.
  const [warp, setWarp] = useState(1);
  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - innerHeight;
      const p = max > 0 ? Math.min(1, scrollY / max) : 0;
      setWarp(Number((1 + p * 8.9).toFixed(1)));
    };
    onScroll();
    addEventListener("scroll", onScroll, { passive: true });
    return () => removeEventListener("scroll", onScroll);
  }, []);

  const jump = (id: string) => {
    engageWarp();
    soundFx.playSynthwaveLaser();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${
        scrolled ? "hud-strong rounded-none border-b" : "border-b border-transparent"
      }`}
      style={{ borderColor: scrolled ? "var(--line)" : "transparent" }}
    >
      <div className="mx-auto flex h-16 max-w-[1340px] items-center gap-3 px-4 sm:px-6">
        {/* ship registry */}
        <a href="#bridge" onClick={() => engageWarp()} className="flex shrink-0 items-center gap-2.5">
          <span className="hud-flicker grid h-9 w-9 place-items-center rounded-lg border border-[var(--line-strong)] bg-[rgba(86,216,255,0.1)]">
            <Rocket className="h-4 w-4 text-[var(--cyan)]" />
          </span>
          <span className="leading-tight">
            <span className="block font-display text-[13.5px] font-bold text-[var(--text)]">{profile.name}</span>
            <span className="label block text-[8.5px]">NCC-2026-A · ANDROID DIVISION</span>
          </span>
        </a>

        {/* deck nav */}
        <nav aria-label="Ship decks" className="ml-4 hidden items-center gap-0.5 xl:flex">
          {DECKS.map((d) => {
            const on = active === d.id;
            return (
              <button
                key={d.id}
                onClick={() => jump(d.id)}
                aria-current={on ? "true" : undefined}
                className="rounded-lg px-3 py-1.5 font-tech text-[12.5px] transition-colors"
                style={{
                  color: on ? "var(--cyan)" : "var(--body)",
                  background: on ? "rgba(86,216,255,0.1)" : "transparent",
                }}
              >
                {d.label}
              </button>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          {/* warp gauge */}
          <div className="hud hidden items-center gap-2.5 rounded-lg px-3 py-1.5 lg:flex" aria-live="off">
            <span className="label text-[8.5px]">WARP</span>
            <span className="font-mono text-[15px] font-bold tabular-nums text-[var(--warp)]">
              {warp.toFixed(1)}
            </span>
            <span className="flex h-3 items-end gap-[2px]" aria-hidden="true">
              {[0, 1, 2, 3, 4].map((i) => (
                <span
                  key={i}
                  className="w-[3px] rounded-sm transition-all duration-300"
                  style={{
                    height: `${5 + i * 2.4}px`,
                    background: warp / 2 > i ? "var(--warp)" : "var(--line-strong)",
                    boxShadow: warp / 2 > i ? "0 0 6px var(--warp)" : "none",
                  }}
                />
              ))}
            </span>
          </div>

          {/* clock */}
          <div className="hud hidden items-center gap-2 rounded-lg px-2.5 py-1.5 xl:flex">
            <span className="live-blink h-1.5 w-1.5 rounded-full bg-[var(--shield)]" />
            <span className="font-mono text-[10.5px] tabular-nums text-[var(--body)]">
              {clock.toISOString().slice(11, 19)} STARDATE
            </span>
          </div>

          <button
            onClick={() => setSfx(soundFx.toggle())}
            title={sfx ? "Mute comms" : "Enable comms"}
            aria-label="Toggle comms audio"
            className="grid h-9 w-9 place-items-center rounded-lg border border-[var(--line)]"
            style={{ color: sfx ? "var(--cyan)" : "var(--muted)" }}
          >
            <span className="font-mono text-[10px] font-bold">{sfx ? "SFX" : "MUTE"}</span>
          </button>

          <button onClick={onResume} className="btn btn-ghost hidden !px-3.5 !py-2 !text-[12px] sm:inline-flex">
            <Download className="h-3.5 w-3.5" /> Mission CV
          </button>

          <button
            onClick={() => setMenu((v) => !v)}
            aria-label={menu ? "Close deck menu" : "Open deck menu"}
            aria-expanded={menu}
            className="grid h-9 w-9 place-items-center rounded-lg border border-[var(--line)] text-[var(--body)] xl:hidden"
          >
            {menu ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {menu && (
        <nav aria-label="Mobile decks" className="hud-strong rounded-none border-t px-4 py-3 xl:hidden" style={{ borderColor: "var(--line)" }}>
          {DECKS.map((d) => (
            <button
              key={d.id}
              onClick={() => { setMenu(false); jump(d.id); }}
              className="flex w-full items-center justify-between border-b border-[var(--line)] py-3 text-left font-tech text-[14px] last:border-0"
              style={{ color: "var(--text)" }}
            >
              {d.label}
              <span className="label text-[9px]">{d.short}</span>
            </button>
          ))}
          <button onClick={() => { setMenu(false); onResume(); }} className="btn btn-ghost mt-3 w-full justify-center">
            <Download className="h-4 w-4" /> Mission CV
          </button>
        </nav>
      )}
    </header>
  );
}
