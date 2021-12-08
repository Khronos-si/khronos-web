const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema({
	todoGroup: {
		type: mongoose.Types.ObjectId,
		ref: "TodoGroup",
		required: true,
	},
	name: {
		type: String,
		required: true,
	},
	description: {
		type: String,
		required: true,
	},
	status: {
		type: Boolean,
		default: false,
		required: true,
	},
	tags: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "TodoTag",
		},
	],
});

module.exports = mongoose.model("Todo", todoSchema, "Todo");
