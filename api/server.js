// ─────────────────────────────────────────────────────────────────────────────
// Supply Chain Twin — REST API + SSE Events + MCP HTTP Server
//
// Endpoints:
//   GET  /api/v1/phases                    all phases
//   GET  /api/v1/phases/:id                phase detail
//   GET  /api/v1/phases/:id/companies      companies in phase
//   GET  /api/v1/phases/:id/companies/:cid company detail
//   GET  /api/v1/phases/:id/inventory      inventory buffers for phase
//   GET  /api/v1/phases/:id/risk           risk factors for phase
//   GET  /api/v1/graph                     nodes + edges
//   GET  /api/v1/risk-summary              cross-chain risk summary
//   GET  /api/v1/inventory/risk?max_days=N companies below threshold
//   GET  /api/v1/bottlenecks               critical single-points-of-failure
//   GET  /api/v1/disruption/:id            cascade impact simulation
//   GET  /api/v1/search?q=                 search companies
//   GET  /api/v1/events                    SSE stream (subscribe)
//   POST /api/v1/events/emit               manual event emit (dev/test)
//   ALL  /mcp                              MCP HTTP (Streamable HTTP transport)
// ─────────────────────────────────────────────────────────────────────────────

import express from 'express';
import cors    from 'cors';
import { randomUUID } from 'node:crypto';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { PHASES, EDGES, INVENTORY, getPhase, getCompany, getInventoryRisk, getCriticalBottlenecks, searchCompanies, getDisruptionImpact } from './data.js';
import { bus, startMockGenerator, emitManual } from './events.js';
import { registerTools, registerResources } from './tools.js';

const PORT = process.env.PORT || 3001;

const app = express();
app.use(cors());
app.use(express.json());

// ── Minimal API key auth middleware (optional) ─────────────────────────────────
// Set env var SUPPLYTWIN_API_KEY to require auth, else open access.
const REQUIRED_KEY = process.env.SUPPLYTWIN_API_KEY;
function auth(req, res, next) {
  if (!REQUIRED_KEY) return next();
  const key = req.headers['x-api-key'] || req.query.apikey;
  if (key === REQUIRED_KEY) return next();
  res.status(401).json({ error: 'Unauthorized', hint: 'Provide x-api-key header or ?apikey= query param' });
}

// ── Helper ─────────────────────────────────────────────────────────────────────
function ok(res, data, meta = {}) {
  res.json({ ok: true, ts: new Date().toISOString(), ...meta, data });
}

function notFound(res, msg) {
  res.status(404).json({ ok: false, error: msg });
}

// ─────────────────────────────────────────────────────────────────────────────
// REST ROUTES
// ─────────────────────────────────────────────────────────────────────────────
const api = express.Router();
api.use(auth);

// Health
api.get('/health', (_, res) => res.json({ ok: true, service: 'supplytwin-api', version: '1.0.0', ts: new Date().toISOString() }));

// All phases (summary)
api.get('/phases', (_, res) => {
  ok(res, PHASES.map(p => ({
    id: p.id, name: p.name, icon: p.icon, color: p.color,
    risk: p.risk, location: p.location, companyCount: p.companies.length,
  })));
});

// Phase detail
api.get('/phases/:id', (req, res) => {
  const phase = getPhase(req.params.id);
  if (!phase) return notFound(res, `Phase "${req.params.id}" not found`);
  ok(res, {
    ...phase,
    companies: phase.companies.map(co => ({ ...co, inventory: INVENTORY[co.id] ?? null })),
    edges: { incoming: EDGES.filter(e => e.to === phase.id), outgoing: EDGES.filter(e => e.from === phase.id) },
  });
});

// Companies in phase
api.get('/phases/:id/companies', (req, res) => {
  const phase = getPhase(req.params.id);
  if (!phase) return notFound(res, `Phase "${req.params.id}" not found`);
  ok(res, phase.companies.map(co => ({ ...co, inventory: INVENTORY[co.id] ?? null })));
});

// Single company (from phase context)
api.get('/phases/:id/companies/:cid', (req, res) => {
  const phase = getPhase(req.params.id);
  if (!phase) return notFound(res, `Phase "${req.params.id}" not found`);
  const co = phase.companies.find(c => c.id === req.params.cid);
  if (!co) return notFound(res, `Company "${req.params.cid}" not found in phase ${req.params.id}`);
  ok(res, { ...co, phaseId: phase.id, phaseName: phase.name, inventory: INVENTORY[co.id] ?? null });
});

// Phase inventory
api.get('/phases/:id/inventory', (req, res) => {
  const phase = getPhase(req.params.id);
  if (!phase) return notFound(res, `Phase "${req.params.id}" not found`);
  const inv = phase.companies.map(co => ({ companyId: co.id, companyName: co.name, ...INVENTORY[co.id] ?? { days: null, trend: null, source: 'n/a', note: 'n/a' } }));
  const known = inv.filter(i => i.days !== null);
  const avgDays = known.length ? Math.round(known.reduce((s, i) => s + i.days, 0) / known.length) : null;
  ok(res, { phaseId: phase.id, phaseName: phase.name, avgBufferDays: avgDays, companies: inv });
});

// Phase risk
api.get('/phases/:id/risk', (req, res) => {
  const phase = getPhase(req.params.id);
  if (!phase) return notFound(res, `Phase "${req.params.id}" not found`);
  ok(res, { phaseId: phase.id, phaseName: phase.name, risk: phase.risk, riskFactors: phase.riskFactors, description: phase.description });
});

// Graph
api.get('/graph', (req, res) => {
  const includeCompanies = req.query.companies === 'true';
  ok(res, {
    nodes: PHASES.map(p => ({
      id: p.id, type: 'phase', label: p.name, color: p.color, risk: p.risk,
      ...(includeCompanies ? { companies: p.companies.map(c => ({ id: c.id, name: c.name, health: c.health, share: c.share })) } : {}),
    })),
    edges: EDGES,
  });
});

// Risk summary
api.get('/risk-summary', (_, res) => {
  const avgRisk = PHASES.reduce((s, p) => s + p.risk.score, 0) / PHASES.length;
  const byLevel = { critical: 0, high: 0, medium: 0, low: 0 };
  PHASES.forEach(p => byLevel[p.risk.level]++);
  const sanctioned = [];
  PHASES.forEach(p => p.companies.forEach(c => { if (c.health === 'crit') sanctioned.push({ id: c.id, name: c.name, phase: p.id }); }));
  ok(res, {
    averageRiskScore: parseFloat(avgRisk.toFixed(2)),
    riskDistribution: byLevel,
    criticalPhases: PHASES.filter(p => p.risk.level === 'critical').map(p => ({ id: p.id, name: p.name, score: p.risk.score })),
    sanctionedEntities: sanctioned,
    totalPhases: PHASES.length,
    totalCompanies: PHASES.reduce((s, p) => s + p.companies.length, 0),
  });
});

// Inventory risk
api.get('/inventory/risk', (req, res) => {
  const maxDays = parseInt(req.query.max_days ?? '30', 10);
  if (isNaN(maxDays) || maxDays < 1) return res.status(400).json({ ok: false, error: 'max_days must be a positive integer' });
  ok(res, getInventoryRisk(maxDays), { threshold: maxDays });
});

// Bottlenecks
api.get('/bottlenecks', (_, res) => ok(res, getCriticalBottlenecks()));

// Disruption simulation
api.get('/disruption/:id', (req, res) => {
  const impact = getDisruptionImpact(req.params.id);
  if (!impact) return notFound(res, `Phase "${req.params.id}" not found`);
  ok(res, impact);
});

// Company search
api.get('/search', (req, res) => {
  const q = req.query.q;
  if (!q || q.length < 2) return res.status(400).json({ ok: false, error: 'Provide ?q= with at least 2 characters' });
  ok(res, searchCompanies(q));
});

// Manual event emit (dev/test)
api.post('/events/emit', (req, res) => {
  const { type, payload } = req.body;
  if (!type) return res.status(400).json({ ok: false, error: 'type required' });
  const event = emitManual(type, payload ?? {});
  ok(res, event);
});

app.use('/api/v1', api);

// ─────────────────────────────────────────────────────────────────────────────
// SSE — Server-Sent Events  (GET /api/v1/events)
// ─────────────────────────────────────────────────────────────────────────────
app.get('/api/v1/events', auth, (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('X-Accel-Buffering', 'no');
  res.flushHeaders();

  // Filter by event type if provided: ?types=inventory.updated,risk.alert
  const filterTypes = req.query.types ? new Set(req.query.types.split(',')) : null;

  // Send a heartbeat comment every 15s to keep connection alive
  const heartbeat = setInterval(() => res.write(': heartbeat\n\n'), 15000);

  // Send connected message
  res.write(`data: ${JSON.stringify({ type: 'connected', ts: new Date().toISOString(), message: 'Supply Chain Twin event stream active' })}\n\n`);

  function onEvent(event) {
    if (filterTypes && !filterTypes.has(event.type)) return;
    res.write(`id: ${event.id}\nevent: ${event.type}\ndata: ${JSON.stringify(event)}\n\n`);
  }

  bus.on('event', onEvent);

  req.on('close', () => {
    clearInterval(heartbeat);
    bus.off('event', onEvent);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// MCP HTTP  (POST + GET /mcp — Streamable HTTP Transport)
// ─────────────────────────────────────────────────────────────────────────────
function createMcpServer() {
  const server = new McpServer({
    name:    'supplytwin',
    version: '1.0.0',
  });
  registerTools(server);
  registerResources(server);
  return server;
}

app.all('/mcp', async (req, res) => {
  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: () => randomUUID(),
  });
  const mcpServer = createMcpServer();
  try {
    await mcpServer.connect(transport);
    await transport.handleRequest(req, res, req.body);
    res.on('close', async () => mcpServer.close().catch(() => {}));
  } catch (err) {
    console.error('[mcp] Error:', err.message);
    if (!res.headersSent) res.status(500).json({ jsonrpc: '2.0', error: { code: -32603, message: err.message }, id: null });
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// Root — API discovery
// ─────────────────────────────────────────────────────────────────────────────
app.get('/', (_, res) => res.json({
  service:     'Supply Chain Twin API',
  version:     '1.0.0',
  description: '10-phase AI chip supply chain data product — REST + SSE + MCP',
  endpoints: {
    rest:     `http://localhost:${PORT}/api/v1`,
    events:   `http://localhost:${PORT}/api/v1/events`,
    mcp_http: `http://localhost:${PORT}/mcp`,
    health:   `http://localhost:${PORT}/api/v1/health`,
  },
  mcp_stdio: 'node api/mcp-server.js',
  docs: {
    phases:     'GET /api/v1/phases',
    phase:      'GET /api/v1/phases/:id  (01–10)',
    companies:  'GET /api/v1/phases/:id/companies',
    company:    'GET /api/v1/phases/:id/companies/:cid',
    inventory:  'GET /api/v1/phases/:id/inventory',
    risk:       'GET /api/v1/phases/:id/risk',
    graph:      'GET /api/v1/graph[?companies=true]',
    riskSummary:'GET /api/v1/risk-summary',
    invRisk:    'GET /api/v1/inventory/risk[?max_days=30]',
    bottlenecks:'GET /api/v1/bottlenecks',
    disruption: 'GET /api/v1/disruption/:phaseId',
    search:     'GET /api/v1/search?q=nvidia',
    sse:        'GET /api/v1/events[?types=inventory.updated,risk.alert]',
    emit:       'POST /api/v1/events/emit  {type, payload}',
  },
}));

// ─────────────────────────────────────────────────────────────────────────────
// Start
// ─────────────────────────────────────────────────────────────────────────────
startMockGenerator(4000);

app.listen(PORT, () => {
  console.log(`
  ┌─────────────────────────────────────────────────┐
  │  Supply Chain Twin API  v1.0.0                  │
  │                                                 │
  │  REST   → http://localhost:${PORT}/api/v1         │
  │  Events → http://localhost:${PORT}/api/v1/events  │
  │  MCP    → http://localhost:${PORT}/mcp            │
  │  Docs   → http://localhost:${PORT}/              │
  └─────────────────────────────────────────────────┘
  `);
});
