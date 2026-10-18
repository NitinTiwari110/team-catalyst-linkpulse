# ⚡ LinkPulse — Smart URL Management & Telemetry Engine

> **Innovista 2026 Hackathon Submission**  
> **Team Name:** TEAM CATALYST  
> **Repository:** `team-catalyst-linkpulse`  
> **Live Demo:** [https://team-catalyst-linkpulse.vercel.app](https://team-catalyst-linkpulse.vercel.app) *(Update with your deployed link)*

---

## 📌 1. Problem Statement
In modern digital operations, raw URLs are long, fragile, and opaque. Traditional shorteners treat links as static redirects without granular observability or security governance. Organizations lack unified platforms that offer:
- Real-time click stream telemetry without latency overhead.
- Campaign segmentation to attribute conversions across marketing channels.
- Safety controls such as operational killswitches, click limits, and password gates.
- High-resolution scannable assets (QR codes) and batch spreadsheet ingestion for enterprise scale.

---

## 💡 2. Solution: LinkPulse
**LinkPulse** elevates standard URL shortening into an enterprise-grade performance engine. Built with a modern, decoupled architecture:
1. **Frontend:** Ultra-responsive Next.js App Router application featuring an executive console, live telemetry visualizers, and interactive QR tooling.
2. **Backend Architecture (In Progress / Ready for Integration):** Microservice architecture powered by Java Spring Boot 3, Hibernate ORM, and MySQL for relational persistence, with planned Redis caching and async event queues for high-velocity link redirects.

---

## ✨ 3. Core Features

### 🚀 Smart Link Management
- Instant URL shortening with custom back-half vanity aliases.
- Auto-expiration triggers based on scheduled date/time or maximum click limits.
- Password protection for restricted destinations.
- Operational killswitch: Disable or reactivate any redirect in real-time.

### 📊 Precision Click Telemetry
- Real-time timeseries volume charts powered by Recharts (Past 24 Hours & Launch Week views).
- Deep attribution analytics:
  - **Referrer channels:** Direct/QR, GitHub, LinkedIn, Twitter/X.
  - **Device breakdown:** Desktop, Mobile, and Tablet split.
  - **Browser distribution:** Chrome, Safari, Edge, Firefox.
  - **Geographic distribution:** Top visiting countries.

### 🎯 Campaign Segmentation
- Group multiple related short links under cohesive marketing or product initiatives.
- Compare aggregate click volume and engagement across different campaigns.
- Expandable drill-down drawers to inspect links tagged to specific channels.

### 🎨 QR Studio & Bulk CSV Ingestion
- Interactive vector QR Code generator with customizable color palettes (Navy, Electric Blue, Emerald) and resolution scaling.
- Instant high-resolution print-ready PNG downloads.
- Drag-and-drop CSV batch importer with client-side syntax validation, pre-flight error reporting, and bulk link creation.

---

## 🛠️ 4. Tech Stack

| Layer | Technologies |
|---|---|
| **Framework** | Next.js (App Router), React, TypeScript |
| **Styling** | Tailwind CSS, Lucide React Icons |
| **Data Visualization** | Recharts (Responsive SVG Area & Bar Telemetry) |
| **QR Code Engine** | qrcode.react (Canvas/SVG High Error Correction) |
| **Planned Backend** | Java, Spring Boot 3, Spring Data JPA, RESTful API |
| **Database** | MySQL (Relational persistence & time-bucketed indices) |
| **Deployment** | Vercel (CI/CD Automated Git Pipeline) |

---

## 👥 5. TEAM CATALYST Roster

| Member | Role | Responsibilities |
|---|---|---|
| **Nitin Tiwari** | Team Leader & Backend Architect | Spring Boot 3 REST API, redirect routing engine, MySQL data modeling |
| **Tanishq Rawat** | Frontend Engineer | Next.js App Router architecture, service layer abstraction, state persistence |
| **Ankit Tiwari** | UI/UX & Styling | Design system tokens, responsive layouts, Tailwind styling, micro-interactions |
| **Vivek Bisht** | Database Administrator | Schema normalization, indexing strategy, data models, AI exploration |

---

## 💻 6. Local Setup Instructions

### Prerequisites
- Node.js 18.18+ or 20+
- npm or yarn
- Git

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/NitinTiwari110/team-catalyst-linkpulse.git
   cd team-catalyst-linkpulse