import { z } from 'zod';
// Schema for insert context request
export const InsertContextSchema = z.object({
    content: z.string().min(1, 'Content cannot be empty'),
    metadata: z.object({
        context: z.string().optional(),
        tags: z.array(z.string()).optional(),
        timestamp: z.string().optional(),
        client: z.string().optional(),
    }).optional(),
});
// Schema for search context request
export const SearchContextSchema = z.object({
    query: z.string().min(1, 'Query cannot be empty'),
    k: z.number().min(1).max(100).default(5),
    filters: z.object({
        tags: z.array(z.string()).optional(),
    }).optional(),
});
//# sourceMappingURL=types.js.map