const router = require("express").Router();
const {
	register,
	login,
	logout,
	getAvatar,
	updatePassword,
	checkEmails,
	refreshToken,
} = require("../controllers/userController");
const { prepareUser } = require("../middleware/userMiddlewares");
const { verifyToken } = require("../middleware/verifyToken");

router.post("/register", register);

router.post("/login", login);

router.post("/logout", verifyToken, logout);

router.put("/update-password", verifyToken, prepareUser, updatePassword);

router.get("/avatar", verifyToken, prepareUser, getAvatar);

router.get("/check-emails", verifyToken, checkEmails);

router.get("/refresh-token", refreshToken);

module.exports = router;
