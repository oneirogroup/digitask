import { z } from "zod";

const envSchema = z.object({
  EXPO_PUBLIC_API_URL: z.string().url(),
  EXPO_PUBLIC_TAILWIND_CONFIG: z.string().optional()
});

export const env = envSchema.parse(process.env);
export type Env = z.infer<typeof envSchema>;
