import type { InsertContextRequest, SearchContextRequest, InsertContextResponse, SearchContextResponse } from './types.js';
export declare class ContextAPIClient {
    private readonly headers;
    constructor();
    insertContext(request: InsertContextRequest): Promise<InsertContextResponse>;
    searchContext(request: SearchContextRequest): Promise<SearchContextResponse>;
    private normalizeSearchResponse;
}
//# sourceMappingURL=api-client.d.ts.map