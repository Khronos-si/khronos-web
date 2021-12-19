const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Avatar = require("avatar-builder");
const redis = require("redis");
const User = require("../model/User");
const EventTag = require("../model/EventTag");
const { registerValidation, loginValidation } = require("../utils/validation");

const redisClient = redis.createClient({
	url: process.env.REDIS_CONNECT,
});

const register = async (req, res) => {
	const { error } = registerValidation(req.body);
	const { name, email, password } = req.body;
	if (error) return res.status(400).json({ message: error.details[0].message });

	const emailExists = await User.findOne({ email: email });
	if (emailExists)
		return res.status(400).json({ message: "Email already exists" });

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
		return res.status(400).json({ message: err });
	}
};

const login = async (req, res) => {
	const email = req.body.email.toLowerCase();
	const { password } = req.body;
	const { error } = loginValidation(req.body);
	if (error) return res.status(400).json({ message: error.details[0].message });

	const user = await User.findOne({ email: email });
	if (!user) return res.status(400).json({ message: "Email doesn't exists" });

	const validPassword = await bcrypt.compare(password, user.password);
	if (!validPassword)
		return res.status(400).json({ message: "invalid password" });

	const validUntil = new Date(
		Date.now() + parseInt(process.env.JWT_EXP, 10) * 1000
	);
	const token = jwt.sign(
		{ _id: user._id, validUntil },
		process.env.JWT_SECRET,
		{ expiresIn: parseInt(process.env.JWT_EXP, 10) }
	);

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

const logout = async (req, res) => {
	const token = req.header("auth-token");
	const decodedToken = jwt.decode(token);

	const now = Math.floor(Date.now() / 1000);
	const remExp = decodedToken.exp - now;

	await redisClient.connect();

	const blacklist = await redisClient.keys(
		`BL_${decodedToken._id.toString()}*`
	);

	const index = blacklist.length;

	await redisClient.set(`BL_${decodedToken._id.toString()}_${index}`, token, {
		EX: remExp,
	});

	await redisClient.disconnect();

	res.header("auth-token", "Invalid");

	return res.json();
};

const updatePassword = async (req, res) => {
	const { user } = req;
	const { oldPassword, newPassword } = req.body;
	const token = req.header("auth-token");

	const validPassword = await bcrypt.compare(oldPassword, user.password);
	if (!validPassword)
		return res.status(400).json({ message: "Old password is invalid" });

	const salt = await bcrypt.genSalt(10);
	const hashPassword = await bcrypt.hash(newPassword, salt);

	user.password = hashPassword;
	await user.save();

	const decodedToken = jwt.decode(token);

	const now = Math.floor(Date.now() / 1000);
	const remExp = decodedToken.exp - now;

	await redisClient.connect();

	const blacklist = await redisClient.keys(
		`BL_${decodedToken._id.toString()}*`
	);

	const index = blacklist.length;

	await redisClient.set(`BL_${decodedToken._id.toString()}_${index}`, token, {
		EX: remExp,
	});

	await redisClient.disconnect();

	const validUntil = new Date(
		Date.now() + parseInt(process.env.JWT_EXP, 10) * 1000
	);
	const newToken = jwt.sign(
		{ _id: user._id, validUntil },
		process.env.JWT_SECRET,
		{ expiresIn: parseInt(process.env.JWT_EXP, 10) }
	);

	res.header("auth-token", newToken);

	return res.json({ message: "Success!" });
};

module.exports = { register, login, getAvatar, logout, updatePassword };
