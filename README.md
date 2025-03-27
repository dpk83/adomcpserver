# ADO MCP Server

## Overview
This project provides a MCP server implementation for working with [Azure DevOps](https://learn.microsoft.com/en-us/azure/devops/) using the REST API. 

## Features
- Fetch work items from Azure DevOps.
- Create and update work items using the REST API.
- Supports various HTTP methods (GET, POST, PUT, PATCH, DELETE).

## Project Structure
- **src/**: Contains the TypeScript source files.
  - `index.ts`: Entry point of the application.
  - `workitems-tracker.ts`: Handles Azure DevOps work item operations.
- **build/**: Contains the compiled JavaScript files.

## Environment Variables
The project uses the following environment variables:
- `AZURE_DEVOPS_ORG`: The Azure DevOps organization name.
- `AZURE_DEVOPS_PROJECT`: The Azure DevOps project name.
- `AZURE_DEVOPS_PAT`: The personal access token for authenticating with Azure DevOps.

## Installation
1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory and add the required environment variables.

## Usage
Run the application using the following command:
```bash
npm start
```

## Example LLM Queries

This server enables the following example queries for interacting with Azure DevOps work items:

- **Get Work Items Assigned to Me**: "Get a list of all Azure DevOps work items assigned to me."
- **Filter Work Items by Tag**: "Get a list of all Azure DevOps work items with the tag 'ABC'."
- **Update Work Item State**: "Update the state of work item 1234 to 'Active'."
- **Create a New Work Item**: "Create a new Azure DevOps work item of type 'Bug' with the title 'Fix login issue'."
- **Delete a Work Item**: "Delete the Azure DevOps work item with ID 5678."
- **Get Work Item Details**: "Retrieve details of the Azure DevOps work item with ID 91011."

These queries demonstrate the server's ability to handle various operations on Azure DevOps work items using natural language inputs.

## Model Context Protocol (MCP)

Model Context Protocol (MCP) is a protocol designed to facilitate seamless communication and data exchange between different systems and models. It provides a standardized way to define, share, and manage context information, enabling interoperability and integration across various platforms.

To learn more about MCP, visit the following resources:
- [Official MCP Website](https://modelcontextprotocol.org)
- [MCP Documentation](https://docs.modelcontextprotocol.org)

## License
This project is licensed under the MIT License.