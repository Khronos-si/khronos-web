const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Avatar = require("avatar-builder");
const User = require("../model/User");
const { registerValidation, loginValidation } = require("../utils/validation");

router.post("/register", async (req, res) => {
	const { error } = registerValidation(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	const emailExists = await User.findOne({ email: req.body.email });
	if (emailExists) return res.status(400).send("Email already exists");

	const salt = await bcrypt.genSalt(10);
	const hashPassword = await bcrypt.hash(req.body.password, salt);

	const avatar = Avatar.githubBuilder(128);

	const img = await avatar.create(req.body.name);

	const user = new User({
		name: req.body.name,
		email: req.body.email,
		password: hashPassword,
		avatar: img,
	});

	try {
		const savedUser = await user.save();
		return res.json({
			email: savedUser.email,
			name: savedUser.name,
			_id: savedUser._id,
		});
	} catch (err) {
		return res.status(400).send(err);
	}
});

router.post("/login", async (req, res) => {
	const { error } = loginValidation(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	const user = await User.findOne({ email: req.body.email });
	if (!user) return res.status(400).send("Email doesn't exists");

	const validPassword = await bcrypt.compare(req.body.password, user.password);
	if (!validPassword) return res.status(400).send("invalid password");

	const validUntil = new Date(Date.now() + 4 * 60 * 60 * 1000);
	const token = jwt.sign({ _id: user._id, validUntil }, process.env.JWT_SECRET);

	return res.header("auth-token", token).send(token);
});

module.exports = router;
