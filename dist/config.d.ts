import { z } from 'zod';
declare const ConfigSchema: z.ZodObject<{
    insertEndpoint: z.ZodString;
    searchEndpoint: z.ZodString;
    apiKey: z.ZodOptional<z.ZodString>;
    apiTimeout: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    insertEndpoint: string;
    searchEndpoint: string;
    apiTimeout: number;
    apiKey?: string | undefined;
}, {
    insertEndpoint: string;
    searchEndpoint: string;
    apiKey?: string | undefined;
    apiTimeout?: number | undefined;
}>;
export declare const config: {
    insertEndpoint: string;
    searchEndpoint: string;
    apiTimeout: number;
    apiKey?: string | undefined;
};
export type Config = z.infer<typeof ConfigSchema>;
export {};
//# sourceMappingURL=config.d.ts.map