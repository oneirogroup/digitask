import { z } from "zod";

const envSchema = z.object({
  EXPO_PUBLIC_API_URL: z.string().url().default("https://app.digitask.store")
});

export const env = envSchema.parse(process.env);
export type Env = z.infer<typeof envSchema>;
