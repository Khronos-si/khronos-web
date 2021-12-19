const router = require("express").Router();
const {
	register,
	login,
	logout,
	getAvatar,
	updatePassword,
} = require("../controllers/userController");
const { prepareUser } = require("../middleware/userMiddlewares");
const { verifyToken } = require("../middleware/verifyToken");

router.post("/register", register);

router.post("/login", login);

router.post("/logout", verifyToken, logout);

router.put("/update-password", verifyToken, prepareUser, updatePassword);

router.get("/avatar", verifyToken, prepareUser, getAvatar);

module.exports = router;
