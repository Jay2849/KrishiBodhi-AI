# 🌾 KrishiBodhi AI — Full-Stack Intelligent Agronomy Platform

[![Live App (Vercel)](https://img.shields.io/badge/Vercel-Live%20App-000000.svg?style=for-the-badge&logo=vercel&logoColor=white)](https://krishi-bodhi-ai.vercel.app)
[![Live Backend (Render)](https://img.shields.io/badge/Render-Live%20API-46E3B7.svg?style=for-the-badge&logo=render&logoColor=white)](https://krishibodhi-ai.onrender.com)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688.svg?style=flat&logo=fastapi)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-19.0-61DAFB.svg?style=flat&logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.0-646CFF.svg?style=flat&logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v4.0-38B2AC.svg?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![Google Gemini](https://img.shields.io/badge/AI-Gemini%201.5%20Flash-4285F4.svg?style=flat&logo=google)](https://deepmind.google/technologies/gemini/)
[![SQLite](https://img.shields.io/badge/Database-SQLite-003B57.svg?style=flat&logo=sqlite)](https://www.sqlite.org/)

**KrishiBodhi AI** is a production-ready, full-stack precision agriculture platform engineered to empower field supervisors operating across high-altitude agricultural ecosystems in Uttarakhand. The system seamlessly combines a high-speed **FastAPI** backend with a modern **React 19 + Vite** frontend, powered by **Google Gemini 1.5 Flash AI** to deliver real-time, actionable agronomy advisory intelligence.

---

## 🌐 Deployment Documentation (Deliverable 2)

> [!NOTE]  
> **Live Production Services Status**: Both Frontend and Backend services are fully deployed and operational at the public URLs below.

| Service | Host Platform | Production Public URL | Status |
| :--- | :--- | :--- | :---: |
| **Frontend SPA** | **Vercel** | 🔗 [https://krishi-bodhi-ai.vercel.app](https://krishi-bodhi-ai.vercel.app) | 🟢 Live |
| **Backend REST API** | **Render** | 🔗 [https://krishibodhi-ai.onrender.com](https://krishibodhi-ai.onrender.com) | 🟢 Live |

### 🛠️ Production Tech Stack Summary
- **Frontend Layer**: React 19, Vite 8, Axios (JWT Authorization Interceptor), Tailwind CSS v4, Lucide Icons.
- **Frontend Deployment**: Hosted on Vercel with single-page routing rewrite engine configured via `vercel.json`.
- **Backend Layer**: Python 3.11, FastAPI ASGI Framework, Uvicorn Server, SQLAlchemy ORM.
- **Backend Deployment**: Web Service hosted on Render with automatic GitHub deployment pipeline.
- **Database Engine**: Persistent SQLite Database (`krishibodhi.db`) with automatic schema initialization.
- **AI Intelligence**: Google Gemini 1.5 Flash Generative Language Model paired with a rule-based agronomy fail-safe fallback engine.
- **Security Framework**: Passlib + SHA-256 fallback password hashing, PyJWT bearer token authorization matrix, SlowAPI rate limiting.

### ⚠️ Known Limitations on Free Tier
> [!WARNING]  
> Please review the following free-tier operational behaviors during testing:

1. **Render Container Cold Starts (15-min Idle Spin-down)**:
   - Render's Free Instance spins down after **15 minutes of inactivity** to save resources.
   - The **very first HTTP request** after an idle period takes **20 to 45 seconds** to awaken the backend container. All subsequent requests execute instantly (<200ms).
2. **Ephemeral Database Storage on Free Instances**:
   - Render's free tier provides transient disk storage on container re-deploys. Saved metrics persist continuously while the instance is running, but database state resets on new code deployments.
3. **Gemini AI API Quota & Fail-Safe Fallback**:
   - Free tier Gemini 1.5 Flash has a 15 Requests/Min (RPM) quota. If network latency occurs or rate limits are reached, the system automatically engages the built-in rule-based fallback advisory engine to ensure 100% operational uptime.

---

## ✨ Key Platform Features

### 🔐 1. Advanced Security & Authentication Matrix
- **JWT Bearer Token System**: 60-minute expiring JSON Web Tokens with strict authorization guards on protected routes (`/metrics/*`).
- **Password Hashing**: Dual-layer encryption using `passlib` with fallback `SHA-256` hashing preventing cross-platform bcrypt compilation issues.
- **Rate-Limiting Protection**: SlowAPI middleware protecting endpoints against brute-force attacks (`60 requests/min`).
- **Google OAuth 2.0 Identity Resolution**: Seamless OAuth callback handler with dynamic user account auto-provisioning.

### 🤖 2. Gemini 1.5 Flash AI Advisory Engine
- **Telemetry Analysis**: Processes soil moisture (%), ambient temperature (°C), and Nitrogen, Phosphorus, Potassium (NPK) ratios.
- **Structured Output Enforcement**: Generates 2-sentence actionable advisories strictly formatted into:
  - ⚠️ **Status Alert**: Highlights immediate telemetry risks (e.g. soil dehydration, thermal stress).
  - 💡 **Action Required**: Provides precise organic/fertilizer mitigation solutions.
- **Fail-Safe Agronomy Fallback**: Automatic rule-based agronomy fallback mechanism ensures zero downtime if network or AI API limits occur.

### 📊 3. Complete Telemetry CRUD & Interactive UI
- **Create**: Log field evaluations with farmer details and soil parameters.
- **Read**: Logged-in supervisors access isolated, real-time records via `/metrics/supervisor/me`.
- **Update**: Full parameter modification (Farmer Name, Moisture, Temperature, NPK) via `EditModal`, triggering live AI advisory re-evaluations.
- **Delete**: Hard purge of obsolete metric records from persistent SQLite database.
- **Live Search & Filtering**: Client-side search bar for instant lookup of farmer evaluations.

### 📱 4. Low-Bandwidth & Adaptive Design System
- Built using **Tailwind CSS v4** and custom styled component blocks.
- Optimized for instant loading across weak regional networks (2G/3G compatible).
- Fully responsive across viewports from **375px (Mobile)** to **1440px (Desktop)**.

---

## 🏗️ System Architecture

```text
                                 +-----------------------------------+
                                 |   React 19 + Vite Frontend SPA    |
                                 |  (Vercel: krishi-bodhi-ai)        |
                                 +-----------------------------------+
                                                   |
                                                   | REST API (HTTP / Bearer JWT)
                                                   v
                                 +-----------------------------------+
                                 |         FastAPI Gateway           |
                                 |  (Render: krishibodhi-ai)         |
                                 +-----------------------------------+
                                         /                     \
                                        /                       \
                                       v                         v
        +-----------------------------------+     +-----------------------------------+
        |       SQLAlchemy ORM Matrix       |     |      Google Gemini 1.5 Flash      |
        |       (SQLite Data Persistence)   |     |    (Intelligent Agronomy Engine)  |
        +-----------------------------------+     +-----------------------------------+
```

---

## 📁 Repository Directory Structure

```text
KrishiBodhi AI/
├── README.md                          # Primary Repository Documentation Overview (Deliverable 2)
├── PROMPTS.md                         # Prompt Engineering Execution & Validation Log
├── W6_AuthAPICollection_JayNegi.json  # Postman API Collection
├── requirements.txt                   # Root Python Backend Dependencies
│
├── Backend/                           # Core REST API Gateway & Database Engine
│   ├── .env                           # Environment Variables (GEMINI_API_KEY)
│   ├── .env.example                   # Production Environment Configuration Template
│   ├── Procfile                       # Render Web Service Process Command
│   ├── krishibodhi.db                 # SQLite Relational Database Engine
│   ├── requirements.txt               # Backend Dependencies Specification
│   └── app/
│       ├── main.py                    # FastAPI App Entrypoint, CORS & Rate Limiter
│       ├── database.py                # SQLAlchemy Engine & Session Configuration
│       ├── models.py                  # Database Schemas (Supervisor, FieldMetric)
│       ├── schemas.py                 # Pydantic Request/Response Validation Schemas
│       ├── security.py                # JWT Token Generation & HTTPBearer Middleware
│       └── routers/
│           ├── auth.py                # Signup, Login & OAuth Endpoints
│           ├── metrics.py             # Field Metrics CRUD & Gemini Advisory Routes
│           └── ai.py                  # Direct Soil Advisory API Endpoint
│
└── Frontend/                          # Client SPA (React + Vite + Tailwind v4)
    ├── vercel.json                    # Vercel Single-Page Application Rewrites Rule
    ├── package.json                   # Client Dependencies & Build Scripts
    ├── index.html                     # HTML5 Root Application Entry
    └── src/
        ├── App.jsx                    # Module Navigation & Auth Persistence
        ├── main.jsx                   # React DOM Mounting Sequence
        ├── index.css                  # Global Directives & Tailwind v4 Imports
        ├── services/
        │   └── api.js                 # Centralized Axios Service & JWT Interceptor
        ├── components/                # Modular UI Elements
        │   ├── EditModal.jsx          # Metric Edit Modal (N, P, K, Temp, Moisture)
        │   └── EmptyState.jsx         # Zero-Data Display Component
        └── pages/
            ├── Dashboard.jsx          # Authenticated Field Supervisor Hub
            ├── Login.jsx              # Auth Portal Gate & Google OAuth Flow
            ├── Home.jsx               # Landing Page & Core Pillars Showcase
            └── About.jsx              # Mission & Mandakini Collective Overview
```

---

## 🔌 API Endpoint Specifications

| Method | Endpoint | Description | Auth Required | Rate Limit |
| :--- | :--- | :--- | :---: | :---: |
| `POST` | `/auth/register` | Register a new Field Supervisor | ❌ | 60/min |
| `POST` | `/auth/login` | Authenticate supervisor & return JWT token | ❌ | 60/min |
| `POST` | `/auth/oauth/callback` | OAuth 2.0 dynamic account authentication | ❌ | — |
| `GET` | `/metrics/supervisor/me` | Fetch all telemetry records for logged-in supervisor | 🛡️ Bearer JWT | — |
| `POST` | `/metrics/submit` | Submit field telemetry & generate Gemini AI advisory | 🛡️ Bearer JWT | — |
| `PUT` | `/metrics/update/{id}` | Update existing metric record & re-evaluate AI advice | 🛡️ Bearer JWT | — |
| `DELETE` | `/metrics/delete/{id}` | Permanently delete a telemetry record | 🛡️ Bearer JWT | — |
| `POST` | `/api/ai/recommendation` | Direct AI recommendation API endpoint | ❌ | — |

---

## 💻 Local Installation & Setup Guide

### Prerequisites
- **Node.js**: v18.0 or higher
- **Python**: v3.10 or higher
- **Git**

### 1. Clone Repository & Setup Environment
```bash
git clone https://github.com/Jay2849/KrishiBodhi-AI.git
cd "KrishiBodhi AI"
```

### 2. Backend Setup & Launch
1. Create a `.env` file inside the `Backend/` directory:
   ```env
   GEMINI_API_KEY="YOUR_GOOGLE_GEMINI_API_KEY"
   SECRET_KEY="YOUR_SUPER_SECRET_KEY"
   ```
2. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Start the FastAPI Uvicorn development server:
   ```bash
   cd Backend
   python -m uvicorn app.main:app --reload --port 8000
   ```
   > 🌐 **Backend API Base**: `http://localhost:8000`  
   > 📖 **Interactive Swagger Documentation**: `http://localhost:8000/docs`

---

### 3. Frontend Setup & Launch
1. Open a new terminal window and navigate to `Frontend/`:
   ```bash
   cd Frontend
   npm install
   ```
2. Start the Vite development server:
   ```bash
   cmd /c npm run dev
   ```
   > 🌐 **Frontend App URL**: `http://localhost:5173/`

---

## 🧪 Build & Verification Commands

### Frontend Production Build
```bash
cd Frontend
cmd /c npm run build
```

### Python Syntax & Compilation Verification
```bash
python -m py_compile Backend/app/main.py Backend/app/database.py Backend/app/models.py Backend/app/schemas.py Backend/app/security.py Backend/app/routers/auth.py Backend/app/routers/metrics.py Backend/app/routers/ai.py
```

---

## 📄 License & Placement Project Alignment

Developed as a core Capstone & Placement Internship Project for **Graphic Era Hill University**, supporting agricultural technology operations for high-altitude ecosystems in Uttarakhand.
