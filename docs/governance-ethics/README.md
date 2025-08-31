
# Governance & Ethics Checklist (PoC Proofs)

| Area | What We Do | PoC Proof Artifact |
|---|---|---|
| Zero PHI | No personal identifiers on the bus | `events/sample_lab_result_ready.json` (check fields) |
| Privacy & Security | TLS in transit, OAuth2 scopes per consumer (design) | `openapi/nzheb-openapi.yaml` (scope placeholders) |
| Maori Data Sovereignty | Governance role and equity-first defaults | `consumers/tpo_receipt_example.json` (equity example), README notes |
| Transparency | Every KPI has a "receipt" | `consumers/tpo_receipt_example.json` |
| Auditability | Append-only logs for events & computations | `scripts/logs/audit_log_example.csv` |
| Ethics in Design | Threshold alerts on inequity gaps | TPO receipt shows gap; design note in README |

## Quick Demo (2 minutes)
1. Install Python 3.10+.
2. Run the simulator:
   ```bash
   python scripts/simulate_bus.py events/sample_lab_result_ready.json
   ```
3. Observe console output and **logs/audit_log_example.csv** updating.
4. Open **consumers/tpo_receipt_example.json** to see the KPI "receipt".

## Contents
- `events/sample_lab_result_ready.json` — de-identified event (CloudEvents + FHIR)
- `consumers/tpo_receipt_example.json` — transparency record (formula + inputs + outputs)
- `scripts/logs/audit_log_example.csv` — access and processing log
- `openapi/nzheb_openapi.yaml` — minimal API contract (stub)
- `governance/Governance_and_Ethics_Checklist.md` — checklist with PoC artifacts
- `scripts/simulate_bus.py` — local simulator

## Notes
- All identifiers are mock and de-identified.
