import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine
} from "recharts";

// ---- Palette ----
const BG = "#000";
const INK = "#fff";
const MUTED = "#9aa0a6";
const ACCENT = "#08b129";

// ---- REAL DATA (from your uploaded Te Whatu Ora / MoH publications) ----
// Years limited to 2018/19–2022/23 where available to keep comparisons tidy
// Māori-first ordering preserved in legend and drawing order
const unmetGpCost = [
  { year: "2018/19", Maori: 21.3, Pacific: 19.4, EuropeanOther: 12.8, Asian: 10.9 },
  { year: "2019/20", Maori: 20.5, Pacific: 16.1, EuropeanOther: 13.3, Asian: 11.2 },
  { year: "2020/21", Maori: 15.7, Pacific: 15.2, EuropeanOther: 9.7,  Asian: 8.7  },
  { year: "2021/22", Maori: 14.9, Pacific: 11.0, EuropeanOther: 11.1, Asian: 10.8 },
  { year: "2022/23", Maori: 16.9, Pacific: 17.6, EuropeanOther: 12.4, Asian: 10.4 },
];

const unfilledRxCost = [
  { year: "2018/19", Maori: 11.4, Pacific: 13.8, EuropeanOther: 4.2, Asian: 3.5 },
  { year: "2019/20", Maori: 12.6, Pacific: 13.6, EuropeanOther: 4.2, Asian: 2.8 },
  { year: "2020/21", Maori: 7.2,  Pacific: 6.6,  EuropeanOther: 2.7, Asian: 1.7 },
  { year: "2021/22", Maori: 8.8,  Pacific: 3.9,  EuropeanOther: 2.9, Asian: 2.6 },
  { year: "2022/23", Maori: 7.6,  Pacific: 8.5,  EuropeanOther: 3.3, Asian: 2.6 },
];

const edVisit = [
  { year: "2018/19", Maori: 21.1, Pacific: 22.3, EuropeanOther: 15.0, Asian: 9.6 },
  { year: "2019/20", Maori: 21.4, Pacific: 20.5, EuropeanOther: 15.0, Asian: 8.7 },
  { year: "2020/21", Maori: 19.7, Pacific: 14.8, EuropeanOther: 14.8, Asian: 9.5 },
  { year: "2021/22", Maori: 21.8, Pacific: 17.4, EuropeanOther: 17.1, Asian: 12.9 },
  { year: "2022/23", Maori: 21.1, Pacific: 20.1, EuropeanOther: 18.5, Asian: 12.7 },
];

const dailySmokers = [
  { year: "2018/19", Maori: 30.4, Pacific: 21.6, EuropeanOther: 11.0, Asian: 7.1 },
  { year: "2019/20", Maori: 28.6, Pacific: 18.4, EuropeanOther: 10.2, Asian: 7.4 },
  { year: "2020/21", Maori: 22.3, Pacific: 16.4, EuropeanOther: 8.3,  Asian: 3.9 },
  { year: "2021/22", Maori: 21.3, Pacific: 18.1, EuropeanOther: 7.9,  Asian: 2.5 },
  { year: "2022/23", Maori: 17.1, Pacific: 6.4,  EuropeanOther: 6.1,  Asian: 3.3 },
];

// NEW (added per request): additional equity indicators from HIR 2023
const hazardousDrinking = [
  { year: "2018/19", Maori: 33.0, Pacific: 23.3, EuropeanOther: 21.6, Asian: 6.3 },
  { year: "2019/20", Maori: 36.4, Pacific: 24.5, EuropeanOther: 22.6, Asian: 5.5 },
  { year: "2020/21", Maori: 33.2, Pacific: 26.5, EuropeanOther: 21.1, Asian: 5.7 },
  { year: "2021/22", Maori: 33.4, Pacific: 21.5, EuropeanOther: 20.0, Asian: 6.2 },
  { year: "2022/23", Maori: 25.1, Pacific: 21.5, EuropeanOther: 16.9, Asian: 4.9 },
];

const psychologicalDistress = [
  { year: "2018/19", Maori: 9.5, Pacific: 12.9, EuropeanOther: 5.6, Asian: 4.6 },
  { year: "2019/20", Maori: 9.6, Pacific: 10.1, EuropeanOther: 5.7, Asian: 5.5 },
  { year: "2020/21", Maori: 10.5, Pacific: 11.2, EuropeanOther: 6.4, Asian: 6.0 },
  { year: "2021/22", Maori: 11.4, Pacific: 11.8, EuropeanOther: 7.3, Asian: 5.5 },
  { year: "2022/23", Maori: 13.8, Pacific: 11.2, EuropeanOther: 8.6, Asian: 5.6 },
];

// ---- Helpers ----
const seriesOrder = [
  { key: "Maori", label: "Māori" },
  { key: "Pacific", label: "Pacific" },
  { key: "EuropeanOther", label: "European/Other" },
  { key: "Asian", label: "Asian" },
];

function domainMax(rows){
  let m = 0;
  rows.forEach(r=> seriesOrder.forEach(s=> { const v = r[s.key]; if(typeof v==='number' && v>m) m=v; }));
  return Math.ceil((m+1)/5)*5; // round up to nearest 5
}

function GovHackBadge(){
  return <span className="ml-2 px-2 py-0.5 rounded-full text-[10px] border" style={{borderColor:'#1f1f1f', color:INK}}>GovHack</span>;
}

function MetaLine({ about, processedFrom, datasetHref, datasetId }) {
  return (
    <div className="text-[11px] mt-2 flex flex-wrap items-center gap-3" style={{color:MUTED}}>
      <span><strong>About:</strong> {about}</span>
      <span>• <strong>Processed:</strong> {processedFrom}</span>
      <span>• <strong>GovHack:</strong> <a href={datasetHref} target="_blank" rel="noreferrer">{datasetId}</a></span>
      <GovHackBadge />
    </div>
  );
}

function ChartBlock({title, subtitle, data, target, meta}){
  const ymax = domainMax(data);
  return (
    <div className="rounded-xl p-4" style={{background:'#0b0b0b', border:'1px solid #1f1f1f', color:INK}}>
      <div className="mb-2">
        <div className="text-sm font-semibold">{title}</div>
        {subtitle && <div className="text-xs" style={{color:MUTED}}>{subtitle}</div>}
        <div className="text-[11px] mt-1" style={{color:MUTED}}>
          Comparison area graph — Māori (first), Pacific, European/Other, Asian (percentage of adults)
        </div>
      </div>
      <div style={{width:'100%', height:260}}>
        <ResponsiveContainer>
          <AreaChart data={data} margin={{left:8,right:8,top:10,bottom:0}}>
            <XAxis dataKey="year" stroke={MUTED} tick={{fontSize:12}}/>
            <YAxis domain={[0, ymax]} stroke={MUTED} tick={{fontSize:12}}/>
            <Tooltip contentStyle={{background:'#111', border:'1px solid #222', color:INK}}/>
            {target!=null && (
              <ReferenceLine y={target} stroke="#666" strokeDasharray="4 4" label={{value:`Target ${target}%`, fill:MUTED, fontSize:11, position:'top'}} />
            )}
            {seriesOrder.map((s, idx) => (
              <Area key={s.key} type="monotone" dataKey={s.key} name={s.label} fillOpacity={0.2 + idx*0.15} strokeWidth={2} />
            ))}
            <Legend verticalAlign="bottom" height={24} wrapperStyle={{fontSize:12}}/>
          </AreaChart>
        </ResponsiveContainer>
      </div>
      {meta}
    </div>
  );
}

export default function EquityRealData(){
  return (
    <div className="min-h-screen" style={{background:BG, color:INK}}>
      <header className="border-b" style={{borderColor:'#1f1f1f', background:'#0a0a0a'}}>
        <div className="mx-auto max-w-[1200px] px-4 py-3">
          <h1 className="text-lg font-semibold">Equity – Comparison Area Graphs (Real NZHS / HIR data)</h1>
          <div className="text-xs" style={{color:MUTED}}>2018/19–2022/23 • Māori-first ordering • Percentages as published</div>
        </div>
      </header>

      <main className="mx-auto max-w-[1200px] px-4 py-6 grid grid-cols-12 gap-6">
        {/* 1 */}
        <section className="col-span-12 lg:col-span-6">
          <ChartBlock
            title="Unmet need for GP due to cost (adults)"
            subtitle="NZ Health Survey"
            data={unmetGpCost}
            meta={<MetaLine
              about="Adults reporting they could not see a GP due to cost (%, past 12 months)"
              processedFrom="Health and Independence Report 2023 – indicator tables.xlsx (sheet: UnmetGP) → cleaned CSV: unmet_gp_cost_ethnicity_adults.csv"
              datasetHref="https://hackerspace.govhack.org/data_sets/1789"
              datasetId="#1789"
            />}
          />
        </section>

        {/* 2 */}
        <section className="col-span-12 lg:col-span-6">
          <ChartBlock
            title="Unfilled prescription due to cost (adults)"
            subtitle="NZ Health Survey"
            data={unfilledRxCost}
            meta={<MetaLine
              about="Adults who did not collect a prescription due to cost (%, past 12 months)"
              processedFrom="Health and Independence Report 2023 – indicator tables.xlsx (sheet: UnfilledPresc) → cleaned CSV: unfilled_prescription_cost_ethnicity_adults.csv"
              datasetHref="https://hackerspace.govhack.org/data_sets/1789"
              datasetId="#1789"
            />}
          />
        </section>

        {/* 3 */}
        <section className="col-span-12 lg:col-span-6">
          <ChartBlock
            title="ED visit in past 12 months (adults)"
            subtitle="NZ Health Survey"
            data={edVisit}
            meta={<MetaLine
              about="Adults with at least one ED visit in the past 12 months (prevalence %)"
              processedFrom="nz-health-survey-2023-24-time-series.csv → cleaned CSV: ed_visit_ethnicity_adults.csv"
              datasetHref="https://hackerspace.govhack.org/data_sets/1856"
              datasetId="#1856"
            />}
          />
        </section>

        {/* 4 */}
        <section className="col-span-12 lg:col-span-6">
          <ChartBlock
            title="Daily smokers (adults)"
            subtitle="NZ Health Survey"
            data={dailySmokers}
            meta={<MetaLine
              about="Adults who smoke daily (prevalence %)"
              processedFrom="Health and Independence Report 2023 – indicator tables.xlsx (sheet: DailySmoker) → cleaned CSV: daily_smokers_ethnicity_adults.csv"
              datasetHref="https://hackerspace.govhack.org/data_sets/1789"
              datasetId="#1789"
            />}
          />
        </section>

        {/* 5 */}
        <section className="col-span-12 lg:col-span-6">
          <ChartBlock
            title="Hazardous drinkers (adults)"
            subtitle="Health and Independence Report 2023"
            data={hazardousDrinking}
            meta={<MetaLine
              about="Adults classified as hazardous drinkers (AUDIT thresholds, %)"
              processedFrom="Health and Independence Report 2023 – indicator tables.xlsx (sheet: HazDrinker) → cleaned CSV: hazardous_drinking_adults_ethnicity.csv"
              datasetHref="https://hackerspace.govhack.org/data_sets/1882"
              datasetId="#1882"
            />}
          />
        </section>

        {/* 6 */}
        <section className="col-span-12 lg:col-span-6">
          <ChartBlock
            title="Psychological distress (adults)"
            subtitle="Health and Independence Report 2023"
            data={psychologicalDistress}
            meta={<MetaLine
              about="Adults with high or very high psychological distress (K10, %)"
              processedFrom="Health and Independence Report 2023 – indicator tables.xlsx (sheet: PsycDistress) → cleaned CSV: psychological_distress_adults_ethnicity.csv"
              datasetHref="https://hackerspace.govhack.org/data_sets/1882"
              datasetId="#1882"
            />}
          />
        </section>
      </main>

      <footer className="border-t text-center text-xs py-3" style={{borderColor:'#1f1f1f', color:MUTED}}>
        Values shown are the published NZHS / HIR percentages for the specified years; no synthetic values were used. · DevPanda
      </footer>
    </div>
  );
}
