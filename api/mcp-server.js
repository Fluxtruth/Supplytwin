// ─────────────────────────────────────────────────────────────────────────────
// Supply Chain Twin — MCP stdio Server
//
// Usage:
//   node api/mcp-server.js
//
// For Claude Desktop, add to claude_desktop_config.json:
//   {
//     "mcpServers": {
//       "supplytwin": {
//         "command": "node",
//         "args": ["/path/to/Supplytwin/api/mcp-server.js"]
//       }
//     }
//   }
//
// Tools exposed:
//   list_phases             All 10 phases with risk overview
//   get_phase               Full phase detail by ID (01–10)
//   get_company             Company detail + inventory buffer
//   search_companies        Search by name, ticker, or abbreviation
//   get_inventory_risk      Companies below buffer threshold
//   get_critical_bottlenecks  Single-point-of-failure analysis
//   get_disruption_impact   Cascade simulation for a phase failure
//   get_supply_chain_graph  Nodes + edges
//   get_risk_summary        Cross-chain health dashboard
// ─────────────────────────────────────────────────────────────────────────────

import { McpServer }         from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { registerTools, registerResources } from './tools.js';

const server = new McpServer({
  name:    'supplytwin',
  version: '1.0.0',
});

registerTools(server);
registerResources(server);

const transport = new StdioServerTransport();
await server.connect(transport);
// server runs until process exits — stdio kept open by Claude Desktop / MCP client
