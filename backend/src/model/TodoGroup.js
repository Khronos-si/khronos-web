const mongoose = require("mongoose");

const todoGroupSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	owner: {
		type: mongoose.Types.ObjectId,
		ref: "User",
	},
	permissions: { type: Number, default: 0 },
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

module.exports = mongoose.model("TodoGroup", todoGroupSchema);
