import { z } from "zod";

import { emailSchema } from "./email.schema";

export const signInSchema = emailSchema.extend({ password: z.string().min(5) }).strict();

export type SignInSchema = z.infer<typeof signInSchema>;
