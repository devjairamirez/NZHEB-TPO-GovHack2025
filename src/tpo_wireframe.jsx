import React, { useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import {
  Users,
  Building2,
  Landmark,
  Scale,
  Calculator,
  Search,
  Filter,
  Download,
  LayoutDashboard,
} from "lucide-react";

// Demo data
const months = ["Apr", "May", "Jun", "Jul", "Aug", "Sep"];
const latencySeries = months.map((m, i) => ({ month: m, p95: [34, 30, 27, 22, 19, 18][i] }));
const decisionToTreatment = months.map((m, i) => ({ month: m, median: [17, 16, 14, 13, 12, 12][i] }));
const immunisation24mByEth = [
  { group: "Maori", pct: 80 },
  { group: "Pacific", pct: 82 },
  { group: "Asian", pct: 92 },
  { group: "European/Other", pct: 89 },
  { group: "National", pct: 86 },
];
// Demo data for Business
const employerSickDays = [
  { name: "Q1", before: 5.1, after: 4.6 },
  { name: "Q2", before: 5.0, after: 4.3 },
  { name: "Q3", before: 5.3, after: 4.2 },
  { name: "Q4", before: 5.2, after: 4.1 },
];
const employerPreEmployment = [
  { step: "Check Requested", days: 2.5 },
  { step: "GP Clearance", days: 1.9 },
  { step: "Vacc Evidence", days: 1.5 },
  { step: "Ready to Start", days: 0.5 },
];
// Demo data for Government
const govWaitTargets = months.map((m, i) => ({ month: m, ed_within6h: [73, 75, 76, 77, 79, 81][i] }));
const waitlistByPriority = [
  { prio: "P1", count: 1100 },
  { prio: "P2", count: 4600 },
  { prio: "P3", count: 9800 },
  { prio: "P4", count: 12200 },
];

// Helpers
function Section({ title, subtitle, children }) {
  return (
    <section className="space-y-3">
      <h2 className="text-xl font-semibold tracking-tight">{title}</h2>
      {subtitle && <p className="text-sm text-neutral-400 max-w-3xl">{subtitle}</p>}
      {children}
    </section>
  );
}
function Kpi({ label, value }) {
  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4">
      <div className="text-xs text-neutral-400 mb-1">{label}</div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  );
}
function Chip({ children }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-neutral-700 bg-neutral-800 px-2 py-1 text-[11px] text-neutral-300">
      {children}
    </span>
  );
}

function Toolbar() {
  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-neutral-400" />
        <input className="w-64 rounded-xl bg-neutral-900/70 pl-8 pr-3 py-2 text-sm border border-neutral-800" placeholder="Search metrics" />
      </div>
      <button className="rounded-xl bg-neutral-800/80 px-3 py-2 text-sm border border-neutral-700 hover:bg-neutral-700/60 inline-flex items-center gap-2">
        <Filter className="h-4 w-4" /> Filters
      </button>
      <button className="rounded-xl bg-sky-600/90 px-3 py-2 text-sm hover:bg-sky-500 inline-flex items-center gap-2">
        <Download className="h-4 w-4" /> Export
      </button>
    </div>
  );
}

function CardShell({ title, children }) {
  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4">
      <div className="text-sm font-medium text-neutral-200 mb-2">{title}</div>
      {children}
    </div>
  );
}

function NavItem({ active, icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left rounded-xl px-3 py-2 border transition ${
        active
          ? "bg-neutral-900 border-neutral-700 text-neutral-100"
          : "bg-neutral-950 border-neutral-900 text-neutral-300 hover:border-neutral-700"
      }`}
    >
      <div className="flex items-center gap-2">
        <span className="opacity-90">{icon}</span>
        <span className="text-sm">{label}</span>
      </div>
    </button>
  );
}

// Tabs
function IndividualsTab() {
  return (
    <div className="space-y-6">
      <Section title="KPIs for Individuals">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Kpi label="Lab→Clinician latency (p95)" value="18 min" />
          <Kpi label="Decision→Treatment (oncology median)" value="12 days" />
          <Kpi label="Immunisation (24m) coverage" value="86%" />
        </div>
      </Section>
      <Section title="Latency trend">
        <CardShell title="Lab→Clinician p95 (minutes)">
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={latencySeries}>
              <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
              <XAxis dataKey="month" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip />
              <Line type="monotone" dataKey="p95" stroke="#60a5fa" />
            </LineChart>
          </ResponsiveContainer>
        </CardShell>
      </Section>
      <Section title="Equity lens">
        <CardShell title="Immunisation 24m by ethnicity">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={immunisation24mByEth}>
              <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
              <XAxis dataKey="group" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip />
              <Bar dataKey="pct" fill="#34d399" />
            </BarChart>
          </ResponsiveContainer>
        </CardShell>
      </Section>
    </div>
  );
}

function BusinessTab() {
  return (
    <div className="space-y-6">
      <Section title="KPIs for Businesses / Employers" subtitle="Quantify productivity benefits tied to workforce health and faster return-to-work.">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Kpi label="Annual sick days per FTE" value="4.3 days" />
          <Kpi label="Time-to-clear pre-employment checks" value="1.5 days" />
          <Kpi label="Return-to-work median" value="6 days" />
        </div>
      </Section>

      <Section title="Sick days before vs after adoption" subtitle="Illustrative change following event-driven automation.">
        <CardShell title="Quarterly sick days per FTE">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={employerSickDays} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
              <XAxis dataKey="name" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip contentStyle={{ background: "#0a0a0a", border: "1px solid #262626" }} />
              <Legend />
              <Bar dataKey="before" name="Before" fill="#60a5fa" radius={[6,6,0,0]} />
              <Bar dataKey="after" name="After" fill="#34d399" radius={[6,6,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardShell>
      </Section>

      <Section title="Pre-employment health checks (time in days)" subtitle="Event-driven document fetch & verification trims delays.">
        <CardShell title="Steps duration">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={employerPreEmployment} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
              <XAxis dataKey="step" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip contentStyle={{ background: "#0a0a0a", border: "1px solid #262626" }} />
              <Legend />
              <Bar dataKey="days" name="Days" fill="#f59e0b" radius={[6,6,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardShell>
      </Section>
    </div>
  );
}

function GovernmentTab() {
  return (
    <div className="space-y-6">
      <Section title="KPIs for Government" subtitle="System-level targets and transparent, auditable improvements.">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Kpi label="ED within 6h" value="81%" />
          <Kpi label="Outpatient waitlist (P1–P4)" value="27.7k" />
          <Kpi label="Coverage at 24m (national)" value="86%" />
        </div>
      </Section>

      <Section title="ED timeliness" subtitle="Percentage of ED presentations completed within 6 hours.">
        <CardShell title="ED within 6h (%)">
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={govWaitTargets} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
              <XAxis dataKey="month" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip contentStyle={{ background: "#0a0a0a", border: "1px solid #262626" }} />
              <Legend />
              <ReferenceLine y={95} stroke="#34d399" strokeDasharray="4 4" label={{ value: "Target 95%", fill: "#34d399", position: "top" }} />
              <Line type="monotone" dataKey="ed_within6h" stroke="#60a5fa" strokeWidth={2} dot={false} name="%" />
            </LineChart>
          </ResponsiveContainer>
        </CardShell>
      </Section>

      <Section title="Waitlist by clinical priority" subtitle="Snapshot distribution by priority class (illustrative).">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CardShell title="Priority mix (pie)">
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Tooltip contentStyle={{ background: "#ffffff", border: "1px solid #262626" }} />
                <Legend />
                <Pie data={waitlistByPriority} dataKey="count" nameKey="prio" innerRadius={50} outerRadius={80} paddingAngle={3}>
                  {waitlistByPriority.map((_, i) => (
                    <Cell key={i} fill={["#60a5fa","#34d399","#f59e0b","#f472b6"][i % 4]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </CardShell>
          <CardShell title="Counts (bar)">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={waitlistByPriority} margin={{ top: 8, right: 16, left: 0, bottom: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#262626" />
                <XAxis dataKey="prio" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip contentStyle={{ background: "#0a0a0a", border: "1px solid #262626" }} />
                <Legend />
                <Bar dataKey="count" name="Patients" fill="#a78bfa" radius={[6,6,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardShell>
        </div>
      </Section>
    </div>
  );
}

function TransparencyTab() {
  return (
    <div className="space-y-6">
      <Section title="Receipts & Formulas" subtitle="Everything is replicable: show inputs, formulas, and dataset anchors for auditors and the public.">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <FormulaCard
            title="ROI (%)"
            formula={`roi_pct = (productivity_gain - implementation_cost) ÷ implementation_cost × 100`}
            inputs={["productivity_gain", "implementation_cost"]}
            notes="Use productivity_gain from receipts; implementation_cost from project ledger."
          />
          <FormulaCard
            title="Time saved (hours)"
            formula={`hours = (events × avg_minutes_saved) ÷ 60`}
            inputs={["events", "avg_minutes_saved"]}
            notes="Events from NZHEB topics; minutes_saved from measured deltas vs baseline."
          />
          <FormulaCard
            title="ED within 6h (%)"
            formula={`ed_≤6h = completed_within_6h ÷ total_ed_presentations × 100`}
            inputs={["completed_within_6h", "total_ed_presentations"]}
            notes="Totals from EDStatusChanged events + hospital reporting feeds."
          />
        </div>
      </Section>

      <Section title="Dataset anchors" subtitle="Where each metric pulls its ground truth.">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <AnchorList
            label="Individuals"
            items={[
              "Lab→Clinician latency: NZHEB LabResultReady + clinician inbox timestamps",
              "Immunisation 24m: MoH published data; NZHEB ImmunisationUpdated",
              "Oncology D→T: MoH 31-day target, oncology pathway events",
            ]}
          />
          <AnchorList
            label="System & employers"
            items={[
              "Sick days: payroll/HRIS aggregates (opt-in) + NZHEB medical certificates",
              "Pre-employment checks: NZHEB verification events",
              "ED within 6h: hospital operational feeds",
            ]}
          />
        </div>
      </Section>

      <Section title="Receipt (example)" subtitle="Each chart and KPI has a JSON receipt: inputs, transformations, outputs, and hash.">
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4 text-sm">
          <pre className="whitespace-pre-wrap leading-relaxed text-neutral-200">{`{
  "metric": "lab_to_clinician_p95_minutes",
  "period": "2025-06-01..2025-08-31",
  "inputs": {
    "events": "nzheb.topic.lab.result.ready",
    "count": 48219,
    "avg_minutes_saved": 9.2,
    "source": ["MoH", "Hospital A/B"],
    "hash": "sha256:…"
  },
  "formula": "time_saved_hours = events × avg_minutes_saved ÷ 60",
  "output": { "value": 7393.9, "unit": "hours" }
}`}</pre>
          <div className="mt-3 flex items-center gap-2">
            <button className="rounded-xl bg-neutral-800/80 px-3 py-2 text-xs border border-neutral-700 hover:bg-neutral-700/60 inline-flex items-center gap-2"><Download className="h-4 w-4"/>Download JSON</button>
            <button className="rounded-xl bg-neutral-800/80 px-3 py-2 text-xs border border-neutral-700 hover:bg-neutral-700/60 inline-flex items-center gap-2"><Download className="h-4 w-4"/>Download CSV</button>
          </div>
        </div>
      </Section>
    </div>
  );
}

function FormulaCard({ title, formula, inputs, notes }) {
  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4">
      <div className="text-sm font-medium mb-2">{title}</div>
      <pre className="text-xs bg-neutral-950/60 border border-neutral-800 rounded-xl p-3 overflow-auto text-neutral-300">{formula}</pre>
      <div className="mt-2 text-[11px] text-neutral-400">Inputs: {inputs.join(", ")}</div>
      {notes && <div className="mt-1 text-[11px] text-neutral-400">{notes}</div>}
    </div>
  );
}

function AnchorList({ label, items }) {
  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4">
      <div className="text-sm font-medium mb-2">{label}</div>
      <ul className="list-disc list-inside text-sm text-neutral-300 space-y-1">
        {items.map((t, i) => (
          <li key={i}>{t}</li>
        ))}
      </ul>
    </div>
  );
}

function EthicsTab() {
  return (
    <div className="space-y-6">
      <Section title="Ethics & Inclusivity" subtitle="Built-in safeguards aligned with NZ context: Zero-PHI demo, opt-in sharing, and Maori data governance.">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <GuardCard title="Zero‑PHI (demo layer)" desc="No persistent personally identifiable health data stored in the demo." status="Passing" />
          <GuardCard title="Maori data sovereignty" desc="Respect governance principles; enable iwi/hapu-led controls on access and reuse." status="Planned" />
          <GuardCard title="Auditability" desc="Every KPI has a receipt, formula, inputs, and a cryptographic hash." status="Passing" />
        </div>
      </Section>
      <Section title="Risk register (excerpt)" subtitle="Common concerns and how we address them.">
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-neutral-900/70 text-neutral-300">
              <tr>
                <th className="text-left p-3">Risk / Question</th>
                <th className="text-left p-3">Mitigation</th>
                <th className="text-left p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800">
              {[
                { q: "Is this centralised surveillance?", m: "Event bus only routes technical events; analytics happen on de-identified, aggregated views with governance controls.", s: "Mitigated" },
                { q: "Hard for small practices to adopt?", m: "FHIR + CloudEvents adapters, low-code connectors, vendor toolkits, and test sandboxes.", s: "Planned" },
                { q: "Trust in numbers?", m: "Receipts + formulas + dataset anchors; public verification endpoint.", s: "Mitigated" },
              ].map((r, i) => (
                <tr key={i} className="align-top">
                  <td className="p-3 text-neutral-200">{r.q}</td>
                  <td className="p-3 text-neutral-300">{r.m}</td>
                  <td className="p-3"><StatusPill value={r.s} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>
    </div>
  );
}

function GuardCard({ title, desc, status }) {
  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4">
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium">{title}</div>
        <StatusPill value={status} />
      </div>
      <p className="text-sm text-neutral-300 mt-1">{desc}</p>
    </div>
  );
}

function StatusPill({ value }) {
  const map = {
    Passing: "bg-emerald-500/15 text-emerald-300 border-emerald-600/30",
    Mitigated: "bg-sky-500/15 text-sky-300 border-sky-600/30",
    Planned: "bg-amber-500/15 text-amber-300 border-amber-600/30",
  };
  return (
    <span className={`text-xs px-2 py-1 rounded-full border ${map[value] || "bg-neutral-800 text-neutral-300 border-neutral-700"}`}>
      {value}
    </span>
  );
}

export default function TPOWireframe() {
  const [tab, setTab] = useState("individuals");
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <header className="sticky top-0 z-20 backdrop-blur bg-neutral-950/80 border-b border-neutral-900">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <LayoutDashboard className="h-5 w-5 text-sky-400" />
            <div>
              <h1 className="text-lg font-semibold tracking-tight">Targets & Productivity Orchestrator</h1>
            </div>
            <div className="hidden md:flex items-center gap-2 ml-3">
              <Badge label="FHIR R4" title="{FHIR}" />
              <Badge label="CloudEvents 1.0" title="{CloudEvents}" />
              <Badge label="Zero-PHI demo" title="{Synthetic events only; no personal health information.}" />
            </div>
          </div>
          <Toolbar />
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-12 gap-5">
        {/* Sidebar with visible tabs */}
        <aside className="col-span-12 md:col-span-3 lg:col-span-2 space-y-2">
          <NavItem active={tab === "individuals"} icon={<Users className="h-4 w-4" />} label="Individuals" onClick={() => setTab("individuals")} />
          <NavItem active={tab === "business"} icon={<Building2 className="h-4 w-4" />} label="Businesses / Employers" onClick={() => setTab("business")} />
          <NavItem active={tab === "government"} icon={<Landmark className="h-4 w-4" />} label="Government" onClick={() => setTab("government")} />
          <NavItem active={tab === "transparency"} icon={<Calculator className="h-4 w-4" />} label="Transparency (receipts & formulas)" onClick={() => setTab("transparency")} />
          <NavItem active={tab === "ethics"} icon={<Scale className="h-4 w-4" />} label="Ethics & Inclusivity" onClick={() => setTab("ethics")} />
        </aside>

        {/* Main content area */}
        <main className="col-span-12 md:col-span-9 lg:col-span-10 space-y-6">
          {tab === "individuals" && <IndividualsTab />}
          {tab === "business" && <BusinessTab />}
          {tab === "government" && <GovernmentTab />}
          {tab === "transparency" && <TransparencyTab />}
          {tab === "ethics" && <EthicsTab />}
        </main>
      </div>

      <footer className="max-w-7xl mx-auto px-4 pb-10 pt-2 text-[11px] text-neutral-500">
        Prototype wireframe for GovHack NZ 2025 · Replace demo data with cited datasets · DevPanda
      </footer>
    </div>
  );
}

// --- Opt-in test cases (not executed by default) ---
// Call window.__tpoWireframeTests?.() in the browser console to run.
export function __tpoWireframeTests() {
  const results = [];
  results.push({ name: "components exist", pass: [IndividualsTab, BusinessTab, GovernmentTab, TransparencyTab, EthicsTab].every((c) => typeof c === "function") });
  results.push({ name: "latencySeries length matches months", pass: latencySeries.length === months.length });
  results.push({ name: "immunisation data numeric", pass: immunisation24mByEth.every((d) => typeof d.pct === "number") });
  results.push({ name: "waitlist counts numeric", pass: waitlistByPriority.every((d) => typeof d.count === "number") });
  return results;
}

function Badge({ label, title }) {
  return (
    <span title={title} className="text-[11px] px-2 py-1 rounded-full border" style={{ background: "#0a0a0a", borderColor: "#1f1f1f", color: "#FFFFFF", textAlign: "center" }}>
      {label}
    </span>
  );
}