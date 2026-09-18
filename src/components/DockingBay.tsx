import { useState } from "react";
import { ArrowUpRight, Check, Copy, Download, Mail, ShieldCheck } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "./icons";
import { engageWarp } from "./WarpCanvas";
import { soundFx } from "../lib/soundFx";
import type { ProfileData } from "../types/portfolio";

export function DockingBay({ profile, onResume }: { profile: ProfileData; onResume: () => void }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    soundFx.playArcadeCoin();
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* noop */
    }
  };

  return (
    <section id="docking" className="relative z-10 border-t border-[var(--line)] px-4 py-24 sm:px-6">
      <div className="mx-auto max-w-[1180px]">
        <div className="fade-up hud-strong hud-frame scanlines relative overflow-hidden rounded-3xl p-8 sm:p-12">
          <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 opacity-45" aria-hidden="true">
            {[0, 18, 36].map((inset) => (
              <span key={inset} className="absolute rounded-full border" style={{ inset: `${inset}%`, borderColor: "var(--line)" }} />
            ))}
            <span className="ring-ping absolute inset-[30%] rounded-full border border-[var(--cyan)]" />
            <span className="ring-ping absolute inset-[30%] rounded-full border border-[var(--warp)]" style={{ animationDelay: "1.3s" }} />
          </div>

          <div className="relative">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 mono text-[11px] font-bold uppercase" style={{ borderColor: "var(--line-strong)", color: "var(--shield)", background: "rgba(94,255,200,0.08)" }}>
              <span className="live-blink h-2 w-2 rounded-full bg-[var(--shield)]" />
              Docking clamps released · accepting transmissions
            </div>

            <h2 className="section-title">
              Request <span className="warp-text">docking clearance.</span>
            </h2>
            <p className="mt-3 max-w-2xl text-[15px]" style={{ color: "var(--body)" }}>
              {profile.availability}. Subspace frequency is open — direct email only, no relay forms.
              I answer every serious transmission within one rotation.
            </p>

            <div className="mt-5 flex items-start gap-3 rounded-xl border border-[var(--line)] bg-black/30 p-4">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[var(--shield)]" />
              <p className="mono text-[12px]" style={{ color: "var(--body)" }}>
                <span className="text-[var(--cyan)]">SERVICE RECORD // </span>{profile.trustSignal}
              </p>
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              <a
                href={`mailto:${profile.email}`}
                onClick={() => { engageWarp(); soundFx.playPlasmaCharge(); }}
                className="btn btn-primary"
              >
                <Mail className="h-4 w-4" /> {profile.email}
              </a>
              <button onClick={copy} className="btn btn-ghost" aria-label="Copy email address">
                {copied ? <Check className="h-4 w-4" style={{ color: "var(--shield)" }} /> : <Copy className="h-4 w-4" />}
                {copied ? "Copied" : "Copy frequency"}
              </button>
              <a href={profile.calendly} target="_blank" rel="noreferrer" onClick={() => { engageWarp(); soundFx.playSynthwaveLaser(); }} className="btn btn-ghost">
                Schedule briefing <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-2 border-t border-[var(--line)] pt-6">
              <span className="mr-1 mono text-[10px] text-[var(--muted)]">FREQUENCIES //</span>
              <a href={profile.github} target="_blank" rel="noreferrer" onClick={() => soundFx.playCircuitProbe()} className="flex items-center gap-2 rounded-lg border border-[var(--line)] px-3.5 py-2 mono text-[12px] transition-colors hover:border-[var(--cyan)]" style={{ color: "var(--text)" }}>
                <GithubIcon className="h-4 w-4" /> GitHub <ArrowUpRight className="h-3 w-3 text-[var(--muted)]" />
              </a>
              <a href={profile.linkedin} target="_blank" rel="noreferrer" onClick={() => soundFx.playCircuitProbe()} className="flex items-center gap-2 rounded-lg border border-[var(--line)] px-3.5 py-2 mono text-[12px] transition-colors hover:border-[var(--cyan)]" style={{ color: "var(--text)" }}>
                <LinkedinIcon className="h-4 w-4" /> LinkedIn <ArrowUpRight className="h-3 w-3 text-[var(--muted)]" />
              </a>
              <button onClick={onResume} className="ml-auto flex items-center gap-2 rounded-lg px-4 py-2 mono text-[12px] font-bold" style={{ background: "var(--text)", color: "var(--void)" }}>
                <Download className="h-4 w-4" /> Mission CV
              </button>
            </div>
          </div>
        </div>

        <footer className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-[var(--line)] pt-6 mono text-[11px] sm:flex-row" style={{ color: "var(--muted)" }}>
          <span>© 2026 {profile.name} · Senior Android Engineer</span>
          <span className="flex items-center gap-2">
            <span className="live-blink h-1.5 w-1.5 rounded-full bg-[var(--shield)]" />
            WARP-DRIVE OS · NCC-2026-A · ALL DECKS NOMINAL
          </span>
        </footer>
      </div>
    </section>
  );
}
