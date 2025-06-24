# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.1] - 2025-01-24

### Changed
- **Project Structure**: Moved setup scripts to `scripts/` directory for better organization
- Updated package.json to reference scripts from new location
- Updated README.md with new script paths and project structure documentation
- Updated .npmignore to exclude setup script from npm package (development tool only)

### Fixed
- Improved project organization and maintainability
- Cleaner separation between runtime code and development tools

## [1.0.0] - 2025-01-24

### Added
- Initial release of ArchiveNet MCP Server
- Insert context functionality for saving personal/professional data
- Search context functionality with vector similarity search
- Configurable API endpoints via environment variables
- Optional API key authentication
- TypeScript implementation with full type safety
- Zod validation for request/response schemas
- **Multi-LLM Support**: Claude Desktop and Cursor IDE
- **Unified Setup Script**: Single script to configure both Claude and Cursor
- Support for metadata including context, tags, timestamps, and client info
- Comprehensive error handling and validation
- Response format normalization for different backend APIs
- CLI binary for easy installation and usage

### Features
- **insert_context** tool: Save context data with rich metadata
- **search_context** tool: Find relevant context using queries and filters
- **Unified setup command**: `setup-mcp claude` or `setup-mcp cursor`
- Automated configuration for both Claude Desktop and Cursor IDE
- Support for Windows, macOS, and Linux
- Flexible backend API integration
- Distance to relevance score conversion
- Timeout handling for API requests
- Detailed logging and error messages

### LLM Support
- **Claude Desktop**: Full MCP integration with automated setup
- **Cursor IDE**: Full MCP integration with automated setup
- Cross-platform configuration paths
- Environment variable management
- Automatic config file creation and updates

### Documentation
- Complete README with setup instructions for both LLMs
- API endpoint requirements and examples
- Troubleshooting guide for multiple LLMs
- Usage examples for AI assistants
- Unified setup script documentation

### Breaking Changes
- Package renamed from `mcp-context-server` to `archivenet`
- Setup script renamed from `setup-claude-mcp` to `setup-mcp`
- Server name in configs changed from `context-server` to `archivenet`