import React, { useState } from "react";
import NZHEBDashboardWireframe from "./nzheb_live_dashboard_wireframe";
import TPOWireframe from "./tpo_wireframe";
import EquityRealData from "./data_analysis_processed_govhack_dataset";
import NZHEBApiContract from "./nzheb_api_viewer";

const PAGES = {
  NZHEB: { label: "NZHEB Live Dashboard", Component: NZHEBDashboardWireframe },
  TPO: { label: "Targets & Productivity Orchestrator (TPO)", Component: TPOWireframe },
  Equity: { label: "Equity (Real Data)", Component: EquityRealData },
  API: { label: "NZHEB API Documentation", Component: NZHEBApiContract },
};

export default function App() {
  const [page, setPage] = useState("NZHEB");

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="sticky top-0 z-50 border-b border-neutral-800 bg-black/80 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 py-3 flex gap-2">
          {Object.entries(PAGES).map(([key, { label }]) => (
            <button
              key={key}
              onClick={() => setPage(key)}
              className={`px-3 py-2 rounded-lg text-sm font-medium ${page === key ? "bg-[#08b129] text-black" : "bg-neutral-900 text-white hover:bg-neutral-800"}`}
            >
              {label}
            </button>
          ))}
        </div>
      </header>
      <main className="min-h-screen">
        {React.createElement(PAGES[page].Component)}
      </main>
    </div>
  );
}
