const jwt = require("jsonwebtoken");

module.exports = function verifyToken(req, res, next) {
	const token = req.header("auth-token");
	if (!token) return res.status(401).send("Access Denied");

	try {
		const verified = jwt.verify(token, process.env.JWT_SECRET);
		req.user = verified;
	} catch (err) {
		return res.status(400).send("Invalid Token");
	}
	return next();
};
