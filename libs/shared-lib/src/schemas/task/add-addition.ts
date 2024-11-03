import { z } from "zod";

export const addAdditionSchema = z.object({});

export type AddAdditionSchema = z.infer<typeof addAdditionSchema>;
