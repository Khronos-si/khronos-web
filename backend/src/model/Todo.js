const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema({
	todoGroup: {
		type: mongoose.Types.ObjectId,
		ref: "TodoGroup",
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
		required: true,
		default: false,
	},
	tags: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "TodoTag",
		},
	],
});

module.exports = mongoose.model("Todo", todoSchema, "Todo");
