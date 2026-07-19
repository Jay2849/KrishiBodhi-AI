# 🌾 KrishiBodhi AI — Precision Agriculture Analytics Platform

KrishiBodhi AI is an enterprise-grade, low-latency precision agricultural monitoring and real-time advisory engine. The system is custom-architected to assist field supervisors operating across rural regions and high-altitude terrains (such as Uttarakhand). By capturing localized soil telemetry components, the platform evaluates micro-nutrient imbalances and dynamic environmental variables to generate instant, context-aware agricultural interventions.

The ecosystem utilizes a modular architecture consisting of an asynchronous decoupled client interface (React + Vite + Tailwind CSS v4) and a high-performance relational analytics API layer (FastAPI + SQLAlchemy + SQLite), directly reinforced by an isolated generative telemetry processor (Google Gemini-1.5-Flash model mapping).

========================================================================
🚀 SYSTEM ARCHITECTURAL PILLARS & CORE FUNCTIONALITY
========================================================================
* Multi-Node Network Pipeline: Decouples core analytical evaluation workloads from client devices, enabling rapid execution loops over low-bandwidth constraints (2G/3G connectivity profiles).
* Asynchronous Non-Blocking Telemetry: Handles bulk structural soil metric inputs without locking thread lifecycles, guaranteeing smooth interactive interfaces.
* Secure Sandboxed Environment: Manages authorization tokens and application endpoints separate from code version tracks, mitigating telemetry token data leaks.
* Intelligent Generative Diagnostics: Replaces traditional static hardcoded rule sets with contextual recommendation engines that adapt crop logs into deterministic agronomy reports.

========================================================================
📁 REPOSITORY STRUCTURE & INDIVIDUAL MODULE OVERVIEW
========================================================================
KrishiBodhi AI/
├── .gitignore                # Global rules restricting environment secrets and build items
├── README.md                 # Primary system structural documentation portal
├── PROMPTS.md                # System prompt logs and variant telemetry matrices
├── requirements.txt          # Root Python baseline packages manifest
├── krishibodhi.db            # Active SQLite relational persistent binary storage
│
├── Backend/                  # API Subsystem & Core Relational Analytics Router
│   ├── .env                  # Runtime environmental keys (API credentials container)
│   ├── requirements.txt      # API package dependencies manifest (FastAPI, Uvicorn, Dotenv)
│   └── app/
│       ├── main.py           # Application entry, CORS controls, and routing aggregation
│       ├── database.py       # Connection handling and SQLAlchemy session pool managers
│       ├── models.py         # Relational DB entities mapping physical storage spaces
│       ├── schemas.py        # Pydantic structural schema profiles validating JSON states
│       ├── security.py       # Password cryptographic salting and active session security
│       └── routers/          # Distributed core business logic endpoints
│           ├── ai.py         # Gemini generative backend logic and token handlers
│           ├── auth.py       # Field supervisor verification and profile management
│           └── metrics.py    # CRUD processing rules for crop health monitoring logs
│
└── Frontend/                 # Responsive Client Presentation Web Application
    ├── index.html            # Core structural DOM mounting anchor
    ├── package.json          # Node dependency configurations and system lifecycle scripts
    └── src/
        ├── main.jsx          # V8 compiler entry point mounting the global DOM
        ├── App.jsx           # Global component routing matrix and structural view controls
        ├── index.css         # Global layer bindings and Tailwind styling injections
        ├── App.css           # Component explicit design layout modifications
        ├── context/          # State engines tracking supervisor sessions
        │   └── AuthContext.jsx
        ├── pages/            # Client View interfaces for structural components
        │   ├── Home.jsx      # Portal public engagement index
        │   ├── About.jsx     # Technical overview context display
        │   ├── Login.jsx     # Supervisor access validation matrix
        │   └── Dashboard.jsx # Active monitoring field controls and AI panel
        └── components/       # Reusable layout building components
            ├── Navbar.jsx    # Persistent horizontal routing header
            ├── Hero.jsx      # High-impact user engagement banner
            ├── Card.jsx      # Diagnostic records display layout item
            ├── Footer.jsx    # Regulatory compliance liability disclaimer panel
            ├── ProtectedRoute.jsx  # Authentication state route interceptor
            └── ui/           # Atomic primitive atomic styling entities
                ├── Button.jsx  ├── Index.js   ├── Input.jsx
                ├── Loader.jsx  ├── Modal.jsx  └── Toast.jsx

========================================================================
💻 ENVIRONMENT PROVISIONING & PRODUCTION BOOTSTRAPPING
========================================================================
Follow this explicit sequence to instantiate the multi-tiered ecosystem locally:

------------------------------------------------------------------------
STEP 1: ENVIRONMENT CREDENTIALS CONFIGURATION
------------------------------------------------------------------------
Create a custom isolated environment variable structure inside the 'Backend/' root:
File Location: Backend/.env
Content Schema:
  GEMINI_API_KEY="your_private_google_ai_studio_access_key"

------------------------------------------------------------------------
STEP 2: RUNNING THE RELATIONAL API SUB-ENGINE (BACKEND)
------------------------------------------------------------------------
Open a terminal shell block and route into the server workspace directory:
  $ cd Backend

Activate your virtual environment and install standard requirements:
  $ pip install -r requirements.txt

Instantiate the asynchronous Uvicorn routing server process:
  $ uvicorn app.main:app --reload

* System Telemetry Verification Link: http://127.0.0.1:8000/docs
* Confirm that the backend live console returns: "Uvicorn running on http://127.0.0.1:8000"

------------------------------------------------------------------------
STEP 3: RUNNING THE REACT INTERACTION SYSTEM (FRONTEND)
------------------------------------------------------------------------
Open a new parallel terminal instance window, leaving the backend process active:
  $ cd Frontend

Install the required node module dependencies:
  $ npm install

Launch the frontend development engine:
  $ npm run dev

* Client Application Local Mount Link: http://localhost:5173/
* Open the local interface link inside Chrome to view responsive layouts.

========================================================================
💾 DATA MATRIX PERSISTENCE LAYER & RELATION DIAGRAM
========================================================================
* Storage Infrastructure: SQLite engine deployed serverless for instant IO operations.
* Data Layer Enforcement: Orchestrated via declarative object-relational mapping (ORM).
* Entity Relation Bounds: Maps a 1-to-Many connection flow where an authenticated field supervisor captures multiple diagnostic metrics loops.

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
                                                     | (1 to Many Connection)
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

========================================================================
🤖 COGNITIVE ARTIFICIAL INTELLIGENCE INFERENCE FLOW
========================================================================
1. Input Parsing: Field supervisor enters diagnostic indicators (Moisture, Temp, N-P-K metrics).
2. Data Serialization: Client component transforms fields into unified JSON payloads via Axios.
3. Network Routing: Requests transit to the Backend endpoint "/metrics/submit".
4. Isolated Model Intercept: Server extracts runtime values and builds strict tokens.
5. Generative Processing: Google Gemini processes prompts under optimization constraints.
6. Dynamic UI Rendering: Frontend intercepts response streams, halts loading states, and updates dashboard cards with custom recommendations.
========================================================================
