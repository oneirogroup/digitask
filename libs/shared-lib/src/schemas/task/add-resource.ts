import { z } from "zod";

import { Backend } from "../../types";

export const addResourceSchema = z.object({
  id: z.number(),
  type: z.enum(["tv", "internet", "voice"]),
  task: z.number(),
  count: z.string().regex(/^\d+$/, { message: "Sayı daxil edin..." }),
  item: z.custom<Backend.WarehouseItem>(value => !!value, { message: "Məhsulu seçin..." }).nullable(),
  warehouse: z.custom<Backend.Warehouse>(value => !!value, { message: "Anbarı seçin..." }).nullable()
});

export type AddResourceSchema = z.infer<typeof addResourceSchema>;
