import DOMPurify from 'dompurify';
import { z } from 'zod';

export const sanitizeHtml = (input: string): string => {
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
    KEEP_CONTENT: true,
  });
};

export const sanitizeText = (input: string): string => {
  return input
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '')
    .trim();
};

export const sanitizeForDisplay = (input: string): string => {
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'span'],
    ALLOWED_ATTR: ['class'],
  });
};

export const validateAndSanitize = <T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; errors: z.ZodError } => {
  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, errors: result.error };
};

export const placeSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido').max(100, 'Máximo 100 caracteres'),
  category: z.string().min(1, 'La categoría es requerida').max(50),
  vibe: z.string().min(1, 'El ambiente es requerido').max(50),
  priceRange: z.enum(['$', '$$', '$$$', '$$$$']),
  tags: z.array(z.string().max(30)).max(10, 'Máximo 10 etiquetas'),
  addressOrNotes: z.string().max(500).optional(),
  rating: z.number().min(1).max(5).optional(),
  isFavorite: z.boolean().default(false),
  createdAt: z.date().optional(),
});

export const cravingSchema = z.object({
  name: z.string().min(1).max(100),
  iconName: z.string().min(1).max(50),
  category: z.string().min(1).max(50),
  tags: z.array(z.string().max(30)).max(10),
  vibes: z.array(z.string().max(30)).max(10),
});

export const blenderStateSchema = z.object({
  cravingType: z.string().min(1).max(50),
  mood: z.string().min(1).max(50),
  timeOfDay: z.string().min(1).max(50),
  company: z.string().min(1).max(50),
  budget: z.enum(['$', '$$', '$$$', '$$$$']),
});

export const settingsSchema = z.object({
  theme: z.enum(['light', 'dark', 'system']).default('system'),
  animationsEnabled: z.boolean().default(true),
  soundEnabled: z.boolean().default(true),
  language: z.enum(['es', 'en']).default('es'),
});

export type PlaceInput = z.infer<typeof placeSchema>;
export type CravingInput = z.infer<typeof cravingSchema>;
export type BlenderStateInput = z.infer<typeof blenderStateSchema>;
export type SettingsInput = z.infer<typeof settingsSchema>;

export const generateSecureId = (): string => {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  return `${Date.now()}-${array[0].toString(36)}`;
};

export const rateLimiter = new Map<string, { count: number; resetAt: number }>();

export const checkRateLimit = (key: string, maxRequests: number, windowMs: number): boolean => {
  const now = Date.now();
  const record = rateLimiter.get(key);
  
  if (!record || now > record.resetAt) {
    rateLimiter.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  
  if (record.count >= maxRequests) {
    return false;
  }
  
  record.count++;
  return true;
};

export const validateUrl = (url: string): boolean => {
  try {
    const parsed = new URL(url);
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch {
    return false;
  }
};

export const escapeHtml = (text: string): string => {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
};