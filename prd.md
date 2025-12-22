# 📄 PRODUCT REQUIREMENTS DOCUMENT (PRD)

## Product Name (Working)

**PolicyLens India**
*(Name is placeholder — we can brand later)*

---

## 1. 🎯 Product Vision

To build a **neutral, citizen-first policy intelligence platform** for India that:

* Explains policies in simple language
* Shows **pros & cons transparently**
* Tells users **which policies/schemes apply to them**
* Explains **how to avail benefits step-by-step**

The product must be:

* Fast
* Easy to understand
* Trustworthy
* Mobile-friendly

---

## 2. 👥 Target Users (MVP)

Primary (Phase 1):

* College students
* Young salaried professionals
* First-time taxpayers

Secondary (Later):

* MSMEs
* Gig workers
* Rural beneficiaries

---

## 3. 🧩 MVP Scope (What We Are Building First)

### In Scope (MVP)

* Policy & scheme explainer pages
* Eligibility questionnaire
* Personalized scheme results
* “How to avail” guides
* Search & filters

### Out of Scope (For Now)

* User discussions
* Comments
* Social feeds
* Political opinions
* State-level schemes (Phase 2+)

---

## 4. 🏗️ Tech Stack (Simple & Fast)

### Frontend (MVP)

* **HTML5**
* **CSS3**

  * Flexbox / Grid
  * No frameworks initially
* **Vanilla JavaScript**

  * DOM manipulation
  * Fetch API

Why?

* Zero learning curve
* Extremely fast to build
* Easy to deploy anywhere

---

### Backend (Lightweight)

Choose **one**:

**Option A (Recommended for speed):**

* **Node.js**
* **Express.js**
* JSON-based APIs

**Option B (Even simpler):**

* Python + Flask

---

### Database

* **SQLite** (MVP)

  * Simple
  * File-based
  * No infra headaches

Upgrade later to PostgreSQL.

---

### AI / Logic Layer (Phase 1 = minimal AI)

* Start **rule-based**
* AI only for:

  * Policy summarisation
  * Pros/cons generation (offline or admin-side)

No real-time AI calls in MVP frontend.

---

### Hosting

* Frontend: Netlify / GitHub Pages
* Backend: Render / Railway / Fly.io

---

## 5. 🗂️ Core Features & Requirements

---

## 5.1 Policy Explorer

### Description

A page listing all policies & schemes available on the platform.

### Functional Requirements

* List view of policies
* Each policy card shows:

  * Policy name
  * Category
  * Target group
  * Status (Active / Proposed)

### Technical Notes

* Policies fetched from `/api/policies`
* Rendered dynamically using JS

---

## 5.2 Policy Detail Page (MOST IMPORTANT)

### Sections

1. **What is this policy?**

   * 3–5 simple bullet points

2. **Who is it for?**

   * Students / salaried / MSME etc.

3. **Pros**

   * Clear benefits

4. **Cons / Limitations**

   * Trade-offs
   * Eligibility constraints

5. **Important Dates**

   * Launch
   * Deadline (if any)

6. **Official Links**

   * Government portals

### Non-Functional Requirements

* No political language
* Neutral tone
* Simple vocabulary

---

## 5.3 Eligibility Questionnaire

### Description

A short form that determines which schemes apply to the user.

### Questions (MVP)

* Age range
* Occupation
* Income range
* Student status
* State
* Family income (optional)

### Output

* List of applicable schemes
* Eligibility status:

  * Eligible
  * Conditionally eligible
  * Not eligible

### Technical Logic

* Client sends answers → backend
* Backend runs **rule-based matching**
* Returns list of schemes

---

## 5.4 Personalized Results Page

### Features

For each scheme:

* Eligibility ✔️ / ❌
* Why eligible / not eligible
* Estimated benefit (qualitative)
* “How to avail” link

No login required in MVP.

---

## 5.5 How to Avail Guide

### Description

Clear step-by-step instructions.

### Example Format

1. Check eligibility
2. Keep documents ready
3. Apply online/offline
4. Track application
5. Common rejection reasons

### Stored As

* Markdown or HTML blocks in DB

---

## 5.6 Search & Filters

### Search

* Keyword search (policy name)

### Filters

* Category
* Target group
* Status

### Technical

* Simple JS filtering on fetched data (MVP)
* Backend search later

---

## 6. 🧠 Data Model (Simplified)

### Policy Table

```json
{
  "id": 1,
  "name": "National Scholarship Scheme",
  "category": "Education",
  "description": "...",
  "pros": ["..."],
  "cons": ["..."],
  "eligibility_rules": {
    "income_max": 800000,
    "student": true
  },
  "how_to_avail": "...",
  "official_links": []
}
```

---

## 7. 🖥️ Frontend Pages (MVP)

1. Home
2. Policy Explorer
3. Policy Detail
4. Eligibility Questionnaire
5. Results Page
6. About / Disclaimer

---

## 8. ⚖️ Legal & Compliance

### Mandatory Disclaimers

* “This platform does not provide legal advice”
* “Information is for awareness purposes only”
* Sources linked wherever possible

### Data Privacy

* No Aadhaar
* No phone number
* No precise income values
* No user tracking

---

## 9. 🚀 MVP Success Metrics

* Time spent per policy page
* % users completing questionnaire
* Schemes clicked per session
* Bounce rate

No vanity metrics initially.

---

## 10. 🛠️ Development Phases

### Week 1–2

* HTML/CSS layout
* Policy data structure
* Backend setup

### Week 3

* Policy pages
* Eligibility logic
* Questionnaire

### Week 4

* Polish UX
* Content quality
* Deploy MVP

---

## 11. 🔮 Post-MVP (Not Now)

* User accounts
* Notifications
* AI discussions
* State-level schemes
* Mobile app

---

## 12. 🧠 Final Note (Founder Advice)

This PRD is **intentionally boring technically** — and that’s GOOD.

Your **real innovation is content + trust**, not tech stack.

