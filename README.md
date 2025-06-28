# Monorepo

This is a monorepo containing multiple projects and tools.

## Projects

### MCP (Model Context Protocol)
Located in `mcp/` - An MCP server for context insertion and search functionality.

**Features:**
- Insert and search personal/professional context data
- Multi-LLM support (Claude Desktop, Cursor IDE)
- Configurable API endpoints
- Bearer token authentication
- TypeScript implementation with full type safety

**Quick Start:**
```bash
cd mcp
npm install
npm run edit-env --interactive
npm run setup claude  # or cursor
```

See [mcp/README.md](mcp/README.md) for detailed documentation.

## Structure

```
/
├── mcp/                    # MCP Context Server
│   ├── src/               # TypeScript source files
│   ├── scripts/           # Setup and utility scripts
│   ├── dist/              # Compiled JavaScript files
│   ├── package.json       # MCP package configuration
│   └── README.md          # MCP documentation
└── README.md              # This file
```

## Getting Started

Each project in this monorepo is self-contained with its own dependencies and build process. Navigate to the specific project directory and follow its README for setup instructions.

## Development

Each project can be developed independently:

```bash
# Work on MCP server
cd mcp
npm install
npm run dev

# Build all projects (if needed)
cd mcp && npm run build
```

## Contributing

When contributing to this monorepo:

1. Navigate to the specific project directory
2. Follow the project's development guidelines
3. Test your changes within that project's context
4. Update relevant documentation

Each project maintains its own changelog and versioning.