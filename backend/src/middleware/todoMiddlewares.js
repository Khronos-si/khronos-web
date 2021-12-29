const TodoGroup = require("../model/TodoGroup");
const Todo = require("../model/Todo");
const TodoTag = require("../model/TodoTag");

const prepareGroupById = async (req, res, next) => {
	const todoGroupId = req.body.todoGroupId || req.params.id;
	const { user } = req;
	const group = await TodoGroup.findOne({
		$and: [
			{ _id: todoGroupId },
			{ $or: [{ owner: user }, { _id: { $in: user.sharedTodos } }] },
		],
	})
		.populate({
			path: "todos",
			model: "Todo",
			populate: { path: "tags", model: "TodoTag" },
		})
		.populate("sharedWith")
		.populate("owner");

	req.group = group;
	req.isOwner = group && group.owner._id.toString() === user._id.toString();
	req.canEdit =
		(group && group.owner._id.toString() === user._id.toString()) ||
		(group && group.permissions >= 1);
	req.canDelete =
		(group && group.owner._id.toString() === user._id.toString()) ||
		(group && group.permissions >= 2);

	return next();
};

const prepareAllGroups = async (req, res, next) => {
	const { user } = req;
	const groups = await TodoGroup.find({
		or: [{ owner: user }, { _id: { $in: user.sharedTodos } }],
	})
		.populate({
			path: "todos",
			model: "Todo",
			populate: { path: "tags", model: "TodoTag" },
		})
		.populate("sharedWith")
		.populate("owner");
	req.groups = groups;
	return next();
};

const prepareSharedGroups = async (req, res, next) => {
	const { user } = req;
	const groups = await TodoGroup.find({ _id: { $in: user.sharedTodos } })
		.populate({
			path: "todos",
			model: "Todo",
			populate: { path: "tags", model: "TodoTag" },
		})
		.populate("sharedWith")
		.populate("owner");
	req.groups = groups;
	return next();
};

const prepareGroups = async (req, res, next) => {
	const { user } = req;
	const groups = await TodoGroup.find({ owner: user })
		.populate({
			path: "todos",
			model: "Todo",
			populate: { path: "tags", model: "TodoTag" },
		})
		.populate("sharedWith")
		.populate("owner");
	req.groups = groups;
	return next();
};

// ******************************
// 			TODO
// ******************************

const prepareTodoById = async (req, res, next) => {
	const todoId = req.body.todoId || req.params.id;
	const todo = await Todo.findById(todoId).populate("tags");
	req.todo = todo;
	req.body.todoGroupId = todo && todo.todoGroup._id.toString();
	return next();
};

const prepareTodoTags = async (req, res, next) => {
	const { user } = req;
	const { tags } = req.body;
	const tags_ = await TodoTag.find({ _id: { $in: tags }, owner: user });
	req.tags = tags_;
	return next();
};

const prepareTodoTagById = async (req, res, next) => {
	const tagId = req.params.id;
	const { user } = req;
	const tag = await TodoTag.findOne({ _id: tagId, owner: user }).populate({
		path: "appliedTo",
		model: "Todo",
	});
	req.tag = tag;
	return next();
};

module.exports = {
	prepareGroupById,
	prepareAllGroups,
	prepareSharedGroups,
	prepareGroups,
	prepareTodoById,
	prepareTodoTags,
	prepareTodoTagById,
};
