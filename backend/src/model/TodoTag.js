const mongoose = require("mongoose");

const todoTagSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	color: {
		type: String,
		default: "#ff8000",
	},
	owner: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User",
	},
	appliedTo: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Todo",
		},
	],
});

module.exports = mongoose.model("TodoTag", todoTagSchema, "TodoTag");
