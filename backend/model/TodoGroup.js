const mongoose = require("mongoose");

const todoGroupSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	userId: {
		type: mongoose.Types.ObjectId,
		ref: "User",
	},
	todoEntrys: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "TodoEntry",
		},
	],
});

module.exports = mongoose.model("TodoGroup", todoGroupSchema);
