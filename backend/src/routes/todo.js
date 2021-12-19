const router = require("express").Router();
const { verifyToken } = require("../middleware/verifyToken");

const { prepareUser } = require("../middleware/userMiddlewares");

const {
	prepareGroupById,
	prepareSharedGroups,
	prepareGroups,
	prepareTodoById,
	prepareTodoTags,
	prepareTodoTagById,
} = require("../middleware/todoMiddlewares");

const {
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
} = require("../controllers/todoController");

router.get("/group", verifyToken, prepareUser, prepareGroups, getTodoGroups);

router.get(
	"/group/:id",
	verifyToken,
	prepareUser,
	prepareGroupById,
	getTodoGroupById
);

router.get("/tag", verifyToken, prepareUser, getTodoTags);

router.get(
	"/shared-with-me",
	verifyToken,
	prepareUser,
	prepareSharedGroups,
	getTodoGroupsSharedWithUser
);

router.get("/:id", verifyToken, prepareUser, prepareTodoById, getTodoById);

router.post(
	"/",
	verifyToken,
	prepareUser,
	prepareTodoTags,
	prepareGroupById,
	addTodo
);

router.post("/group", verifyToken, prepareUser, addTodoGroup);

router.post("/tag", verifyToken, prepareUser, addTodoTag);

router.delete(
	"/group/:id",
	verifyToken,
	prepareUser,
	prepareGroupById,
	deleteTodoGroup
);

router.delete(
	"/tag/:id",
	verifyToken,
	prepareUser,
	prepareTodoTagById,
	deleteTodoTag
);

router.delete(
	"/:id",
	verifyToken,
	prepareUser,
	prepareTodoById,
	prepareGroupById,
	deleteTodo
);

router.put(
	"/group/:id",
	verifyToken,
	prepareUser,
	prepareGroupById,
	updateTodoGroup
);

router.put(
	"/tag/:id",
	verifyToken,
	prepareUser,
	prepareTodoTagById,
	updateTodoTag
);

router.put("/:id", verifyToken, prepareUser, prepareTodoById, updateTodo);

module.exports = router;
