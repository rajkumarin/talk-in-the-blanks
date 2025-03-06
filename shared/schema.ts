import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const formFields = pgTable("form_fields", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  label: text("label").notNull(),
  type: text("type").notNull(),
  required: boolean("required").default(false),
});

export const formData = pgTable("form_data", {
  id: serial("id").primaryKey(),
  fieldId: integer("field_id").references(() => formFields.id),
  value: text("value").notNull(),
});

export const insertFormFieldSchema = createInsertSchema(formFields).pick({
  name: true,
  label: true,
  type: true,
  required: true,
});

export const insertFormDataSchema = createInsertSchema(formData).pick({
  fieldId: true,
  value: true,
});

export type FormField = typeof formFields.$inferSelect;
export type InsertFormField = z.infer<typeof insertFormFieldSchema>;
export type FormData = typeof formData.$inferSelect;
export type InsertFormData = z.infer<typeof insertFormDataSchema>;
