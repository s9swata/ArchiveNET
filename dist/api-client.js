import { config } from './config.js';
export class ContextAPIClient {
    headers;
    constructor() {
        this.headers = {
            'Content-Type': 'application/json',
            'User-Agent': 'MCP-Context-Server/1.0.0',
        };
        // Only add Authorization header if API key is provided
        if (config.apiKey) {
            this.headers['Authorization'] = `Bearer ${config.apiKey}`;
        }
    }
    async insertContext(request) {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), config.apiTimeout);
            // Format the request to match your API structure
            const requestBody = {
                content: request.content,
                metadata: {
                    context: request.metadata?.context || 'user_data',
                    tags: request.metadata?.tags || [],
                    timestamp: request.metadata?.timestamp || new Date().toISOString(),
                    client: request.metadata?.client || 'mcp-server',
                    ...request.metadata,
                },
            };
            const response = await fetch(config.insertEndpoint, {
                method: 'POST',
                headers: this.headers,
                body: JSON.stringify(requestBody),
                signal: controller.signal,
            });
            clearTimeout(timeoutId);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            const result = await response.json();
            // Handle different response formats
            if (typeof result === 'object' && result !== null) {
                // If it's already in the expected format
                if ('success' in result) {
                    return result;
                }
                // If it's a different format, normalize it
                return {
                    success: true,
                    id: result.id || 'unknown',
                    message: result.message || 'Context inserted successfully'
                };
            }
            // Fallback for unexpected formats
            return {
                success: true,
                message: 'Context inserted successfully'
            };
        }
        catch (error) {
            if (error instanceof Error) {
                if (error.name === 'AbortError') {
                    throw new Error('Request timeout - insert operation took too long');
                }
                throw new Error(`Insert context failed: ${error.message}`);
            }
            throw new Error('Insert context failed: Unknown error');
        }
    }
    async searchContext(request) {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), config.apiTimeout);
            // Format the request to match your API structure
            const requestBody = {
                query: request.query,
                k: request.k,
                filters: {
                    tags: request.filters?.tags || [],
                    ...request.filters,
                },
            };
            const response = await fetch(config.searchEndpoint, {
                method: 'POST',
                headers: this.headers,
                body: JSON.stringify(requestBody),
                signal: controller.signal,
            });
            clearTimeout(timeoutId);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            const result = await response.json();
            // Handle your backend's response format
            return this.normalizeSearchResponse(result);
        }
        catch (error) {
            if (error instanceof Error) {
                if (error.name === 'AbortError') {
                    throw new Error('Request timeout - search operation took too long');
                }
                throw new Error(`Search context failed: ${error.message}`);
            }
            throw new Error('Search context failed: Unknown error');
        }
    }
    normalizeSearchResponse(result) {
        // Handle direct array response (your format)
        if (Array.isArray(result)) {
            const normalizedResults = result.map((item) => ({
                id: item.id?.toString(),
                content: item.content || '',
                metadata: item.metadata,
                relevanceScore: item.distance ? (1 - item.distance) : undefined, // Convert distance to relevance score
                distance: item.distance
            }));
            return {
                success: true,
                results: normalizedResults,
                total: result.length,
                message: 'Search completed successfully'
            };
        }
        // Handle object response with results array
        if (result && typeof result === 'object') {
            // If it's already in the expected format
            if ('success' in result && 'results' in result) {
                return result;
            }
            // If it has a data field with results
            if ('data' in result && Array.isArray(result.data)) {
                const normalizedResults = result.data.map((item) => ({
                    id: item.id?.toString(),
                    content: item.content || '',
                    metadata: item.metadata,
                    relevanceScore: item.distance ? (1 - item.distance) : undefined,
                    distance: item.distance
                }));
                return {
                    success: true,
                    results: normalizedResults,
                    total: result.data.length,
                    message: result.message || 'Search completed successfully'
                };
            }
            // If it has results directly
            if ('results' in result && Array.isArray(result.results)) {
                const normalizedResults = result.results.map((item) => ({
                    id: item.id?.toString(),
                    content: item.content || '',
                    metadata: item.metadata,
                    relevanceScore: item.distance ? (1 - item.distance) : item.relevanceScore,
                    distance: item.distance
                }));
                return {
                    success: result.success !== false,
                    results: normalizedResults,
                    total: result.total || result.results.length,
                    message: result.message || 'Search completed successfully'
                };
            }
        }
        // Fallback for unexpected formats
        console.warn('Unexpected search response format:', result);
        return {
            success: false,
            results: [],
            total: 0,
            message: 'Unexpected response format from search endpoint'
        };
    }
}
//# sourceMappingURL=api-client.js.map