import {
	AlertDialog,
	Badge,
	Button,
	Card,
	Checkbox,
	Container,
	Dialog,
	Flex,
	Heading,
	IconButton,
	Spinner,
	Text,
	TextField,
} from "@radix-ui/themes";
import { useLiveQuery } from "@tanstack/react-db";
import { createFileRoute } from "@tanstack/react-router";
import { ClipboardList, Plus, Trash2 } from "lucide-react";
import { useId, useState } from "react";
import { todoCollection } from "@/db/collections/todos";
import type { Todo } from "@/db/zod-schemas";

export const Route = createFileRoute("/")({
	ssr: false,
	loader: async () => {
		await todoCollection.preload();
		return null;
	},
	component: HomePage,
});

function HomePage() {
	const { data: todos, isLoading } = useLiveQuery(
		(q) =>
			q
				.from({ todo: todoCollection })
				.orderBy(({ todo }) => todo.created_at, "desc"),
		[],
	);

	const todoInputId = useId();
	const [newTitle, setNewTitle] = useState("");
	const [dialogOpen, setDialogOpen] = useState(false);
	const [deleteTarget, setDeleteTarget] = useState<Todo | null>(null);

	const completedCount = todos?.filter((t) => t.completed).length ?? 0;
	const totalCount = todos?.length ?? 0;

	const handleAddTodo = () => {
		const title = newTitle.trim();
		if (!title) return;
		todoCollection.insert({
			id: crypto.randomUUID(),
			title,
			completed: false,
			created_at: new Date(),
			updated_at: new Date(),
		});
		setNewTitle("");
		setDialogOpen(false);
	};

	const handleToggle = (todo: Todo) => {
		todoCollection.update(todo.id, (draft) => {
			draft.completed = !draft.completed;
			draft.updated_at = new Date();
		});
	};

	const handleDelete = () => {
		if (deleteTarget) {
			todoCollection.delete(deleteTarget.id);
			setDeleteTarget(null);
		}
	};

	if (isLoading) {
		return (
			<Flex align="center" justify="center" py="9">
				<Spinner size="3" />
			</Flex>
		);
	}

	return (
		<Container size="2" py="6">
			<Flex direction="column" gap="5">
				{/* Header */}
				<Flex justify="between" align="center">
					<Flex align="center" gap="3">
						<Heading size="7">Todos</Heading>
						{totalCount > 0 && (
							<Badge variant="soft" color="violet">
								{completedCount}/{totalCount}
							</Badge>
						)}
					</Flex>
					<Dialog.Root open={dialogOpen} onOpenChange={setDialogOpen}>
						<Dialog.Trigger>
							<Button>
								<Plus size={16} />
								Add Todo
							</Button>
						</Dialog.Trigger>
						<Dialog.Content maxWidth="450px">
							<Dialog.Title>New Todo</Dialog.Title>
							<Flex direction="column" gap="4" mt="4">
								<Flex direction="column" gap="1">
									<Text size="2" weight="medium" htmlFor={todoInputId}>
										Title
									</Text>
									<TextField.Root
										aria-label="Todo title"
										id={todoInputId}
										placeholder="What needs to be done?"
										value={newTitle}
										onChange={(e) => setNewTitle(e.target.value)}
										onKeyDown={(e) => {
											if (e.key === "Enter") handleAddTodo();
										}}
										autoFocus
									/>
								</Flex>
								<Flex gap="3" justify="end" mt="2">
									<Dialog.Close>
										<Button variant="soft" color="gray">
											Cancel
										</Button>
									</Dialog.Close>
									<Button onClick={handleAddTodo} disabled={!newTitle.trim()}>
										Add Todo
									</Button>
								</Flex>
							</Flex>
						</Dialog.Content>
					</Dialog.Root>
				</Flex>

				{/* Todo List */}
				{!todos || todos.length === 0 ? (
					<Flex direction="column" align="center" gap="3" py="9">
						<ClipboardList size={48} strokeWidth={1} color="var(--gray-8)" />
						<Text size="4" color="gray">
							No todos yet
						</Text>
						<Button variant="soft" onClick={() => setDialogOpen(true)}>
							Create your first todo
						</Button>
					</Flex>
				) : (
					<Flex direction="column" gap="2">
						{todos.map((todo) => (
							<Card key={todo.id}>
								<Flex align="center" gap="3" justify="between">
									<Flex align="center" gap="3" style={{ flex: 1, minWidth: 0 }}>
										<Checkbox
											size="2"
											checked={todo.completed}
											onCheckedChange={() => handleToggle(todo)}
										/>
										<Text
											size="3"
											weight={todo.completed ? "regular" : "medium"}
											color={todo.completed ? "gray" : undefined}
											style={{
												textDecoration: todo.completed
													? "line-through"
													: "none",
												overflow: "hidden",
												textOverflow: "ellipsis",
												whiteSpace: "nowrap",
											}}
										>
											{todo.title}
										</Text>
									</Flex>
									<IconButton
										size="1"
										variant="ghost"
										color="red"
										onClick={() => setDeleteTarget(todo)}
									>
										<Trash2 size={14} />
									</IconButton>
								</Flex>
							</Card>
						))}
					</Flex>
				)}
			</Flex>

			{/* Delete Confirmation */}
			<AlertDialog.Root
				open={!!deleteTarget}
				onOpenChange={(open) => !open && setDeleteTarget(null)}
			>
				<AlertDialog.Content maxWidth="400px">
					<AlertDialog.Title>Delete Todo</AlertDialog.Title>
					<AlertDialog.Description size="2">
						Are you sure you want to delete &ldquo;{deleteTarget?.title}&rdquo;?
						This action cannot be undone.
					</AlertDialog.Description>
					<Flex gap="3" justify="end" mt="4">
						<AlertDialog.Cancel>
							<Button variant="soft" color="gray">
								Cancel
							</Button>
						</AlertDialog.Cancel>
						<AlertDialog.Action>
							<Button color="red" onClick={handleDelete}>
								Delete
							</Button>
						</AlertDialog.Action>
					</Flex>
				</AlertDialog.Content>
			</AlertDialog.Root>
		</Container>
	);
}
