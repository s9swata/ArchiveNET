import dotenv from 'dotenv';
import { z } from 'zod';

// Load environment variables
dotenv.config();

// Define configuration schema
const ConfigSchema = z.object({
  baseApiUrl: z.string().url('BASE_API_URL must be a valid URL'),
  token: z.string().optional(),
  apiTimeout: z.number().default(30000),
});

// Parse and validate configuration
function loadConfig() {
  try {
    const config = ConfigSchema.parse({
      baseApiUrl: process.env.BASE_API_URL,
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