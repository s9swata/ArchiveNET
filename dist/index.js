import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema, } from '@modelcontextprotocol/sdk/types.js';
import { ContextTools } from './tools.js';
import { config } from './config.js';
class MCPContextServer {
    server;
    contextTools;
    constructor() {
        this.server = new Server({
            name: 'context-server',
            version: '1.0.0',
        }, {
            capabilities: {
                tools: {},
            },
        });
        this.contextTools = new ContextTools();
        this.setupHandlers();
    }
    setupHandlers() {
        // Handle tool listing
        this.server.setRequestHandler(ListToolsRequestSchema, async () => {
            return {
                tools: [
                    this.contextTools.getInsertContextTool(),
                    this.contextTools.getSearchContextTool(),
                ],
            };
        });
        // Handle tool execution
        this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
            const { name, arguments: args } = request.params;
            switch (name) {
                case 'insert_context':
                    return await this.contextTools.executeInsertContext(args);
                case 'search_context':
                    return await this.contextTools.executeSearchContext(args);
                default:
                    throw new Error(`Unknown tool: ${name}`);
            }
        });
    }
    async run() {
        const transport = new StdioServerTransport();
        await this.server.connect(transport);
        console.error('MCP Context Server started successfully');
        console.error(`Insert endpoint: ${config.insertEndpoint}`);
        console.error(`Search endpoint: ${config.searchEndpoint}`);
    }
}
// Start the server
const server = new MCPContextServer();
server.run().catch((error) => {
    console.error('Failed to start server:', error);
    process.exit(1);
});
//# sourceMappingURL=index.js.map