import { config } from './config.js';
import type { 
  InsertContextRequest, 
  SearchContextRequest, 
  InsertContextResponse, 
  SearchContextResponse 
} from './types.js';

export class ContextAPIClient {
  private readonly headers: Record<string, string>;

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

  async insertContext(request: InsertContextRequest): Promise<InsertContextResponse> {
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

      const result = await response.json() as InsertContextResponse;
      return result;
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Request timeout - insert operation took too long');
        }
        throw new Error(`Insert context failed: ${error.message}`);
      }
      throw new Error('Insert context failed: Unknown error');
    }
  }

  async searchContext(request: SearchContextRequest): Promise<SearchContextResponse> {
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

      const result = await response.json() as SearchContextResponse;
      return result;
    } catch (error) {
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