const router = require("express").Router();
const { verifyToken } = require("../middleware/verifyToken");
const { prepareUser } = require("../middleware/userMiddlewares");
const {
	prepareTagById,
	prepareAllEvents,
	prepareAllTags,
	prepareSharedEvents,
	prepareEventById,
} = require("../middleware/eventMiddlewares");
const {
	addEventTag,
	addEvent,
	getAllEvents,
	getAllTags,
	getAllSharedEvents,
	getTagById,
	getEventById,
	deleteEventTag,
	deleteEvent,
	updateEventTag,
	updateEvent,
} = require("../controllers/eventController");

router.get("/", verifyToken, prepareUser, prepareAllTags, getAllEvents);

router.get("/tag", verifyToken, prepareUser, prepareAllTags, getAllTags);

router.get(
	"/shared-with-me",
	verifyToken,
	prepareUser,
	prepareSharedEvents,
	getAllSharedEvents
);

router.get("/tag/:id", verifyToken, prepareUser, prepareTagById, getTagById);

router.get("/:id", verifyToken, prepareUser, prepareEventById, getEventById);

router.post("/tag", verifyToken, prepareUser, addEventTag);

router.post("/", verifyToken, prepareUser, prepareTagById, addEvent);

router.delete(
	"/tag/:id",
	verifyToken,
	prepareUser,
	prepareTagById,
	deleteEventTag
);

router.delete("/:id", verifyToken, prepareUser, prepareEventById, deleteEvent);

router.put(
	"/tag/:id",
	verifyToken,
	prepareUser,
	prepareTagById,
	updateEventTag
);

router.put(
	"/:id",
	verifyToken,
	prepareUser,
	prepareEventById,
	prepareTagById,
	updateEvent
);
module.exports = router;
