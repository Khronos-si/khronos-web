const User = require("../model/User");
const Event = require("../model/Event");
const EventTag = require("../model/EventTag");

const _userToJSON = (user, getId, getEmail, getName, getAvatar) => ({
	...(getId && { _id: user._id }),
	...(getName && { name: user.name }),
	...(getEmail && { email: user.email }),
	...(getAvatar && { avatar: user.avatar.toString("base64") }),
});

const _eventToJSON = (event) => ({
	_id: event._id,
	name: event.name,
	owner: _userToJSON(event.owner, true, false, false, false),
	description: event.description,
	start: event.start,
	end: event.end,
	repeatType: event.repeatType,
	repeatFor: event.repeatFor,
	tag: { _id: event.tag._id, name: event.tag.name, color: event.tag.color },
	sharedWith: event.sharedWith.map((e) =>
		_userToJSON(e, false, true, false, false)
	),
});

const _eventTagToJSON = (tag) => ({
	_id: tag._id,
	name: tag.name,
	color: tag.color,
	events: tag.appliedTo.map(_eventToJSON),
});

const addEventTag = async (req, res) => {
	const { name, color } = req.body;
	const { user } = req;

	const tag = new EventTag({
		name: name,
		color: color,
		owner: user,
	});

	user.eventTags.push(tag);

	try {
		const savedTag = await tag.save();
		await user.save();
		return res.json(_eventTagToJSON(savedTag));
	} catch (err) {
		return res.status(400).send(err);
	}
};

const addEvent = async (req, res) => {
	const { name, description, start, end, repeatType, repeatFor, shareWith } =
		req.body;
	const { user, tag } = req;

	const sharedWithUsers = [];
	for (const e of shareWith) {
		if (e === user.email)
			return res
				.status(400)
				.send("You cant share a todo to yourself. Find some friends");
		const u = await await User.findOne({ email: e });
		if (!u) return res.status(400).send(`Email ${e} not found!`);
		sharedWithUsers.push(u);
	}

	const event = new Event({
		name: name,
		description: description,
		owner: user,
		tag: tag,
		sharedWith: sharedWithUsers,
		start: new Date(start),
		end: new Date(end),
		repeatType: repeatType,
		repeatFor: repeatFor,
	});

	user.events.push(event);

	sharedWithUsers.forEach((e) => {
		e.sharedEvents.push(event);
	});

	tag.appliedTo.push(event);

	try {
		const savedEvent = await event.save();
		await user.save();
		await tag.save();
		for (const e of sharedWithUsers) {
			await e.save();
		}
		return res.json(_eventToJSON(savedEvent));
	} catch (err) {
		return res.status(400).send(err);
	}
};

const getAllEvents = async (req, res) => {
	const { events } = req;
	return res.json(events.map(_eventToJSON));
};

const getAllTags = async (req, res) => {
	const { tags } = req;
	return res.json(tags.map(_eventTagToJSON));
};

const getAllSharedEvents = async (req, res) => {
	const { events } = req;
	return res.json(events.map(_eventToJSON));
};

const getTagById = async (req, res) => {
	const { tag } = req;
	return res.json(_eventTagToJSON(tag));
};

const getEventById = async (req, res) => {
	const { event } = req;
	return res.json(_eventToJSON(event));
};

const deleteEventTag = async (req, res) => {
	const { tag, user, isOwner, isDefault } = req;

	if (!isOwner) return res.status(400).send("You dont own this event tag!");

	if (isDefault)
		return res.status(400).send("You can't delete the default tag");

	const defaultTag = await EventTag.findOne({ owner: user, default: true });

	user.eventTags.splice(user.eventTags.indexOf(tag), 1);
	try {
		for (const e of tag.appliedTo) {
			e.tag = defaultTag;
			await e.save();
		}
		await EventTag.findByIdAndDelete(tag);
		await user.save();

		return res.send();
	} catch (err) {
		return res.status(400).send(err);
	}
};

const deleteEvent = async (req, res) => {
	const { event, user, isOwner } = req;

	if (!isOwner) return res.status(400).send("You dont own this event!");

	const sharedWith = await User.find({ _id: { $in: event.sharedWith } });
	const tag = await EventTag.findById(event.tag);

	user.events.splice(user.events.indexOf(event), 1);
	try {
		for (const e of sharedWith) {
			e.sharedEvents.splice(e.sharedEvents.indexOf(event), 1);
			await e.save();
		}
		tag.appliedTo.splice(tag.appliedTo.indexOf(event));
		await tag.save();
		await user.save();
		await Event.findByIdAndDelete(event);
		return res.send();
	} catch (err) {
		return res.status(400).send(err);
	}
};

const updateEventTag = async (req, res) => {
	const { tag, isOwner, isDefault } = req;
	const { name, color } = req.body;

	if (!isOwner) return res.status(400).send("You dont own this event!");

	if (isDefault) return res.status(400).send("You can't edit the default tag");

	tag.name = name || tag.name;
	tag.color = color || tag.color;

	try {
		const savedTag = await tag.save();
		return res.json(_eventTagToJSON(savedTag));
	} catch (err) {
		return res.status(400).send(err);
	}
};

const updateEvent = async (req, res) => {
	const { name, description, start, end, repeatType, repeatFor, shareWith } =
		req.body;
	const { user, event, tag } = req;

	const sharedWithUsers = [];
	for (const e of shareWith) {
		if (e === user.email)
			return res
				.status(400)
				.send("You cant share a todo to yourself. Find some friends");
		const u = await await User.findOne({ email: e }).populate("sharedEvents");
		if (!u) return res.status(400).send(`Email ${e} not found!`);
		sharedWithUsers.push(u);
	}

	// Remove users
	let i = 0;
	while (i < event.sharedWith.length) {
		const e = event.sharedWith[i];
		if (sharedWithUsers.indexOf(e) === -1) {
			event.sharedWith.splice(event.sharedWith.indexOf(e), 1);
			e.sharedEvents.splice(e.sharedEvents.indexOf(event._id), 1);
			await e.save();
		} else i += 1;
	}

	// Add new users
	for (const e of sharedWithUsers) {
		if (event.sharedWith.indexOf(e) === -1) {
			event.sharedWith.push(e);
			e.sharedEvents.push(event);
			await e.save();
		}
	}

	event.name = name || event.name;
	event.description = description || event.description;
	event.start = start || event.start;
	event.end = end || event.end;
	event.repeatType = repeatType || event.repeatType;
	event.repeatFor = repeatFor || event.repeatFor;

	if (!event.tag._id.equals(tag._id)) {
		const oldTag = await EventTag.findById(event.tag);
		oldTag.appliedTo.splice(oldTag.appliedTo.indexOf(event), 1);
		await oldTag.save();

		tag.appliedTo.push(event);
		await tag.save();
		event.tag = tag;
	}

	try {
		const savedEvent = await event.save();
		return res.json(_eventToJSON(savedEvent));
	} catch (err) {
		return res.status(400).send(err);
	}
};

module.exports = {
	addEventTag,
	addEvent,
	getAllEvents,
	getAllTags,
	getAllSharedEvents,
	getTagById,
	getEventById,
	deleteEventTag,
	deleteEvent,
	updateEventTag,
	updateEvent,
};
