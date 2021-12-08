const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Avatar = require("avatar-builder");
const User = require("../model/User");
const EventTag = require("../model/EventTag");
const { registerValidation, loginValidation } = require("../utils/validation");

const register = async (req, res) => {
	const { error } = registerValidation(req.body);
	const { name, email, password } = req.body;
	if (error) return res.status(400).send(error.details[0].message);

	const emailExists = await User.findOne({ email: email });
	if (emailExists) return res.status(400).send("Email already exists");

	const salt = await bcrypt.genSalt(10);
	const hashPassword = await bcrypt.hash(password, salt);

	const avatar = Avatar.githubBuilder(128);

	const img = await avatar.create(name);

	const user = new User({
		name: name,
		email: email,
		password: hashPassword,
		avatar: img,
	});

	const defaultEventTag = new EventTag({
		name: "Default",
		default: true,
		owner: user,
	});

	user.eventTags.push(defaultEventTag);

	try {
		const savedUser = await user.save();
		await defaultEventTag.save();
		return res.json({
			email: savedUser.email,
			name: savedUser.name,
			_id: savedUser._id,
		});
	} catch (err) {
		return res.status(400).send(err);
	}
};

const login = async (req, res) => {
	const { email, password } = req.body;
	const { error } = loginValidation(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	const user = await User.findOne({ email: email });
	if (!user) return res.status(400).send("Email doesn't exists");

	const validPassword = await bcrypt.compare(password, user.password);
	if (!validPassword) return res.status(400).send("invalid password");

	const validUntil = new Date(Date.now() + 4 * 60 * 60 * 1000);
	const token = jwt.sign({ _id: user._id, validUntil }, process.env.JWT_SECRET);

	res.header("auth-token", token);
	return res.json({
		_id: user._id,
		user: user.name,
		email: user.email,
		avatar: user.avatar.toString("base64"),
	});
};

const getAvatar = async (req, res) => {
	const { user } = req;
	return res.json({
		avatar: user.avatar.toString("base64"),
	});
};

module.exports = { register, login, getAvatar };
