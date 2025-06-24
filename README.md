# ArchiveNet

A Model Context Protocol (MCP) server that provides context insertion and search functionality. This server allows AI assistants to save and retrieve personal and professional data through configurable API endpoints.

## Features

- **Insert Context**: Save personal, professional, or general information with metadata
- **Search Context**: Find previously stored context using queries with filtering
- **Multi-LLM Support**: Works with Claude Desktop and Cursor IDE
- **Configurable Endpoints**: Use your own API endpoints via environment variables
- **Type Safety**: Full TypeScript implementation with Zod validation
- **Error Handling**: Comprehensive error handling and validation
- **Metadata Support**: Rich metadata including context, tags, timestamps, and client info
- **Optional Authentication**: API key authentication is optional

## Quick Setup

### Automated Setup (Recommended)

Use the unified setup script to automatically configure your preferred LLM:

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env with your API endpoints

# 3. Run automated setup for your LLM
npm run setup claude    # For Claude Desktop
npm run setup cursor    # For Cursor IDE
```

### Manual Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment**
   Copy `.env.example` to `.env` and configure your API endpoints:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your actual endpoints:
   ```env
   INSERT_CONTEXT_ENDPOINT=https://your-api.com/insert
   SEARCH_CONTEXT_ENDPOINT=https://your-api.com/search
   # API_KEY is optional - uncomment if your API requires authentication
   # API_KEY=your-api-key-here
   API_TIMEOUT=30000
   ```

3. **Build the Server**
   ```bash
   npm run build
   ```

4. **Configure Your LLM**

   #### For Claude Desktop
   
   Add to your Claude Desktop config file:
   
   **macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`
   **Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
   **Linux**: `~/.config/Claude/claude_desktop_config.json`
   
   ```json
   {
     "mcpServers": {
       "archivenet": {
         "command": "node",
         "args": ["/absolute/path/to/your/project/dist/index.js"],
         "env": {
           "INSERT_CONTEXT_ENDPOINT": "https://your-api.com/insert",
           "SEARCH_CONTEXT_ENDPOINT": "https://your-api.com/search",
           "API_TIMEOUT": "30000"
         }
       }
     }
   }
   ```

   #### For Cursor IDE
   
   Add to your Cursor MCP config file:
   
   **macOS**: `~/Library/Application Support/Cursor/User/globalStorage/mcp.json`
   **Windows**: `%APPDATA%\Cursor\User\globalStorage\mcp.json`
   **Linux**: `~/.config/Cursor/User/globalStorage/mcp.json`
   
   ```json
   {
     "mcpServers": {
       "archivenet": {
         "command": "node",
         "args": ["/absolute/path/to/your/project/dist/index.js"],
         "env": {
           "INSERT_CONTEXT_ENDPOINT": "https://your-api.com/insert",
           "SEARCH_CONTEXT_ENDPOINT": "https://your-api.com/search",
           "API_TIMEOUT": "30000"
         }
       }
     }
   }
   ```

5. **Restart Your LLM**

## Setup Script Usage

The unified setup script supports both Claude and Cursor:

```bash
# Setup for Claude Desktop
scripts/setup-mcp.js claude

# Setup for Cursor IDE
scripts/setup-mcp.js cursor

# Show help
scripts/setup-mcp.js --help
```

### Using with npm/npx

```bash
# Install globally
npm install -g archivenet

# Run setup
setup-mcp claude

# Or use without installing
npx archivenet
npx setup-mcp claude
```

## API Endpoint Requirements

Your API endpoints should implement the following interfaces:

### Insert Endpoint (POST)
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

The API key is now optional. If your API endpoints don't require authentication, simply leave the `API_KEY` environment variable unset or commented out in your `.env` file. The server will work without authentication headers.

## Troubleshooting

If the MCP server doesn't connect to your LLM:

1. **Check file paths**: Ensure all paths in the config are absolute and correct
2. **Verify endpoints**: Test your API endpoints independently
3. **Check logs**: Look at your LLM's logs for error messages
4. **Restart completely**: Completely restart your LLM after configuration changes
5. **Test server**: Run `node dist/index.js` to check for server errors
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
npm install -g archivenet

# Setup for your preferred LLM
setup-mcp claude
# or
setup-mcp cursor

# Start the server manually if needed
archivenet
```

## Project Structure

```
archivenet/
├── src/                    # TypeScript source files
├── dist/                   # Compiled JavaScript files
├── scripts/                # Setup and utility scripts
│   └── setup-mcp.js       # Unified setup script for Claude and Cursor
├── .env.example           # Environment variables template
├── package.json           # Package configuration
├── tsconfig.json          # TypeScript configuration
├── README.md              # This file
├── LICENSE                # MIT License
└── CHANGELOG.md           # Version history
```