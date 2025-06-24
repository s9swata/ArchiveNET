import { z } from 'zod';
declare const ConfigSchema: z.ZodObject<{
    insertEndpoint: z.ZodString;
    searchEndpoint: z.ZodString;
    apiKey: z.ZodString;
    apiTimeout: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    insertEndpoint: string;
    searchEndpoint: string;
    apiKey: string;
    apiTimeout: number;
}, {
    insertEndpoint: string;
    searchEndpoint: string;
    apiKey: string;
    apiTimeout?: number | undefined;
}>;
export declare const config: {
    insertEndpoint: string;
    searchEndpoint: string;
    apiKey: string;
    apiTimeout: number;
};
export type Config = z.infer<typeof ConfigSchema>;
export {};
//# sourceMappingURL=config.d.ts.map