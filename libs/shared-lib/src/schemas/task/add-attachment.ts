import { z } from "zod";

const baseAttachmentSchema = z.object({
  modem_SN: z.string(),
  passport: z.string(),
  photo_modem: z.string()
});

const tvAttachmentSchema = baseAttachmentSchema.extend({
  type: z.literal("tv")
});

const internetAttachmentSchema = baseAttachmentSchema.extend({
  type: z.literal("internet"),
  siqnal: z.string(),
  internet_packs: z.string()
});

const voiceAttachmentSchema = baseAttachmentSchema.extend({
  type: z.literal("voice"),
  home_number: z.string(),
  password: z.string()
});

export const taskAddAttachmentSchema = z.discriminatedUnion("type", [
  tvAttachmentSchema,
  internetAttachmentSchema,
  voiceAttachmentSchema
]);

export type AddAdditionSchema = z.infer<typeof taskAddAttachmentSchema>;
export type TVAttachmentSchema = z.infer<typeof tvAttachmentSchema>;
export type InternetAttachmentSchema = z.infer<typeof internetAttachmentSchema>;
export type VoiceAttachmentSchema = z.infer<typeof voiceAttachmentSchema>;
