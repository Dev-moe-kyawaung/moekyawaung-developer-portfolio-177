import { useEffect, useRef, useState } from "react";
import { Rocket, Send, X } from "lucide-react";
import { engageWarp } from "./WarpCanvas";
import { soundFx } from "../lib/soundFx";

type Msg = { from: "computer" | "user"; text: string };

const PROBES: { id: string; label: string; reply: string }[] = [
  {
    id: "offline",
    label: "Report on offline sync",
    reply:
      "Computer: PulseSync employs a Room single source of truth with a durable outbox. Mutations commit to local SQLite before UI acknowledgement, then drain via unique WorkManager chains with exponential backoff. Result — 99.4% automatic recovery, zero data-loss incidents. Flight plan available in Mission 101.",
  },
  {
    id: "transit",
    label: "Report on GTFS-Realtime",
    reply:
      "Computer: TransitPulse ingests sequence-numbered protobuf deltas over OkHttp WebSocket into a normalized Room store. The map observes one conflated Flow with viewport marker culling. Telemetry — 5.2M vehicle events/day at 60fps P95, stale-arrival reports reduced 67%. See Mission 102.",
  },
  {
    id: "security",
    label: "Report on hardware security",
    reply:
      "Computer: VaultPay signs with StrongBox-backed ECDSA keys unlocked per-transaction by BiometricPrompt. Client-generated UUID idempotency keys are persisted to encrypted Room before dispatch. Cold start 980ms → 412ms via Baseline Profiles, zero critical audit findings. See Mission 103.",
  },
  {
    id: "ai",
    label: "Report on on-device AI",
    reply:
      "Computer: MoekyawTranslator executes a quantized INT8 TFLite model on NNAPI/GPU delegates — 118ms median inference, zero bytes of offline egress, 85% cache hit rate. Claude API is an opt-in fallback governed by token budgets. See Mission 104.",
  },
  {
    id: "warp",
    label: "Report on warp capability",
    reply:
      "Computer: Warp performance comes from three disciplines — Baseline Profiles removing JIT warmup, compiler-verified Compose stability eliminating recomposition, and R8 full-mode shrinking the APK 46%. Cold start 412ms P50, jank under 0.4%.",
  },
  {
    id: "crew",
    label: "Report on crew service",
    reply:
      "Computer: Captain's service record spans 8+ years. Current posting — independent Android architecture consulting (2023–present). Prior — regional product teams (2021–2023) and Lanpya Labs (2018–2021). Twelve engineers mentored, four promoted. Full logbook available on deck 04.",
  },
];

export function StarshipComputer({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const [msgs, setMsgs] = useState<Msg[]>([
    {
      from: "computer",
      text: "⋆ Starship computer online. All decks reporting nominal. Request a mission report — GTFS-Realtime, offline sync, hardware security, on-device AI, warp capability, or crew service.",
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [bars, setBars] = useState(0);
  const end = useRef<HTMLDivElement>(null);

  useEffect(() => end.current?.scrollIntoView({ behavior: "smooth" }), [msgs, typing, open]);

  useEffect(() => {
    if (!open) return;
    const id = window.setInterval(() => setBars((b) => (b + 1) % 20), 110);
    return () => window.clearInterval(id);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const k = (e: KeyboardEvent) => e.key === "Escape" && onOpenChange(false);
    addEventListener("keydown", k);
    return () => removeEventListener("keydown", k);
  }, [open, onOpenChange]);

  const respond = (raw: string, probe?: (typeof PROBES)[number]) => {
    if (!raw.trim() || typing) return;
    const q = raw.toLowerCase();
    soundFx.playCircuitProbe();
    setMsgs((m) => [...m, { from: "user", text: `> ${raw}` }]);
    setInput("");
    setTyping(true);

    window.setTimeout(() => {
      let hit = probe;
      if (!hit) {
        hit = PROBES.find(
          (p) =>
            q.includes(p.id) ||
            (p.id === "transit" && (q.includes("gtfs") || q.includes("map") || q.includes("realtime"))) ||
            (p.id === "offline" && (q.includes("sync") || q.includes("room") || q.includes("work"))) ||
            (p.id === "security" && (q.includes("secur") || q.includes("vault") || q.includes("keystore") || q.includes("biometric"))) ||
            (p.id === "ai" && (q.includes("ai") || q.includes("ml") || q.includes("tflite") || q.includes("translat"))) ||
            (p.id === "warp" && (q.includes("warp") || q.includes("performance") || q.includes("speed"))) ||
            (p.id === "crew" && (q.includes("crew") || q.includes("experience") || q.includes("career") || q.includes("service")))
        );
      }
      const text = hit
        ? hit.reply
        : "Computer: no mission matches that query. Available reports — offline sync, GTFS-Realtime, hardware security, on-device AI, warp capability, crew service. Use a probe below.";
      setMsgs((m) => [...m, { from: "computer", text }]);
      setTyping(false);
      soundFx.playPlasmaBurst();
      engageWarp();
      if (hit) {
        window.setTimeout(() => {
          document.getElementById("missions")?.scrollIntoView({ behavior: "smooth" });
        }, 500);
      }
    }, 500);
  };

  return (
    <>
      {/* floating computer bubble */}
      <button
        onClick={() => { onOpenChange(true); engageWarp(); soundFx.playPlasmaCharge(); }}
        aria-label="Wake starship computer"
        className="float-drift micro-pulse fixed bottom-5 right-5 z-40 flex items-center gap-2.5 rounded-full border py-2.5 pl-3 pr-4"
        style={{ background: "var(--panel-solid)", borderColor: "var(--line-strong)", boxShadow: "var(--glow-cyan)" }}
      >
        <span className="relative grid h-9 w-9 place-items-center rounded-full" style={{ background: "radial-gradient(circle at 35% 30%, #fff, var(--cyan) 40%, var(--warp) 88%)" }}>
          <Rocket className="h-4 w-4 text-[#01030a]" />
          <span className="ring-ping absolute inset-0 rounded-full border border-[var(--cyan)]" />
        </span>
        <span className="text-left leading-tight">
          <b className="block mono text-[11px] text-[var(--text)]">STARSHIP COMPUTER</b>
          <span className="block mono text-[9px]" style={{ color: "var(--shield)" }}>ask for a mission report</span>
        </span>
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center p-0 backdrop-blur-sm sm:items-center sm:p-4"
          style={{ background: "rgba(1,3,10,0.78)" }}
          onClick={() => onOpenChange(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Starship computer"
            onClick={(e) => e.stopPropagation()}
            className="hud-strong hud-frame scanlines flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-t-3xl sm:rounded-3xl"
            style={{ borderColor: "var(--line-strong)", boxShadow: "var(--glow-cyan)" }}
          >
            {/* computer header */}
            <div className="flex items-center justify-between border-b border-[var(--line)] px-5 py-4">
              <div className="flex items-center gap-3">
                <span className="relative grid h-10 w-10 place-items-center rounded-xl" style={{ background: "radial-gradient(circle at 35% 30%, #fff, var(--cyan) 40%, var(--warp) 88%)" }}>
                  <Rocket className="h-5 w-5 text-[#01030a]" />
                </span>
                <div>
                  <h3 className="font-display text-[15px] font-bold text-[var(--text)]">STARSHIP COMPUTER</h3>
                  <p className="mono text-[10px]" style={{ color: "var(--shield)" }}>LCARS interface · all decks reporting · online</p>
                </div>
              </div>
              <button onClick={() => onOpenChange(false)} aria-label="Close" className="grid h-9 w-9 place-items-center rounded-lg border border-[var(--line)] text-[var(--muted)]">
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* LCARS telemetry bar */}
            <div className="border-b border-[var(--line)] px-5 py-3" style={{ background: "var(--panel)" }}>
              <div className="mb-2 flex items-center justify-between mono text-[10px]" style={{ color: "var(--muted)" }}>
                <span>DIAGNOSTIC BUS · SUBSPACE BANDWIDTH</span>
                <span style={{ color: "var(--shield)" }}>{60 + (bars % 40)}% UTILISED</span>
              </div>
              <div className="flex items-end gap-[3px]">
                {Array.from({ length: 34 }).map((_, i) => (
                  <span
                    key={i}
                    className="flex-1 rounded-sm"
                    style={{
                      height: 6 + ((i * 7 + bars) % 22),
                      background: i % 3 === 0 ? "var(--warp)" : i % 2 === 0 ? "var(--cyan)" : "var(--shield)",
                      opacity: 0.28 + ((i + bars) % 5) * 0.14,
                      transition: "height 0.2s ease",
                    }}
                  />
                ))}
              </div>
            </div>

            {/* log */}
            <div className="flex-1 space-y-3 overflow-y-auto p-4" style={{ minHeight: 175 }}>
              {msgs.map((m, i) => (
                <div key={i} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[88%] rounded-xl px-3.5 py-2.5 text-[13px] leading-relaxed ${
                      m.from === "user"
                        ? "font-medium text-[#01030a]"
                        : "border border-[var(--line)] bg-black/30 mono"
                    }`}
                    style={m.from === "user" ? { background: "var(--cyan)" } : { color: "var(--body)" }}
                  >
                    {m.from === "computer" && <span className="mb-1 block text-[9px] font-bold" style={{ color: "var(--cyan)" }}>COMPUTER</span>}
                    {m.text}
                  </div>
                </div>
              ))}
              {typing && (
                <div className="flex items-center gap-1.5 px-2 mono text-[11px]" style={{ color: "var(--muted)" }}>
                  <span className="live-blink h-2 w-2 rounded-full bg-[var(--cyan)]" />
                  retrieving mission records…
                </div>
              )}
              <div ref={end} />
            </div>

            {/* probes */}
            <div className="flex flex-wrap gap-1.5 border-t border-[var(--line)] px-4 py-3">
              {PROBES.map((p) => (
                <button
                  key={p.id}
                  onClick={() => respond(p.label, p)}
                  className="rounded-full border border-[var(--line)] px-2.5 py-1 mono text-[10.5px] transition-colors hover:border-[var(--cyan)]"
                  style={{ color: "var(--body)", background: "var(--panel)" }}
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                respond(input);
              }}
              className="flex items-center gap-2 border-t border-[var(--line)] p-3"
            >
              <span className="mono text-[12px]" style={{ color: "var(--shield)" }}>&gt;</span>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Computer, report on…"
                aria-label="Message the starship computer"
                className="min-w-0 flex-1 rounded-lg border border-[var(--line)] bg-transparent px-3 py-2.5 mono text-[13px] text-[var(--text)] outline-none"
              />
              <button type="submit" aria-label="Send" className="grid h-10 w-10 place-items-center rounded-lg" style={{ background: "var(--cyan)", color: "#01030a" }}>
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
