const Event = require("../model/Event");
const EventTag = require("../model/EventTag");

const prepareTagById = async (req, res, next) => {
	const tagId = req.body.eventTagId || req.params.id;
	const { user } = req;

	const tag = await EventTag.findOne({ _id: tagId, owner: user }).populate(
		"appliedTo"
	);

	if (!tag) return res.status(400).json({ message: "Event tag not found!" });

	req.tag = tag;
	req.isDefault = tag.default;
	req.canEdit = !tag.default;
	req.isOwner = tag.owner._id.equals(user._id);

	return next();
};

const prepareEventById = async (req, res, next) => {
	const eventId = req.body.eventId || req.params.id;
	const { user } = req;

	const event = await Event.findOne({ _id: eventId, owner: user })
		.populate("tag")
		.populate("owner")
		.populate("sharedWith");

	if (!event) return res.status(400).json({ message: "Event not found!" });

	req.event = event;
	req.isOwner = event.owner._id.equals(user._id);
	// req.body.eventTagId = event.tag._id.toString();
	return next();
};

const prepareAllEvents = async (req, res, next) => {
	const { user } = req;
	const events = await Event.find({ owner: user })
		.populate("tag")
		.populate("owner")
		.populate("sharedWith");
	req.events = events;
	return next();
};

const prepareAllTags = async (req, res, next) => {
	const { user } = req;
	const tags = await EventTag.find({ owner: user }).populate("appliedTo");
	req.tags = tags;
	return next();
};

const prepareSharedEvents = async (req, res, next) => {
	const { user } = req;
	const events = await Event.find({ _id: { $in: user.sharedEvents } })
		.populate("tag")
		.populate("owner")
		.populate("sharedWith");
	req.events = events;
	return next();
};

module.exports = {
	prepareTagById,
	prepareAllEvents,
	prepareAllTags,
	prepareSharedEvents,
	prepareEventById,
};
