#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.workItemsTrackerToolRequestHandler = exports.workItemsTrackerToolSchema = exports.workItemsTrackerToolDescription = exports.workItemsTrackerToolName = void 0;
// Load environment variables from .env file
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const zod_1 = require("zod");
const AZURE_DEVOPS_ORG = process.env.AZURE_DEVOPS_ORG;
const AZURE_DEVOPS_PROJECT = process.env.AZURE_DEVOPS_PROJECT;
const AZURE_DEVOPS_PAT = process.env.AZURE_DEVOPS_PAT;
exports.workItemsTrackerToolName = "ADO_WorkItem_GetAndUpdate_Tool";
exports.workItemsTrackerToolDescription = "A tool to call Azure DevOps REST API to get, create, and update bugs, tasks, and other work items for your team using the REST API.";
exports.workItemsTrackerToolSchema = zod_1.z.object({
    // workItemId: z.string().describe("The Azure DevOps API work item ID to operate on. For example, 1234."),
    path: zod_1.z.string().describe("The Azure DevOps API path to operate on. For example, /_apis/wit/workitems/1234."),
    method: zod_1.z.enum(["get", "post", "put", "patch", "delete"]).describe("HTTP method to use"),
    queryParams: zod_1.z.record(zod_1.z.string()).optional().describe("Query parameters like $expand, fields, asOf, etc."),
    body: zod_1.z.any().optional().describe("The request body (for POST, PUT, PATCH)"),
    contentType: zod_1.z.string().optional().describe("Content-Type header for the request"),
}).shape;
const workItemsTrackerToolRequestHandler = async ({ path, method, queryParams, body, contentType }) => {
    try {
        if (!AZURE_DEVOPS_PAT) {
            throw new Error("Failed to acquire access token");
        }
        // Build URL with query parameters
        let url = `https://dev.azure.com/${AZURE_DEVOPS_ORG}/${AZURE_DEVOPS_PROJECT}/${path}`;
        if (queryParams && Object.keys(queryParams).length > 0) {
            const searchParams = new URLSearchParams();
            for (const [key, value] of Object.entries(queryParams)) {
                searchParams.append(key, value);
            }
            url += `?${searchParams.toString()}`;
        }
        // Prepare headers
        const headers = {
            Authorization: `Bearer ${AZURE_DEVOPS_PAT}`,
        };
        // For methods that send body data, add Content-Type header and ensure body is properly formatted
        const requestOptions = {
            method: method.toUpperCase(),
            headers: headers
        };
        // Only add Content-Type and body if we're using a method that supports sending data
        // and if body is provided
        if (["POST", "PUT", "PATCH"].includes(method.toUpperCase())) {
            if (body) {
                // Add Content-Type header
                headers['Content-Type'] = contentType ?? 'application/json';
                // Ensure body is properly stringified
                requestOptions.body = typeof body === 'string' ? body : JSON.stringify(body);
            }
            else {
                // If no body is provided for methods that require it, send an empty object
                headers['Content-Type'] = contentType ?? 'application/json';
                requestOptions.body = JSON.stringify({});
            }
        }
        // Make ADO API request
        const response = await fetch(url, requestOptions);
        // Handle response
        const responseText = await response.text();
        let responseData;
        try {
            // Try to parse as JSON
            responseData = JSON.parse(responseText);
        }
        catch (e) {
            // If not JSON, use the raw text
            responseData = { rawResponse: response.body };
        }
        if (!response.ok) {
            throw new Error(`ADO API error (${response.status}): ${JSON.stringify(responseData)}`);
        }
        let resultText = `Result for ${url}:\n\n`;
        resultText += JSON.stringify(responseData, null, 2);
        return {
            content: [
                {
                    type: "text",
                    text: resultText,
                },
            ],
            isError: false,
        };
    }
    catch (error) {
        return {
            content: [
                {
                    type: "text",
                    text: JSON.stringify({
                        error: error instanceof Error ? error.message : String(error),
                    }),
                },
            ],
            isError: true
        };
    }
};
exports.workItemsTrackerToolRequestHandler = workItemsTrackerToolRequestHandler;
//# sourceMappingURL=workitems-tracker.js.map