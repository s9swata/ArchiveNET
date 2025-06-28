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
  }).default({}), // Required field but defaults to empty object
});

// Types
export type InsertContextRequest = z.infer<typeof InsertContextSchema>;
export type SearchContextRequest = z.infer<typeof SearchContextSchema>;

// Updated to match your backend response format
export interface VectorMetadata {
  context?: string;
  tags?: string[];
  timestamp?: string;
  client?: string;
  [key: string]: any; // Allow additional metadata fields
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

// Updated to handle both your format and standard format
export interface SearchContextResponse {
  success?: boolean;
  results?: ContextItem[];
  total?: number;
  message?: string;
  // Support direct array response from your backend
  data?: MemoryResult[];
  // Support if your backend returns results directly as array
  length?: number;
}