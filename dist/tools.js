import { z } from 'zod';
import { ContextAPIClient } from './api-client.js';
import { InsertContextSchema, SearchContextSchema } from './types.js';
export class ContextTools {
    apiClient;
    constructor() {
        this.apiClient = new ContextAPIClient();
    }
    // Define the insert context tool
    getInsertContextTool() {
        return {
            name: 'insert_context',
            description: 'Insert personal or professional context data for future reference. Use this when the user shares personal information, work details, preferences, or any data that should be remembered.',
            inputSchema: {
                type: 'object',
                properties: {
                    content: {
                        type: 'string',
                        description: 'The content to store (personal info, work details, preferences, etc.)',
                    },
                    metadata: {
                        type: 'object',
                        properties: {
                            context: {
                                type: 'string',
                                description: 'Context description (e.g., "preference setting", "work info")',
                            },
                            tags: {
                                type: 'array',
                                items: { type: 'string' },
                                description: 'Tags for better organization and search',
                            },
                            timestamp: {
                                type: 'string',
                                description: 'ISO timestamp (will be auto-generated if not provided)',
                            },
                            client: {
                                type: 'string',
                                description: 'Client identifier (defaults to "mcp-server")',
                            },
                        },
                        description: 'Metadata object containing context, tags, timestamp, and client info',
                    },
                },
                required: ['content'],
            },
        };
    }
    // Define the search context tool
    getSearchContextTool() {
        return {
            name: 'search_context',
            description: 'Search through previously stored context data. Use this to find relevant personal or professional information that was previously shared.',
            inputSchema: {
                type: 'object',
                properties: {
                    query: {
                        type: 'string',
                        description: 'Search query to find relevant context',
                    },
                    k: {
                        type: 'number',
                        minimum: 1,
                        maximum: 100,
                        description: 'Number of results to return (required, typically 5-10)',
                        default: 5,
                    },
                    filters: {
                        type: 'object',
                        properties: {
                            tags: {
                                type: 'array',
                                items: { type: 'string' },
                                description: 'Filter results by specific tags',
                            },
                        },
                        description: 'Filters to apply to the search (can be empty object)',
                        default: {},
                    },
                },
                required: ['query', 'filters'],
            },
        };
    }
    // Execute insert context
    async executeInsertContext(args) {
        try {
            const validatedArgs = InsertContextSchema.parse(args);
            const result = await this.apiClient.insertContext(validatedArgs);
            if (result.success) {
                return {
                    content: [
                        {
                            type: 'text',
                            text: `✅ Context saved successfully! ${result.message}${result.id ? ` (ID: ${result.id})` : ''}`,
                        },
                    ],
                };
            }
            else {
                return {
                    content: [
                        {
                            type: 'text',
                            text: `❌ Failed to save context: ${result.message}`,
                        },
                    ],
                };
            }
        }
        catch (error) {
            if (error instanceof z.ZodError) {
                const errorMessages = error.errors.map(err => `${err.path.join('.')}: ${err.message}`);
                return {
                    content: [
                        {
                            type: 'text',
                            text: `❌ Invalid input:\n${errorMessages.join('\n')}`,
                        },
                    ],
                };
            }
            return {
                content: [
                    {
                        type: 'text',
                        text: `❌ Error inserting context: ${error instanceof Error ? error.message : 'Unknown error'}`,
                    },
                ],
            };
        }
    }
    // Execute search context
    async executeSearchContext(args) {
        try {
            const validatedArgs = SearchContextSchema.parse(args);
            const result = await this.apiClient.searchContext(validatedArgs);
            if (result.success && result.results && result.results.length > 0) {
                const formattedResults = result.results.map((item, index) => {
                    const tags = item.metadata?.tags ? ` [Tags: ${item.metadata.tags.join(', ')}]` : '';
                    const context = item.metadata?.context ? ` (${item.metadata.context})` : '';
                    // Use relevanceScore if available, otherwise calculate from distance
                    let scoreText = '';
                    if (item.relevanceScore !== undefined) {
                        scoreText = ` (Relevance: ${(item.relevanceScore * 100).toFixed(1)}%)`;
                    }
                    else if (item.distance !== undefined) {
                        const relevance = Math.max(0, (1 - item.distance) * 100);
                        scoreText = ` (Relevance: ${relevance.toFixed(1)}%)`;
                    }
                    const timestamp = item.metadata?.timestamp ?
                        new Date(item.metadata.timestamp).toLocaleString() : 'Unknown';
                    return `${index + 1}. **${context || 'Context'}**${scoreText}\n   ${item.content}${tags}\n   _Saved: ${timestamp}_`;
                }).join('\n\n');
                const total = result.total || result.results.length;
                return {
                    content: [
                        {
                            type: 'text',
                            text: `🔍 Found ${result.results.length} result(s)${total !== result.results.length ? ` out of ${total} total` : ''}:\n\n${formattedResults}`,
                        },
                    ],
                };
            }
            else if (result.success && result.results && result.results.length === 0) {
                return {
                    content: [
                        {
                            type: 'text',
                            text: `🔍 No results found for query: "${validatedArgs.query}"`,
                        },
                    ],
                };
            }
            else {
                return {
                    content: [
                        {
                            type: 'text',
                            text: `❌ Search failed: ${result.message || 'Unknown error'}`,
                        },
                    ],
                };
            }
        }
        catch (error) {
            if (error instanceof z.ZodError) {
                const errorMessages = error.errors.map(err => `${err.path.join('.')}: ${err.message}`);
                return {
                    content: [
                        {
                            type: 'text',
                            text: `❌ Invalid search parameters:\n${errorMessages.join('\n')}`,
                        },
                    ],
                };
            }
            return {
                content: [
                    {
                        type: 'text',
                        text: `❌ Error searching context: ${error instanceof Error ? error.message : 'Unknown error'}`,
                    },
                ],
            };
        }
    }
}
//# sourceMappingURL=tools.js.map