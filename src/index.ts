#!/usr/bin/env node

// Load environment variables from .env file
import dotenv from 'dotenv';
dotenv.config();

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { adoToolName, adoToolDescription, adoToolSchema, adoToolRequestHandler } from "./ado-mcp-tool.js";

const server = new McpServer({
    name: "ado-mcp-server",
    description: "MCP server for Azure DevOps REST API",
    version: "1.0.0",
  });
  
server.tool(
    adoToolName,
    adoToolDescription,
    adoToolSchema,
    adoToolRequestHandler,
  );
  
  // Start the server with stdio transport
  async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
  }
  
  main().catch((error) => {
    process.exit(1);
  });
