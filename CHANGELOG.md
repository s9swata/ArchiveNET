# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-01-24

### Added
- Initial release of MCP Context Server
- Insert context functionality for saving personal/professional data
- Search context functionality with vector similarity search
- Configurable API endpoints via environment variables
- Optional API key authentication
- TypeScript implementation with full type safety
- Zod validation for request/response schemas
- Cross-platform setup scripts for Claude Desktop integration
- Support for metadata including context, tags, timestamps, and client info
- Comprehensive error handling and validation
- Response format normalization for different backend APIs
- CLI binary for easy installation and usage

### Features
- **insert_context** tool: Save context data with rich metadata
- **search_context** tool: Find relevant context using queries and filters
- Automated Claude Desktop configuration
- Support for Windows, macOS, and Linux
- Flexible backend API integration
- Distance to relevance score conversion
- Timeout handling for API requests
- Detailed logging and error messages

### Documentation
- Complete README with setup instructions
- API endpoint requirements and examples
- Troubleshooting guide
- Usage examples for AI assistants