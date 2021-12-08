const router = require("express").Router();
const { register, login, getAvatar } = require("../controllers/userController");
const { prepareUser } = require("../middleware/userMiddlewares");
const verifyToken = require("../middleware/verifyToken");

router.post("/register", register);

router.post("/login", login);

router.get("/avatar", verifyToken, prepareUser, getAvatar);

module.exports = router;
