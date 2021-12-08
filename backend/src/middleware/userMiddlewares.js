const User = require("../model/User");

const prepareUser = async (req, res, next) => {
	const userId = req.user._id;
	const user = await User.findById(userId);
	req.user = user;
	return next();
};

module.exports = {
	prepareUser,
};
