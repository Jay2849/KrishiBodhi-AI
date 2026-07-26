# 🌾 KrishiBodhi AI — Full-Stack Intelligent Agronomy Platform

[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688.svg?style=flat&logo=fastapi)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-19.0-61DAFB.svg?style=flat&logo=react)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8.0-646CFF.svg?style=flat&logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v4.0-38B2AC.svg?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![Google Gemini](https://img.shields.io/badge/AI-Gemini%201.5%20Flash-4285F4.svg?style=flat&logo=google)](https://deepmind.google/technologies/gemini/)
[![SQLite](https://img.shields.io/badge/Database-SQLite-003B57.svg?style=flat&logo=sqlite)](https://www.sqlite.org/)

**KrishiBodhi AI** is a production-ready, full-stack precision agriculture platform engineered to empower field supervisors operating across the high-altitude agricultural terrains of Uttarakhand. The system seamlessly combines a high-speed **FastAPI** backend with a modern **React 19 + Vite** frontend, powered by **Google Gemini 1.5 Flash AI** to deliver real-time, actionable agronomy advisory intelligence.

---

## ✨ Key Platform Features

### 🔐 1. Advanced Security & Authentication Matrix
- **JWT Bearer Token System**: 60-minute expiring JSON Web Tokens with strict authorization guards.
- **Password Hashing**: Secure password encryption utilizing `passlib` and `bcrypt`.
- **Rate-Limiting Protection**: SlowAPI middleware protecting authentication endpoints against brute-force attacks (5 requests/min on registration, 3 requests/min on login).
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
- Built using **Tailwind CSS v4** and styled component blocks.
- Optimized for instant loading across weak 2G/3G regional networks.
- Fully responsive across viewports from **375px (Mobile)** to **1440px (Desktop)**.

---

## 🏗️ System Architecture

```text
                                 +-----------------------------------+
                                 |   React 19 + Vite Frontend SPA    |
                                 |  (Tailwind v4, Axios Interceptor) |
                                 +-----------------------------------+
                                                   |
                                                   | REST API (HTTP / Bearer JWT)
                                                   v
                                 +-----------------------------------+
                                 |         FastAPI Gateway           |
                                 |  (SlowAPI Rate Limiter & CORS)    |
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
├── README.md                          # Primary Repository Documentation Overview
├── PROMPTS.md                         # Prompt Engineering Execution & Validation Log
├── W6_AuthAPICollection_JayNegi.json  # Postman API Collection
├── requirements.txt                   # Root Python Backend Dependencies
│
├── Backend/                           # Core REST API Gateway & Database Engine
│   ├── .env                           # Environment Variables (GEMINI_API_KEY)
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
        │   ├── EmptyState.jsx         # Zero-Data Display Component
        │   └── ui/                    # Reusable Buttons, Inputs, Loaders, Toasts
        ├── context/
        │   └── AuthContext.jsx        # Auth Context State Provider
        └── pages/
            ├── Dashboard.jsx          # Authenticated Field Supervisor Hub
            ├── Login.jsx              # Auth Portal Gate & Google OAuth Simulation
            ├── Home.jsx               # Landing Page & Core Pillars Showcase
            └── About.jsx              # Mission & Mandakini Collective Overview
```

---

## 💻 Local Installation & Setup Guide

### Prerequisites
- **Node.js**: v18.0 or higher
- **Python**: v3.10 or higher
- **Git**

---

### 1. Clone Repository & Setup Environment
```bash
git clone https://github.com/Jay2849/KrishiBodhi-AI.git
cd "KrishiBodhi AI"
```

### 2. Backend Setup & Launch
1. Create a `.env` file inside the `Backend/` directory:
   ```env
   GEMINI_API_KEY="YOUR_GOOGLE_GEMINI_API_KEY"
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

## 💾 Database Schema & ER Diagram

The SQLite database manages data integrity via SQLAlchemy ORM using a **One-to-Many ($1 \rightarrow N$)** relationship between Supervisors and Field Metrics:

```text
       +-----------------------------------+
       |            SUPERVISORS            |
       +-----------------------------------+
       | id (PK)            [Integer, Inc] | <-------+
       | intern_id          [String, Uniq] |         |
       | name               [String]       |         |
       | email              [String, Uniq] |         |
       | hashed_password    [String]       |         |
       | created_at         [Timestamp]    |         |
       +-----------------------------------+         |
                                                     | (1-to-Many Relationship)
       +-----------------------------------+         |
       |           FIELD_METRICS           |         |
       +-----------------------------------+         |
       | id (PK)            [Integer, Inc] |         |
       | supervisor_id (FK) [Integer]      | --------+
       | farmer_name        [String]       |
       | soil_moisture      [Float]        |
       | temperature        [Float]        |
       | nitrogen_level     [Float]        |
       | phosphorus_level   [Float]        |
       | potassium_level    [Float]        |
       | ai_advisory        [Text]         |
       | timestamp          [Timestamp]    |
       +-----------------------------------+
```

---

## 🔌 API Endpoint Specifications

| Method | Endpoint | Description | Auth Required | Rate Limit |
| :--- | :--- | :--- | :---: | :---: |
| `POST` | `/auth/register` | Register a new Field Supervisor | ❌ | 5/min |
| `POST` | `/auth/login` | Authenticate supervisor & return JWT token | ❌ | 3/min |
| `POST` | `/auth/oauth/callback` | OAuth 2.0 dynamic account authentication | ❌ | — |
| `GET` | `/metrics/supervisor/me` | Fetch all telemetry records for logged-in supervisor | 🛡️ Bearer JWT | — |
| `POST` | `/metrics/submit` | Submit field telemetry & generate Gemini AI advisory | 🛡️ Bearer JWT | — |
| `PUT` | `/metrics/update/{id}` | Update existing metric record & re-evaluate AI advice | 🛡️ Bearer JWT | — |
| `DELETE` | `/metrics/delete/{id}` | Permanently delete a telemetry record | 🛡️ Bearer JWT | — |
| `POST` | `/api/ai/recommendation` | Direct AI recommendation API endpoint | ❌ | — |

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
