const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
	createdAt: {
		type: Date,
		required: true,
		default: Date.now,
	},
	todoGroups: [{ type: mongoose.Schema.Types.ObjectId, ref: "TodoGroup" }],
	sharedTodos: [{ type: mongoose.Schema.Types.ObjectId, ref: "TodoGroup" }],
});

module.exports = mongoose.model("User", userSchema);
