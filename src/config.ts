import dotenv from 'dotenv';
import { z } from 'zod';

// Load environment variables
dotenv.config();

// Define configuration schema
const ConfigSchema = z.object({
  insertEndpoint: z.string().url('INSERT_CONTEXT_ENDPOINT must be a valid URL'),
  searchEndpoint: z.string().url('SEARCH_CONTEXT_ENDPOINT must be a valid URL'),
  token: z.string().optional(),
  apiTimeout: z.number().default(30000),
});

// Parse and validate configuration
function loadConfig() {
  try {
    const config = ConfigSchema.parse({
      insertEndpoint: process.env.INSERT_CONTEXT_ENDPOINT,
      searchEndpoint: process.env.SEARCH_CONTEXT_ENDPOINT,
      token: process.env.TOKEN,
      apiTimeout: process.env.API_TIMEOUT ? parseInt(process.env.API_TIMEOUT) : 30000,
    });
    
    return config;
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Configuration validation failed:');
      error.errors.forEach(err => {
        console.error(`- ${err.path.join('.')}: ${err.message}`);
      });
    } else {
      console.error('Failed to load configuration:', error);
    }
    process.exit(1);
  }
}

export const config = loadConfig();
export type Config = z.infer<typeof ConfigSchema>;