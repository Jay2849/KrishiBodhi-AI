# KrishiBodhi AI — Frontend Ecosystem

A production-ready, highly optimized React frontend skeleton engineered with Vite and Tailwind CSS v4. This interface is specifically architected to serve as a low-latency, responsive agricultural advisory hub tailored for field supervisors operating in the high-altitude terrains of Uttarakhand.

---

## 🚀 Architectural Milestones (Week 2 Deliverables)

- **Vite & React Integration:** Initialized a lightweight Single Page Application (SPA) utilizing Vite for instant Hot Module Replacement (HMR) and optimized building.
- **Tailwind CSS v4 Configuration:** Successfully implemented and verified Tailwind v4 utility constraints using a PostCSS compatibility layout layer (`@tailwindcss/postcss`).
- **Semantic Components:** Engineered clean, modular UI layers including a persistent `Navbar`, high-impact `Hero` segment, multi-pillar layout grids (`Cards`), and a strict safety liability disclaimer `Footer`.
- **Low-Bandwidth Optimization:** Designed entirely with standard web components to guarantee smooth runtime compilation and visual layout rendering across patchy 2G/3G network infrastructure.

---

## 📁 Repository Directory Structure

The workspace has been organized cleanly to separate client interfaces from future analytical engines:

```text
KrishiBodhi AI/
├── .gitignore                # Restricts build artifacts & node_modules from being tracked
├── README.md                 # Primary repository documentation overview
├── Frontend/                 # Core Client-Side Web Application (React + Vite)
│   ├── public/               # Static vector resources & icons
│   ├── src/
│   │   ├── components/       # Layout blocks (Navbar.jsx, Hero.jsx, Card.jsx, Footer.jsx)
│   │   ├── pages/            # View Endpoints (Home.jsx, About.jsx, Dashboard.jsx, Login.jsx)
│   │   ├── App.jsx           # Routing Matrix & Entry Point Configuration
│   │   ├── index.css         # Global layer directives & Tailwind imports
│   │   └── main.jsx          # Application mounting sequence
│   ├── index.html            # Primary DOM Entry Document
│   ├── package.json          # Dependency manifestations & build scripts
│   └── postcss.config.js     # PostCSS styling compilation plugins
└── Backend/                  # Reserved space for future ML models & API routes

💻 Local Installation & Server Instantiation
To duplicate and execution-test this framework locally, run the following parameters inside your terminal sequence:

1. Change Environment Directory
```
cd Frontend
```

2. Verify Dependency Installation
```
npm install
```

3. Launch Development Server
```
npm run dev
```

The system will initialize the server instance locally at http://localhost:5173/. Open this link in Google Chrome to inspect the fully responsive viewports.