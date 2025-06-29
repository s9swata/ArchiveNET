# ArchiveNet

A Model Context Protocol (MCP) server that provides context insertion and search functionality. This server allows AI assistants to save and retrieve personal and professional data through configurable API endpoints.

## Features

- **Insert Context**: Save personal, professional, or general information with metadata
- **Search Context**: Find previously stored context using queries with filtering
- **Multi-LLM Support**: Works with Claude Desktop and Cursor IDE
- **Configurable Endpoints**: Use your own API endpoints via environment variables
- **Environment Editor**: Interactive tool to configure API endpoints
- **Type Safety**: Full TypeScript implementation with Zod validation
- **Error Handling**: Comprehensive error handling and validation
- **Metadata Support**: Rich metadata including context, tags, timestamps, and client info
- **Bearer Token Authentication**: Optional Bearer token authentication
- **Global Installation**: Install as global commands for easy access

## Quick Setup

### Option 1: Global Installation (Recommended)

Install ArchiveNET MCP globally for easy access from anywhere:

```bash
# 1. Clone and navigate to MCP directory
cd mcp

# 2. Install dependencies
npm install

# 3. Configure environment (interactive)
npm run edit-env --interactive

# 4. Install globally
npm run global:install

# 5. Setup for your LLM
archivenet-setup-mcp claude    # For Claude Desktop
archivenet-setup-mcp cursor    # For Cursor IDE
```

### Option 2: Local Development Setup

```bash
# 1. Install dependencies
npm install

# 2. Configure environment (interactive)
npm run edit-env --interactive

# 3. Run automated setup for your LLM
npm run setup claude    # For Claude Desktop
npm run setup cursor    # For Cursor IDE
```

## Global Commands

After global installation, these commands are available system-wide:

- **`archivenet-mcp`** - Run the MCP server
- **`archivenet-setup-mcp`** - Setup MCP for Claude/Cursor
- **`archivenet-edit-env`** - Configure environment variables

### Global Management Commands

```bash
# Install globally
npm run global:install

# Check installation status
npm run global:status

# Uninstall globally
npm run global:uninstall

# Development linking (for local development)
npm run global:link
npm run global:unlink
```

## Environment Configuration

### Using the Environment Editor

The `edit-env` script provides multiple ways to configure your API endpoints:

#### Interactive Mode (Recommended)
```bash
# Global installation
archivenet-edit-env --interactive

# Local installation
npm run edit-env --interactive
```

#### Direct Updates
```bash
# Global installation
archivenet-edit-env INSERT_CONTEXT_ENDPOINT=https://api.example.com/insert
archivenet-edit-env SEARCH_CONTEXT_ENDPOINT=https://api.example.com/search

# Local installation
npm run edit-env INSERT_CONTEXT_ENDPOINT=https://api.example.com/insert
npm run edit-env SEARCH_CONTEXT_ENDPOINT=https://api.example.com/search
```

#### Show Current Configuration
```bash
# Global installation
archivenet-edit-env --show

# Local installation
npm run edit-env --show
```

### Environment Variables

- **INSERT_CONTEXT_ENDPOINT** (required): API endpoint for inserting context
- **SEARCH_CONTEXT_ENDPOINT** (required): API endpoint for searching context  
- **TOKEN** (optional): Bearer token for authentication
- **API_TIMEOUT** (optional): Request timeout in milliseconds (default: 30000)

## Setup Script Usage

### Global Installation
```bash
# Setup for Claude Desktop
archivenet-setup-mcp claude

# Setup for Cursor IDE
archivenet-setup-mcp cursor

# Show help
archivenet-setup-mcp --help
```

### Local Installation
```bash
# Setup for Claude Desktop
npm run setup claude

# Setup for Cursor IDE
npm run setup cursor
```

## API Endpoint Requirements

Your API endpoints should implement the following interfaces:

### Insert Endpoint (POST)
**Request Headers:**
```
Content-Type: application/json
Authorization: Bearer your-token-here
```

**Request Body:**
```json
{
  "content": "User's favorite color is blue",
  "metadata": {
    "context": "preference setting",
    "tags": ["preference", "color"],
    "timestamp": "2025-06-06T14:30:00Z",
    "client": "cursor"
  }
}
```

**Response:**
```json
{
  "success": true,
  "id": "unique-id",
  "message": "Context saved successfully"
}
```

### Search Endpoint (POST)
**Request Headers:**
```
Content-Type: application/json
Authorization: Bearer your-token-here
```

**Request Body:**
```json
{
  "query": "favorite color preference",
  "k": 5,
  "filters": {}
}
```

**Response:**
```json
{
  "success": true,
  "message": "Found 1 relevant memories",
  "data": [
    {
      "id": 0,
      "content": "User's favorite color is blue",
      "metadata": {
        "context": "preference setting",
        "tags": ["preference", "color"],
        "timestamp": "2025-06-06T14:30:00Z",
        "client": "cursor"
      },
      "distance": 0.3285933909986025
    }
  ]
}
```

## Tools Available

### insert_context
Saves personal or professional context data for future reference.

**Parameters:**
- `content` (required): The content to store
- `metadata` (optional): Object containing:
  - `context`: Context description (e.g., "preference setting")
  - `tags`: Array of tags for organization
  - `timestamp`: ISO timestamp (auto-generated if not provided)
  - `client`: Client identifier (defaults to "mcp-server")

### search_context
Searches through previously stored context data.

**Parameters:**
- `query` (required): Search query
- `k`: Number of results to return (default: 5)
- `filters` (required): Object containing:
  - `tags`: Array of tags to filter by (optional)

## Usage with AI Assistants

This MCP server automatically detects when users share personal or professional information and can save it using the `insert_context` tool. It can then retrieve relevant information using the `search_context` tool when needed.

The server is designed to work seamlessly with AI assistants that support the Model Context Protocol.

## Development

- `npm run dev`: Run in development mode with hot reload
- `npm run build`: Build TypeScript to JavaScript
- `npm start`: Run the built server
- `npm run setup <llm>`: Run the automated setup for specified LLM
- `npm run edit-env`: Configure environment variables

## Global Installation Management

- `npm run global:install`: Install globally as `archivenet-mcp`
- `npm run global:status`: Check global installation status
- `npm run global:uninstall`: Remove global installation
- `npm run global:link`: Create development link
- `npm run global:unlink`: Remove development link

## Supported LLMs

- **Claude Desktop**: Full support with automated configuration
- **Cursor IDE**: Full support with automated configuration

## Error Handling

The server includes comprehensive error handling for:
- Configuration validation
- API endpoint connectivity
- Request/response validation
- Network timeouts
- Invalid parameters

All errors are properly formatted and returned to the AI assistant for appropriate handling.

## Authentication

Bearer token authentication is optional. If your API endpoints don't require authentication, simply leave the `TOKEN` environment variable unset or commented out in your `.env` file. The server will work without authentication headers.

## Troubleshooting

If the MCP server doesn't connect to your LLM:

1. **Check configuration**: Use `archivenet-edit-env --show` to verify your settings
2. **Verify endpoints**: Test your API endpoints independently
3. **Check logs**: Look at your LLM's logs for error messages
4. **Restart completely**: Completely restart your LLM after configuration changes
5. **Test server**: Run `archivenet-mcp` to check for server errors
6. **Permissions**: Ensure your LLM has permission to execute Node.js scripts

## Example Usage

After setup, you can test the integration:

**Saving context:**
```
"My favorite programming language is TypeScript and I work as a senior developer at TechCorp."
```

**Searching context:**
```
"What's my favorite programming language?"
```

The MCP server will automatically handle saving and retrieving this information through your configured API endpoints.

## Installation from npm

```bash
# Install globally
npm install -g @s9swata/archivenet-mcp

# Configure environment interactively
archivenet-edit-env --interactive

# Setup for your preferred LLM
archivenet-setup-mcp claude
# or
archivenet-setup-mcp cursor

# Start the server manually if needed
archivenet-mcp
```

## Project Structure

```
archivenet/
├── src/                    # TypeScript source files
├── dist/                   # Compiled JavaScript files
├── scripts/                # Setup and utility scripts
│   ├── setup-mcp.js       # Unified setup script for Claude and Cursor
│   ├── edit-env.js        # Environment configuration editor
│   └── setup-global.js    # Global installation management
├── .env.example           # Environment variables template
├── package.json           # Package configuration
├── tsconfig.json          # TypeScript configuration
├── README.md              # This file
├── LICENSE                # MIT License
└── CHANGELOG.md           # Version history
```