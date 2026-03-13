import { createFileRoute } from "@tanstack/react-router";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { todos } from "@/db/schema";
import { generateTxId, parseDates } from "@/db/utils";

export const Route = createFileRoute("/api/mutations/todos")({
	server: {
		handlers: {
			POST: async ({ request }) => {
				const body = parseDates(await request.json());
				let txid: number = 0;
				await db.transaction(async (tx) => {
					await tx.insert(todos).values(body);
					txid = await generateTxId(tx);
				});
				return new Response(JSON.stringify({ txid }), {
					headers: { "Content-Type": "application/json" },
				});
			},
			PATCH: async ({ request }) => {
				const body = parseDates(await request.json());
				const { id, ...rest } = body as { id: string } & Record<
					string,
					unknown
				>;
				let txid: number = 0;
				await db.transaction(async (tx) => {
					await tx.update(todos).set(rest).where(eq(todos.id, id));
					txid = await generateTxId(tx);
				});
				return new Response(JSON.stringify({ txid }), {
					headers: { "Content-Type": "application/json" },
				});
			},
			DELETE: async ({ request }) => {
				const { id } = (await request.json()) as { id: string };
				let txid: number = 0;
				await db.transaction(async (tx) => {
					await tx.delete(todos).where(eq(todos.id, id));
					txid = await generateTxId(tx);
				});
				return new Response(JSON.stringify({ txid }), {
					headers: { "Content-Type": "application/json" },
				});
			},
		},
	},
});
