// ─────────────────────────────────────────────────────────────────────────────
// Supply Chain Twin — Canonical Data Module
// Extracted from detail.html + graph.html — single source of truth for API + MCP
// ─────────────────────────────────────────────────────────────────────────────

export const PHASES = [
  {
    id: '01', icon: '⛏️', name: 'HPQ Sand Mining', color: '#b45309',
    risk: { score: 7.2, level: 'high' },
    location: 'Spruce Pine, NC, USA',
    description: 'Weltweit einzige kommerzielle Quelle für halbleitertaugliches HPQ. Zwei Minen auf 10 km² in Spruce Pine. Ausfall = globaler Chip-Stopp binnen 4–6 Wochen.',
    kpis: [
      { label: 'LKW-Abfahrten/Tag', value: '47', status: 'ok' },
      { label: 'I-26 Highway Status', value: 'FREI', status: 'ok' },
      { label: 'Mining-Output vs. Ziel', value: '94%', status: 'warn' },
      { label: 'Hurrikan-Risiko', value: 'FERN', status: 'ok' },
      { label: 'Ø Reinheit SiO₂', value: '99.9995%', status: 'ok' },
    ],
    riskFactors: [
      { label: 'Geograph. Konzentration', score: 9.5, level: 'crit' },
      { label: 'Naturkatastrophen', score: 7.0, level: 'warn' },
      { label: 'Regulierungsrisiko', score: 5.5, level: 'warn' },
      { label: 'Transportinfrastruktur', score: 6.0, level: 'warn' },
    ],
    companies: [
      { id: 'tqc',     abbr: 'TQC', name: 'The Quartz Corp',   flag: '🇺🇸', country: 'US', share: '~50%', health: 'ok',   ticker: null,   desc: 'JV Imerys+Norsk Mineral. Weltmarktführer HPQ Halbleiter. Betreibt Spruce Pine North Mine.' },
      { id: 'sibelco', abbr: 'SBL', name: 'Sibelco',           flag: '🇧🇪', country: 'BE', share: '~40%', health: 'ok',   ticker: null,   desc: 'Belgische Mineraliengruppe. Chestnut Flats Mine. 240 Standorte in 31 Ländern.' },
      { id: 'msr',     abbr: 'MSR', name: 'Min. Santa Rosa',   flag: '🇧🇷', country: 'BR', share: '~5%',  health: 'ok',   ticker: null,   desc: 'Brasilien – Americas-Backup, geringere Reinheit (~99.99%).' },
    ],
  },
  {
    id: '02', icon: '🔥', name: 'Siliziummetall-Verhüttung', color: '#c2410c',
    risk: { score: 6.8, level: 'medium' },
    location: 'Norwegen · Deutschland · China (Yunnan)',
    description: 'Reduktion von SiO₂ mit Koks bei 1500 °C → metallurgisches Silizium (MG-Si, 98–99% Si). Feedstock für Polysilizium und Aluminium-Legierungen.',
    kpis: [
      { label: 'Energie-Spotpreis', value: '€82/MWh', status: 'warn' },
      { label: 'Si-Metall Preis', value: '$2.15/kg', status: 'ok' },
      { label: 'CN Exportsteuer', value: '25%', status: 'crit' },
      { label: 'Schiffe: NORMAL', value: 'NORMAL', status: 'ok' },
    ],
    riskFactors: [
      { label: 'Energie-Intensität', score: 8.0, level: 'crit' },
      { label: 'CN Exportpolitik', score: 7.5, level: 'warn' },
      { label: 'UFLPA-Risiko', score: 6.5, level: 'warn' },
      { label: 'Preisvolatilität', score: 5.5, level: 'warn' },
    ],
    companies: [
      { id: 'ferroglobe', abbr: 'GSM',  name: 'Ferroglobe',  flag: '🇺🇸', country: 'US', share: '~15%', health: 'ok',   ticker: 'GSM',  desc: 'Weltmarktführer Si-Metall. NYSE: GSM. Werke in USA, Spanien, Frankreich.' },
      { id: 'elkem',      abbr: 'ELK',  name: 'Elkem',       flag: '🇳🇴', country: 'NO', share: '~12%', health: 'ok',   ticker: 'ELK',  desc: 'Oslo Børs: ELK. Norweg. Siliziumhersteller, nachhaltige Wasserkraft-Energie.' },
      { id: 'hoshine',    abbr: 'HSH',  name: 'Hoshine',     flag: '🇨🇳', country: 'CN', share: '~18%', health: 'crit', ticker: null,   desc: 'UFLPA-sanktioniert. Größter CN-Si-Produzent. Keine Westdaten verfügbar.' },
      { id: 'wacker-si',  abbr: 'WCH',  name: 'Wacker Chemie (Si)', flag: '🇩🇪', country: 'DE', share: '~8%', health: 'ok', ticker: 'WCH', desc: 'XETRA: WCH. Burghausen, Bayern. Kombinierter Si-Metall + Polysilizium-Produzent.' },
      { id: 'cn-rest',    abbr: 'CNR',  name: 'CN-Rest (Schätzung)', flag: '🇨🇳', country: 'CN', share: '~47%', health: 'warn', ticker: null, desc: 'Sammelposition übriger chinesischer Si-Hersteller. Hohes UFLPA-Risiko.' },
    ],
  },
  {
    id: '03', icon: '🧪', name: 'Polysilizium-Produktion', color: '#d97706',
    risk: { score: 7.8, level: 'high' },
    location: 'Xinjiang/Sichuan China · Deutschland · Südkorea/Malaysia',
    description: 'Destillation von Trichlorsilan → Hydrierung → Reinigung → Granular- oder Chunkpolysilizium (Reinheit ≥ 11N). Kritisch für Solar + Halbleiter.',
    kpis: [
      { label: 'Polysi-Preis', value: '$6.8/kg', status: 'warn' },
      { label: 'CN-Anteil Global', value: '88%', status: 'crit' },
      { label: 'UFLPA-Enforcement', value: 'AKTIV', status: 'crit' },
      { label: 'Preistrend', value: 'fallend', status: 'warn' },
    ],
    riskFactors: [
      { label: 'CN-Monopol (88%)', score: 9.0, level: 'crit' },
      { label: 'UFLPA-Sanktionsrisiko', score: 8.5, level: 'crit' },
      { label: 'Energiekosten CN', score: 6.0, level: 'warn' },
      { label: 'Preiskollaps-Risiko', score: 7.0, level: 'warn' },
    ],
    companies: [
      { id: 'gcl',     abbr: 'GCL',  name: 'GCL Tech',  flag: '🇨🇳', country: 'CN', share: '~26%', health: 'warn', ticker: '3800.HK', desc: 'HKEX: 3800. Weltgrößter Polysilizium-Hersteller. Xinjiang-Produktion → UFLPA-Risiko.' },
      { id: 'tongwei', abbr: 'TW',   name: 'Tongwei',   flag: '🇨🇳', country: 'CN', share: '~22%', health: 'warn', ticker: '600438.SS', desc: 'SZSE: 600438. Integriert Poly + Zellen. Hauptstandorte Sichuan (kein UFLPA).' },
      { id: 'daqo',    abbr: 'DQ',   name: 'Daqo New Energy', flag: '🇨🇳', country: 'CN', share: '~16%', health: 'warn', ticker: 'DQ', desc: 'NYSE: DQ. Xinjiang-Polysilizium. Höchste Reinheit unter CN-Herstellern.' },
      { id: 'wacker',  abbr: 'WCH',  name: 'Wacker Chemie (Poly)', flag: '🇩🇪', country: 'DE', share: '~10%', health: 'ok', ticker: 'WCH', desc: 'XETRA: WCH. Einziger westlicher Großproduzent. Burghausen + TN-Werk (USA).' },
      { id: 'oci',     abbr: 'OCI',  name: 'OCI Company', flag: '🇰🇷', country: 'KR', share: '~8%', health: 'ok', ticker: 'OCI.KR', desc: 'KRX: OCI. Polysilizium-Werke Malaysia. Non-UFLPA, Expansion in Nordamerika.' },
    ],
  },
  {
    id: '04', icon: '💿', name: 'Silizium-Wafer-Produktion', color: '#2563eb',
    risk: { score: 6.4, level: 'medium' },
    location: 'Japan (70%) · Taiwan · Deutschland · Südkorea',
    description: 'Czochralski-Kristallzucht → 300 mm Polierwafer. JP-Duopol Shin-Etsu + SUMCO kontrolliert ~55% des Weltmarkts.',
    kpis: [
      { label: 'Lieferzeit', value: '14 Wo.', status: 'warn' },
      { label: 'Fab-Auslastung', value: '96%', status: 'ok' },
      { label: 'Yen', value: '¥152', status: 'ok' },
      { label: 'Export-Lizenz JP', value: 'OK', status: 'ok' },
    ],
    riskFactors: [
      { label: 'JP-Duopol', score: 7.5, level: 'warn' },
      { label: 'Yen-Volatilität', score: 5.5, level: 'warn' },
      { label: 'Kapazitätsengpass', score: 6.5, level: 'warn' },
      { label: 'Reinraum-Energie', score: 4.5, level: 'ok' },
    ],
    companies: [
      { id: 'shinetsu',    abbr: 'SHE', name: 'Shin-Etsu Chemical', flag: '🇯🇵', country: 'JP', share: '~30%', health: 'ok', ticker: 'TOELY', desc: 'Globaler Marktführer Halbleiter-Wafer. Beliefert TSMC und alle großen Foundries.' },
      { id: 'sumco',       abbr: 'SMC', name: 'SUMCO Corporation',  flag: '🇯🇵', country: 'JP', share: '~25%', health: 'ok', ticker: 'SMCOY', desc: 'Spezialisiert auf 300-mm-Wafer für Leading-Edge-Knoten. Samsung-Hauptlieferant.' },
      { id: 'globalwafers',abbr: 'GWF', name: 'GlobalWafers',       flag: '🇹🇼', country: 'TW', share: '~17%', health: 'ok', ticker: 'GWF',   desc: 'Expandiert mit US-Fab (Sherman, TX) für CHIPS-Act-Foundry-Kunden.' },
      { id: 'siltronic',   abbr: 'WAF', name: 'Siltronic',          flag: '🇩🇪', country: 'DE', share: '~13%', health: 'ok', ticker: 'WAF',   desc: 'Einziger europäischer Premium-Waferhersteller. Werk in Singapur im Hochlauf.' },
      { id: 'sksiltron',   abbr: 'SKS', name: 'SK Siltron CSi',     flag: '🇰🇷', country: 'KR', share: '~8%',  health: 'ok', ticker: null,   desc: 'SK-Group-Tochter. US-SiC-Wafer-Kapazität für Automotive und AI.' },
    ],
  },
  {
    id: '05', icon: '🔬', name: 'EUV-Lithographie & Chipanlagen', color: '#dc2626',
    risk: { score: 9.1, level: 'critical' },
    location: 'Veldhoven NL (ASML) · Santa Clara CA · Tokyo JP',
    description: 'ASML hält 100% des EUV-Markts. Lieferzeit 18 Monate. High-NA EUV (NA 0.55) für 1,4nm-Knoten. China seit 2023 vom EUV-Zugang ausgesperrt.',
    kpis: [
      { label: 'ASML EUV Backlog', value: '32 Einh.', status: 'warn' },
      { label: 'Lieferzeit', value: '18 Mo.', status: 'crit' },
      { label: 'EUV Uptime', value: '98.2%', status: 'ok' },
      { label: 'CN-Export EUV', value: 'GESPERRT', status: 'crit' },
      { label: 'High-NA Ramp', value: '7 ausgeliefert', status: 'warn' },
    ],
    riskFactors: [
      { label: 'ASML-Monopol', score: 9.8, level: 'crit' },
      { label: 'Lieferkettentiefe', score: 8.5, level: 'crit' },
      { label: 'China-Ausschluss', score: 8.0, level: 'crit' },
      { label: 'Export-Kontrolle NL/USA', score: 8.2, level: 'crit' },
    ],
    companies: [
      { id: 'asml', abbr: 'ASML', name: 'ASML Holding', flag: '🇳🇱', country: 'NL', share: '100% EUV', health: 'warn', ticker: 'ASML', monopoly: true, desc: 'Einziger EUV-Hersteller. NXE:5000 High-NA für 1,4nm-Knoten. Backlog 32 Maschinen. €27.6 Mrd. Umsatz 2023.' },
      { id: 'amat', abbr: 'AMAT', name: 'Applied Materials', flag: '🇺🇸', country: 'US', share: '~19% Anlagen', health: 'warn', ticker: 'AMAT', desc: 'Größter komplementärer Anlagenlieferant. $26.2B Umsatz. 27% CN-Anteil unter Exportkontrolle.' },
      { id: 'lam',  abbr: 'LAM',  name: 'Lam Research',     flag: '🇺🇸', country: 'US', share: '~12% Anlagen', health: 'ok',   ticker: 'LRCX', desc: 'Führend Plasma-Ätzen und ALD-Abscheidung. 94% Auslastung. $17.8B Umsatz.' },
      { id: 'tel',  abbr: 'TEL',  name: 'Tokyo Electron',   flag: '🇯🇵', country: 'JP', share: '~14% Anlagen', health: 'ok',   ticker: 'TOELY',desc: 'Drittgrößter Anlagenlieferant. Coater/Developer. +11% Wachstum.' },
      { id: 'kla',  abbr: 'KLA',  name: 'KLA Corporation',  flag: '🇺🇸', country: 'US', share: '~11% Anlagen', health: 'ok',   ticker: 'KLAC', desc: 'Weltführer Inspektion & Metrologie. ~55% Marktanteil Inspection. $10.5B Umsatz.' },
    ],
  },
  {
    id: '06', icon: '🏭', name: 'Halbleiter-Foundries', color: '#7c3aed',
    risk: { score: 8.8, level: 'critical' },
    location: 'Taiwan (TSMC) · Südkorea · USA · Deutschland',
    description: 'Advanced Node Wafer-Fabrikation. TSMC dominiert 58% des globalen Foundry-Markts und 90%+ der Leading-Edge (≤5nm) Fertigung.',
    kpis: [
      { label: 'Taiwan-Straße Risiko', value: 'ERHÖHT', status: 'warn' },
      { label: 'Wasser TSMC', value: 'NORMAL', status: 'ok' },
      { label: 'TSMC Auslastung', value: '97%', status: 'ok' },
      { label: 'AZ N2-Ramp', value: '67%', status: 'warn' },
    ],
    riskFactors: [
      { label: 'Taiwan-Konzentration', score: 9.5, level: 'crit' },
      { label: 'Geopolitik Taiwan', score: 9.0, level: 'crit' },
      { label: 'TSMC-Technologiemonopol', score: 8.5, level: 'crit' },
      { label: 'Wasserversorgung', score: 5.0, level: 'ok' },
    ],
    companies: [
      { id: 'tsmc',           abbr: 'TSM',  name: 'TSMC',            flag: '🇹🇼', country: 'TW', share: '~58%', health: 'warn', ticker: 'TSM',  monopoly: true, desc: 'Fertigt N3/N2. Einzige Quelle für NVIDIA H100/B200 und Apple M-Chips. $90B Umsatz 2024.' },
      { id: 'samsung-foundry',abbr: 'SAM',  name: 'Samsung Foundry', flag: '🇰🇷', country: 'KR', share: '~13%', health: 'ok',   ticker: null,   desc: 'Bietet 3GAE/4-nm-Knoten. Produziert Qualcomm- und Google-Tensor-Chips.' },
      { id: 'intel-foundry',  abbr: 'IFS',  name: 'Intel Foundry',   flag: '🇺🇸', country: 'US', share: '~7%',  health: 'warn', ticker: 'INTC', desc: 'Intel 18A-Prozess in Entwicklung. CHIPS-Act-geförderter Aufbau externer Kundenfertigung.' },
      { id: 'gf',             abbr: 'GFS',  name: 'GlobalFoundries', flag: '🇺🇸', country: 'US', share: '~7%',  health: 'ok',   ticker: 'GFS',  desc: 'Spezialisiert auf 12-nm-plus, RF/Analog, sicherheitsrelevante Chips.' },
      { id: 'smic',           abbr: 'SMIC', name: 'SMIC',            flag: '🇨🇳', country: 'CN', share: '~6%',  health: 'warn', ticker: null,   desc: 'Chinas größte Foundry. Auf 14nm+ begrenzt (kein EUV-Zugang).' },
    ],
  },
  {
    id: '07', icon: '🧠', name: 'KI-Chip-Design', color: '#6d28d9',
    risk: { score: 8.3, level: 'critical' },
    location: 'Santa Clara CA · Mountain View CA',
    description: 'NVIDIA dominiert ~80% der AI-GPU-Nachfrage. CUDA-Ökosystem = Lock-in. Alle NVIDIA-GPUs von TSMC gefertigt. US-Exportkontrollen sperren CN.',
    kpis: [
      { label: 'H100 Spot-Preis', value: '$28k', status: 'warn' },
      { label: 'B200 Yield', value: '71%', status: 'warn' },
      { label: 'Lieferzeit', value: '8 Wo.', status: 'warn' },
      { label: 'US-BIS Export', value: 'AKTIV', status: 'crit' },
    ],
    riskFactors: [
      { label: 'NVIDIA-Monopol', score: 8.5, level: 'crit' },
      { label: 'TSMC-Abhängigkeit', score: 9.2, level: 'crit' },
      { label: 'US-Export-Kontrollen', score: 8.0, level: 'crit' },
      { label: 'HBM/Interposer-Knappheit', score: 7.5, level: 'warn' },
    ],
    companies: [
      { id: 'nvidia',     abbr: 'NVDA', name: 'NVIDIA',          flag: '🇺🇸', country: 'US', share: '~80%', health: 'warn', ticker: 'NVDA', monopoly: true, desc: 'H100/B200/GB200 NVL72. CUDA ~4M Dev. $3.2T Marktkapitalisierung. Q1 2025: $22.6B.' },
      { id: 'amd-gpu',    abbr: 'AMD',  name: 'AMD',             flag: '🇺🇸', country: 'US', share: '~8%',  health: 'ok',   ticker: 'AMD',  desc: 'MI300X (192GB HBM3). ROCm-Stack verbessert sich. $2.3B/Q AI-Umsatz.' },
      { id: 'google-tpu', abbr: 'TPU',  name: 'Google TPU',      flag: '🇺🇸', country: 'US', share: '~5%',  health: 'ok',   ticker: 'GOOGL',desc: 'TPU v5p/v6 für Gemini-Training. GCP extern verfügbar.' },
      { id: 'aws-trnm',   abbr: 'TRN',  name: 'Amazon Trainium', flag: '🇺🇸', country: 'US', share: '~3%',  health: 'ok',   ticker: 'AMZN', desc: 'Trainium 2 GA Q3 2025. Anthropic-Trainingscluster. -40% Kosten vs H100.' },
      { id: 'intel-gaudi',abbr: 'GDI',  name: 'Intel Gaudi 3',   flag: '🇺🇸', country: 'US', share: '~2%',  health: 'warn', ticker: 'INTC', desc: 'Gaudi 3 als NVIDIA-Alternative. SW-Ökosystem lückenhaft. Geringe Marktakzeptanz.' },
    ],
  },
  {
    id: '08', icon: '🖥️', name: 'Server- & Systemintegration', color: '#0891b2',
    risk: { score: 5.4, level: 'medium' },
    location: 'San Jose CA · Round Rock TX · Houston TX',
    description: 'GPU-Cluster-Server · HGX/NVL-Module · Networking · Kühlsysteme. HGX-Module (8×GPU + Interposer + NVLink) sind kritischer Engpass.',
    kpis: [
      { label: 'Lieferzeit', value: '12 Wo.', status: 'warn' },
      { label: 'kW/Rack avg', value: '42 kW', status: 'ok' },
      { label: 'HGX-Module', value: 'KNAPP', status: 'crit' },
      { label: 'Auslastung', value: '94%', status: 'ok' },
    ],
    riskFactors: [
      { label: 'HGX-Modul-Knappheit', score: 7.5, level: 'warn' },
      { label: 'Kühlsystem-Komplexität', score: 6.0, level: 'warn' },
      { label: 'Entity-List CN-Anbieter', score: 5.5, level: 'warn' },
      { label: 'Energiedichte-Limits', score: 5.0, level: 'warn' },
    ],
    companies: [
      { id: 'nvidia-dgx', abbr: 'DGX',  name: 'NVIDIA DGX / HGX', flag: '🇺🇸', country: 'US', share: '~38%', health: 'warn', ticker: 'NVDA', desc: 'DGX H100/B200 und GB200 NVL72 — integrierte AI-Server mit 72 Blackwell-GPUs.' },
      { id: 'supermicro', abbr: 'SMCI', name: 'Supermicro',        flag: '🇺🇸', country: 'US', share: '~23%', health: 'ok',   ticker: 'SMCI', desc: 'Größter ODM für GPU-Server. Direkte Hyperscaler-Lieferungen. Schnellste Time-to-Market.' },
      { id: 'dell',       abbr: 'DELL', name: 'Dell Technologies',  flag: '🇺🇸', country: 'US', share: '~14%', health: 'ok',   ticker: 'DELL', desc: 'PowerEdge XE9680 mit 8× H100/B200. Enterprise-Support und Services-Fokus.' },
      { id: 'hpe',        abbr: 'HPE',  name: 'HPE',               flag: '🇺🇸', country: 'US', share: '~9%',  health: 'ok',   ticker: 'HPE',  desc: 'ProLiant DL380a Gen11 und Cray-basierte HPC/AI-Supercomputing-Systeme.' },
      { id: 'inspur',     abbr: 'INS',  name: 'Lenovo / Inspur',   flag: '🇨🇳', country: 'CN', share: '~10%', health: 'crit', ticker: null,   desc: 'Inspur auf US-Entity-List. APAC-Markt-Dominanz. Wachsende Exportbeschränkungen.' },
    ],
  },
  {
    id: '09', icon: '🏗️', name: 'Hyperscale-Rechenzentren', color: '#0d9488',
    risk: { score: 5.1, level: 'medium' },
    location: 'USA (global) · Dublin IE · Singapore SG',
    description: 'Cloud-Infrastruktur für KI-Training & Inferenz. US-Oligopol aus AWS/Azure/GCP kontrolliert ~67% des globalen Cloud-Markts.',
    kpis: [
      { label: 'PUE', value: '1.18', status: 'ok' },
      { label: 'GPU-Kap. frei', value: '23%', status: 'crit' },
      { label: 'Netzanschluss', value: '14 Mo.', status: 'warn' },
      { label: 'Erneuerbar', value: '68%', status: 'ok' },
    ],
    riskFactors: [
      { label: 'Stromanschluss-Engpass', score: 8.0, level: 'crit' },
      { label: 'GPU-Kapazitätsmangel', score: 7.5, level: 'warn' },
      { label: 'Wasser/Kühlung', score: 5.5, level: 'warn' },
      { label: 'Regulierung/Datenschutz', score: 4.5, level: 'ok' },
    ],
    companies: [
      { id: 'aws',    abbr: 'AWS',   name: 'Amazon AWS',      flag: '🇺🇸', country: 'US', share: '~31%', health: 'ok',   ticker: 'AMZN',  desc: 'Größter Cloud. UltraClusters 20k+ H100. Eigene Trainium/Inferentia-Chips.' },
      { id: 'azure',  abbr: 'AZUR',  name: 'Microsoft Azure', flag: '🇺🇸', country: 'US', share: '~24%', health: 'ok',   ticker: 'MSFT',  desc: 'OpenAI-Exklusivpartner. GPT-Infrastruktur. Maia-Eigenentwicklung.' },
      { id: 'gcp',    abbr: 'GCP',   name: 'Google Cloud',    flag: '🇺🇸', country: 'US', share: '~12%', health: 'ok',   ticker: 'GOOGL', desc: 'TPU-Pods + GPU-Cluster. Gemini-Training auf TPU v5p.' },
      { id: 'meta',   abbr: 'META',  name: 'Meta (DC)',       flag: '🇺🇸', country: 'US', share: '~8%',  health: 'ok',   ticker: 'META',  desc: '350k H100-Cluster. Llama-Training. Eigene AI-Infra-Sparte.' },
      { id: 'oracle', abbr: 'OCI',   name: 'Oracle Cloud',    flag: '🇺🇸', country: 'US', share: '~5%',  health: 'ok',   ticker: 'ORCL',  desc: 'NVIDIA-Supercluster-Partner. xAI-Verträge. Schnell wachsendes GPU-Segment.' },
    ],
  },
  {
    id: '10', icon: '⚡', name: 'Energieinfrastruktur', color: '#16a34a',
    risk: { score: 4.2, level: 'low' },
    location: 'USA (Southeast · Midwest) · Europa',
    description: 'Strom- & Kühlversorgung für AI-Rechenzentren. Wachstum +40% p.a. Datenzentrum-Strombedarf. Nuklear-Renaissance als AI-Enabler.',
    kpis: [
      { label: 'Strompreis', value: '$0.089/kWh', status: 'ok' },
      { label: 'Erneuerbar-Anteil', value: '42%', status: 'ok' },
      { label: 'Nuklear Uptime', value: '94%', status: 'ok' },
      { label: 'Geplante Kapazität', value: '+12 GW', status: 'ok' },
    ],
    riskFactors: [
      { label: 'Netzkapazität-Engpass', score: 6.5, level: 'warn' },
      { label: 'Nukleare Genehmigungen', score: 5.0, level: 'warn' },
      { label: 'Wetterabhängigkeit', score: 4.5, level: 'ok' },
      { label: 'Regulierung', score: 3.5, level: 'ok' },
    ],
    companies: [
      { id: 'nextera',      abbr: 'NEE',  name: 'NextEra Energy',   flag: '🇺🇸', country: 'US', share: '~17%', health: 'ok', ticker: 'NEE',  desc: 'Weltgrößter Wind/Solar-Betreiber. PPA-Strom an AWS, Google, Meta.' },
      { id: 'constellation',abbr: 'CEG',  name: 'Constellation',    flag: '🇺🇸', country: 'US', share: '~13%', health: 'ok', ticker: 'CEG',  desc: 'Größter US-Kernkraft-Betreiber (21 Reaktoren). Three Mile Island für Microsoft reaktiviert.' },
      { id: 'duke',         abbr: 'DUK',  name: 'Duke Energy',      flag: '🇺🇸', country: 'US', share: '~10%', health: 'ok', ticker: 'DUK',  desc: 'Versorgt DC-Cluster in North Carolina / Virginia. Erneuerbare + Gas-Mix.' },
      { id: 'aes',          abbr: 'AES',  name: 'AES Corporation',  flag: '🇺🇸', country: 'US', share: '~8%',  health: 'ok', ticker: 'AES',  desc: 'Batterie-Storage und Solar-PPAs für Hyperscaler. Globale Diversifikation.' },
      { id: 'smr-cons',     abbr: 'SMR',  name: 'SMR-Konsortium',   flag: '🇺🇸', country: 'US', share: '~2%',  health: 'ok', ticker: null,   desc: 'NuScale/Kairos/X-energy. Kleine Modulare Reaktoren als On-Site-DC-Stromquelle ab ~2028.' },
    ],
  },
];

// ─── Graph Edges (material/energy flows between phases) ───────────────────────
export const EDGES = [
  { from: '01', to: '02', transport: '🚛 LKW / 🚂 Rail',       material: 'HPQ-Quarz',         km: '500–8.000 km',   color: 'rgba(180,83,9,.5)',   vol: { day: '490 t/d',     month: '14,7 kt',   year: '176 kt' } },
  { from: '02', to: '03', transport: '🚢 Container / 🚛 LKW',  material: 'Si-Metall',          km: '2.000–18.000 km',color: 'rgba(194,65,12,.5)',  vol: { day: '1.200 t/d',   month: '36 kt',     year: '432 kt' } },
  { from: '03', to: '04', transport: '✈️ Luft / 🚢 See',        material: 'Polysilizium',       km: '1.000–12.000 km',color: 'rgba(217,119,6,.5)',  vol: { day: '300 t/d',     month: '9 kt',      year: '108 kt' } },
  { from: '04', to: '05', transport: '✈️ Luft / 🚚 LKW',        material: 'Wafer & Equipment',  km: '5.000–10.000 km',color: 'rgba(37,99,235,.5)',  vol: { day: '2,2M Wafer/d',month: '66M Wafer', year: '790M Wafer' } },
  { from: '05', to: '06', transport: '✈️ Schwerlast-Luft',      material: 'EUV-Anlagen',        km: '8.000–12.000 km',color: 'rgba(220,38,38,.5)',  vol: { day: '~1 EUV/d',   month: '35 Anl.',   year: '420 Anl.' } },
  { from: '06', to: '07', transport: '✈️ Air Express',           material: 'Chips',              km: '2.000–12.000 km',color: 'rgba(124,58,237,.5)', vol: { day: '22M Chips/d', month: '660M',      year: '7,9 Mrd.' } },
  { from: '07', to: '08', transport: '✈️ Luft / 🚛 LKW',        material: 'GPUs',               km: '100–5.000 km',   color: 'rgba(109,40,217,.5)', vol: { day: '40k GPUs/d',  month: '1,2M GPU',  year: '14,4M GPU' } },
  { from: '08', to: '09', transport: '🚛 LKW / ✈️ Charter',     material: 'Server',             km: '50–3.000 km',    color: 'rgba(8,145,178,.5)',  vol: { day: '400 Server/d',month: '12k Server',year: '144k Server' } },
  { from: '10', to: '09', transport: '⚡ Stromnetz',             material: 'Elektrizität (+40%)',km: 'Regional Grid',  color: 'rgba(22,163,74,.7)',  vol: { day: '380 GWh/d',   month: '11,4 TWh',  year: '137 TWh' }, reverse: true },
];

// ─── Inventory / Supply Shock Survival ───────────────────────────────────────
export const INVENTORY = {
  tqc:           { days: 42,  trend: '+2d',    source: 'FMP · Imerys Annual Report',    note: 'Stockpile/Tagesförderung' },
  sibelco:       { days: 38,  trend: '−1d',    source: 'Öff. Berichte',                 note: 'Stockpile/Tagesförderung' },
  ferroglobe:    { days: 22,  trend: 'stabil', source: 'NYSE: GSM · FMP 10-Q',          note: 'Fertigwaren / DIO Q4 2024' },
  elkem:         { days: 28,  trend: '+4d',    source: 'Oslo Børs: ELK · FMP',          note: 'Fertigwaren & WIP' },
  hoshine:       { days: null,trend: null,     source: 'Keine Westdaten',               note: 'UFLPA-sanktioniert' },
  'wacker-si':   { days: 18,  trend: '−2d',    source: 'XETRA: WCH · FMP',             note: 'DIO Balance Sheet 2024' },
  'cn-rest':     { days: 14,  trend: 'unbek.', source: 'Schätzung',                     note: 'Schätzung Branchenø' },
  gcl:           { days: 11,  trend: '−3d',    source: 'HKEX: 3800 · FMP',             note: 'Granular Poly / Tagesoutput' },
  tongwei:       { days: 14,  trend: 'stabil', source: 'SZSE: 600438 · FMP',           note: 'DIO Jahresabschluss 2024' },
  daqo:          { days: 16,  trend: '+2d',    source: 'NYSE: DQ · FMP 10-K',           note: 'DIO = Inv/COGS×365' },
  wacker:        { days: 19,  trend: '−2d',    source: 'XETRA: WCH · FMP',             note: 'DIO Balance Sheet 2024' },
  oci:           { days: 22,  trend: 'stabil', source: 'KRX: OCI · FMP',               note: 'EG-Poly Lager Malaysia' },
  shinetsu:      { days: 35,  trend: '+1d',    source: 'TYO: 4063 · FMP',              note: 'Wafer WIP / Tagesumsatz' },
  sumco:         { days: 28,  trend: 'stabil', source: 'TYO: 3436 · FMP',              note: 'DIO Balance Sheet Q3 2024' },
  globalwafers:  { days: 40,  trend: '+5d',    source: 'TWSE: 6488 · FMP',             note: 'Wafer Lager + WIP' },
  siltronic:     { days: 32,  trend: 'stabil', source: 'XETRA: WAF · FMP',             note: 'DIO Annual Report 2024' },
  sksiltron:     { days: 25,  trend: '+3d',    source: 'KRX: SK Siltron · FMP',        note: 'SiC + Si Wafer kombiniert' },
  asml:          { days: 180, trend: '+20d',   source: 'NASDAQ: ASML · FMP 20-F',      note: 'Backlog-basiert · 18 Mo. Lead' },
  amat:          { days: 45,  trend: '+3d',    source: 'NASDAQ: AMAT · FMP 10-Q',      note: 'Spare Parts + WIP Anlagen' },
  lam:           { days: 38,  trend: 'stabil', source: 'NASDAQ: LRCX · FMP 10-Q',      note: 'DIO Quartalsbericht' },
  tel:           { days: 42,  trend: '+2d',    source: 'TYO: 8035 · FMP',              note: 'DIO Annual Report 2024' },
  kla:           { days: 55,  trend: '+4d',    source: 'NASDAQ: KLAC · FMP 10-Q',      note: 'Inspektion-Ersatzteile hoch' },
  tsmc:          { days: 45,  trend: '+2d',    source: 'TWSE: 2330 · FMP 20-F',        note: 'WIP Wafer / Tagesumsatz' },
  'samsung-foundry': { days: 52, trend: 'stabil', source: 'KRX: Samsung · FMP',        note: 'Foundry WIP integriert' },
  'intel-foundry':   { days: 38, trend: '−5d',   source: 'NASDAQ: INTC · FMP 10-Q',   note: 'IFS WIP anteilig' },
  gf:            { days: 44,  trend: '+1d',    source: 'NASDAQ: GFS · FMP 10-Q',       note: 'DIO 12nm/RF Wafer' },
  smic:          { days: 48,  trend: '+8d',    source: 'HKEX: 981 · FMP',              note: 'Bestandsaufbau Binnenmarkt' },
  nvidia:        { days: 28,  trend: '+7d',    source: 'NASDAQ: NVDA · FMP 10-Q',      note: 'Finished GPU / Tageslieferung' },
  'amd-gpu':     { days: 35,  trend: '+3d',    source: 'NASDAQ: AMD · FMP 10-Q',       note: 'MI300X Fertiglager Q1 2025' },
  'google-tpu':  { days: null,trend: null,     source: 'Nicht öffentlich',              note: 'Intern — keine Offenlegung' },
  'aws-trnm':    { days: null,trend: null,     source: 'Nicht öffentlich',              note: 'Intern — keine Offenlegung' },
  'intel-gaudi': { days: 28,  trend: '−3d',    source: 'NASDAQ: INTC · FMP 10-Q',      note: 'Gaudi 3 Lager anteilig' },
  'nvidia-dgx':  { days: 14,  trend: '−6d',    source: 'NASDAQ: NVDA · FMP 10-Q',      note: 'HGX Module hochnachgefragt' },
  supermicro:    { days: 22,  trend: '−4d',    source: 'NASDAQ: SMCI · FMP 10-Q',      note: 'DIO lean ODM-Modell' },
  dell:          { days: 32,  trend: 'stabil', source: 'NYSE: DELL · FMP 10-Q',        note: 'PowerEdge Fertiglager' },
  hpe:           { days: 38,  trend: '+2d',    source: 'NYSE: HPE · FMP 10-Q',         note: 'ProLiant + Cray-Teile' },
  inspur:        { days: null,trend: null,     source: 'Keine Westdaten',               note: 'Entity-List sanktioniert' },
  aws:           { days: 60,  trend: '+8d',    source: 'Schätzung · AWS CapEx',         note: 'GPU Kapazitätspuffer' },
  azure:         { days: 30,  trend: '+2d',    source: 'Schätzung · MSFT 10-Q',         note: 'GPU + Server Vorhaltung' },
  gcp:           { days: 75,  trend: '+12d',   source: 'Schätzung · Alphabet 10-Q',     note: 'TPU + H100 Puffer' },
  meta:          { days: 45,  trend: '+5d',    source: 'Schätzung · Meta 10-Q',         note: '350k H100 Überschuss' },
  oracle:        { days: 90,  trend: '+20d',   source: 'Schätzung · OCI CapEx',         note: 'xAI-Cluster Vorhaltung' },
  nextera:       { days: 0,   trend: null,     source: 'N/A',                           note: 'Wind/Solar kontinuierlich' },
  constellation: { days: 540, trend: '+30d',   source: 'NRC · 10-K · FMP',             note: '18-Monats Kernbrennstoffzyklus' },
  duke:          { days: 45,  trend: 'stabil', source: 'NYSE: DUK · FMP 10-Q',         note: 'Gas-Reservoire + Storage' },
  aes:           { days: 30,  trend: '+5d',    source: 'NYSE: AES · FMP 10-Q',         note: 'Batteriespeicher Ø Puffer' },
  'smr-cons':    { days: null,trend: null,     source: 'N/A',                           note: 'Vorproduktion' },
};

// ─── Derived helpers ──────────────────────────────────────────────────────────
export function getPhase(id) {
  return PHASES.find(p => p.id === String(id).padStart(2, '0')) ?? null;
}

export function getCompany(id) {
  for (const phase of PHASES) {
    const co = phase.companies.find(c => c.id === id);
    if (co) return { ...co, phaseId: phase.id, phaseName: phase.name, phaseColor: phase.color, inventory: INVENTORY[id] ?? null };
  }
  return null;
}

export function getInventoryRisk(maxDays = 30) {
  return Object.entries(INVENTORY)
    .filter(([, v]) => v.days !== null && v.days <= maxDays)
    .map(([id, v]) => ({ companyId: id, ...v, company: getCompany(id) }))
    .sort((a, b) => a.days - b.days);
}

export function getCriticalBottlenecks() {
  return PHASES
    .filter(p => p.risk.level === 'critical')
    .map(p => ({
      phaseId: p.id,
      name: p.name,
      riskScore: p.risk.score,
      monopolies: p.companies.filter(c => c.monopoly).map(c => c.name),
      topRiskFactor: p.riskFactors.sort((a, b) => b.score - a.score)[0],
    }))
    .sort((a, b) => b.riskScore - a.riskScore);
}

export function searchCompanies(query) {
  const q = query.toLowerCase();
  const results = [];
  for (const phase of PHASES) {
    for (const co of phase.companies) {
      if (co.name.toLowerCase().includes(q) || co.abbr.toLowerCase().includes(q) || co.id.includes(q) || (co.ticker && co.ticker.toLowerCase().includes(q))) {
        results.push({ ...co, phaseId: phase.id, phaseName: phase.name, inventory: INVENTORY[co.id] ?? null });
      }
    }
  }
  return results;
}

export function getDisruptionImpact(phaseId) {
  const phase = getPhase(phaseId);
  if (!phase) return null;
  const downstreamEdges = EDGES.filter(e => e.from === phaseId);
  const upstreamEdges   = EDGES.filter(e => e.to   === phaseId);
  const downstream = downstreamEdges.map(e => ({
    phaseId: e.to, phaseName: getPhase(e.to)?.name, material: e.material, transport: e.transport,
    avgInventoryDays: (() => {
      const p = getPhase(e.to);
      if (!p) return null;
      const days = p.companies.map(c => INVENTORY[c.id]?.days).filter(d => d != null);
      return days.length ? Math.round(days.reduce((a, b) => a + b, 0) / days.length) : null;
    })(),
  }));
  return { phaseId, phaseName: phase.name, riskScore: phase.risk.score, upstreamEdges, downstreamEdges, downstream, estimatedShockDays: Math.min(...phase.companies.map(c => INVENTORY[c.id]?.days ?? 999).filter(d => d > 0)) };
}
