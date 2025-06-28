import { config } from './config.js';
import type { 
  InsertContextRequest, 
  SearchContextRequest, 
  InsertContextResponse, 
  SearchContextResponse,
  MemoryResult,
  ContextItem
} from './types.js';

export class ContextAPIClient {
  private readonly headers: Record<string, string>;

  constructor() {
    this.headers = {
      'Content-Type': 'application/json',
      'User-Agent': 'MCP-Context-Server/1.0.0',
    };

    // Only add Authorization header if token is provided
    if (config.token) {
      this.headers['Authorization'] = `Bearer ${config.token}`;
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

      const result = await response.json();
      
      // Handle different response formats
      if (typeof result === 'object' && result !== null) {
        // If it's already in the expected format
        if ('success' in result) {
          return result as InsertContextResponse;
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

      /* Format the request to match your API structure
      const requestBody = {
        query: request.query,
        k: request.k,
        filters: {
          tags: request.filters?.tags || [],
          ...request.filters,
        },
      };
      */

      const response = await fetch(config.searchEndpoint, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify({
          query: request.query,
          k: request.k || 5, // Default to 5 if not provided
          filters: {},
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      
      // Handle your backend's response format

      return this.normalizeSearchResponse(result);
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

  private normalizeSearchResponse(result: any): SearchContextResponse {
    // Handle your specific backend format first
    if (result && typeof result === 'object' && 'success' in result && 'data' in result && Array.isArray(result.data)) {
      const normalizedResults: ContextItem[] = result.data.map((item: MemoryResult) => ({
        id: item.id?.toString(),
        content: item.content || '',
        metadata: item.metadata,
        relevanceScore: item.distance ? (1 - item.distance) : undefined, // Convert distance to relevance score
        distance: item.distance
      }));

      return {
        success: result.success,
        results: normalizedResults,
        total: result.data.length,
        message: result.message || 'Search completed successfully'
      };
    }

    // Handle direct array response (fallback)
    if (Array.isArray(result)) {
      const normalizedResults: ContextItem[] = result.map((item: MemoryResult) => ({
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

    // Handle object response with results array (other formats)
    if (result && typeof result === 'object') {
      // If it's already in the expected format
      if ('success' in result && 'results' in result) {
        return result as SearchContextResponse;
      }

      // If it has results directly
      if ('results' in result && Array.isArray(result.results)) {
        const normalizedResults: ContextItem[] = result.results.map((item: any) => ({
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