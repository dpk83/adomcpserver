#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Load environment variables from .env file
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const mcp_js_1 = require("@modelcontextprotocol/sdk/server/mcp.js");
const stdio_js_1 = require("@modelcontextprotocol/sdk/server/stdio.js");
const ado_mcp_tool_js_1 = require("./ado-mcp-tool.js");
const server = new mcp_js_1.McpServer({
    name: "ado-mcp-server",
    description: "MCP server for Azure DevOps REST API",
    version: "1.0.0",
});
server.tool(ado_mcp_tool_js_1.adoToolName, ado_mcp_tool_js_1.adoToolDescription, ado_mcp_tool_js_1.adoToolSchema, ado_mcp_tool_js_1.adoToolRequestHandler);
// Start the server with stdio transport
async function main() {
    const transport = new stdio_js_1.StdioServerTransport();
    await server.connect(transport);
}
main().catch((error) => {
    process.exit(1);
});
//# sourceMappingURL=index.js.map