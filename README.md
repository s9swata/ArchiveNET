# MCP Context Server

A Model Context Protocol (MCP) server that provides context insertion and search functionality. This server allows AI assistants to save and retrieve personal and professional data through configurable API endpoints.

## Features

- **Insert Context**: Save personal, professional, or general information with metadata
- **Search Context**: Find previously stored context using queries with filtering
- **Configurable Endpoints**: Use your own API endpoints via environment variables
- **Type Safety**: Full TypeScript implementation with Zod validation
- **Error Handling**: Comprehensive error handling and validation
- **Metadata Support**: Rich metadata including context, tags, timestamps, and client info
- **Optional Authentication**: API key authentication is optional

## Setup

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

4. **Run the Server**
   ```bash
   npm start
   ```

   For development:
   ```bash
   npm run dev
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
  "filters": {
    "tags": ["preference"]
  }
}
```

**Response:**
```json
{
  "success": true,
  "results": [
    {
      "id": "unique-id",
      "content": "User's favorite color is blue",
      "metadata": {
        "context": "preference setting",
        "tags": ["preference", "color"],
        "timestamp": "2025-06-06T14:30:00Z",
        "client": "cursor"
      },
      "relevanceScore": 0.95
    }
  ],
  "total": 1,
  "message": "Search completed successfully"
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
- `filters` (optional): Object containing:
  - `tags`: Array of tags to filter by

## Usage with AI Assistants

This MCP server automatically detects when users share personal or professional information and can save it using the `insert_context` tool. It can then retrieve relevant information using the `search_context` tool when needed.

The server is designed to work seamlessly with AI assistants that support the Model Context Protocol.

## Development

- `npm run dev`: Run in development mode with hot reload
- `npm run build`: Build TypeScript to JavaScript
- `npm start`: Run the built server

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