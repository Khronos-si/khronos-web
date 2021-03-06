const mongoose = require("mongoose");

const todoGroupSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	owner: {
		type: mongoose.Types.ObjectId,
		ref: "User",
		required: true,
	},
	color: {
		type: String,
		default: "#ff8000",
	},
	permissions: { type: Number, default: 0, required: true },
	sharedWith: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
	],
	todos: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Todo",
		},
	],
});

module.exports = mongoose.model("TodoGroup", todoGroupSchema, "TodoGroup");
