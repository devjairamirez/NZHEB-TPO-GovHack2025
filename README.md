# NZHEB + TPO  
*New Zealand Health Event Bus + Targets & Productivity Orchestrator*

---

## Imagine if…
Our health system could talk to itself in real time.
A lab result comes in, a referral is made, or a vaccine is recorded — and instead of sitting in one system, that update is instantly shared with the people who need it: GPs, hospitals, government, even employers.

That’s the idea behind **NZHEB + TPO**.

- **NZHEB (New Zealand Health Event Bus)** is the backbone. It would let health systems share important updates once, and then anyone subscribed — like doctors, hospitals, or dashboards — would automatically receive the information they need.
- **TPO (Targets & Productivity Orchestrator)** sits on top, turning those updates into clear answers:  
  - Are we meeting health targets?  
  - How much time and money could we save?  
  - Are Māori, Pacific, rural, and disadvantaged communities benefiting equally?  

✅ The result: **Fewer delays, less waste, fairer outcomes — and proof that productivity gains are possible.**

---

## The Problem
Right now, health systems don’t talk easily to each other. Updates often sit in one place, waiting to be chased or copied manually.

This creates:
- ⏱️ **Delays** in care (patients waiting longer for results or treatment).  
- 💰 **Hidden costs** (avoidable ED visits, longer hospital stays, wasted time).  
- ⚖️ **Inequities** (Māori, Pacific, rural, and low-income communities left behind).  
- ❓ **Uncertainty** (decision-makers can’t see if IT investments are actually paying off).

Billions have been invested in digital health, but leaders still can’t answer:
:point_right: Are we saving money?
:point_right: Are outcomes improving?
:point_right: Are gains being shared fairly?

---

## The Solution (Prototype Idea)

### 1. **NZHEB — The Event Bus**
- A background service that connects existing health systems.
- When something happens — like a lab test result is ready — the system sends that update once.
- Anyone subscribed (GPs, hospitals, government dashboards) automatically receives the update.

**Benefits:** Faster updates, less duplication, fewer delays.
🔒 Privacy built in: **Zero-PHI** (no patient-identifiable details flow through the bus).

---

### 2. **TPO — The Orchestrator**
A dashboard that translates updates into insights everyone can understand:
- Are we meeting national health targets?
- How much time and money could be saved by reducing avoidable ED visits?
- Are Māori, Pacific, and rural communities seeing the same improvements?

**Transparency:** All datasets and formulas are open, so results can be checked and trusted.

---

## Equity Evidence
We tested the prototype concept against **six real indicators** (GovHack datasets: MoH/Te Whatu Ora):

1. **Unmet GP need due to cost**
   - Problem: People skip GP visits because they can’t afford it.
   - Impact: Delays → hospitalisations.
   - Potential benefit: 5% reduction prevents ~150,000 delays → **$45M saved annually**.

2. **Unfilled prescriptions due to cost**
   - Problem: People don’t fill prescriptions because of price.
   - Impact: Missed meds → hospital admissions.
   - Potential benefit: 5% reduction prevents ~10,000 admissions → **$30M saved**.

3. **Emergency department overuse**
   - Problem: Many ED visits are avoidable.
   - Impact: Wasted time, higher costs, staff pressure.
   - Potential benefit: 10% reduction = **$100M saved** (200,000 fewer avoidable visits).

4. **Smoking prevalence**
   - Problem: High smoking rates drive long-term health costs.
   - Potential benefit: 2% national reduction = **$200M saved annually**.

5. **Hazardous drinking**
   - Problem: Alcohol harm creates high hospital and social costs.
   - Potential benefit: 5% reduction = **$40M saved annually**.

6. **Psychological distress**
   - Problem: High distress impacts mental health + workforce productivity.
   - Potential benefit: 3% reduction = **$150M productivity gain annually**.

👉 These are **real numbers from real datasets**. Even small improvements make a huge difference.

---

## Cost Savings & Methodology
All calculations use **official data + NZ cost references**.

- **ED visits:** Avoidable visits × $500 avg. cost per visit (NZ Treasury/MoH).
- **Unfilled prescriptions:** Missed scripts × 5% hospitalisation × $3–5k per admission.
- **Smoking:** $1.9B annual cost × % reduction.
- **Hazardous drinking:** $7.8B annual cost × % reduction (healthcare share).
- **Psychological distress:** GDP productivity loss (2–4% of GDP) × % reduction.
- **Unmet GP visits:** Prevented delays × $300 avoided ED cost.

✅ Transparent and credible: anyone can follow the formulas, check the datasets, and verify.

---

## Implementation Pathway (Prototype Vision)
1. **Start small:**
   - Kafka (event router), Kong/Apigee (API gateway), JSON Schema (validation).
2. **Producers:** GPs, labs, immunisation registers publishing updates.
3. **Consumers:** TPO dashboards, Ministry dashboards, employer workforce analytics.
4. **Safeguards:** API keys, encrypted channels, Zero-PHI.
5. **Scale up:** From pilot to national backbone.

---

## Final Summary
Our prototype, **NZHEB + TPO**, shows how a simple backbone could:
- 🔗 Connect systems in real time
- 💰 Turn events into cost/time savings
- ⚖️ Make inequities visible
- 🚑 Deliver fairer, faster outcomes for all New Zealanders

⚡ **In short: A prototype vision for a connected, measurable, and equitable health system.**ogs or raise an issue in the repository.

## License
See `LICENSE` for details.
