import { z } from "zod";

const envSchema = z.object({
  EXPO_PUBLIC_API_URL: z.string().url().default("https://37.61.77.5")
});

export const env = envSchema.parse(process.env);
export type Env = z.infer<typeof envSchema>;
