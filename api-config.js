/* ═══════════════════════════════════════════════════════════════
   api-config.js — Live data integration for Supply Chain Twin
   Public APIs used:
     • Open-Meteo      (free, no key) — weather
     • USGS            (free, no key) — earthquakes
     • NASA EONET      (free, no key) — natural events
     • NOAA            (free, no key, US only) — weather alerts
     • Alpha Vantage   (free key, 25 req/day) — stock quotes
     • EIA             (free key) — US energy prices
═══════════════════════════════════════════════════════════════ */

const ApiConfig = {
  _KEY: 'supplytwin_api_keys',

  get(service) {
    try { return JSON.parse(localStorage.getItem(this._KEY) || '{}')[service] || ''; }
    catch { return ''; }
  },

  set(service, key) {
    try {
      const s = JSON.parse(localStorage.getItem(this._KEY) || '{}');
      s[service] = key;
      localStorage.setItem(this._KEY, JSON.stringify(s));
    } catch {}
  },

  /* ── Open-Meteo (free, no key) ── */
  async fetchWeather(lat, lon) {
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
        `&current=temperature_2m,wind_speed_10m,precipitation,cloud_cover&wind_speed_unit=kmh&timezone=auto`;
      const r = await fetch(url);
      if (!r.ok) return null;
      const d = await r.json();
      const c = d.current;
      return {
        temp_c:    Math.round(c.temperature_2m * 10) / 10,
        wind_kmh:  Math.round(c.wind_speed_10m),
        precip_mm: c.precipitation,
        cloud_pct: c.cloud_cover,
      };
    } catch { return null; }
  },

  /* ── USGS Earthquake API (free, no key) ── */
  async fetchEarthquakes(lat, lon) {
    try {
      const url = `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson` +
        `&latitude=${lat}&longitude=${lon}&maxradiuskm=500&minmagnitude=2.0&limit=10&orderby=time`;
      const r = await fetch(url);
      if (!r.ok) return null;
      const d = await r.json();
      const feats = d.features || [];
      if (!feats.length) return { count: 0, maxMag: 0, nearest: null };
      const maxMag = Math.max(...feats.map(f => f.properties.mag || 0));
      return {
        count: feats.length,
        maxMag: Math.round(maxMag * 10) / 10,
        nearest: feats[0]?.properties?.place || null,
      };
    } catch { return null; }
  },

  /* ── NASA EONET (free, no key) ── */
  async fetchNaturalEvents() {
    try {
      const r = await fetch('https://eonet.gsfc.nasa.gov/api/v3/events?status=open&limit=15');
      if (!r.ok) return null;
      const d = await r.json();
      return (d.events || []).map(e => ({
        title:    e.title,
        category: e.categories?.[0]?.title || 'Ereignis',
        date:     e.geometry?.[0]?.date?.slice(0, 10) || '',
      }));
    } catch { return null; }
  },

  /* ── NOAA Weather Alerts (free, US only) ── */
  async fetchNoaaAlerts(stateCode) {
    try {
      const r = await fetch(`https://api.weather.gov/alerts/active?area=${stateCode}`, {
        headers: { 'User-Agent': 'SupplyChainTwin/1.0 (contact@supplytwin.dev)' },
      });
      if (!r.ok) return null;
      const d = await r.json();
      return (d.features || []).slice(0, 5).map(f => ({
        headline: f.properties.headline || f.properties.event,
        severity: f.properties.severity || 'Unknown',
        event:    f.properties.event || 'Alert',
      }));
    } catch { return null; }
  },

  /* ── Alpha Vantage (API key required) ── */
  async fetchStockQuote(symbol) {
    const key = this.get('alphaVantage');
    if (!key) return null;
    try {
      const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${key}`;
      const r = await fetch(url);
      if (!r.ok) return null;
      const d = await r.json();
      const q = d['Global Quote'];
      if (!q || !q['05. price']) return null;
      return {
        symbol,
        price:      parseFloat(q['05. price']).toFixed(2),
        change:     parseFloat(q['09. change']).toFixed(2),
        changePct:  (q['10. change percent'] || '0%').replace('%', ''),
      };
    } catch { return null; }
  },

  /* ── EIA US Energy (API key required) ── */
  async fetchEnergyPrice() {
    const key = this.get('eia');
    if (!key) return null;
    try {
      const url = `https://api.eia.gov/v2/electricity/retail-sales/data/?api_key=${key}` +
        `&frequency=monthly&data[]=price&facets[stateid][]=US&facets[sectorName][]=commercial` +
        `&sort[0][column]=period&sort[0][direction]=desc&length=1`;
      const r = await fetch(url);
      if (!r.ok) return null;
      const d = await r.json();
      const row = d?.response?.data?.[0];
      if (!row) return null;
      return {
        price_kWh: (parseFloat(row.price) / 100).toFixed(4),
        period:    row.period,
      };
    } catch { return null; }
  },
};

/* ═══════════════════════════════════════════════════════════════
   Settings Modal — injected into every page via DOMContentLoaded
═══════════════════════════════════════════════════════════════ */

(function () {
  const CSS = `
    .st-settings-btn {
      background: none;
      border: 1px solid rgba(255,255,255,0.12);
      color: #6470a0;
      font-size: 0.85rem;
      cursor: pointer;
      padding: 0.28rem 0.55rem;
      border-radius: 5px;
      line-height: 1;
      transition: color 0.2s, border-color 0.2s;
      font-family: inherit;
      flex-shrink: 0;
    }
    .st-settings-btn:hover { color: #e8eaf0; border-color: rgba(255,255,255,0.3); }

    .st-overlay {
      position: fixed; inset: 0; z-index: 9999;
      background: rgba(0,0,0,0.75);
      display: none; align-items: center; justify-content: center;
    }
    .st-overlay.open { display: flex; }

    .st-modal {
      background: #0d1424;
      border: 1px solid rgba(0,229,255,0.18);
      border-radius: 12px;
      padding: 1.5rem;
      width: min(480px, 92vw);
      max-height: 85vh;
      overflow-y: auto;
      font-family: 'Courier New', Consolas, monospace;
      color: #d8dff0;
    }
    .st-modal h2 {
      font-size: 0.88rem;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: #00e5ff;
      margin-bottom: 1.2rem;
      font-family: inherit;
    }
    .st-section-title {
      font-size: 0.62rem;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: #4a5578;
      margin: 1rem 0 0.6rem;
      padding-bottom: 0.3rem;
      border-bottom: 1px solid rgba(255,255,255,0.06);
    }
    .st-free-row {
      display: flex; align-items: center; justify-content: space-between;
      padding: 0.3rem 0;
      font-size: 0.73rem;
      color: #8a93b2;
    }
    .st-badge-live {
      font-size: 0.58rem; font-weight: 700; letter-spacing: 0.06em;
      padding: 0.14rem 0.48rem; border-radius: 999px;
      background: rgba(0,255,136,0.1);
      color: #00ff88;
      border: 1px solid rgba(0,255,136,0.22);
    }
    .st-key-block { margin-top: 0.8rem; }
    .st-key-label {
      font-size: 0.68rem; color: #8a93b2; margin-bottom: 0.35rem;
      display: flex; align-items: center; justify-content: space-between;
    }
    .st-key-label a {
      font-size: 0.6rem; color: #4f8ef7; text-decoration: none;
    }
    .st-key-label a:hover { text-decoration: underline; }
    .st-key-row { display: flex; gap: 0.45rem; align-items: center; }
    .st-key-input {
      flex: 1; padding: 0.42rem 0.65rem;
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 6px; color: #d8dff0;
      font-family: monospace; font-size: 0.73rem;
      outline: none;
    }
    .st-key-input:focus { border-color: rgba(79,142,247,0.5); }
    .st-save-btn {
      padding: 0.42rem 0.75rem;
      background: rgba(79,142,247,0.15);
      border: 1px solid rgba(79,142,247,0.3);
      color: #7eb3ff;
      border-radius: 6px; cursor: pointer;
      font-size: 0.68rem; font-weight: 600;
      font-family: inherit; white-space: nowrap;
      transition: background 0.15s;
    }
    .st-save-btn:hover { background: rgba(79,142,247,0.28); }
    .st-key-status {
      font-size: 0.72rem; min-width: 18px; text-align: center;
    }
    .st-key-status.set   { color: #00ff88; }
    .st-key-status.empty { color: #4a5578; }
    .st-close-row { margin-top: 1.4rem; display: flex; justify-content: flex-end; }
    .st-close-btn {
      padding: 0.42rem 1.1rem;
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.1);
      color: #6470a0; border-radius: 6px;
      cursor: pointer; font-size: 0.73rem;
      font-family: inherit; transition: color 0.15s;
    }
    .st-close-btn:hover { color: #d8dff0; }
    .st-note {
      margin-top: 1rem;
      font-size: 0.62rem; color: #3d4460; line-height: 1.55;
    }
    .st-live-badge {
      display: inline-flex; align-items: center; gap: 0.25rem;
      font-size: 0.58rem; font-weight: 700; letter-spacing: 0.06em;
      padding: 0.1rem 0.45rem; border-radius: 999px; margin-left: 0.5rem;
      background: rgba(0,255,136,0.1);
      color: #00ff88;
      border: 1px solid rgba(0,255,136,0.22);
      vertical-align: middle;
    }
    .st-live-badge::before { content: '●'; font-size: 0.45rem; }
    .st-data-source {
      font-size: 0.6rem; color: #3d4460; margin-top: 0.18rem;
    }
  `;

  const HTML = `
    <div class="st-overlay" id="st-overlay">
      <div class="st-modal">
        <h2>⚙ API-Einstellungen</h2>

        <div class="st-section-title">Kostenlose APIs — kein Key erforderlich</div>
        <div class="st-free-row">
          <span>Open-Meteo Wetter (Echtzeit)</span>
          <span class="st-badge-live">✓ AKTIV</span>
        </div>
        <div class="st-free-row">
          <span>USGS Erdbeben-Feed (500 km Radius)</span>
          <span class="st-badge-live">✓ AKTIV</span>
        </div>
        <div class="st-free-row">
          <span>NASA EONET Naturereignisse (global)</span>
          <span class="st-badge-live">✓ AKTIV</span>
        </div>
        <div class="st-free-row">
          <span>NOAA Wetterwarnungen (US-Standorte)</span>
          <span class="st-badge-live">✓ AKTIV</span>
        </div>

        <div class="st-section-title">API Keys — optional, für Live-Marktdaten</div>

        <div class="st-key-block">
          <div class="st-key-label">
            <span>Alpha Vantage · Aktienkurse (NVDA, ASML, TSM …)</span>
            <a href="https://www.alphavantage.co/support/#api-key" target="_blank" rel="noopener">Kostenlos registrieren →</a>
          </div>
          <div class="st-key-row">
            <input class="st-key-input" id="st-key-av" type="password"
              placeholder="API Key eingeben…" autocomplete="off" />
            <button class="st-save-btn" onclick="stSaveKey('alphaVantage','st-key-av','st-status-av')">Speichern</button>
            <span class="st-key-status empty" id="st-status-av">○</span>
          </div>
        </div>

        <div class="st-key-block">
          <div class="st-key-label">
            <span>EIA · US-Energiepreise</span>
            <a href="https://www.eia.gov/opendata/register.php" target="_blank" rel="noopener">Kostenlos registrieren →</a>
          </div>
          <div class="st-key-row">
            <input class="st-key-input" id="st-key-eia" type="password"
              placeholder="API Key eingeben…" autocomplete="off" />
            <button class="st-save-btn" onclick="stSaveKey('eia','st-key-eia','st-status-eia')">Speichern</button>
            <span class="st-key-status empty" id="st-status-eia">○</span>
          </div>
        </div>

        <p class="st-note">
          Keys werden ausschließlich lokal im Browser (localStorage) gespeichert
          und nie an externe Server übertragen.
        </p>

        <div class="st-close-row">
          <button class="st-close-btn" onclick="stCloseSettings()">Schließen</button>
        </div>
      </div>
    </div>
  `;

  function stSaveKey(service, inputId, statusId) {
    const val = (document.getElementById(inputId)?.value || '').trim();
    ApiConfig.set(service, val);
    const el = document.getElementById(statusId);
    if (el) { el.textContent = val ? '●' : '○'; el.className = `st-key-status ${val ? 'set' : 'empty'}`; }
  }

  function stOpenSettings() {
    document.getElementById('st-overlay').classList.add('open');
    const av  = ApiConfig.get('alphaVantage');
    const eia = ApiConfig.get('eia');
    const avEl  = document.getElementById('st-key-av');
    const eiaEl = document.getElementById('st-key-eia');
    if (avEl)  avEl.value  = av;
    if (eiaEl) eiaEl.value = eia;
    const avS  = document.getElementById('st-status-av');
    const eiaS = document.getElementById('st-status-eia');
    if (avS)  { avS.textContent  = av  ? '●' : '○'; avS.className  = `st-key-status ${av  ? 'set' : 'empty'}`; }
    if (eiaS) { eiaS.textContent = eia ? '●' : '○'; eiaS.className = `st-key-status ${eia ? 'set' : 'empty'}`; }
  }

  function stCloseSettings() {
    document.getElementById('st-overlay').classList.remove('open');
  }

  window.stSaveKey      = stSaveKey;
  window.stOpenSettings = stOpenSettings;
  window.stCloseSettings = stCloseSettings;

  document.addEventListener('DOMContentLoaded', () => {
    const style = document.createElement('style');
    style.textContent = CSS;
    document.head.appendChild(style);
    document.body.insertAdjacentHTML('beforeend', HTML);
    document.getElementById('st-overlay').addEventListener('click', e => {
      if (e.target.id === 'st-overlay') stCloseSettings();
    });
  });
})();
