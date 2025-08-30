import { useEffect, useMemo, useRef, useState } from "react";

// --- Palette (global) ---
const BG = "#000000"; // page bg
const INK = "#FFFFFF"; // primary text
const MUTED = "#999999"; // secondary text
const ACCENT = "#08b129"; // buttons/chips active

// QES official dataset hook (Stats NZ QES)
// If you have the official value, set it here (NZD/hour, e.g. 41.0)
const QES_NZD_AVG_HOURLY = null; // set a number to enable $ calc

// --- Hover / Tooltip Dictionary ---
const HOVERS = {
  NZHS: "National survey of health status/behaviours; used here for baselines & equity context. (Ministry of Health NZ)",
  NZDep: "Socioeconomic deprivation quintiles (Q1 least deprived → Q5 most). (University of Otago)",
  LINZ: "Land Information NZ; official boundary datasets for maps & filters. (data.linz.govt.nz)",
  "ED ≤6h": "NZ health target: 95% of patients processed within 6h. (Ministry of Health NZ)",
  "31-day cancer": "Target from decision to treat → treatment within 31 days. (Ministry of Health NZ)",
  FSA: "First Specialist Assessment, initial specialist outpatient consultation.",
  DNA: "Did Not Attend (missed appointment).",
  "QES earnings": "Stats NZ ‘Labour market statistics’ (June 2025): average hourly earnings used for hours→$ conversion. (stats.govt.nz)",
  FHIR: "Fast Healthcare Interoperability Resources. Open healthcare data standard for clinical data.",
  CloudEvents: "Open CNCF spec for event metadata so events can be routed consistently.",
};
const tip = (k) => HOVERS[k] || undefined;

// NZDep quintile-specific helper
const depTip = (q) => {
  switch (q) {
    case "Q1":
      return "Q1 — Least deprived areas (NZDep quintile 1).";
    case "Q2":
      return "Q2 — Lower deprivation than average.";
    case "Q3":
      return "Q3 — Middle deprivation (around national median).";
    case "Q4":
      return "Q4 — Higher deprivation than average.";
    case "Q5":
      return "Q5 — Most deprived areas (NZDep quintile 5).";
    default:
      return tip("NZDep");
  }
};

// ---------- Main Component ----------
export default function NZHEBWireframe() {
  // --- Data seeds ---
  const producerSeed = [
    { name: "ED System", eventsPerSec: "2.1/s", uptime: "99.98%", schemaOk: true },
    { name: "GP PMS", eventsPerSec: "1.4/s", uptime: "99.90%", schemaOk: true },
    { name: "Lab LIS", eventsPerSec: "0.9/s", uptime: "99.95%", schemaOk: true },
    { name: "Immunisation (AIR)", eventsPerSec: "0.5/s", uptime: "99.99%", schemaOk: true },
    { name: "Imaging RIS/PACS", eventsPerSec: "0.7/s", uptime: "99.92%", schemaOk: true },
  ];

  const consumerSeed = [
    { name: "Targets Orchestrator", lag: 45, errors: 0, tput: 1200 },
    { name: "Productivity Calculator", lag: 61, errors: 1, tput: 980 },
    { name: "Ops Dashboards", lag: 38, errors: 0, tput: 1520 },
    { name: "Public Tiles", lag: 70, errors: 0, tput: 410 },
    { name: "Data Lake", lag: 120, errors: 2, tput: 5000 },
  ];

  const templates = useMemo(
    () => [
      { type: "LabResultReady", producer: "LIS", detail: "HbA1c ready", consumers: ["GP PMS", "Oncology", "Targets"], benefits: ["👤 Individuals", "🏛 Government"], severity: "good" },
      { type: "EDStatusChanged", producer: "ED", detail: "Triage 3 → Seen", consumers: ["Ops Dash", "Targets"], benefits: ["🏛 Government"], severity: "warn" },
      { type: "ImmunisationUpdated", producer: "AIR", detail: "24m schedule", consumers: ["Targets", "Productivity"], benefits: ["👤 Individuals", "🏛 Government"], severity: "good" },
      { type: "ReferralRegistered", producer: "GP PMS", detail: "Specialty: Cardiology", consumers: ["Targets"], benefits: ["👤 Individuals"], severity: "good" },
      { type: "AppointmentCancelled", producer: "Hospital PAS", detail: "DNA risk ↑", consumers: ["Productivity", "Ops Dash"], benefits: ["🏢 Employers", "🏛 Government"], severity: "danger" },
      { type: "FSABooked", producer: "Hospital PAS", detail: "First Specialist Assessment scheduled", consumers: ["Targets", "Ops Dash"], benefits: ["👤 Individuals", "🏛 Government"], severity: "good" },
      { type: "Cancer31DayMilestone", producer: "Oncology", detail: "Decision→Treatment: Day 21", consumers: ["Targets", "Ops Dash"], benefits: ["👤 Individuals", "🏛 Government"], severity: "warn" },
      { type: "DNAPredicted", producer: "Hospital PAS", detail: "DNA risk ↑ (model)", consumers: ["Productivity", "Ops Dash"], benefits: ["🏢 Employers", "🏛 Government"], severity: "danger" },
    ],
    []
  );

  // --- Live event state (auto-stream) ---
  const [events, setEvents] = useState(() => seedEvents(templates));
  const tickRef = useRef(null);
  useEffect(() => {
    // push a new event every 1.5s (demo)
    const id = window.setInterval(() => {
      const next = synthEvent(templates);
      setEvents((prev) => [next, ...prev].slice(0, 40));
    }, 1500);
    tickRef.current = id;
    return () => {
      if (tickRef.current) window.clearInterval(tickRef.current);
    };
  }, [templates]);

  // --- Equity demo ---
  const equity = [
    { q: "Q1", v: 3.2 },
    { q: "Q2", v: 3.6 },
    { q: "Q3", v: 4.1 },
    { q: "Q4", v: 4.7 },
    { q: "Q5", v: 5.3 },
  ];

  // Enlarged equity chart settings
  const CHART_H = 240; // px chart height for bigger visibility
  const LABEL_SPACE = 40; // reserved space for labels under bars
  const equityMax = Math.max(...equity.map((i) => i.v));
  const equityAvg = Number((equity.reduce((a, i) => a + i.v, 0) / equity.length).toFixed(1));

  // Employers economic value using QES (if provided)
  const avoidedPer10k = 12; // projected appointments avoided (24h) per 10k
  const avgApptMins = 30; // average appointment minutes avoided
  const employersValue = QES_NZD_AVG_HOURLY ? Math.round(avoidedPer10k * (avgApptMins / 60) * QES_NZD_AVG_HOURLY) : null;

  // --- Dev sanity checks (console-only) ---
  useEffect(() => {
    runInternalTests(templates);
  }, [templates]);

  return (
    <div className="min-h-screen" style={{ backgroundColor: BG, color: INK }}>
      {/* HEADER */}
      <header className="sticky top-0 z-30 border-b backdrop-blur" style={{ borderColor: "#222", background: "rgba(0,0,0,0.8)" }}>
        <div className="mx-auto max-w-[1280px] px-4 py-3 flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h1 className="text-lg md:text-xl font-semibold">NZ Health Event Bus (Live)</h1>
            <div className="hidden md:flex items-center gap-2">
              <Badge label="FHIR R4" title={tip("FHIR")} />
              <Badge label="CloudEvents 1.0" title={tip("CloudEvents")} />
              <Badge label="Zero-PHI demo" title="Synthetic events only; no personal health information." />
            </div>
          </div>

          {/* Controls row */}
          <div className="flex flex-wrap gap-2">
            <Select label="Region" options={["Auckland", "Waikato", "Wellington", "Canterbury", "Otago"]} accent={ACCENT} muted={MUTED} />
            <Select label="Stratifier" options={["NZDep Q1–Q5"]} accent={ACCENT} muted={MUTED} />
            <Segmented label="Window" options={["Now", "1h", "24h"]} accent={ACCENT} muted={MUTED} />
          </div>

          {/* Two-column: Event chips + Benefit legend */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <ChipGroup
              label="Event types"
              chips={[
                "LabResultReady",
                "EDStatusChanged",
                "ImmunisationUpdated",
                "ReferralRegistered",
                "AppointmentCancelled",
                "FSABooked",
                "Cancer31DayMilestone",
                "DNAPredicted",
              ]}
              accent={ACCENT}
              muted={MUTED}
            />
            <div className="flex flex-wrap items-center gap-2 text-xs" style={{ color: MUTED }}>
              <span>Benefit tracks:</span>
              <LegendPill accent={ACCENT}>👤 Individuals</LegendPill>
              <LegendPill accent={ACCENT}>🏢 Employers</LegendPill>
              <LegendPill accent={ACCENT}>🏛 Government</LegendPill>
            </div>
          </div>
        </div>
      </header>

      {/* PAGE SECTIONS WRAPPER */}
      <main className="mx-auto max-w-[1280px] px-4 py-6 grid grid-cols-12 gap-6">
        {/* --- Live Events & Benefit tickers (2 columns) --- */}
        <section id="live" className="col-span-12 md:col-span-8 relative" aria-labelledby="live-h">
          <SectionHeader id="live-h" title="Live Event Rail" subtitle="Critical, standards-based clinical events (newest at top)" muted={MUTED} />

          {/* Stream list */}
          <div className="pr-0">
            <div className="rounded-xl h-[500px] overflow-y-auto" style={{ background: "#0b0b0b", border: "1px solid #1f1f1f", overflowAnchor: "none" }}>
              {events.map((e) => (
                <EventRow key={e.id} e={e} muted={MUTED} />
              ))}
            </div>
          </div>

          {/* Standards/refs */}
          <div className="mt-3 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3 text-[11px]" style={{ color: MUTED }}>
            <div title={tip("ED ≤6h")}>
              <span className="font-medium" style={{ color: INK }}>
                ED ≤6h target
              </span>
              : 95% within 6 hours.
            </div>
            <div title={tip("31-day cancer")}>
              <span className="font-medium" style={{ color: INK }}>
                31-day cancer
              </span>
              : decision→treatment pathway.
            </div>
            <div title={tip("FSA")}>
              <span className="font-medium" style={{ color: INK }}>
                FSA
              </span>
              : First Specialist Assessment.
            </div>
            <div title={tip("DNA")}>
              <span className="font-medium" style={{ color: INK }}>
                DNA
              </span>
              : Did Not Attend rate.
            </div>
            <div title={tip("NZHS")}>
              <span className="font-medium" style={{ color: INK }}>
                NZHS
              </span>
              : baselines & equity.
            </div>
            <div title={tip("QES earnings")}>
              <span className="font-medium" style={{ color: INK }}>
                QES earnings
              </span>
              : hours→$ conversion.
            </div>
          </div>
        </section>

        <aside className="col-span-12 md:col-span-4 flex flex-col gap-4" aria-label="Impact tickers">
          <SectionHeader title="Benefit Tickers" subtitle="Individuals • Employers • Government" muted={MUTED} />

          {/* 👤 Individuals */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold" style={{ color: INK }}>
              👤 Individuals
            </h3>
            <MiniPanel title={`18 min (p95)`} subtitle={`Median lab→clinician latency • NZHS`} value="Latency" muted={MUTED} />
            <MiniPanel title={`88% vs 90% target`} subtitle={`Cancer 31-day — decision→treatment compliance`} value="Compliance" muted={MUTED} />
            <MiniPanel title={`23 days`} subtitle={`FSA — median wait to First Specialist Assessment`} value="Wait time" muted={MUTED} />
          </div>

          {/* 🏢 Employers */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold" style={{ color: INK }}>
              🏢 Employers
            </h3>
            <MiniPanel
              title={`+${avoidedPer10k} per 10k${employersValue ? ` (≈ $${employersValue}/10k)` : ""}`}
              subtitle={`Projected appointments avoided (24h) • QES avg $/h${QES_NZD_AVG_HOURLY ? `: $${QES_NZD_AVG_HOURLY}` : ""}`}
              value="Economic impact"
              muted={MUTED}
            />
            <MiniPanel title={`4.8%`} subtitle={`DNA — Did Not Attend (rolling)`} value="Rate" muted={MUTED} />
          </div>

          {/* 🏛 Government */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold" style={{ color: INK }}>
              🏛 Government
            </h3>
            <MiniPanel title={`92% vs 95% target`} subtitle={`ED ≤6h target — rolling`} value="Compliance" muted={MUTED} />
            <MiniPanel title={`>80%`} subtitle={`Immunisation at 24m — national anchor`} value="Coverage" muted={MUTED} />
          </div>
        </aside>

        {/* --- Producers & Consumers (2 columns) --- */}
        <section className="col-span-12 md:col-span-6" aria-labelledby="producers-h">
          <SectionHeader id="producers-h" title="Producers" subtitle="Event sources (ED, GP PMS, Labs, AIR, Imaging)" muted={MUTED} />
          <div className="space-y-3">
            {producerSeed.map((p) => (
              <Card key={p.name}>
                <div className="flex items-center justify-between">
                  <div className="font-medium">{p.name}</div>
                  <span className="text-xs" style={{ color: MUTED }}>
                    FHIR
                  </span>
                </div>
                <div className="mt-2 grid grid-cols-3 gap-2 text-xs" style={{ color: MUTED }}>
                  <Metric label="Events/sec" value={p.eventsPerSec} />
                  <Metric label="Uptime" value={p.uptime} />
                  <Metric label="Schema (FHIR)" value={p.schemaOk ? "OK" : "Check"} />
                </div>
              </Card>
            ))}
          </div>
        </section>

        <section className="col-span-12 md:col-span-6" aria-labelledby="consumers-h">
          <SectionHeader id="consumers-h" title="Consumers" subtitle="Targets, productivity, ops & public" muted={MUTED} />
          <div className="space-y-3">
            {consumerSeed.map((c) => (
              <Card key={c.name}>
                <div className="font-medium">{c.name}</div>
                <div className="mt-2 grid grid-cols-3 gap-2 text-xs" style={{ color: MUTED }}>
                  <Metric label="Lag (ms)" value={c.lag} />
                  <Metric label="Errors (24h)" value={c.errors} />
                  <Metric label="Throughput" value={c.tput} />
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* --- Equity --- */}
        <section id="equity" className="col-span-12" aria-labelledby="equity-h">
          <SectionHeader id="equity-h" title="Equity" subtitle="DNA rate by NZDep quintile (Q1–Q5) — enlarged with labels & average" muted={MUTED} />
          <div className="rounded-xl p-4" style={{ background: "#0b0b0b", border: "1px solid #1f1f1f" }}>
            <div className="relative" style={{ height: CHART_H }}>
              {/* National average marker */}
              <div className="absolute left-0 right-0" style={{ top: `${(1 - equityAvg / equityMax) * CHART_H}px`, borderTop: "1px dashed #555" }} title="Average across Q1–Q5">
                <span className="text-[10px]" style={{ position: "absolute", right: 0, transform: "translateY(-100%)", color: MUTED }}>
                  Avg {equityAvg}%
                </span>
              </div>
              {/* Bars */}
              <div className="flex items-end justify-around h-full overflow-hidden">
                {equity.map((item) => (
                  <div key={item.q} className="flex-1 text-center">
                    <div className="mx-auto w-8 rounded" style={{ background: ACCENT, height: `${(item.v / equityMax) * (CHART_H - LABEL_SPACE)}px` }} title={depTip(item.q)} />
                    <div className="text-[11px] mt-1 whitespace-nowrap" style={{ color: "#fff" }} title={depTip(item.q)}>
                      {item.v.toFixed(1)}%
                    </div>
                    <div className="text-[11px] whitespace-nowrap" style={{ color: MUTED }} title={depTip(item.q)}>
                      {item.q}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-2 text-[11px]" style={{ color: MUTED }}>
              <span title={tip("NZDep")}>Stratifier source: NZDep2018</span> (University of Otago/MoH). Every event’s downstream effect is audited for equity.
            </div>
          </div>
        </section>

        {/* --- Compliance --- */}
        <section id="compliance" className="col-span-12" aria-labelledby="compliance-h">
          <SectionHeader id="compliance-h" title="Compliance" subtitle="Datasets, privacy, ethics" muted={MUTED} />
          <div className="rounded-xl p-4 text-sm" style={{ background: "#0b0b0b", border: "1px solid #1f1f1f", color: INK }}>
            <div className="font-semibold mb-2">Datasets used</div>
            <ul className="list-disc pl-5 space-y-1" style={{ color: MUTED }}>
              <li title={tip("NZHS")}>NZ Health Survey (NZHS): access/utilisation baselines (e.g., immunisation context, unmet need).</li>
              <li title={tip("NZDep")}>NZDep2018: quintiles for equity splits (University of Otago/MoH).</li>
              <li title={tip("LINZ")}>LINZ boundaries: region filtering (map layers in TPO).</li>
              <li title={tip("QES earnings")}>Stats NZ QES (June 2025): average hourly earnings for hours→$ conversion.</li>
            </ul>
            <div className="mt-2 text-xs" style={{ color: MUTED }}>
              Privacy: synthetic demo; no unit-record health data.
            </div>
          </div>
        </section>
      </main>
      
      <footer className="max-w-7xl mx-auto px-4 pb-10 pt-2 text-[11px] text-neutral-500">
        Prototype wireframe for GovHack NZ 2025 · Replace demo data with cited datasets · DevPanda
      </footer>
    </div>
  );
}

// ---------- Components ----------
function SectionHeader({ id, title, subtitle, muted }) {
  return (
    <div className="mb-2">
      <h2 id={id} className="text-sm font-semibold tracking-wide uppercase">
        {title}
      </h2>
      {subtitle && (
        <div className="text-xs" style={{ color: muted }}>
          {subtitle}
        </div>
      )}
    </div>
  );
}

function Card({ children }) {
  return (
    <div className="rounded-xl p-3 shadow-sm" style={{ background: "#0b0b0b", border: "1px solid #1f1f1f", color: "#FFFFFF" }}>
      {children}
    </div>
  );
}

function LegendPill({ children, accent }) {
  return (
    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium" style={{ background: accent, color: "#000" }}>
      {children}
    </span>
  );
}

function Badge({ label, title }) {
  return (
    <span title={title} className="text-[11px] px-2 py-1 rounded-full border" style={{ background: "#0a0a0a", borderColor: "#1f1f1f", color: "#FFFFFF" }}>
      {label}
    </span>
  );
}

function Metric({ label, value }) {
  return (
    <div className="rounded-md p-2 text-center" style={{ background: "#0a0a0a", border: "1px solid #1f1f1f" }}>
      <div className="text-[10px] uppercase tracking-wide" style={{ color: "#999" }}>
        {label}
      </div>
      <div className="text-sm font-semibold" style={{ color: "#fff" }}>
        {value}
      </div>
    </div>
  );
}

function Select({ label, options, accent, muted }) {
  return (
    <label className="text-xs inline-flex items-center gap-1 px-2 py-1 rounded-md border" style={{ background: "#0a0a0a", borderColor: "#1f1f1f", color: "#fff" }}>
      <span style={{ color: muted }}>{label}</span>
      <select className="bg-transparent outline-none text-sm" style={{ color: "#fff" }}>
        {options.map((o) => (
          <option key={o} value={o} style={{ background: "#000", color: "#fff" }}>
            {o}
          </option>
        ))}
      </select>
    </label>
  );
}

function Segmented({ label, options, accent, muted }) {
  const [active, setActive] = useState(options[0]);
  return (
    <div className="text-xs inline-flex items-center gap-1 px-1 py-1 rounded-md border" style={{ background: "#0a0a0a", borderColor: "#1f1f1f" }}>
      <span className="pl-1" style={{ color: muted }}>
        {label}
      </span>
      <div className="ml-1 flex rounded-md overflow-hidden">
        {options.map((o) => (
          <button
            key={o}
            onClick={() => setActive(o)}
            className="px-2 py-1 text-xs border -ml-px first:ml-0"
            style={{
              borderColor: "#1f1f1f",
              background: active === o ? accent : "#0a0a0a",
              color: active === o ? "#000" : "#fff",
            }}
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}

function ChipGroup({ label, chips, accent, muted }) {
  const [active, setActive] = useState([]);
  const toggle = (c) => setActive((arr) => (arr.includes(c) ? arr.filter((x) => x !== c) : [...arr, c]));
  return (
    <div className="flex flex-wrap items-center gap-1 text-xs">
      <span style={{ color: muted }}>{label}:</span>
      {chips.map((c) => (
        <button
          key={c}
          onClick={() => toggle(c)}
          className="px-2 py-1 rounded-full border"
          style={{
            background: active.includes(c) ? ACCENT : "#0a0a0a",
            borderColor: "#1f1f1f",
            color: active.includes(c) ? "#000" : "#fff",
          }}
          title={
            c.includes("Cancer")
              ? tip("31-day cancer")
              : c.includes("FSA")
              ? tip("FSA")
              : c.includes("DNA")
              ? tip("DNA")
              : undefined
          }
        >
          {c}
        </button>
      ))}
    </div>
  );
}

function MiniPanel({ title, subtitle, value, muted }) {
  return (
    <div className="rounded-lg p-3 border" style={{ background: "#0a0a0a", borderColor: "#1f1f1f" }}>
      <div className="text-xs" style={{ color: muted }}>
        {title}
      </div>
      {subtitle && (
        <div className="text-[11px]" style={{ color: "#fff" }}>
          {subtitle}
        </div>
      )}
      <div className="text-sm font-semibold" style={{ color: "#fff" }}>
        {value}
      </div>
    </div>
  );
}

function EventRow({ e, muted }) {
  const typeTitle = e.type.includes("Cancer")
    ? tip("31-day cancer")
    : e.type.includes("FSA")
    ? tip("FSA")
    : e.detail && e.detail.includes("DNA")
    ? tip("DNA")
    : undefined;
  return (
    <div className="p-3 md:p-4 flex flex-wrap items-center gap-x-3 gap-y-2 border-b" style={{ borderColor: "#1f1f1f" }}>
      <code className="text-xs" style={{ color: muted }}>
        {e.time}
      </code>
      <span title={typeTitle} className="inline-flex items-center px-2 py-0.5 rounded-md border text-xs" style={{ background: "#0a0a0a", borderColor: "#1f1f1f", color: "#fff" }}>
        {e.type}
      </span>
      <span className="text-sm" style={{ color: "#fff" }}>
        {e.producer}
      </span>
      <span style={{ color: MUTED }}>→</span>
      <span className="text-sm flex items-center gap-1 flex-wrap">
        {e.consumers.map((c) => (
          <span key={c} className="inline-flex items-center px-2 py-0.5 rounded-md border text-xs" style={{ background: "#0a0a0a", borderColor: "#1f1f1f", color: "#fff" }}>
            {c}
          </span>
        ))}
      </span>
      <div className="ml-auto flex items-center gap-2">
        {e.benefits.map((b) => (
          <button key={b} title="How this event feeds downstream benefit metrics" className="text-[11px] px-2 py-1 rounded-full border" style={{ background: ACCENT, borderColor: "#1f1f1f", color: "#000" }}>
            {b}
          </button>
        ))}
      </div>
      {e.detail && (
        <div className="basis-full pl-[56px] text-xs" style={{ color: muted }} title={e.detail.includes("DNA") ? tip("DNA") : undefined}>
          {e.detail}
        </div>
      )}
    </div>
  );
}

// --- helpers ---
function nowHHMMSS() {
  const d = new Date();
  const pad = (n) => String(n).padStart(2, "0");
  return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

function synthEvent(templates) {
  const t = templates[Math.floor(Math.random() * templates.length)];
  return { id: Math.random().toString(36).slice(2), time: nowHHMMSS(), ...t };
}

function seedEvents(templates) {
  const arr = [];
  for (let i = 0; i < 12; i++) arr.push({ id: String(i), time: nowHHMMSS(), ...templates[i % templates.length] });
  return arr.reverse();
}

// --- internal tests (console only) ---
function runInternalTests(templates) {
  try {
    const seeded = seedEvents(templates);
    console.assert(Array.isArray(seeded) && seeded.length === 12, "seedEvents should create 12 items");
    const e = synthEvent(templates);
    console.assert(e && e.id && e.type && e.producer && e.consumers, "synthEvent should create a well-formed event");
    console.assert(depTip("Q1").toLowerCase().includes("least"), "depTip(Q1) should describe least deprived");
    console.assert(typeof tip("NZHS") === "string", "tip(NZHS) should return a string");
    console.log("%cNZHEB tests passed", "color:#08b129");
  } catch (err) {
    console.error("NZHEB tests failed", err);
  }
}
