import { z } from 'zod';
export declare const InsertContextSchema: z.ZodObject<{
    content: z.ZodString;
    metadata: z.ZodOptional<z.ZodObject<{
        context: z.ZodOptional<z.ZodString>;
        tags: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        timestamp: z.ZodOptional<z.ZodString>;
        client: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        context?: string | undefined;
        tags?: string[] | undefined;
        timestamp?: string | undefined;
        client?: string | undefined;
    }, {
        context?: string | undefined;
        tags?: string[] | undefined;
        timestamp?: string | undefined;
        client?: string | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    content: string;
    metadata?: {
        context?: string | undefined;
        tags?: string[] | undefined;
        timestamp?: string | undefined;
        client?: string | undefined;
    } | undefined;
}, {
    content: string;
    metadata?: {
        context?: string | undefined;
        tags?: string[] | undefined;
        timestamp?: string | undefined;
        client?: string | undefined;
    } | undefined;
}>;
export declare const SearchContextSchema: z.ZodObject<{
    query: z.ZodString;
    k: z.ZodDefault<z.ZodNumber>;
    filters: z.ZodDefault<z.ZodObject<{
        tags: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        tags?: string[] | undefined;
    }, {
        tags?: string[] | undefined;
    }>>;
}, "strip", z.ZodTypeAny, {
    query: string;
    k: number;
    filters: {
        tags?: string[] | undefined;
    };
}, {
    query: string;
    k?: number | undefined;
    filters?: {
        tags?: string[] | undefined;
    } | undefined;
}>;
export type InsertContextRequest = z.infer<typeof InsertContextSchema>;
export type SearchContextRequest = z.infer<typeof SearchContextSchema>;
export interface VectorMetadata {
    context?: string;
    tags?: string[];
    timestamp?: string;
    client?: string;
    [key: string]: any;
}
export interface MemoryResult {
    id: number;
    content?: string;
    metadata?: VectorMetadata;
    distance?: number;
}
export interface ContextItem {
    id?: string | number;
    content: string;
    metadata?: VectorMetadata;
    relevanceScore?: number;
    distance?: number;
}
export interface InsertContextResponse {
    success: boolean;
    id?: string | number;
    message: string;
}
export interface SearchContextResponse {
    success?: boolean;
    results?: ContextItem[];
    total?: number;
    message?: string;
    data?: MemoryResult[];
    length?: number;
}
//# sourceMappingURL=types.d.ts.map