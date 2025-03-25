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
const workitems_tracker_js_1 = require("./workitems-tracker.js");
const server = new mcp_js_1.McpServer({
    name: "ado-workitems-tracker",
    description: "Azure DevOps Work Items Tracker",
    version: "1.0.0",
});
server.tool(workitems_tracker_js_1.workItemsTrackerToolName, workitems_tracker_js_1.workItemsTrackerToolDescription, workitems_tracker_js_1.workItemsTrackerToolSchema, workitems_tracker_js_1.workItemsTrackerToolRequestHandler);
// Start the server with stdio transport
async function main() {
    const transport = new stdio_js_1.StdioServerTransport();
    await server.connect(transport);
}
main().catch((error) => {
    process.exit(1);
});
//# sourceMappingURL=index.js.map