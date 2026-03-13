import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { todos } from "./schema";

const dateField = z
	.union([z.string(), z.date()])
	.transform((v) => (typeof v === "string" ? new Date(v) : v));

export const todoSelectSchema = createSelectSchema(todos, {
	created_at: dateField,
	updated_at: dateField,
});

export const todoInsertSchema = createInsertSchema(todos, {
	created_at: dateField,
	updated_at: dateField,
});

export type Todo = typeof todoSelectSchema._type;
export type NewTodo = typeof todoInsertSchema._type;
