# Content Inventory: current portfolio (`index.html`)

**Purpose:** a record of everything on the current site, written before the game redesign. This is a content inventory, not a code review, and it contains no redesign proposals.
**Source:** `index.html` (1,192 lines), REV 2026.11-D, read in full on 2026-11-25.
**Rule for downstream agents:** every fact below is quoted or closely transcribed from the page, and `L###` gives the line in `index.html`. Anything not listed here is not on the site, so do not invent it. Open questions for Sneha are in §16.

---

## 0. Page map

| # | Section | Anchor | Nav label | Section note (mono caption) | Lines |
|---|---|---|---|---|---|
| — | Nav | — | `S.ISLAM` logo | — | L309–331 |
| — | Hero + metrics strip | `#top` | — | — | L333–456 |
| §01 | About + interests | `#about` | 01 About | `// whoami` | L459–520 |
| §02 | Experience | `#experience` | 02 Experience | `// 4 terms · industry + research` | L523–634 |
| §03 | Projects | `#projects` | 03 Projects | `// lab · design · code` | L637–797 |
| §04 | Open Source | `#repos` | 04 Code | `// github.com/snehaislamm` | L800–943 |
| §05 | Technical Coursework | `#coursework` | 05 Courses | `// click to expand` | L946–978 |
| §06 | Skills + certs | `#skills` | 06 Skills | `// toolkit` | L981–997 |
| §07 | Path (timeline) | `#path` | 07 Path | `// timeline` | L1000–1020 |
| §08 | Résumé | `#resume` | 08 Résumé | `// general · engineering co-op` | L1023–1098 |
| §09 | Contact | `#contact` | 09 Contact | `// open a channel` | L1101–1133 |
| — | Footer title block | — | — | — | L1135–1144 |

**Interactive behaviour (L1146–1189):** scroll-reveal (`.rv`), hero figure tabs (FIG. 01 / FIG. 02), open-source category filters, "Copy as text" for the résumé, and "Copy" for the email address. There are no other scripts, no analytics and no external JS.

---

## 1. Hero (L333–356)

| Type | Content |
|---|---|
| Page `<title>` | Sneha Islam — Nanotechnology Engineering · Software & AI |
| Tag line | Nanotechnology Engineering · University of Waterloo |
| H1 | Sneha Islam / **from silicon to software.** (the gradient accent sits on the second line) |
| Lede (verbatim) | "3rd-year **Nanotechnology Engineering** student specializing in **nanoelectronics**. Across four terms of industry and research work I've shipped **production AI systems**, built **full-stack backends** and written **embedded battery-management code** — and in the lab I fabricate thin-film devices. Long term: **quantum computing hardware**." |
| CTA buttons | **Résumé** (primary, → `#resume`) · View experience → (`#experience`) · GitHub ↗ (`https://github.com/snehaislamm`) |
| Readout (4 stats) | Program: **BASc NE** · Specialization: **Nanoelectronics** · Experience: **4 terms** · Open source: **8 repos** |
| Figure panel | Tabbed: **FIG. 01 · DEVICE** (MIS capacitor cross-section, NE 343) / **FIG. 02 · SYSTEM** (agentic newsletter pipeline, Communitech). See SVG-2 and SVG-3 in §14 |
| Numbers inside the figures | t ≈ **102.6 nm** (ellipsometry) · **50+ sources** · **1,200+ companies** |

## 2. Metrics strip (L446–455)

| Number | Label (verbatim) | Source tag |
|---|---|---|
| **50+** | ecosystem sources summarized daily | Communitech |
| **1,200+** | companies covered by AI monitoring | Communitech |
| **<300ms** | photo / audio / video retrieval | The Plug Co |
| **85%+** | semantic-matching accuracy | The Plug Co |
| **±2%** | state-of-charge estimation accuracy | Battery WC |
| **−35%** | BMS regression testing time | Battery WC |

## 3. About (§01, L459–480)

**Paragraphs, with the facts each one contains:**

| ¶ | Facts |
|---|---|
| 1 | Nanotechnology Engineering at the **University of Waterloo**, specializing in **nanoelectronics**. Went into engineering "wanting to build physical hardware." Coursework: quantum mechanics, microfabrication, polymer science, continuum mechanics. |
| 2 | Work terms pulled her "into **software and applied AI**." Communitech: "built and shipped an agentic AI system that monitors the Waterloo tech ecosystem." The Plug Co: "AI-integrated backend with vector search." Battery Workforce Challenge: "state-of-charge algorithms and embedded C diagnostics for an EV battery pack." |
| 3 | Open-source projects built "end to end": FPGA place-and-route tool and ML kernel compiler (C++), EV control software (C99), thin-film lab toolkit, ML systems (Python and Go), "each with tests, CI and honest benchmarks." |
| 4 | "I like problems where the **device, the data and the code** all matter." Long term: "the **hardware behind quantum computers**." |

**Datasheet panel ("DATASHEET · S. ISLAM"):**

| Key | Value |
|---|---|
| Institution | University of Waterloo |
| Degree | BASc, Nanotechnology Eng. |
| Option | Nanoelectronics |
| Standing | 3B (Fall 2026) |
| Experience | SWE · AI · Embedded · Research |
| Certs | Azure AZ-900 · AI-900 |
| Next | Co-op term · Winter 2027 |
| Location | Waterloo, ON |

## 4. Interests (L482–518)

| Interest | Line (verbatim) | Icon colour | Icon |
|---|---|---|---|
| Quantum hardware | The devices and materials that turn quantum mechanics into working qubits. | cyan `#4fd1c5` | atom (3 orbit ellipses) |
| Nanoelectronics | Thin-film devices, CMOS process flows, and how fabrication shapes device behaviour. | violet `#9f7aea` | stacked film layers + probe |
| Applied AI | LLM pipelines, retrieval and agents that replace real manual work in production. | red `#fc8181` | node graph |
| Fintech | Quantitative modelling, from cash-flow analysis to AI investing tools. | amber `#f6ad55` | rising line chart |

## 5. Experience (§02, L523–634)

### 5.1 Communitech: featured card (L528–572)

| Field | Content |
|---|---|
| Title | Software Developer Co-op — AI Adoption Program |
| Org | Communitech |
| Dates · place | FEB 2026 – MAY 2026 · WATERLOO, ON |
| Kind tag | SOFTWARE · APPLIED AI (violet) |
| Bullet 1 | Built and shipped an **agentic AI system** (React/TypeScript, FastAPI, PostgreSQL) that scrapes, deduplicates and summarizes **50+ ecosystem sources daily** with the Gemini API, replacing manual cross-team monitoring across **1,200+ companies**. |
| Bullet 2 | **Weekly automated pipeline** (Playwright scraping, async concurrency control, SendGrid delivery) plus a **natural-language Q&A chatbot** over the newsletter archive. |
| Bullet 3 | **Personalization engine** that re-ranks and re-summarizes content per user from bio, focus areas and keywords; **Docker on Azure**, behind Google OAuth. |
| Bullet 4 | Portfolio tracking (CSV/Excel upload → AI-flagged mentions), PDF export, per-user scheduler. *(Site only; not on the résumé.)* |
| Diagram | "SYSTEM MAP" (SVG-4): Frontend React 18 + TS + Tailwind (Home · Archive · Q&A · Sources · Profile) → Backend FastAPI + Uvicorn (scrape → extract → dedup → relevance → summarize → personalize → email / PDF) → PostgreSQL (users · issues) / Gemini API (LLM) / SendGrid (**Mon 7 AM ET**); "Docker · Azure Container Apps" |
| Chips | React, TypeScript, FastAPI, PostgreSQL, Gemini API, Playwright, BeautifulSoup4, SendGrid, OAuth2 / JWT, Docker, Azure |

### 5.2 The Plug Co (L575–587)

| Field | Content |
|---|---|
| Title | Data Analysis & AI Development Intern |
| Dates · place | SEP 2025 – JAN 2026 · TORONTO, ON |
| Kind tag | DATA · AI (cyan) |
| Bullet 1 | Full-stack backend (FastAPI, PostgreSQL, AWS) retrieving photos, audio and video in **under 300 ms**; speech-to-text, image recognition and semantic matching at **85%+ accuracy**. |
| Bullet 2 | **Vector search pipeline** (Pinecone/FAISS) with SQL schemas supporting **10k+ timeline events**; Swift (iOS) and Unity (VR) MVP frontends. |
| Bullet 3 | **Privacy-by-design** (RBAC, AES-256, GDPR Art. 17); investor-ready AI prototype in **12 weeks**; Jira sprints that sped delivery by **25%**. |
| Chips | FastAPI, AWS, Pinecone, FAISS, Swift, Unity, Jira |

### 5.3 Battery Workforce Challenge (L589–601)

| Field | Content |
|---|---|
| Title | Undergraduate Research Assistant |
| Org | Battery Workforce Challenge · University of Waterloo |
| Dates · place | JAN 2025 – APR 2025 · WATERLOO, ON |
| Kind tag | EMBEDDED · RESEARCH (amber) |
| Bullet 1 | **State-of-charge estimation** (**±2%** accuracy) and fault detection in MATLAB and Python; **embedded C** diagnostic logging for overvoltage, HVIL and isolation-resistance faults. |
| Bullet 2 | Automated test scripts and **fault-injection simulations** that cut regression testing time by **35%** across BMS validation workflows. |
| Bullet 3 | **CAN bus** communication carrying **120+ DBC-defined signals** between BPCM and EVCU to simulate field conditions. |
| Chips | Embedded C, MATLAB, Python, CAN / DBC, BMS, Fault injection |

### 5.4 Avanade WE Accelerate (L603–615)

| Field | Content |
|---|---|
| Title | Software Developer |
| Org | Avanade · Microsoft Azure & AI (WE Accelerate) |
| Dates · place | MAY 2024 – AUG 2024 · WATERLOO, ON |
| Kind tag | CLOUD · AI (red) |
| Bullet 1 | Earned **AZ-900 / AI-900**; worked with Avanade consultants on **3 AI projects**, including a chatbot prototype **projected** to cut client response time by **40%**. |
| Bullet 2 | AI-driven **Azure workflows** (**+25%** data-processing efficiency); co-built a cross-platform **financial AI chatbot** (Flutter/Dart, Alpha Vantage + OpenAI APIs). Link: **yunus-AI ↗** `https://github.com/zahra-ahmed1/yunus-AI` |
| Bullet 3 | **10+ client-style presentations**; team placed **top 3 for innovation**. |
| Chips | Azure, Flutter / Dart, OpenAI API, Alpha Vantage, Agile consulting |

### 5.5 Engineering Ambassador (L617–629)

> **Removed from the portfolio on 2026-11-25 (D10).** This section is kept as a historical record only. Do not use it.

| Field | Content |
|---|---|
| Title | Engineering Ambassador |
| Org | University of Waterloo Engineering |
| Dates · place | FALL 2026 – PRESENT · WATERLOO, ON |
| Kind tag | LEADERSHIP (cyan) |
| Bullet 1 | Selected to represent **Nanotechnology Engineering** to prospective students: campus tours, shadow days, Ask a Warrior chats. |
| Bullet 2 | Supports recruitment events such as **Fall Open House** (**200–300 volunteers**). |
| Bullet 3 | Formal training in **public speaking, mentorship** and recruitment communication. |
| Chips | Public speaking, Mentorship, Outreach |

## 6. Projects (§03, L637–797)

### 6.1 PRJ-001 · MIS capacitor (featured; L642–673)

| Field | Content |
|---|---|
| Header | PRJ-001 · DEVICE FABRICATION · status **COMPLETE** |
| Title | MIS Capacitor Fabrication & C–V Characterization |
| Course | NE 343 · Microfabrication |
| Summary | Fabricated and characterized an **Al / SiNₓ / p-Si** MIS capacitor; wrote a **~15-page technical report**. |
| Bullets | SiNₓ dielectric by **PECVD**, Al gate by **PVD**, on a p-type Si wafer · thickness by **ellipsometry (102.6 nm)** and **stylus profilometry**; disagreement traced to a **step-edge artefact**, ellipsometry justified as the reliable value · **C–V curves**: minimum capacitance and **threshold-voltage shift** from fixed and interface charge |
| Diagram | C–V plot (SVG-5): measured vs ideal curves, C_ox, C_min, ΔV_T; axes V_G (V) / C (F) |
| Chips | PECVD, PVD, Ellipsometry, Profilometry, C–V analysis, Technical writing |

### 6.2 PRJ-002 · Capstone: doxorubicin patch (featured; L675–758)

> ⚠ **Status is DESIGN PROPOSAL.** It was presented on Nov 24, 2026, and build and testing run from Sep 2027 to Apr 2028. Every number on this card is an **estimate** or a **design value**. Never present it as built or tested.

| Field | Content |
|---|---|
| Header | PRJ-002 · CAPSTONE · GROUP 11 · status **DESIGN PROPOSAL** (amber) |
| Title | Wearable Patch for Doxorubicin Monitoring in Breast Cancer Patients |
| Team | NE Capstone Design · 4-person team (teammate names removed per D3) |
| Summary | Minimally invasive patch: **hydrogel microneedles** + **electrochemical sensor** track a chemo patient's actual doxorubicin exposure, so clinicians can spot patients at higher risk of heart damage. |
| Problem | Dose is set by body size, but clearance varies; blood work and heart imaging catch **cardiotoxicity** only after it happens. |
| Design | Swellable **PEG hydrogel microneedles** draw interstitial fluid to a **screen-printed carbon electrode** (sampling and sensing kept separate). Chosen over hollow-needle microfluidics and cleanroom carbon microneedles. |
| Sensing | Doxorubicin is redox-active → **square-wave voltammetry**, label-free; peak current ∝ concentration via a calibration line. |
| **Sneha's role** | Electronics and readout: detection method, portable potentiostat, system architecture, power and electronics budgets. |
| Stats | **≈8.2 mAh** needed for the 24 h target; a 40 mAh cell gives ~5 days (estimate) · **≈$55 vs $160** per patient (~4 cycles), clinic-loaned pod vs fully disposable · **≈$1,400** estimated total of a **$1,500** budget, incl. contingency |
| "MY PART" (expandable) | **Cartridge + pod:** sterile single-use cartridge (microneedles, electrode, adhesive); sealed, wipeable pod loaned by the clinic per patient for the whole course, under a single-use polyurethane film, no open ports; chosen over fully disposable (Dexcom G7 / FreeStyle Libre 3) for hygiene, accessibility, cost. **Signal chain:** **AD5940** potentiostat (**50 pA – 3 mA**) → **nRF52840** MCU, scan every **10 min**, batch calibration, **Bluetooth LE**; NFC tap-to-pair; LED + vibration alerts for patients without a smartphone; on-chip flash buffer. **Power:** sleeps between ~**20 s** scans; I_avg ≈ **0.24 mA** (datasheet values); C = (0.24 mA)(24 h)/0.7 ≈ **8.2 mAh** → 40 mAh LiPo has **~5× margin**, >2 days at double current. **nA-level signals:** short traces, guard ring on the WE trace, analog away from antenna, no radio during scans, baseline subtraction, temperature correction; *to be validated* against a lab potentiostat. **Budget call:** skipped the **~$611** AD5940 eval kit (~**40%** of budget), using a custom board from ADI's reference design plus a borrowed lab potentiostat; electronics **~$250 per unit set**. |
| Diagram | Cartridge → pod → BLE → Patient app → Secure server → Doctor portal (SVG-6) |
| Chips | Electrochemical sensing, Square-wave voltammetry, AD5940 AFE, nRF52840 · BLE · NFC, Low-power design, Low-current PCB layout, Hydrogel microneedles, Medical devices |

### 6.3 Smaller course projects

| ID | Title | Course | Status | Content | Chips |
|---|---|---|---|---|---|
| PRJ-003 (L760–773) | Engineering Economics Analysis Toolkit | MSE 261 · Engineering Economics | COMPLETE | Python scripts + Excel models for capital-investment decisions, to solve and check problem sets. PW / AW / FW, **IRR**, incremental IRR, ERR · replacement analysis, after-tax **CCA**, inflation, B/C ratios · sensitivity analysis, decision trees, **CPM project crashing** | Python, Excel, Financial modelling |
| PRJ-004 (L775–783) | Recycling Multilayer Plastic Packaging | NE 333 · Polymer Science · Group project | COMPLETE | Group study of why multilayer packaging is hard to recycle. Sneha **owned the Challenges section** (material incompatibility, separation barriers) and **presented it to the class**. | Polymer blends, Sustainability, Presentation |
| PRJ-005 (L785–793) | Tensor Transformation Solver | NE 318 · Continuum Mechanics | COMPLETE | Python script for tensor coordinate transformations; checks hand derivations; cross-checked against worked analytical solutions. | Python, NumPy, Linear algebra |

## 7. Open Source (§04, L800–943)

**Filters (L803–809):** All **8** · Hardware & EDA **2** · Embedded & Controls **2** · Compilers & Systems **2** · ML & Applied AI **3**. The category counts add up to 9 because `muse` is tagged in both Systems and ML.
**Path timeline (L1010):** all 8 repos were shipped in the **Nov 2026 open-source build sprint**.

| Repo | Lang | Category | Title | Description (key facts) | Stat 1 | Stat 2 | Stat 3 | Chips | Footer tag |
|---|---|---|---|---|---|---|---|---|---|
| **vaclab** | Python | hw | Thin-film lab toolkit: vacuum, leaks, DoE & metrology | Pump-down certification, rate-of-rise and helium-spray leak finding, 2³ sputtering DoE, spectral reflectometry, ion-beam wafer heating. Seeded with **102.6 nm SiNₓ** from her NE 343 lab. | **1.73→0.24 nm** worst-case thickness error after index calibration | **<1%** leak-rate recovery error (vs 16% linear fit) | **28** tests · CI | Vacuum physics, DoE / t-tests, Reflectometry, NumPy · SciPy | Fab · metrology |
| **fabricfit** | C++17 | hw | FPGA place-and-route tool | Island-style FPGA with IO, HSSI transceiver and NoC hard blocks as a routing-resource graph; **simulated-annealing placement**, **PathFinder** negotiated-congestion routing with A*, min channel-width search, static timing, SVG render. | **2,218** blocks routed on a **54×54** device | **−65%** placement cost vs random | **89.5 MHz** Fmax, 200-block design | C++17, CMake, Graph algorithms, STA | EDA · FPGA |
| **zonecore** | C99 | emb | Vehicle controls stack for a quad-motor EV | Embedded C for BMS (2-state **EKF SOC**), DC fast charging, thermal, propulsion, traction control, torque vectoring, functional safety; Python **software-in-the-loop** bench over E2E-protected CAN. | **46/46** ASIL-tagged requirements traced to tests | **32** closed-loop SIL scenarios, **9** fault-injection | **~3.1k** lines C99, no heap, clang-tidy clean | Embedded C, CAN / DBC, ISO 26262 style, SIL testing | Automotive · safety |
| **modcell** | Ladder · Python | emb | Controls package for a robotic module-assembly cell | Rockwell-format **ladder logic** on a custom 10 ms scan engine against a plant model: conveyor, clamps, vision inspection, fastening robot, MES reporting, ISA-101 HMI, ISO 13849 safeguarding concept. | **97** rungs across **12** routines | **~520/h** parts throughput incl. indexing | **10 ms** E-stop to safe state (1 scan) | PLC / ladder, Machine vision, HMI, Functional safety | Manufacturing controls |
| **tilec** | C++17 · LLVM | sys | Tile-based ML kernel compiler → LLVM IR | Triton-style DSL (matmul, softmax, LayerNorm, attention, GELU) → SSA tile IR with CSE/DCE and **kernel fusion** → cache-blocked LLVM IR. FileCheck IR tests, NumPy end-to-end checks, **differential fuzzer**. | **15.7×** tiled matmul vs naive (**38.8 GFLOP/s**) | **1.81×** LayerNorm speed-up from fusion | **2,000** fuzzed programs pass | C++17, LLVM IR, Compilers, ASan / UBSan | Compilers · ML systems |
| **muse** | Go · Python · TS | sys + ml | Visual discovery engine with an online A/B harness | Home-feed recommender: Go serving stack, Python ML pipeline, React client. Corrected **position bias** with inverse-propensity weighting; showed a naive offline metric would have rejected the better model. **"All data is simulated."** | **+14.1%** saves in a 4,000-user *simulated* A/B | **10.7 ms** p99 at **359 QPS** | **0.90** Kendall τ for IPS vs 0.52 naive | Go, Recommender systems, Causal eval, React / TS | RecSys · experimentation |
| **facesolve** | Python · NumPy | ml | Neural blendshape solver for facial capture | Noisy landmark capture → clean blendshape animation as **UsdSkel** for Maya and Houdini. Kabsch stabilization, outlier rejection, MLP with **hand-derived, gradient-checked backprop**, PyTorch/ONNX port. | **0.29 mm** mean vertex error (0.40 least squares) | **~70×** faster than the least-squares solve | **18.8→1.26** landmark RMSE (mm) after cleaning | NumPy, PyTorch · ONNX, USD, Docker · CI | ML · graphics pipeline |
| **coa-forge** | Python | ml | Course-of-action generation & Monte Carlo war-gaming | Candidate plans over a **fictional scenario**: threat-aware A* routing, **NSGA-II** search, pre-screened by a **random-forest surrogate**, stochastic war-gaming, decision brief of **three Pareto-optimal options** with confidence intervals. | **~2,000** COAs war-gamed in **~20 s** on a laptop | **R² 0.97** surrogate hold-out, mission success | **+3.9%** best mission score vs plain NSGA-II | Multi-objective optimization, scikit-learn, Simulation, Docker · CI | Decision support |

**Repo links:** `https://github.com/snehaislamm/<repo>` for each of the 8 repos above.

**Earlier & collaborative work (L934–941):**

| Item | Description | Year | Link |
|---|---|---|---|
| yunus-AI | Flutter financial AI chatbot (OpenAI + Alpha Vantage), Avanade WE Accelerate | 2024 | `https://github.com/zahra-ahmed1/yunus-AI` |
| Selenium_Python_BestBuy | Selenium scraper filtering 75–85″ TV listings by price and sale end date | 2024 | `https://github.com/snehaislamm/Selenium_Python_BestBuy` |
| Ultimate tic-tac-toe | Team Pygame game | 2023 | `https://github.com/varshini811/tic-tac-toe_game` |

## 8. Technical Coursework (§05, L946–978)

**Colour legend:** cyan = Devices & fabrication · violet = Physics · amber = Materials & mechanics · red = Systems, data & economics.

| Code | Title | Status | Topics (chips) | Colour |
|---|---|---|---|---|
| NE 343 | Microfabrication & Thin Films | COMPLETED | Photolithography, Nanopatterning, Junction formation, Thermal oxidation (Deal–Grove), CMOS process flow, Thin-film transistors, PECVD / PVD | cyan |
| NE 344 | Nanoelectronics specialization core | COMPLETED | Nanoelectronics specialization *(the only chip; the content is thin)* | cyan |
| NE 332 | Quantum Mechanics | COMPLETED · CROSS-LISTED CHEM 356 | Schrödinger equation, Tunneling & scattering, Angular momentum, Spherical harmonics, Spin & Pauli matrices, Variational principle | violet |
| NE 333 | Polymer Science | COMPLETED | Step & chain polymerization, ATRP / ROMP, Copolymer composition, GPC · MALDI-TOF · AFM, Tg/Tm · DSC, Flory–Huggins, Biodegradation | amber |
| NE 318 | Continuum Mechanics & Transport | COMPLETED | Shell momentum balances, Laminar & two-fluid flow, Unsteady flow, Conductive heat transfer, Tensor transformations | amber |
| MSE 261 | Engineering Economics | COMPLETED | PW / AW / IRR / ERR, Replacement analysis, Taxes & CCA, Inflation, B/C ratio, Decision trees, CPM crashing | red |

Totals: **6 completed**. *(4 planned-course entries — PHYS 468, SYDE 572, ECE 457B/C, MTE 544 · STAT 341 — were removed from the site on 2026-11-25 at Sneha's request, D8. Do not use them.)*

## 9. Skills (§06, L981–991)

| Group (6) | Items | Count |
|---|---|---|
| Languages | Python, TypeScript, C99 (embedded), C++17, Go, Swift, Java, MATLAB, SQL, Dart | 10 |
| Software & Web | FastAPI, React, PostgreSQL, Supabase, Playwright, BeautifulSoup4, Flutter, REST APIs, CMake, LLVM IR | 10 |
| AI / ML | Gemini API, OpenAI API, LLM summarization, Agentic pipelines, Pinecone, FAISS, PyTorch · ONNX, scikit-learn, NSGA-II, Recommender systems, Speech-to-text, Image recognition | 12 |
| Cloud & DevOps | Azure, AWS, Docker, GitHub Actions CI, Vercel, Git, Jira, Confluence, Claude Code | 9 |
| Hardware & Embedded | CAN bus / DBC, BMS validation, Fault injection, SIL testing, PLC ladder logic, FPGA place & route, LTspice, COMSOL, SolidWorks | 9 |
| Fab & Characterization | PECVD, PVD, Photolithography, Thermal oxidation, Ellipsometry, Profilometry, Reflectometry, C–V measurement, Vacuum & leak testing | 9 |

The site gives **no proficiency levels** for skills. Do not invent any.

**Certifications (L992–995):**

| Badge | Name | How earned |
|---|---|---|
| AZ 900 | Microsoft Azure Fundamentals | Earned through Avanade WE Accelerate, 2024 |
| AI 900 | Microsoft Azure AI Fundamentals | Earned through Avanade WE Accelerate, 2024 |

## 10. Path timeline (§07, L1000–1020)

Legend: cyan ring = Academic · violet ring = Work term · amber ring = Next. The site shows the newest entry first.

| When | Entry | Detail | Type |
|---|---|---|---|
| JAN – AUG 2027 · NEXT | 8-month co-op work term | Open to software engineering, applied AI, embedded systems and nanoelectronics / quantum hardware roles. | Next |
| NOV 2026 | Open-source build sprint | Shipped fabricfit, tilec, zonecore, modcell, muse, facesolve, vaclab and coa-forge to GitHub. | Academic (cyan) |
| FALL 2026 · NOW | 3B · Capstone design proposal & Engineering Ambassador | Presented capstone design (**Nov 24**): wearable microneedle patch; Sneha owns electronics and readout. Representing NE to prospective students. | Academic |
| FEB – MAY 2026 | Communitech · Software Developer Co-op | Shipped an agentic AI ecosystem-monitoring and newsletter platform **to production on Azure**. | Work |
| SEP 2025 – JAN 2026 | The Plug Co · Data Analysis & AI Development Intern | AI-integrated backend, vector search, investor-ready prototype in 12 weeks. | Work |
| 2025 | 3A · Devices & materials | Quantum mechanics, microfabrication, polymer science, engineering economics; fabricated an MIS capacitor. | Academic |
| JAN – APR 2025 | Battery Workforce Challenge · Research Assistant | SoC estimation, embedded fault diagnostics, CAN communication for an EV battery pack. | Work |
| MAY – AUG 2024 | Avanade WE Accelerate · Software Developer | Azure AI workflows, financial AI chatbot, AZ-900 and AI-900. | Work |
| SEP 2023 | Started BASc Nanotechnology Engineering · University of Waterloo | Specialization in nanoelectronics. | Academic |

## 11. Résumé (§08)

> **Updated 2026-11-25:** the sheet was replaced with Sneha's **Reliable Robotics–tailored** résumé (from `Sneha_Islam_Resume_ReliableRobotics.pdf`). The earlier general engineering-co-op version is gone from the page but remains in git history (commit `26caf2a`).

- **Bar:** REV · NOV 2026 · 1 PAGE · button "COPY AS TEXT" · section caption `// displays software · summer 2027` · footnote "Tailored versions available on request."
- **Format:** an HTML sheet styled as paper. **There is still no PDF file in the repo.**
- **Header:** Sneha Islam. Headline: "Displays Software Engineer Intern, **Summer 2027** | JavaScript/TypeScript, React, HTML/CSS, Figma | Safety-Critical Testing". Contact: **Toronto, ON** · **+1 647 457 2005** · s32islam@uwaterloo.ca · linkedin.com/in/SnehaIslam. There is no GitHub link on the sheet.
- **Education:** University of Waterloo · Sep 2023 – Present · Candidate for BASc, Nanotechnology Engineering + Specialization in Nano-Electronics · Waterloo, ON.
- **Experience:**
  - **Communitech** (4 bullets): Figma design-system components with usage guidelines; React/TS + Tailwind UI (settings, archive, Q&A chat); personalization (per-user re-ranking, selectable summary formats and styles, in-app answer ratings); back end FastAPI/PostgreSQL/Gemini, 50+ sources daily, 1,200+ companies; with a teammate, **root-caused 5 of 6 sources silently returning 0 articles** and added a strict validator; code reviews; Docker on Azure.
  - **The Plug Co** (2): Swift (iOS) / Unity (VR) MVPs on FastAPI/PostgreSQL/AWS, <300ms retrieval; investor prototype in 12 weeks, Jira sprints +25%, privacy-by-design (RBAC, AES-256, GDPR Art. 17).
  - **Battery WC** (2): embedded C fault detection + **DTC logging** for overvoltage (**>420 V**), overcurrent (**>250 A**), HVIL breaks, isolation resistance (**<500 kΩ**); automated BMS regression tests and fault injection, −35% testing time; validated 120+ DBC-defined CAN signals between BPCM and EVCU.
  - **Avanade** (1): Flutter/Dart financial AI chatbot (Alpha Vantage + OpenAI) for real-time investing guidance; 10+ client-style presentations.
- **Projects:** **zonecore** — Safety-Critical Real-Time Controls Stack | C99, Python, CAN: ~3.1k LOC C99, no heap, closed-loop Python SIL bench; **47 unit tests**, 32 SIL tests (9 fault-injection cases), 46/46 safety requirements traced in CI; **HARA, alive supervision**.
- **Leadership:** Engineering Ambassador, Fall 2026 – Present (1 bullet).
- **Skills:**
  - *Web & UI:* JavaScript, TypeScript, React, HTML, CSS (Tailwind), Vite, Node.js, GraphQL
  - *Design:* Figma, design systems, user-centered design, prototyping
  - *Back End & Data:* Python, FastAPI, PostgreSQL, SQL, Gemini API, OpenAI API
  - *Testing & Safety:* JS/TS unit and integration tests, Playwright, fault-injection testing, SIL testing, CAN
  - *Other Languages:* C (Embedded), C++, Swift, Dart (Flutter), MATLAB
  - *Tools:* Git, Docker, Azure, AWS, GCP, Linux, Jira, Confluence, Claude Code

**New facts that appear only on the résumé** (not yet elsewhere on the site): Figma design-system work; answer ratings and selectable summary formats; the 5-of-6 silent-source root cause; the fault thresholds >420 V / >250 A / <500 kΩ and DTC logging; zonecore's 47 unit tests, HARA and alive supervision; skills JavaScript, HTML/CSS, Tailwind, Vite, Node.js, GraphQL, Figma, GCP, Linux.

**Where the résumé and the rest of the site now differ** (ask Sneha before reconciling):

| Fact | Résumé | Rest of site |
|---|---|---|
| Next term | **Summer 2027** (Displays SWE intern) | **Winter 2027** co-op (datasheet, Path, contact status "W27") |
| Location | **Toronto, ON** | **Waterloo, ON** (datasheet) |
| Phone number | shown | not shown anywhere else |
| GitHub link | absent | present |
| Communitech org name | "Communitech Corporation" | "Communitech" |
| Plug Co 85%+ accuracy, vector search, 10k+ events | absent | present |
| Avanade AZ-900/AI-900, 3 AI projects, +25%, top-3 | absent | present |
| Battery WC ±2% SoC | absent | present |

## 12. Contact (§09, L1101–1133)

| Item | Content |
|---|---|
| Pitch (verbatim) | "I'm open to co-op roles in **software engineering, applied AI, embedded systems** and **nanoelectronics / quantum hardware**. Email is the best way to reach me." |
| Status chip | ● AVAILABLE · W27 CO-OP |
| Email | `s32islam@uwaterloo.ca` (`mailto:` link + COPY button) |
| LinkedIn | `https://www.linkedin.com/in/SnehaIslam` |
| GitHub | `https://github.com/snehaislamm` |
| Résumé | "View on this page" → `#resume` |

## 13. Footer title block (L1135–1144)

TITLE: SNEHA ISLAM — PORTFOLIO · DRAWN BY: S. ISLAM · REV: 2026.11-D · SHEET: 1 / 1

---

## 14. Reusable SVG diagrams

All SVGs are inline, hand-written and use hard-coded hex colours matching the tokens in §15. **Watch for ID collisions:** several SVGs define `<defs>` IDs (`hatch`, `dots`, `al`, `ar`, `ar2`). If two copies render on the same page, rename the IDs.

| ID | What it shows | Where | viewBox | Animated | IDs in `<defs>` | Reuse value for the game |
|---|---|---|---|---|---|---|
| SVG-1 | Logo: hexagon with a centre node and three spokes | Nav, L312–316 | 0 0 32 32 | no | — | Brand mark / favicon / character emblem. Uses `currentColor` |
| SVG-2 | **MIS capacitor cross-section**: V_G probe, Al (PVD) gate, SiNₓ · PECVD layer, p-Si substrate, depletion region, field lines, ground, t ≈ 102.6 nm callout | Hero FIG. 01, L363–400 | 0 0 420 300 | yes (`.flow` field lines, `.pulse` depletion) | `hatch`, `dots`, `al` | High. The device-fab "how it works" visual |
| SVG-3 | **Agentic newsletter pipeline**: 50+ sources → extract + dedup → summarize (Gemini) → personalize → PostgreSQL → SendGrid, plus Q&A chatbot; stack box with 1,200+ companies | Hero FIG. 02, L404–441 | 0 0 420 300 | yes (`.flow` arrows) | `ar` | High. Signal-flow visual for the Communitech quest |
| SVG-4 | **Communitech system map**: three-tier frontend / backend / {PostgreSQL, Gemini, SendGrid Mon 7 AM ET}, Docker · Azure Container Apps | Experience, L543–568 | 0 0 300 210 | no | `ar2` | High. An architecture visual that pairs with SVG-3 |
| SVG-5 | **C–V curve**: measured (cyan) vs ideal (amber dashed), C_ox, C_min, ΔV_T arrow, gridlines | PRJ-001, L655–670 | 0 0 300 200 | no | — | High. Before/after-style chart for the MIS project |
| SVG-6 | **Capstone cartridge + pod**: microneedle array, PEG hydrogel, WE·CE·Ag/AgCl RE electrode, skin/ISF line, AD5940, nRF52840, 40 mAh LiPo, SWV peak (i_p), LED/buzz, scan / 10 min, BLE → Patient app → Secure server → Doctor portal | PRJ-002, L689–737 | 0 0 300 210 | yes (`.flow`, `.pulse`) | — | High. Already has an `aria-label`; it is a **design** diagram, not a built device |
| SVG-7 | Interest icons ×4: atom, film stack, node graph, line chart | About, L484–517 | 0 0 48 48 each | no | — | Zone/area icons for the 4 interests |
| SVG-8 | Résumé download icon (document + down arrow) | Hero CTA, L341 | 0 0 24 24 | no | — | "Skip to Résumé" button icon |
| SVG-9 | Contact icons: email envelope, LinkedIn, GitHub mark, résumé document | Contact, L1114–1127 | 0 0 24 24 | no | — | Persistent contact dock. The GitHub path contains odd tokens (`2.690`, `5.770`); check how it renders before reusing it |

**No diagram exists for:** The Plug Co, Battery WC, Avanade, Ambassador, PRJ-003/004/005, any of the 8 repos, coursework, or the timeline. Their only visuals are stat tiles and chips, so any new visual would have to be built from the facts above.

CSS-only visual motifs that can be reused: the corner-bracket frame (`.corner c1–c4`), the 3-up stat tile (`.stats`), the datasheet key/value table (`.spec`), the engineering title block (`.tblock`), and the vertical gradient timeline rail (`.tl`).

## 15. Current visual system

### 15.1 CSS custom properties (`:root`, L11–16)

| Token | Value | Role on the site |
|---|---|---|
| `--bg` | `#070b14` | Page background (near-black navy) |
| `--bg2` | `#0c1322` | Inset surfaces, SVG backgrounds |
| `--panel` | `#0f1829` | Cards |
| `--line` | `#1c2a44` | Borders, dividers |
| `--grid` | `rgba(79,209,197,.06)` | Blueprint grid lines |
| `--cyan` | `#4fd1c5` | Primary accent: links, numbers, active states, "software / devices" |
| `--cyan-d` | `#2c9c93` | Hover borders, readout rules |
| `--amber` | `#f6ad55` | "Hardware / materials / next / WIP" |
| `--violet` | `#9f7aea` | "AI / physics / work term", org names |
| `--red` | `#fc8181` | "Cloud / systems / economics" |
| `--text` | `#e2e8f0` | Body text |
| `--muted` | `#8a9bb8` | Secondary text |
| `--dim` | `#56688a` | Captions, labels |
| `--mono` | `'JetBrains Mono', ui-monospace, monospace` | Labels, numbers, nav, chips |
| `--sans` | `'Space Grotesk', system-ui, sans-serif` | Headings, body |

Other hard-coded colours:
- Primary button text `#04201d`, hover `#6fe3d8`.
- H1 accent: gradient cyan → violet.
- Al gradient `#cbd5e0` → `#718096`, and SVG text `#c4b5fd` and `#1a202c`.
- Repo language dots: Python `#3572A5`, C++ `#f34b7d`, C `#555555`, Go `#00ADD8`.
- Résumé sheet: paper `#fbfbf8`, ink `#1b1f27`, headings `#0b1220`, link `#0b5f59`, font Georgia / Times New Roman (serif).

**Colour = category** (used consistently across the site):

| Colour | Experience tags | Project status | Coursework legend | Timeline |
|---|---|---|---|---|
| cyan | SW / Data·AI / Leadership | COMPLETE | Devices & fab | Academic |
| violet | Applied AI | — | Physics | Work term |
| amber | Embedded · Research | DESIGN PROPOSAL (WIP) | Materials & mechanics | Next |
| red | Cloud · AI | — | Systems, data & economics | — |

### 15.2 Typography
- Google Fonts: **Space Grotesk** 400/500/600/700 and **JetBrains Mono** 400/500/700, with `display=swap`.
- H1: `clamp(2.6rem, 6vw, 4.4rem)`, weight 700, letter-spacing −.02em, line-height 1.02.
- H2: 2rem/600. Body line-height 1.6.
- Mono labels: .6–.82rem, uppercase, letter-spacing .06–.14em.

### 15.3 Layout, shape and motion
- Container max-width 1120px with 28px side padding. Sticky blurred nav, 60px tall.
- Border radius: 3px (chips, tags), 4px (buttons, insets), 6px (cards).
- Background: a blueprint grid with 80px major and 16px minor cells.
- Breakpoints: 1000 (nav links hidden), 960, 900, 860, 760, 700, 600, 560, 520px.
- Motion:
  - `.rv` scroll reveal (0.7s fade + 18px rise).
  - `@keyframes flow` (dash offset, 2s linear infinite).
  - `@keyframes pulse` (opacity, 2.4s).
  - Hover lift of −2/−3px.
  - `prefers-reduced-motion` disables the reveal, flow and pulse (L304).
- **Brand motif: an engineering drawing / datasheet.** It shows up as:
  - § section numbers and `// comment` captions
  - "FIG. 01" labels and corner registration marks
  - the "DATASHEET" panel and PRJ-00x IDs
  - the title-block footer (DRAWN BY / REV / SHEET)
  - `▸` bullet glyphs and the hexagon logo

---

## 16. Top-10 recruiter signals (ranked)

Ranking criteria: (a) shipped to real users or production, (b) hard metric attached, (c) rarity for a 3rd-year co-op candidate, (d) relevance across the roles she targets (SWE, applied AI, embedded, nanoelectronics / quantum).

| Rank | Signal | Evidence on the site | Caveat that must travel with it |
|---|---|---|---|
| 1 | **Shipped a production agentic AI system** | Communitech: 50+ sources daily, 1,200+ companies, replaced manual monitoring; "to production on Azure" (L1012); Docker on Azure Container Apps | — |
| 2 | **4 work terms across SWE, AI, embedded and research** | Readout "4 terms"; Communitech, The Plug Co, Battery WC, Avanade | Ambassador is a role, not a 5th term |
| 3 | **Low-latency, accurate AI backend + fast delivery** | The Plug Co: <300 ms retrieval, 85%+ accuracy, 10k+ events, investor-ready prototype in 12 weeks | — |
| 4 | **Embedded / automotive with measurable impact** | Battery WC: ±2% SoC, −35% regression-test time, 120+ CAN signals | — |
| 5 | **Silicon-to-software range: hands-on device fabrication** | MIS capacitor: PECVD/PVD, ellipsometry 102.6 nm, C–V analysis, ~15-page report; carried into vaclab | — |
| 6 | **EDA / hardware tooling in C++** | fabricfit: 2,218 blocks on 54×54, −65% placement cost, 89.5 MHz Fmax | Personal project |
| 7 | **Compiler / ML-systems performance work** | tilec: 15.7× matmul (38.8 GFLOP/s), 1.81× fusion, 2,000 fuzzed programs | Personal project |
| 8 | **Engineering rigour: 8 repos with tests, CI and benchmarks** | 8 repos in one Nov 2026 sprint; zonecore 46/46 ASIL requirements traced, 32 SIL scenarios; vaclab 28 tests | muse numbers are **simulated**; coa-forge uses a **fictional** scenario |
| 9 | **Owns the electronics on a medical-device capstone** | AD5940 + nRF52840 + BLE architecture, ≈8.2 mAh power budget, ≈$55 vs $160 per patient, ≈$1,400 of $1,500 budget | **Design proposal only.** All values are estimates; build runs 2027–28 |
| 10 | **Microsoft certifications** | AZ-900 + AI-900 (Avanade, 2024) | Fundamentals level |

**Must-show logistics** (not ranked signals, but every recruiter looks for these):
- Available for a **Winter 2027 co-op**. The résumé says she is pursuing **8-month** co-ops.
- Location: Waterloo, ON.
- 3B standing, with a long-term goal of quantum computing hardware.

**Numbers that need qualifiers if reused:**
- "projected 40%" (Avanade chatbot)
- "+14.1% … simulated A/B" (muse)
- every capstone figure ("≈", "estimate", "to be validated")
- "+25%" figures, which are stated without a baseline

## 17. Gaps and open questions for Sneha

These are things the redesign will probably need that the current site **does not contain**. Per the shared context, ask Sneha rather than fill these gaps.

1. ~~**Character visual:**~~ *Answered: see D1.* there is no photo, avatar or illustration of Sneha anywhere on the site. What should the main character look like?
2. ~~**Résumé PDF:**~~ *Answered: see D2.* the résumé exists only as HTML. Is there a PDF for "Skip to Résumé" / download?
3. **Dates for PRJ-003 / 004 / 005:** none are shown. The Path suggests 3A (2025) for MSE 261 and NE 333; NE 318 is undated.
4. **NE 344:** its only chip is "Nanoelectronics specialization". Are there real topics to list?
5. ~~**Planned course terms**~~ *Moot: planned courses removed (D8).*
6. **Résumé vs site differences** (§11): Summer vs Winter 2027, Toronto vs Waterloo, and whether the phone number should be public on the site.
7. **Repo stats:** GitHub stars, commits and contributors are not on the site, so they can't be used as game stats unless Sneha adds them.
8. **Skill levels:** none exist. Any XP or level per skill would have to map to counts already on the site (e.g. number of roles or repos using a skill), not to invented scores.
9. ~~**Capstone teammates:**~~ *Answered: see D3.* the site named her three teammates. Does Sneha want teammates shown in the game, and is she comfortable naming them there?
10. **Vercel config:** there is no `vercel.json` or build config in the repo today. The site deploys as a single static `index.html`.

## 18. Decisions from Sneha (2026-11-25)

These answer questions 1, 2 and 9 in §17. They are binding for every downstream agent.

| # | Topic | Decision |
|---|---|---|
| D1 | **Character visual** | Sneha will supply a **Studio Ghibli–style illustration of herself**. It is the official look of the main character. Agents may adapt it for the game (crop, resize, recompose, transparent background, small sprite and portrait variants, colour grading to fit the palette in §15) but must keep it recognisably her. It must not be redrawn as, or mixed with, any existing Ghibli character. Files: see §19. |
| D2 | **Résumé PDF** | The "Skip to Résumé" button links to **`/Sneha_Islam_Resume.pdf`** at the repo root. This is the Reliable Robotics–tailored résumé (same content as the HTML sheet, §11), renamed to a generic filename. The current site's résumé bar already links to it ("PDF ↗"). Note: the PDF includes Sneha's **phone number** and is publicly downloadable once deployed. |
| D3 | **Capstone teammates** | **Do not show teammates' names** anywhere in the game or on the site. Refer to them as "a 4-person team" / "Group 11". Sneha's own role (electronics & readout) stays as stated. Names were removed from the PRJ-002 card in `index.html` on 2026-11-25; it now reads "NE Capstone Design · 4-person team". |

## 19. Character assets (`assets/character/`)

Source: Sneha's Studio Ghibli–style illustration (1086×1448 PNG, 3.1 MB), supplied 2026-11-25. The original is **not** committed; only these web-optimised derivatives are.

**What the character looks like** (for consistent descriptions, alt text and any new art):
- long, wavy, dark-brown hair
- thin round wire-frame glasses
- brown eyes and a warm, slight smile
- a black short-sleeve top with a fine necklace
- a long pale-yellow skirt, with thin bracelets on both wrists
- the pose: leaning on a stone balustrade in a sunny, leafy summer scene with a blue sky, painted in a watercolour style

| File | Size | Dimensions | What it is | Suggested use |
|---|---|---|---|---|
| `sneha-scene.webp` | 204 KB | 900×1200 | Full illustration, downscaled | Title / intro screen, "About" backdrop. Lazy-load it; it is the heaviest asset |
| `sneha-portrait-512.webp` | 41 KB | 512×512 | Head-and-shoulders square crop | Dialogue portrait at 2× (256 px display) |
| `sneha-portrait-256.webp` | 16 KB | 256×256 | Same crop | Dialogue portrait at 1×, character card |
| `sneha-portrait-128.webp` | 4 KB | 128×128 | Same crop | Favicon-scale / small HUD, link-preview candidate |
| `sneha-avatar-256.webp` | 19 KB | 256×256 | Circular crop, transparent corners, cyan (`#4fd1c5`) ring | HUD / player badge / Quest Log avatar |
| `sneha-bust-600.webp` | 80 KB | 600×700 | Waist-up crop with soft transparent edges (oval vignette) | Character beside dialogue or over the dark UI, with no hard rectangle |

Total ≈ 364 KB. **Not done yet:**
- **No true background cutout.** `rembg` isn't installed, and installing it downloads a ~170 MB model. Ask Sneha before adding it.
- **No walking or animated sprites.** Animating the illustration would mean redrawing it, which needs new art.

**Alt text:** "Illustration of Sneha Islam: long wavy brown hair, round glasses, smiling." Keep alt text factual, and don't describe her in ways she hasn't approved.

**Palette note:** the illustration is warm daylight (greens, yellows, sky blue), while the current site is a dark navy blueprint (§15). Matching the two is a redesign decision, so it is left open.

### Further decisions (2026-11-25, answers to brainstorm Q1–Q4)

| # | Topic | Decision | Site updated? |
|---|---|---|---|
| D4 | **Availability** | **8-month co-op, Jan 2027 – Aug 2027.** This replaces "Winter 2027 / W27" everywhere. It matches the résumé headline "Summer 2027" (Jan–Aug covers Winter + Summer). | Yes: datasheet "Next", Path top item, contact status |
| D5 | **Home base** | **Toronto, ON.** Waterloo stays as the university's location. | Yes: datasheet row renamed "Location" → "Home: Toronto, ON" |
| D6 | **Track order** | Fab Line runs **reversed: software → silicon**, ending at the locked Quantum Fab. | n/a (game) |
| D7 | **Phone number in public PDF** | Approved by Sneha. | n/a |
| D8 | **Planned courses** | **Removed** (PHYS 468, SYDE 572, ECE 457B/C, MTE 544 · STAT 341). They add no skill evidence. Don't show them in the game. | Yes: coursework grid and Path item |
| D9 | **Tech stack** | **React + TypeScript** UI, pre-rendered to static HTML. **Python as build-time tooling only** (fact audit, image pipeline). No backend. Deployed on Vercel. | n/a (game) |
| D10 | **Engineering Ambassador** | **Résumé only.** It stays in the résumé (the PDF and the HTML résumé sheet's "Leadership" section) but is **not in the game**: it is not a Quest, not on any Station, Level Card or Quest Log, and not in the Experience section or Path. | Yes: Experience card and Path mention removed; résumé Leadership section kept |
| D11 | **Skill Tree scope** | Includes the résumé-only skills (JavaScript, HTML/CSS, Tailwind, Vite, Node.js, GraphQL, Figma, GCP, Linux) alongside Skills §06. | n/a (game) |
| D12 | **Analytics** | **In v1:** Vercel Web Analytics (cookie-less page views), **free Hobby plan only**. It must be switched on in the Vercel project dashboard; the page only loads Vercel's own `/_vercel/insights/script.js`. If the free event cap is reached, accept a pause in data rather than paying. | Yes: script added to `index.html` |
| D13 | **Avatar** | **Both:** the D1 Ghibli portrait stays the face (Title, dialogue box, HUD). A small **original pixel-art sprite** (changed from flat vector by D14) with 4 states (idle, walk, thinking, celebrate) walks the Track. Sneha produces the sprite from the UX character brief (EXPERIENCE.md §12). Until then, a round avatar marker is the fallback. | n/a (game) |
| D14 | **Visual direction** | **B · Block Biome:** blocky, earthy and game-like. Each Station is a biome: Sky Plains (AI), Mesa (Power), Crystal Cave (Compiler), Snowfield Lab (Cleanroom). Replaces the old navy/cyan palette. Inspired by the colours of sandbox block games and the painterly feel Sneha referenced, as qualities only; no game's art, textures, UI, logos or characters are copied. See `ux-designs/.../DESIGN.md`. | Not yet; the current site keeps its old look until the game is built |
