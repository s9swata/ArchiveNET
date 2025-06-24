import { config } from './config.js';
export class ContextAPIClient {
    headers;
    constructor() {
        this.headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.apiKey}`,
            'User-Agent': 'MCP-Context-Server/1.0.0',
        };
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
            return result;
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
            return result;
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
}
//# sourceMappingURL=api-client.js.map