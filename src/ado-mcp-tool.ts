#!/usr/bin/env node

// Load environment variables from .env file
import dotenv from 'dotenv';
dotenv.config();

import { z } from "zod";

const AZURE_DEVOPS_ORG = process.env.AZURE_DEVOPS_ORG;
const AZURE_DEVOPS_PROJECT = process.env.AZURE_DEVOPS_PROJECT;
const AZURE_DEVOPS_PAT = process.env.AZURE_DEVOPS_PAT;

export const adoToolName = "ADO_TOOL";
export const adoToolDescription = "A tool to call Azure DevOps REST API to perform various ADO operations like managing work items, working with wiki pages, builds, and more.";
export const adoToolSchema = z.object({
  path: z.string().describe("The Azure DevOps API path to operate on. For example, /_apis/wit/workitems/1234."),
  method: z.enum(["get", "post", "put", "patch", "delete"]).describe("HTTP method to use"),
  queryParams: z.record(z.string()).optional().describe("Query parameters like $expand, fields, asOf, etc."),
  body: z.any().optional().describe("The request body (for POST, PUT, PATCH)"),
  contentType: z.string().optional().describe("Content-Type header for the request"),
}).shape;

export type AdoResponse = {
  content: (
    | { type: "text"; text: string }
    | { type: "image"; data: string; mimeType: string }
    | { type: "resource"; resource: { text: string; uri: string; mimeType?: string } }
  )[];
  isError: boolean;
};

export const adoToolRequestHandler = async ({ path, method, queryParams, body, contentType }: { path: string; method: string; queryParams?: Record<string, string>; body?: any; contentType?: string }): Promise<AdoResponse> => {
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
    const headers: Record<string, string> = {
        Authorization: `Bearer ${AZURE_DEVOPS_PAT}`,
    };
    
    // For methods that send body data, add Content-Type header and ensure body is properly formatted
    const requestOptions: RequestInit = {
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
      } else {
        // If no body is provided for methods that require it, send an empty object
        headers['Content-Type'] = contentType ?? 'application/json';
        requestOptions.body = JSON.stringify({});
      }
    }

    // Make ADO API request
    const response = await fetch(url, requestOptions);

    // Handle response
    const responseText = await response.text();
    let responseData: any;
    
    try {
      // Try to parse as JSON
      responseData = JSON.parse(responseText);
    } catch (e) {
      // If not JSON, use the raw text
      responseData = { rawResponse: response.body };
    }

    if (!response.ok) {
      throw new Error(`ADO API error (${response.status}): ${JSON.stringify(responseData)}`);
    }

    let resultText = `Result for ${url}:

`;
    resultText += JSON.stringify(responseData, null, 2);

    return {
      content: [
        {
          type: "text" as const,
          text: resultText,
        },
      ],
      isError: false,
    };

  } catch (error) {
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

