const router = require("express").Router();
const TodoGroup = require("../model/TodoGroup");
const TodoEntry = require("../model/TodoEntry");
const User = require("../model/User");
const verifyToken = require("../middleware/verifyToken");

router.get("/", verifyToken, async (req, res) => {
	const todos = await TodoGroup.find().populate("todoEntrys");
	res.json({
		todos,
	});
	return res;
});

router.get("/:id", verifyToken, async (req, res) => {
	const todoEntryId = req.params.id;
	const todo = await TodoEntry.find({ _id: todoEntryId });
	res.json({
		todo,
	});
	return res;
});

router.post("/", verifyToken, async (req, res) => {
	const userId = req.user._id;
	const { todoGroupId } = req.body;

	const todoGroup = await TodoGroup.findOne({
		_id: todoGroupId,
		user_id: userId,
	});
	if (!todoGroup) return res.status(400).send("Todo group doesn't exist");

	const todoEntry = new TodoEntry({
		todo_group_id: todoGroup._id,
		name: req.body.name,
		description: req.body.description,
		status: req.body.status,
	});

	todoGroup.todoEntrys.push(todoEntry);

	try {
		const savedTodo = await todoEntry.save();
		const savedTodoGroup = await todoGroup.save();
		return res.send({ savedTodo, savedTodoGroup });
	} catch (err) {
		return res.status(400).send(err);
	}
});

router.post("/group", verifyToken, async (req, res) => {
	const userId = req.user._id;
	const todoGroup = new TodoGroup({
		name: req.body.name,
		user_id: userId,
	});

	const user = await User.findOne({ _id: userId });
	user.todoGroups.push(todoGroup);

	try {
		const savedTodoGroup = await todoGroup.save();
		const savedUser = await user.save();
		return res.send({ savedTodoGroup, savedUser });
	} catch (err) {
		return res.status(400).send(err);
	}
});

module.exports = router;
