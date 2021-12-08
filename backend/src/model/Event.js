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
	start: { type: Date, required: true },
	end: { type: Date, required: true },
	repeatType: { type: Number, default: -1, required: true },
	repeatFor: { type: Number, default: 0, required: true },
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
