import sys, json, csv, time, os
from datetime import datetime

LOG = os.path.join(os.path.dirname(__file__), "logs", "audit_log_example.csv")
os.makedirs(os.path.dirname(LOG), exist_ok=True)

def log(action, status="ok", event_id="evt-123456", producer="nzheb", consumer="-"):
    ts = datetime.utcnow().isoformat(timespec='seconds') + "Z"
    with open(LOG, "a", newline="") as f:
        w = csv.writer(f)
        w.writerow([ts, event_id, producer, consumer, action, status])

def main(path):
    with open(path) as f:
        evt = json.load(f)
    event_id = evt.get("id", "evt-unknown")
    # Simulate publish and fan-out
    log("publish", event_id=event_id, producer=evt.get("source","lab-system"), consumer="nzheb")
    for cons in ["ehr-gp-123","patient-portal-01","tpo-analytics"]:
        time.sleep(0.1)
        log("deliver", event_id=event_id, producer="nzheb", consumer=cons)
    # Simulate KPI compute
    time.sleep(0.2)
    log("compute_kpi", event_id=event_id, producer="tpo-analytics", consumer="tpo-analytics")
    print("Simulated publish -> deliver -> KPI compute. Check logs at:", LOG)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python scripts/simulate_bus.py events/sample_lab_result_ready.json")
        sys.exit(1)
    main(sys.argv[1])
