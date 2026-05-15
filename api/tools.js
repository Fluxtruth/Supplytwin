// ─────────────────────────────────────────────────────────────────────────────
// Supply Chain Twin — MCP Tool Definitions (shared between HTTP + stdio)
// ─────────────────────────────────────────────────────────────────────────────

import { z } from 'zod';
import { PHASES, EDGES, INVENTORY, getPhase, getCompany, getInventoryRisk, getCriticalBottlenecks, searchCompanies, getDisruptionImpact } from './data.js';

export function registerTools(server) {
  // ── list_phases ─────────────────────────────────────────────────────────────
  server.tool(
    'list_phases',
    'List all 10 supply chain phases with risk scores, locations, and KPI overview.',
    {},
    async () => ({
      content: [{
        type: 'text',
        text: JSON.stringify(PHASES.map(p => ({
          id: p.id, name: p.name, icon: p.icon, color: p.color,
          risk: p.risk, location: p.location,
          companyCount: p.companies.length,
          criticalKpis: p.kpis.filter(k => k.status === 'crit'),
          topRiskFactor: p.riskFactors.sort((a, b) => b.score - a.score)[0],
        })), null, 2),
      }],
    })
  );

  // ── get_phase ───────────────────────────────────────────────────────────────
  server.tool(
    'get_phase',
    'Get full detail for a supply chain phase including companies, KPIs, risk factors, and inventory buffers.',
    { phase_id: z.string().describe('Phase ID, e.g. "01" through "10"') },
    async ({ phase_id }) => {
      const phase = getPhase(phase_id);
      if (!phase) return { content: [{ type: 'text', text: `Phase "${phase_id}" not found. Valid IDs: 01–10.` }], isError: true };
      const enriched = {
        ...phase,
        companies: phase.companies.map(co => ({ ...co, inventory: INVENTORY[co.id] ?? null })),
        edges: {
          incoming: EDGES.filter(e => e.to === phase.id),
          outgoing: EDGES.filter(e => e.from === phase.id),
        },
      };
      return { content: [{ type: 'text', text: JSON.stringify(enriched, null, 2) }] };
    }
  );

  // ── get_company ─────────────────────────────────────────────────────────────
  server.tool(
    'get_company',
    'Get detail for a specific company including inventory buffer, health status, and phase context.',
    { company_id: z.string().describe('Company ID, e.g. "nvidia", "tsmc", "asml", "tqc"') },
    async ({ company_id }) => {
      const co = getCompany(company_id);
      if (!co) return { content: [{ type: 'text', text: `Company "${company_id}" not found.` }], isError: true };
      return { content: [{ type: 'text', text: JSON.stringify(co, null, 2) }] };
    }
  );

  // ── search_companies ────────────────────────────────────────────────────────
  server.tool(
    'search_companies',
    'Search companies by name, ticker symbol, or abbreviation across all supply chain phases.',
    { query: z.string().describe('Search term, e.g. "NVIDIA", "ASML", "TSM", "foundry"') },
    async ({ query }) => {
      const results = searchCompanies(query);
      if (!results.length) return { content: [{ type: 'text', text: `No companies found matching "${query}".` }] };
      return { content: [{ type: 'text', text: JSON.stringify(results, null, 2) }] };
    }
  );

  // ── get_inventory_risk ──────────────────────────────────────────────────────
  server.tool(
    'get_inventory_risk',
    'Find companies at risk due to low inventory buffers (Days of Inventory Outstanding). Returns companies below the threshold.',
    { max_days: z.number().int().min(1).max(365).default(30).describe('Maximum buffer days threshold. Companies at or below this are returned. Default: 30.') },
    async ({ max_days }) => {
      const at_risk = getInventoryRisk(max_days);
      const summary = {
        threshold: max_days,
        count: at_risk.length,
        criticalCount: at_risk.filter(c => c.days <= 14).length,
        companies: at_risk.map(c => ({
          id: c.companyId, name: c.company?.name, phase: c.company?.phaseName,
          days: c.days, trend: c.trend, source: c.source,
        })),
      };
      return { content: [{ type: 'text', text: JSON.stringify(summary, null, 2) }] };
    }
  );

  // ── get_critical_bottlenecks ────────────────────────────────────────────────
  server.tool(
    'get_critical_bottlenecks',
    'List the most critical supply chain bottlenecks — phases with highest risk scores and monopoly dependencies.',
    {},
    async () => ({
      content: [{ type: 'text', text: JSON.stringify(getCriticalBottlenecks(), null, 2) }],
    })
  );

  // ── get_disruption_impact ───────────────────────────────────────────────────
  server.tool(
    'get_disruption_impact',
    'Simulate what happens if a supply chain phase fails: shows downstream impacts, affected materials, and how many days until shortage based on current inventory buffers.',
    { phase_id: z.string().describe('Phase ID to simulate failure for, e.g. "05" for EUV lithography') },
    async ({ phase_id }) => {
      const impact = getDisruptionImpact(phase_id);
      if (!impact) return { content: [{ type: 'text', text: `Phase "${phase_id}" not found.` }], isError: true };
      return { content: [{ type: 'text', text: JSON.stringify(impact, null, 2) }] };
    }
  );

  // ── get_supply_chain_graph ──────────────────────────────────────────────────
  server.tool(
    'get_supply_chain_graph',
    'Get the supply chain graph structure: all nodes (phases + companies) and edges (material flows) with volumes and transport modes.',
    { include_companies: z.boolean().default(false).describe('Whether to include individual company nodes. Default false (phase-level only).') },
    async ({ include_companies }) => {
      const nodes = PHASES.map(p => ({
        id: p.id, type: 'phase', label: p.name, risk: p.risk,
        ...(include_companies ? { companies: p.companies.map(c => ({ id: c.id, name: c.name, health: c.health, share: c.share })) } : {}),
      }));
      return { content: [{ type: 'text', text: JSON.stringify({ nodes, edges: EDGES }, null, 2) }] };
    }
  );

  // ── get_risk_summary ────────────────────────────────────────────────────────
  server.tool(
    'get_risk_summary',
    'Get a cross-chain risk summary: overall chain health, risk distribution, sanctioned entities, and shortest inventory buffers.',
    {},
    async () => {
      const avgRisk = PHASES.reduce((s, p) => s + p.risk.score, 0) / PHASES.length;
      const byLevel = { critical: 0, high: 0, medium: 0, low: 0 };
      PHASES.forEach(p => byLevel[p.risk.level]++);
      const sanctioned = [];
      PHASES.forEach(p => p.companies.forEach(c => { if (c.health === 'crit') sanctioned.push({ id: c.id, name: c.name, phase: p.id }); }));
      const shortestBuffers = Object.entries(INVENTORY)
        .filter(([, v]) => v.days !== null && v.days > 0)
        .sort(([, a], [, b]) => a.days - b.days)
        .slice(0, 5)
        .map(([id, v]) => ({ id, days: v.days, trend: v.trend }));
      return {
        content: [{
          type: 'text',
          text: JSON.stringify({ averageRiskScore: parseFloat(avgRisk.toFixed(2)), riskDistribution: byLevel, criticalPhases: PHASES.filter(p => p.risk.level === 'critical').map(p => ({ id: p.id, name: p.name, score: p.risk.score })), sanctionedEntities: sanctioned, shortestInventoryBuffers: shortestBuffers, totalPhases: PHASES.length, totalCompanies: PHASES.reduce((s, p) => s + p.companies.length, 0) }, null, 2),
        }],
      };
    }
  );
}

// ─── MCP Resources ────────────────────────────────────────────────────────────
export function registerResources(server) {
  server.resource(
    'supply-chain-overview',
    'supplytwin://overview',
    async (uri) => ({
      contents: [{
        uri: uri.href,
        text: JSON.stringify({
          description: 'AI Chip Supply Chain Twin — 10-phase supply chain from HPQ sand mining to data center energy',
          phases: PHASES.map(p => ({ id: p.id, name: p.name, risk: p.risk, companyCount: p.companies.length })),
          edges: EDGES.map(e => ({ from: e.from, to: e.to, material: e.material })),
          dataNote: 'Mock data — configurable with real FMP API keys via /api/v1/connectors',
        }, null, 2),
        mimeType: 'application/json',
      }],
    })
  );

  server.resource(
    'phase-detail',
    new URL('supplytwin://phase/{id}'),
    async (uri) => {
      const id = uri.pathname.replace('/', '').padStart(2, '0');
      const phase = getPhase(id);
      if (!phase) return { contents: [{ uri: uri.href, text: '{"error":"phase not found"}', mimeType: 'application/json' }] };
      return {
        contents: [{
          uri: uri.href,
          text: JSON.stringify({ ...phase, companies: phase.companies.map(co => ({ ...co, inventory: INVENTORY[co.id] ?? null })) }, null, 2),
          mimeType: 'application/json',
        }],
      };
    }
  );
}
