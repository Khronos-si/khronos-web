const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	description: {
		type: String,
		required: true,
	},
	owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
	dates: { type: Object, required: true },
	start: { type: Date, required: true },
	end: { type: Date, default: new Date(8640000000000000) },
	tag: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "EventTag",
	},

	sharedWith: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
		},
	],
});

module.exports = mongoose.model("Event", eventSchema, "Event");
