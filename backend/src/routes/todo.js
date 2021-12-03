const router = require("express").Router();
const TodoGroup = require("../model/TodoGroup");
const Todo = require("../model/Todo");
const User = require("../model/User");
const verifyToken = require("../middleware/verifyToken");
const {
	processTodo,
	processTodoGroup,
} = require("../middleware/todoMiddlewares");

router.get("/group", verifyToken, async (req, res) => {
	const userId = req.user._id;
	const user = await User.findById(userId);
	const todoGroups = await TodoGroup.find({ owner: user })
		.populate("todos")
		.populate("sharedWith");

	return res.json(
		todoGroups.map((e) => ({
			_id: e._id,
			name: e.name,
			permissions: e.permissions,
			sharedWith: e.sharedWith.map((x) => ({
				_id: x._id,
				name: x.name,
				email: x.email,
			})),
			todos: e.todos.map((x) => ({
				_id: x._id,
				name: x.name,
				description: x.description,
				status: x.status,
			})),
		}))
	);
});

router.get("/group/:id", verifyToken, async (req, res) => {
	const userId = req.user._id;
	const groupId = req.params.id;
	const todoGroup = await TodoGroup.findOne({
		_id: groupId,
		userId: userId,
	})
		.populate("todos")
		.populate("sharedWith");

	if (!todoGroup)
		return res.status(400).send("Requested todo group doesn't exist");

	return res.json({
		_id: todoGroup._id,
		name: todoGroup.name,
		permissions: todoGroup.permissions,
		sharedWith: todoGroup.sharedWith.map((e) => ({
			_id: e._id,
			name: e.name,
			email: e.email,
		})),
		todos: todoGroup.todos.map((e) => ({
			_id: e._id,
			name: e.name,
			description: e.description,
			status: e.status,
		})),
	});
});

router.get("/shared-with-me", verifyToken, async (req, res) => {
	const userId = req.user._id;
	const user = await User.findById(userId);
	const sharedIds = user.sharedTodos;
	const todoGroups = await TodoGroup.find({ _id: { $in: sharedIds } })
		.populate("todos")
		.populate("owner");

	if (!todoGroups) res.status(400).send("No one shared a todo group with you");

	return res.json(
		todoGroups.map((e) => ({
			_id: e._id,
			name: e.name,
			permissions: e.permissions,
			owner: { _id: e.owner._id, name: e.name, email: e.owner.email },
			todos: e.todos.map((x) => ({
				_id: x._id,
				name: x.name,
				description: x.description,
				status: x.status,
			})),
		}))
	);
});

router.get("/:id", verifyToken, async (req, res) => {
	const userId = req.user._id;
	const todoId = req.params.id;
	const user = await User.findById(userId);
	const sharedIds = user.sharedTodos;

	const todo = await Todo.findOne({
		_id: todoId,
		$or: [
			{ todoGroupId: { $in: user.todoGroups } },
			{ todoGroupId: { $in: sharedIds } },
		],
	});

	if (!todo) return res.status(400).send("Requested todo doesn't exist");

	return res.json({
		_id: todo._id,
		name: todo.name,
		description: todo.description,
		status: todo.status,
	});
});

router.post("/", verifyToken, processTodoGroup, async (req, res) => {
	const { name, description } = req.body;
	const { todoGroup } = req;

	const todo = new Todo({
		todoGroupId: todoGroup,
		name: name,
		description: description,
	});

	todoGroup.todos.push(todo);

	try {
		const savedTodo = await todo.save();
		const savedTodoGroup = await todoGroup.save();
		return res.json({
			_id: savedTodo._id,
			name: savedTodo.name,
			description: savedTodo.description,
			status: savedTodo.status,
			todoGroup: {
				_id: savedTodoGroup._id,
				name: savedTodoGroup.name,
				permissions: savedTodoGroup.permissions,
				sharedWith: savedTodoGroup.sharedWith.map((e) => ({
					email: e.email,
					_id: e._id,
				})),
				todos: savedTodoGroup.todos,
			},
		});
	} catch (err) {
		return res.status(400).send(err);
	}
});

router.post("/group", verifyToken, async (req, res) => {
	const { shareWith, permissions } = req.body;
	const userId = req.user._id;
	const user = await User.findOne({ _id: userId });

	// Check emails
	const sharedWithUsers = [];
	for (const e of shareWith) {
		if (e === user.email)
			return res
				.status(400)
				.send("You cant share a todo to yourself. Find some friends");
		const u = await await User.findOne({ email: e });
		if (!u) return res.status(400).send(`Email ${e} not found!`);
		sharedWithUsers.push(u);
	}

	const todoGroup = new TodoGroup({
		name: req.body.name,
		owner: user,
		permissions: permissions,
		sharedWith: sharedWithUsers,
	});

	user.todoGroups.push(todoGroup);
	sharedWithUsers.forEach((e) => {
		e.sharedTodos.push(todoGroup);
	});

	try {
		const savedTodoGroup = await todoGroup.save();
		await user.save();
		sharedWithUsers.forEach(async (e) => {
			await e.save();
		});

		return res.json({
			_id: savedTodoGroup._id,
			name: savedTodoGroup.name,
			permissions: savedTodoGroup.permissions,
			sharedWith: savedTodoGroup.sharedWith.map((e) => ({
				_id: e._id,
				name: e.name,
				email: e.email,
			})),
		});
	} catch (err) {
		return res.status(400).send(err);
	}
});

router.delete("/group/:id", verifyToken, processTodoGroup, async (req, res) => {
	const { user, todoGroup, isOwner } = req;
	if (!isOwner)
		return res
			.status(400)
			.send("You dont have the required permissions to edit this!");

	const sharedWith = await User.find({
		_id: { $in: todoGroup.sharedWith },
	});

	try {
		// Delete references stored in the User table
		sharedWith.forEach(async (e) => {
			e.sharedTodos.splice(e.sharedTodos.indexOf(todoGroup._id), 1);
			await e.save();
		});

		// Delete all the todos in the todo group
		todoGroup.todos.forEach(async (e) => {
			await Todo.findByIdAndRemove(e._id);
		});

		// Delete the todo group
		const removedTodoGroup = await TodoGroup.findByIdAndRemove(todoGroup._id);

		// Delete the reference in the owners User table
		user.todoGroups.splice(user.todoGroups.indexOf(todoGroup._id), 1);
		const savedUser = await user.save();

		return res.send();
	} catch (err) {
		return res.status(400).send(err);
	}
});

router.delete("/:id", verifyToken, processTodo, async (req, res) => {
	const { todo, todoGroup, canDelete } = req;
	if (canDelete) {
		try {
			todoGroup.todos.splice(todoGroup.todos.indexOf(todo._id), 1);
			const deletedTodo = await Todo.findByIdAndDelete(todo._id);
			const savedTodoGroup = todoGroup.save();
			return res.send();
		} catch (err) {
			return res.status(400).send(err);
		}
	} else {
		return res
			.status(400)
			.send("You dont have the required permissions to edit this!");
	}
});

router.put("/group/:id", verifyToken, processTodoGroup, async (req, res) => {
	const { name, shareWith, permissions } = req.body;
	const { user, todoGroup, isOwner } = req;

	if (!isOwner)
		return res
			.status(400)
			.send("You dont have the required permissions to edit this!");

	// Check emails
	const sharedWithUsers = [];
	for (const e of shareWith) {
		if (e === user.email)
			return res
				.status(400)
				.send("You cant share a todo to yourself. Find some friends");
		const u = await await User.findOne({ email: e }).select("_id");
		if (!u) return res.status(400).send(`Email ${e} not found!`);
		sharedWithUsers.push(u);
	}

	// Remove users
	for (const e of todoGroup.sharedWith) {
		if (sharedWithUsers.indexOf(e) === -1) {
			const u = await User.findById(e);
			todoGroup.sharedWith.splice(todoGroup.sharedWith.indexOf(u._id), 1);
			u.sharedTodos.splice(u.sharedTodos.indexOf(todoGroup), 1);
			await u.save();
		}
	}
	// Add new users
	for (const e of sharedWithUsers) {
		if (todoGroup.sharedWith.indexOf(e) === -1) {
			const u = await User.findById(e);
			todoGroup.sharedWith.push(e);
			u.sharedTodos.push(todoGroup);
			await u.save();
		}
	}

	todoGroup.permissions =
		permissions !== null ? permissions : todoGroup.permissions;

	todoGroup.name = name !== null ? name : todoGroup.name;

	try {
		const savedTodoGroup = await todoGroup.save();
		return res.send({
			_id: savedTodoGroup._id,
			name: savedTodoGroup.name,
			permissions: savedTodoGroup.permissions,
			sharedWith: savedTodoGroup.sharedWith.map((e) => ({
				_id: e._id,
				name: e.name,
				email: e.email,
			})),
		});
	} catch (err) {
		return res.status(400).send(err);
	}
});

router.put("/:id", verifyToken, processTodo, async (req, res) => {
	const { description, name, status } = req.body;
	const { todo } = req;
	todo.name = name !== null ? name : todo.name;
	todo.description = description !== null ? description : todo.description;
	todo.status = status !== null ? status : todo.status;
	try {
		const savedTodo = await todo.save();
		const todoGroup = await TodoGroup.findById(todo.todoGroupId).populate(
			"sharedWith"
		);
		console.log(todoGroup);
		return res.json({
			_id: savedTodo._id,
			name: savedTodo.name,
			description: savedTodo.description,
			status: savedTodo.status,
			todoGroup: {
				_id: todoGroup._id,
				name: todoGroup.name,
				permissions: todoGroup.permissions,
				sharedWith: todoGroup.sharedWith.map((e) => ({
					email: e.email,
					_id: e._id,
				})),
				todos: todoGroup.todos,
			},
		});
	} catch (err) {
		return res.status(400).send(err);
	}
});

module.exports = router;
