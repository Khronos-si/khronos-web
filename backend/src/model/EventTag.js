const mongoose = require("mongoose");

const eventTagSchema = new mongoose.Schema({
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
		required: true,
	},
	default: { type: Boolean, default: false },
	appliedTo: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Event",
		},
	],
});

module.exports = mongoose.model("EventTag", eventTagSchema, "EventTag");
