const TodoGroup = require("../model/TodoGroup");
const Todo = require("../model/Todo");
const User = require("../model/User");

const processTodo = async (req, res, next) => {
	const userId = req.user._id;
	const todoId = req.params.id;
	const todo = await Todo.findById(todoId);

	if (!todo) return res.status(400).send("Requested todo doesn't exist");

	const user = await User.findById(userId);

	const todoGroup = await TodoGroup.findOne({
		$or: [
			{ _id: todo.todoGroupId, owner: user },
			{ _id: { $in: user.sharedTodos } },
		],
	});

	if (!todoGroup) return res.status(400).send("Todo not found!");

	req.isOwner = todoGroup.owner._id.equals(user._id);
	req.canEdit =
		todoGroup.owner._id.equals(user._id) || todoGroup.permissions >= 1;
	req.canDelete =
		todoGroup.owner._id.equals(user._id) || todoGroup.permissions >= 2;
	req.todo = todo;
	req.todoGroup = todoGroup;
	req.user = user;

	return next();
};

const processTodoGroup = async (req, res, next) => {
	const userId = req.user._id;
	const todoGroupId = req.params.id || req.body.todoGroupId;
	const user = await User.findById(userId);

	const todoGroup = await TodoGroup.findOne({
		$or: [
			{ _id: todoGroupId, owner: user },
			{ _id: { $in: user.sharedTodos } },
		],
	});

	if (!todoGroup) return res.status(400).send("Todo group not found!");

	req.isOwner = todoGroup.owner._id.equals(user._id);
	req.canEdit =
		todoGroup.owner._id.equals(user._id) || todoGroup.permissions >= 1;
	req.canDelete =
		todoGroup.owner._id.equals(user._id) || todoGroup.permissions >= 2;
	req.todoGroup = todoGroup;
	req.user = user;

	return next();
};

module.exports.processTodo = processTodo;
module.exports.processTodoGroup = processTodoGroup;
