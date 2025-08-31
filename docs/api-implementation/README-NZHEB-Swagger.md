# NZHEB — New Zealand Health Event Bus (API-first)
- `NZHEB-API-Contract-and-Usage.pdf` — one-pager with API contract summary + usage
- `NZHEB-Architecture-and-Implementation.pdf` — architecture flow & implementation toolkit

## Architecture (Where events come from & who consumes them)
- **Producers**: ED systems, GP PMS, Lab LIS, Immunisation registers → POST `/nzheb/events`
- **Gateway**: Validates API key, CloudEvents, JSON Schema, enforces Zero-PHI
- **Router & Store**: Fan-out to storage + delivery channels
- **Consumers**: TPO, employer dashboards, gov analytics, audit → `GET /nzheb/events/stream` or `/nzheb/events/sse`

## High-level Toolkit
- API Gateway: Kong / Apigee / AWS API Gateway
- Auth: API Key now; JWT/mTLS later
- Schema: JSON Schema + FHIR R4
- Bus/Store: Kafka / Kinesis / Pub/Sub
- Delivery: REST poll + SSE
- Observability: OpenTelemetry + logs/metrics
- Security: WAF, IP allowlists, Zero-PHI

## Sample curl
```bash
# Publish an event
curl -X POST http://localhost:8080/nzheb/events   -H "Authorization: Bearer <API-Key>"   -H "Content-Type: application/cloudevents+json"   -d '{
    "specversion":"1.0",
    "type":"LabResultReady",
    "source":"LabSysA",
    "id":"nzheb-event-001",
    "time":"2025-08-30T09:45:00Z",
    "subject":"PatientRef:hash:9a7f3...",
    "datacontenttype":"application/json",
    "data":{
      "PatientRef":"hash:9a7f3...",
      "LabID":"LABX999",
      "Status":"Completed",
      "Result":"Positive"
    }
  }'

# Poll events
curl "http://localhost:8080/nzheb/events/stream?type=LabResultReady&limit=50"   -H "Authorization: Bearer <API-Key>"
```

---

© NZHEB prototype for GovHack NZ 2025. · DevPanda
