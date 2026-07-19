# 🤖 KrishiBodhi AI - Week 7 Core Prompts Engineering Log

### 🎭 Centralized System Prompt / Operational Role
> "You are an expert digital agronomist and environmental precision computing system trained to intercept specific agricultural field metrics (Moisture, Thermal parameters, and NPK status) to deliver highly localized, zero-fluff structural crop action guides."

---

### 🧪 Tested Prompt Variations Execution Telemetry

#### 🔹 Variation 1: Freeform Context Retrieval
*   **Prompt Architecture:** `Check this out: Moisture={moisture}%, Temp={temp}C, NPK={npk}. Tell me what to do.`
*   **Input Context Sample:** Soil Moisture: 24.5%, Temperature: 32.0°C, NPK: Monitored.
*   **Output Context Payload:** The crop requires hydration because moisture levels are looking low and the current ambient climate is moderately hot. Ensure balancing minerals.
*   **Critique & Failure Mode:** Too ambiguous. Lacks explicit structural enforcement and actionable agricultural authority required for real-time edge display.

#### 🔹 Variation 2: Structured Binary Matrix Layout (🥇 SELECTED AS PRODUCTION BEST)
*   **Prompt Architecture:** `Act as an agronomy expert. Based on soil moisture ({moisture}%), temperature ({temperature}°C), and NPK status ({npk_status}), generate a concise 2-sentence structural advisory block for the dashboard. Format strictly as: **Status Alert:** [problem statement], **Action Required:** [precise mitigation solution].`
*   **Input Context Sample:** Soil Moisture: 24.5%, Temperature: 32.0°C, NPK: Nitrogen Deficient.
*   **Output Context Payload:** **Status Alert:** Critical field dehydration detected at 24.5% moisture alongside severe thermal stress at 32°C. **Action Required:** Initiate immediate drip irrigation networks and deploy localized nitrogenous nutrient feeds to restore telemetry balance.
*   **Selection Rationale:** This formulation constraints the tokens tightly, guarantees that the production layout framework doesn't overflow, and isolates operational data from useless fluff.

#### 🔹 Variation 3: Deep Botanical Analytical Sequence
*   **Prompt Architecture:** `Provide a comprehensive microbiological and thermodynamic diagnostic review for soil profiling: Moisture={moisture}%, Temperature={temp}...`
*   **Input Context Sample:** Soil Moisture: 24.5%, Temperature: 32.0°C.
*   **Output Context Payload:** (Generates a verbose 400-word academic paper explaining evaporation constants, root cellular degradation cycles under heat, and chemical ion movement dynamics.)
*   **Critique & Failure Mode:** The payload size breaks the responsive layout wrapper of the dashboard cards, causing heavy vertical scrolling friction.