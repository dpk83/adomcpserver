#!/usr/bin/env node

// Load environment variables from .env file
import dotenv from 'dotenv';
dotenv.config();

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { workItemsTrackerToolName, workItemsTrackerToolDescription, workItemsTrackerToolSchema, workItemsTrackerToolRequestHandler } from "./workitems-tracker.js";

const server = new McpServer({
    name: "ado-workitems-tracker",
    description: "Azure DevOps Work Items Tracker",
    version: "1.0.0",
  });
  
server.tool(
    workItemsTrackerToolName,
    workItemsTrackerToolDescription,
    workItemsTrackerToolSchema,
    workItemsTrackerToolRequestHandler,
  );
  
  // Start the server with stdio transport
  async function main() {
    const transport = new StdioServerTransport();
    await server.connect(transport);
  }
  
  main().catch((error) => {
    process.exit(1);
  });
