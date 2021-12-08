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
	avatar: { type: Buffer, required: true },
	createdAt: {
		type: Date,
		default: Date.now,
		required: true,
	},
	todoTags: [{ type: mongoose.Schema.Types.ObjectId, ref: "TodoTag" }],
	eventTags: [{ type: mongoose.Schema.Types.ObjectId, ref: "EventTag" }],
	todoGroups: [{ type: mongoose.Schema.Types.ObjectId, ref: "TodoGroup" }],
	sharedTodos: [{ type: mongoose.Schema.Types.ObjectId, ref: "TodoGroup" }],
	events: [{ type: mongoose.Schema.Types.ObjectId, ref: "Event" }],
	sharedEvents: [{ type: mongoose.Schema.Types.ObjectId, ref: "Event" }],
});

module.exports = mongoose.model("User", userSchema, "User");
