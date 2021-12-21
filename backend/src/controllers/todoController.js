const TodoGroup = require("../model/TodoGroup");
const Todo = require("../model/Todo");
const User = require("../model/User");
const TodoTag = require("../model/TodoTag");

const _userToJSON = (user, getId, getEmail, getName, getAvatar) => ({
	...(getId && { _id: user._id }),
	...(getName && { name: user.name }),
	...(getEmail && { email: user.email }),
	...(getAvatar && { avatar: user.avatar.toString("base64") }),
});

const _todoTagToJSON = (tag) => ({
	_id: tag._id,
	name: tag.name,
	color: tag.color,
});

const _todoToJSON = (todo) => ({
	_id: todo._id,
	name: todo.name,
	description: todo.description,
	status: todo.status,
	tags: todo.tags.map(_todoTagToJSON),
});

const _todoGroupToJSON = (todoGroup) => ({
	_id: todoGroup._id,
	name: todoGroup.name,
	permissions: todoGroup.permissions,
	sharedWith: todoGroup.sharedWith.map((e) =>
		_userToJSON(e, false, true, false, false)
	),
	color: todoGroup.color,
	owner: _userToJSON(todoGroup.owner, true, false, false, false),
	todos: todoGroup.todos.map(_todoToJSON),
});

const _deleteTodo = async (todo, group) => {
	// Remove from group
	group.todos.splice(group.todos.indexOf(todo), 1);
	await group.save();
	// Clear tag references
	for (const e of todo.tags) {
		e.appliedTo.splice(e.appliedTo.indexOf(todo), 1);
		await e.save();
	}
	// Remove todo
	await Todo.findByIdAndRemove(todo);
};

// ******************************
// 			GET
// ******************************

const getTodoGroups = async (req, res) => {
	const { groups } = req;
	return res.json(groups.map(_todoGroupToJSON));
};

const getTodoGroupById = async (req, res) => {
	const { group } = req;
	return res.json(_todoGroupToJSON(group));
};

const getTodoGroupsSharedWithUser = async (req, res) => {
	const { groups } = req;
	return res.json(groups.map(_todoGroupToJSON));
};

const getTodoById = async (req, res) => {
	const { todo } = req;
	return res.json(_todoToJSON(todo));
};

const getTodoTags = async (req, res) => {
	const { user } = req;
	const tags = await TodoTag.find({ owner: user });
	return res.json(tags.map(_todoTagToJSON));
};

// ******************************
// 			ADD
// ******************************

const addTodoGroup = async (req, res) => {
	const { shareWith, permissions, color } = req.body;
	const { user } = req;

	// Check emails
	const sharedWithUsers = [];
	const notFound = [];
	for (const e of shareWith) {
		if (e === user.email)
			return res.status(400).json({
				message: "You cant share a todo to yourself. Find some friends",
			});
		const u = await await User.findOne({ email: e });
		if (!u) {
			notFound.push(e);
		} else {
			sharedWithUsers.push(u);
		}
	}

	if (notFound.length > 0) {
		return res.status(400).json({
			message: "Users not found",
			users: notFound,
		});
	}

	const group = new TodoGroup({
		name: req.body.name,
		owner: user,
		permissions: permissions,
		sharedWith: sharedWithUsers,
		color: color,
	});

	user.todoGroups.push(group);
	sharedWithUsers.forEach((e) => {
		e.sharedTodos.push(group);
	});

	try {
		const savedGroup = await group.save();
		await user.save();
		for (const e of sharedWithUsers) {
			await e.save();
		}

		return res.json(_todoGroupToJSON(savedGroup));
	} catch (err) {
		return res.status(400).json({ message: err });
	}
};

const addTodoTag = async (req, res) => {
	const { name, color } = req.body;
	const { user } = req;

	const todoTag = new TodoTag({
		name: name,
		color: color,
		owner: user,
	});

	user.todoTags.push(todoTag);

	try {
		const savedTodoTag = await todoTag.save();
		await user.save();
		return res.json(_todoTagToJSON(savedTodoTag));
	} catch (err) {
		return res.status(400).json({ message: err });
	}
};

const addTodo = async (req, res) => {
	const { name, description } = req.body;
	const { group, tags, canEdit } = req;

	if (!canEdit)
		return res.status(400).json({
			message: "You dont have the required permissions to edit this!",
		});

	const todo = new Todo({
		todoGroup: group,
		name: name,
		description: description,
		tags: tags,
	});

	group.todos.push(todo);

	try {
		const savedTodo = await todo.save();
		await group.save();

		for (const e of tags) {
			e.appliedTo.push(todo);
			await e.save();
		}

		return res.json(_todoToJSON(savedTodo));
	} catch (err) {
		return res.status(400).json({ message: err });
	}
};

// ******************************
// 			DELETE
// ******************************

const deleteTodoGroup = async (req, res) => {
	const { user, isOwner, group } = req;
	if (!isOwner)
		return res.status(400).json({
			message: "You dont have the required permissions to edit this!",
		});

	const sharedWith = await User.find({
		_id: { $in: group.sharedWith },
	});

	try {
		// Delete all the todos in the todo group
		let i = group.todos.length;
		while (i > 0) {
			await _deleteTodo(group.todos.at(-1), group);
			i -= 1;
		}

		// Delete references stored in the User table
		for (const e of sharedWith) {
			e.sharedTodos.splice(e.sharedTodos.indexOf(group), 1);
			await e.save();
		}

		// // 	// Delete the reference in the owners User table
		user.todoGroups.splice(user.todoGroups.indexOf(group), 1);
		await user.save();
		// // 	// Delete the todo group
		await TodoGroup.findByIdAndRemove(group);
		return res.json({ message: "success" });
	} catch (err) {
		return res.status(400).json({ message: err });
	}
};

const deleteTodo = async (req, res) => {
	const { todo, group, canDelete } = req;

	if (!canDelete)
		return res.status(400).json({
			message: "You dont have the required permissions to edit this!",
		});

	try {
		_deleteTodo(todo, group);
		return res.json({ message: "success" });
	} catch (err) {
		return res.status(400).json({ message: err });
	}
};

const deleteTodoTag = async (req, res) => {
	const { tag } = req;
	try {
		for (const e of tag.appliedTo) {
			e.tags.splice(e.tags.indexOf(tag), 2);
			await e.save();
		}

		await TodoTag.findByIdAndDelete(tag);
		return res.json({ message: "success" });
	} catch (err) {
		return res.status(400).json({ message: err });
	}
};

// ******************************
// 			UPDATE
// ******************************

const updateTodoGroup = async (req, res) => {
	const { name, shareWith, permissions, color } = req.body;
	const { user, group, isOwner } = req;

	if (!isOwner)
		return res.status(400).json({
			message: "You dont have the required permissions to edit this!",
		});

	// Check emails
	const sharedWithUsers = [];
	const notFound = [];
	for (const e of shareWith) {
		if (e === user.email)
			return res.status(400).json({
				message: "You cant share a todo to yourself. Find some friends",
			});
		const u = await await User.findOne({ email: e });
		if (!u) {
			notFound.push(e);
		} else {
			sharedWithUsers.push(u);
		}
	}

	if (notFound.length > 0) {
		return res.status(400).json({
			message: "Users not found",
			users: notFound,
		});
	}

	// Remove users
	let i = 0;
	while (i < group.sharedWith.length) {
		const e = group.sharedWith[i];
		if (sharedWithUsers.indexOf(e) === -1) {
			group.sharedWith.splice(group.sharedWith.indexOf(e), 1);
			e.sharedTodos.splice(e.sharedTodos.indexOf(group), 1);
			await e.save();
		} else i += 1;
	}

	// Add new users
	for (const e of sharedWithUsers) {
		if (group.sharedWith.indexOf(e) === -1) {
			// const u = await User.findById(e);
			group.sharedWith.push(e);
			e.sharedTodos.push(group);
			await e.save();
		}
	}

	group.permissions =
		permissions === undefined ? group.permissions : permissions;
	group.name = name || group.name;
	group.color = color || group.color;

	try {
		const savedTodoGroup = await group.save();
		return res.json(_todoGroupToJSON(savedTodoGroup));
	} catch (err) {
		return res.status(400).json({ message: err });
	}
};

const updateTodo = async (req, res) => {
	const { description, name, status, tags } = req.body;
	const { todo } = req;

	todo.name = name || todo.name;
	todo.description = description || todo.description;
	todo.status = status === undefined ? todo.status : status;

	if (tags) {
		const newTags = await TodoTag.find({ _id: { $in: tags } });

		for (const e of todo.tags) {
			e.appliedTo.splice(e.appliedTo.indexOf(todo), 1);
			await e.save();
		}

		for (const e of newTags) {
			e.appliedTo.push(todo);
			await e.save();
		}

		todo.tags = newTags;
	}

	try {
		const savedTodo = await todo.save();
		return res.json(_todoToJSON(savedTodo));
	} catch (err) {
		return res.status(400).json({ message: err });
	}
};

const updateTodoTag = async (req, res) => {
	const { tag } = req;
	const { color, name } = req.body;

	tag.color = color || tag.color;
	tag.name = name || tag.name;

	try {
		const savedTag = await tag.save();
		return res.json(_todoTagToJSON(savedTag));
	} catch (err) {
		return res.status(400).json({ message: err });
	}
};

module.exports = {
	getTodoGroups,
	getTodoGroupById,
	getTodoGroupsSharedWithUser,
	getTodoById,
	getTodoTags,
	addTodoGroup,
	addTodoTag,
	addTodo,
	deleteTodoGroup,
	deleteTodo,
	deleteTodoTag,
	updateTodoGroup,
	updateTodo,
	updateTodoTag,
};
