// ─────────────────────────────────────────────────────────────────────────────
// Supply Chain Twin — Event Bus + Mock Event Generator
// Produces realistic supply chain events; SSE clients subscribe via EventEmitter
// ─────────────────────────────────────────────────────────────────────────────

import { EventEmitter } from 'node:events';
import { PHASES, INVENTORY, EDGES } from './data.js';

export const bus = new EventEmitter();
bus.setMaxListeners(200);

let _seq = 1;

function emit(type, payload) {
  const event = { id: _seq++, type, ts: new Date().toISOString(), payload };
  bus.emit('event', event);
  return event;
}

// ─── Event type definitions ───────────────────────────────────────────────────
// inventory.updated    → a company's DIO changed (live FMP pull or estimate revision)
// risk.alert           → phase risk score crossed a threshold
// disruption.detected  → an edge flow was interrupted
// kpi.threshold        → a KPI crossed warn/crit boundary
// connector.status     → a connector went live or offline
// shipment.delayed     → a shipment on an edge is delayed
// price.spike          → commodity spot price moved >5%

const MOCK_EVENTS = [
  () => {
    const companies = PHASES.flatMap(p => p.companies).filter(c => INVENTORY[c.id]?.days != null);
    const co = companies[Math.floor(Math.random() * companies.length)];
    const inv = INVENTORY[co.id];
    const delta = Math.floor(Math.random() * 9) - 4;
    const newDays = Math.max(1, (inv.days ?? 30) + delta);
    return emit('inventory.updated', { companyId: co.id, companyName: co.name, previousDays: inv.days, currentDays: newDays, delta, trend: delta >= 0 ? `+${delta}d` : `${delta}d`, source: 'mock-realtime' });
  },
  () => {
    const phase = PHASES[Math.floor(Math.random() * PHASES.length)];
    const delta = (Math.random() * 1.4 - 0.7).toFixed(1);
    const newScore = Math.min(10, Math.max(1, phase.risk.score + parseFloat(delta)));
    const level = newScore >= 8 ? 'critical' : newScore >= 6 ? 'high' : newScore >= 4 ? 'medium' : 'low';
    return emit('risk.alert', { phaseId: phase.id, phaseName: phase.name, previousScore: phase.risk.score, currentScore: parseFloat(newScore.toFixed(1)), level, delta: parseFloat(delta) });
  },
  () => {
    const edge = EDGES[Math.floor(Math.random() * (EDGES.length - 1))]; // exclude energy edge
    const issues = ['Hafenstreik', 'Zollverzögerung', 'Sturmwarnung', 'Kapazitätsengpass', 'Routenumleitung'];
    const severities = ['warn', 'crit'];
    const issue = issues[Math.floor(Math.random() * issues.length)];
    const severity = severities[Math.floor(Math.random() * severities.length)];
    const delayDays = Math.ceil(Math.random() * 7);
    return emit('disruption.detected', { from: edge.from, to: edge.to, material: edge.material, transport: edge.transport, issue, severity, estimatedDelayDays: delayDays, affectedVolume: edge.vol.day });
  },
  () => {
    const phase = PHASES[Math.floor(Math.random() * PHASES.length)];
    const kpi = phase.kpis[Math.floor(Math.random() * phase.kpis.length)];
    const levels = ['ok', 'warn', 'crit'];
    const newStatus = levels[Math.floor(Math.random() * levels.length)];
    return emit('kpi.threshold', { phaseId: phase.id, phaseName: phase.name, kpiLabel: kpi.label, previousStatus: kpi.status, currentStatus: newStatus, value: kpi.value });
  },
  () => {
    const phase = PHASES[Math.floor(Math.random() * PHASES.length)];
    const types = ['fmp', 'scada', 'erp', 'market'];
    const type = types[Math.floor(Math.random() * types.length)];
    const live = Math.random() > 0.3;
    return emit('connector.status', { phaseId: phase.id, connectorType: type, live, latencyMs: live ? Math.floor(Math.random() * 200 + 20) : null });
  },
  () => {
    const commodities = [
      { name: 'Polysilizium', unit: '$/kg', base: 6.8 },
      { name: 'Si-Metall',    unit: '$/kg', base: 2.15 },
      { name: 'HPQ Sand',     unit: '$/t',  base: 140 },
      { name: 'H100 GPU',     unit: '$/u',  base: 28000 },
    ];
    const c = commodities[Math.floor(Math.random() * commodities.length)];
    const changePct = ((Math.random() * 16) - 8).toFixed(1);
    const newPrice = (c.base * (1 + parseFloat(changePct) / 100)).toFixed(2);
    return emit('price.spike', { commodity: c.name, unit: c.unit, previousPrice: c.base, currentPrice: parseFloat(newPrice), changePct: parseFloat(changePct), alert: Math.abs(changePct) > 5 });
  },
];

let _interval = null;

export function startMockGenerator(intervalMs = 4000) {
  if (_interval) return;
  _interval = setInterval(() => {
    const fn = MOCK_EVENTS[Math.floor(Math.random() * MOCK_EVENTS.length)];
    fn();
  }, intervalMs);
  console.log(`[events] Mock generator started (interval: ${intervalMs}ms)`);
}

export function stopMockGenerator() {
  if (_interval) { clearInterval(_interval); _interval = null; }
}

// Allow manual event emission (for testing / webhooks)
export function emitManual(type, payload) {
  return emit(type, payload);
}
