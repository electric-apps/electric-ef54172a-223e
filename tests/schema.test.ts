import { describe, it, expect } from "vitest"
import { todoSelectSchema, todoInsertSchema } from "@/db/zod-schemas"
import { todos } from "@/db/schema"
import {
	generateValidRow,
	generateRowWithout,
} from "./helpers/schema-test-utils"

describe("todoSelectSchema", () => {
	it("validates a valid row", () => {
		const row = generateValidRow(todoSelectSchema)
		const result = todoSelectSchema.safeParse(row)
		expect(result.success).toBe(true)
	})

	it("fails without title", () => {
		const row = generateRowWithout(todoSelectSchema, "title")
		const result = todoSelectSchema.safeParse(row)
		expect(result.success).toBe(false)
	})

	it("parses ISO string dates to Date objects", () => {
		const row = generateValidRow(todoSelectSchema)
		const withStringDates = {
			...row,
			created_at: new Date().toISOString(),
			updated_at: new Date().toISOString(),
		}
		const result = todoSelectSchema.safeParse(withStringDates)
		expect(result.success).toBe(true)
		if (result.success) {
			expect(result.data.created_at).toBeInstanceOf(Date)
			expect(result.data.updated_at).toBeInstanceOf(Date)
		}
	})

	it("accepts boolean completed field", () => {
		const row = generateValidRow(todoSelectSchema)
		const result = todoSelectSchema.safeParse({ ...row, completed: true })
		expect(result.success).toBe(true)
	})
})

describe("todoInsertSchema", () => {
	it("validates a valid insert row", () => {
		const row = generateValidRow(todoInsertSchema)
		const result = todoInsertSchema.safeParse(row)
		expect(result.success).toBe(true)
	})

	it("fails without title", () => {
		const row = generateRowWithout(todoInsertSchema, "title")
		const result = todoInsertSchema.safeParse(row)
		expect(result.success).toBe(false)
	})
})

describe("todos table schema", () => {
	it("exports the todos table", () => {
		expect(todos).toBeDefined()
	})
})
