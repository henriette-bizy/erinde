# e-RINDE — Early Health Risk Awareness System

> A web application helping communities in rural and underserved areas of Africa assess health symptoms, understand risks, and know when to seek medical care.

---

## 🏥 About

e-RINDE (Early Health Risk Awareness System) is built as part of a Software Engineering project at African Leadership University. It addresses the problem of delayed medical care in rural Africa by providing a simple, free, digital tool for early health risk detection.

**It does NOT provide medical diagnoses.** It provides awareness guidance only.

---

## ✨ Features

- **Register / Login** — Secure account creation with localStorage persistence
- **Symptom Assessment** — 3-step guided questionnaire (16 symptoms across body systems)
- **Risk Analysis Engine** — Rule-based engine classifying Low / Moderate / High risk
- **Health Recommendations** — Personalized, plain-language next steps
- **Assessment History** — View all past assessments on the dashboard
- **Health Education** — 6 articles on prevention, symptoms, treatment, and lifestyle
- **User Profile** — Update personal info, view stats, delete data
- **Fully Responsive** — Works on desktop and mobile

---

## 🛠 Tech Stack

| Layer     | Technology                        |
|-----------|-----------------------------------|
| Frontend  | Next.js 15 (App Router)           |
| Styling   | CSS Variables + Tailwind CSS      |
| Language  | TypeScript                        |
| Storage   | localStorage (client-side)        |
| Fonts     | Plus Jakarta Sans (Google Fonts)  |
| Deployment| Vercel (recommended)              |

---

## 🚀 Local Setup

### Prerequisites

- **Node.js** v18 or higher — [Download here](https://nodejs.org)
- **npm** v9+ (comes with Node.js)
- **Git** — [Download here](https://git-scm.com)

### Step 1 — Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/erinde.git
cd erinde
```

### Step 2 — Install dependencies

```bash
npm install
```

### Step 3 — Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Step 4 — Build for production (optional)

```bash
npm run build
npm start

---
---

## 📁 Project Structure

```
erinde/
├── app/
│   ├── page.tsx              # Landing / Home page
│   ├── layout.tsx            # Root layout + fonts
│   ├── globals.css           # Global styles + CSS variables
│   ├── auth/
│   │   ├── login/page.tsx    # Login page
│   │   └── register/page.tsx # Registration page
│   ├── dashboard/page.tsx    # User dashboard
│   ├── assessment/page.tsx   # 3-step symptom assessment
│   ├── results/page.tsx      # Risk results & recommendations
│   ├── education/page.tsx    # Health education articles
│   └── profile/page.tsx      # User profile management
├── lib/
│   ├── storage.ts            # localStorage auth & data utilities
│   └── riskEngine.ts         # Risk analysis algorithm
└── README.md
```

---

## 👤 Test Account

Register any new account on the app — it takes under 30 seconds and no email verification is required.

---

## ⚠️ Disclaimer

e-RINDE is an educational project. It does **not** provide medical diagnoses and is **not** a substitute for professional medical advice. Always consult a qualified healthcare professional.

---

*Built by Henriette Biziyaremye · African Leadership University · 2026*
