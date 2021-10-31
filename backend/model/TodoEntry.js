const mongoose = require("mongoose");

const todoEntrySchema = new mongoose.Schema({
	todoGroupId: {
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
});

module.exports = mongoose.model("TodoEntry", todoEntrySchema);
