import { z } from "zod";

export const taskAddAdditionSchema = z.object({});

export type AddAdditionSchema = z.infer<typeof taskAddAdditionSchema>;
