const jwt = require("jsonwebtoken");
// const { redisClient } = require("../redis/redisClient");

const redis = require("redis");

const redisClient = redis.createClient({
	url: process.env.REDIS_CONNECT,
});

const verifyToken = async (req, res, next) => {
	const token = req.header("auth-token");
	if (!token) return res.status(401).json({ message: "Access Denied" });

	try {
		const verified = jwt.verify(token, process.env.JWT_SECRET);
		req.user = verified;
	} catch (err) {
		return res.status(400).json({ message: "Invalid Token" });
	}

	await redisClient.connect();

	const blacklist = await redisClient.keys(`BL_${req.user._id.toString()}*`);
	for (const e of blacklist) {
		const value = await redisClient.get(e);
		if (token === value) {
			await redisClient.disconnect();
			return res.status(400).json({ message: "Invalid Token" });
		}
	}
	await redisClient.disconnect();
	return next();
};

module.exports = { verifyToken };
