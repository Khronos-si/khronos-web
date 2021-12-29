const Event = require("../model/Event");
const EventTag = require("../model/EventTag");

const prepareTagById = async (req, res, next) => {
	const tagId = req.body.eventTagId || req.params.id;
	const { user } = req;

	const tag = await EventTag.findOne({ _id: tagId, owner: user }).populate(
		"appliedTo"
	);

	req.tag = tag;
	req.isDefault = tag && tag.default;
	req.canEdit = tag && !tag.default;
	req.isOwner = tag && tag.owner._id.toString() === user._id.toString();

	return next();
};

const prepareEventById = async (req, res, next) => {
	const eventId = req.body.eventId || req.params.id;
	const { user } = req;

	const event = await Event.findOne({ _id: eventId, owner: user })
		.populate("tag")
		.populate("owner")
		.populate("sharedWith");

	req.event = event;
	req.isOwner = event && event.owner._id.toString() === user._id.toString();
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
	const { from, to } = req.body;
	const tags = await EventTag.find({ owner: user });

	for (const e of tags) {
		e.appliedTo = await Event.find({
			$and: [
				{ _id: { $in: e.appliedTo } },
				{ ...(from && { start: { $gte: from } }) },
				{ ...(to && { end: { $lte: to } }) },
			],
		});
	}

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
