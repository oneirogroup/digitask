import { z } from "zod";

import { Backend } from "../../types";

export const addResourceSchema = z.object({
  type: z.enum(["tv", "internet", "voice"]),
  task: z.number(),
  count: z.number().pipe(z.number().min(1)),
  item: z.custom<Backend.WarehouseItem>(value => !!value, { message: "Məhsulu seçin..." }),
  warehouse: z.custom<Backend.Warehouse>(value => !!value, { message: "Anbarı seçin..." })
});

export type AddResourceSchema = z.infer<typeof addResourceSchema>;
