import { Tool } from '@modelcontextprotocol/sdk/types.js';
export declare class ContextTools {
    private apiClient;
    constructor();
    getInsertContextTool(): Tool;
    getSearchContextTool(): Tool;
    executeInsertContext(args: unknown): Promise<{
        content: {
            type: string;
            text: string;
        }[];
    }>;
    executeSearchContext(args: unknown): Promise<{
        content: {
            type: string;
            text: string;
        }[];
    }>;
}
//# sourceMappingURL=tools.d.ts.map