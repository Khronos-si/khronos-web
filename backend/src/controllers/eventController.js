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
	dates: event.dates,
	tag: { _id: event.tag._id, name: event.tag.name, color: event.tag.color },
	sharedWith: event.sharedWith.map((e) =>
		_userToJSON(e, false, true, false, false)
	),
});

const _eventTagToJSON = (tag, getEvents = true) => ({
	_id: tag._id,
	name: tag.name,
	color: tag.color,
	...(getEvents && { events: tag.appliedTo.map(_eventToJSON) }),
});

// ******************************
// 			ADD
// ******************************

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
		return res.status(400).json({ message: err });
	}
};

const addEvent = async (req, res) => {
	const { name, description, dates, sharedWith } = req.body;
	const { user, tag } = req;
	const { start, end } = dates;

	if (!tag) return res.status(400).json({ message: "Event tag not found!" });

	if (start > end)
		return res
			.status(400)
			.json({ message: "Start date is greater than end date!" });

	// Prepare sharedWithUsers array
	const sharedWithUsers = [];
	if (sharedWith !== undefined) {
		for (const e of sharedWith) {
			if (e === user.email)
				return res.status(400).json({
					message: "You cant share a todo to yourself. Find some friends",
				});
			const u = await await User.findOne({ email: e });
			if (!u) return res.status(400).json({ message: `Email ${e} not found!` });
			sharedWithUsers.push(u);
		}
	}

	const event = new Event({
		name: name,
		description: description,
		owner: user,
		tag: tag,
		sharedWith: sharedWithUsers,
		dates: dates,
		start: start,
		...(end && { end: end }),
	});

	// Add event to user
	user.events.push(event);
	// Add event to all the users that the event is shared with
	sharedWithUsers.forEach((e) => {
		e.sharedEvents.push(event);
	});
	// Add event to tag
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
		return res.status(400).json({ message: err });
	}
};

// ******************************
// 			GET
// ******************************

const getAllEvents = async (req, res) => {
	const { tags } = req;
	return res.json(tags.map((e) => _eventTagToJSON(e)));
};

const getAllTags = async (req, res) => {
	const { tags } = req;
	return res.json(tags.map((e) => _eventTagToJSON(e, false)));
};

const getAllSharedEvents = async (req, res) => {
	const { events } = req;
	return res.json(events.map(_eventToJSON));
};

const getTagById = async (req, res) => {
	const { tag } = req;
	if (!tag) return res.status(400).json({ message: "Event tag not found!" });
	return res.json(_eventTagToJSON(tag));
};

const getEventById = async (req, res) => {
	const { event } = req;
	if (!event) return res.status(400).json({ message: "Event not found!" });
	return res.json(_eventToJSON(event));
};

// ******************************
// 			DELETE
// ******************************

const deleteEventTag = async (req, res) => {
	const { tag, user, isOwner, isDefault } = req;

	if (!tag) return res.status(400).json({ message: "Event tag not found!" });

	if (!isOwner)
		return res.status(400).json({ message: "You dont own this event tag!" });

	// Remove events from user
	const events = tag.appliedTo;
	events.forEach((e) => user.events.splice(user.events.indexOf(e), 1));

	if (!isDefault)
		// Remove tag from user
		user.eventTags.splice(user.eventTags.indexOf(tag), 1);
	else tag.appliedTo = [];

	try {
		// Remove events
		for (const e of events) {
			await Event.findByIdAndDelete(e);
			// Remove events from users that the event is shared with
			for (const id of e.sharedWith) {
				const u = await User.findById(id);
				u.sharedEvents.splice(u.sharedEvents.indexOf(e), 1);
				await u.save();
			}
		}

		// Remove tag
		if (!isDefault) await EventTag.findByIdAndDelete(tag);
		else await tag.save();

		await user.save();

		return res.json({ message: "success" });
	} catch (err) {
		return res.status(400).json({ message: err });
	}
};

const deleteEvent = async (req, res) => {
	const { event, user, isOwner } = req;

	if (!event) return res.status(400).json({ message: "Event not found!" });

	if (!isOwner)
		return res.status(400).json({ message: "You dont own this event!" });

	const sharedWith = await User.find({ _id: { $in: event.sharedWith } });
	const tag = await EventTag.findById(event.tag);

	// Remove event from user
	user.events.splice(user.events.indexOf(event), 1);

	// Remove event from user that the event is shared with
	sharedWith.forEach((e) =>
		e.sharedEvents.splice(e.sharedEvents.indexOf(event), 1)
	);

	// Remove event from tag
	tag.appliedTo.splice(tag.appliedTo.indexOf(event));

	try {
		for (const e of sharedWith) {
			await e.save();
		}
		await tag.save();
		await user.save();
		await Event.findByIdAndDelete(event);
		return res.json({ message: "success" });
	} catch (err) {
		return res.status(400).json({ message: err });
	}
};

// ******************************
// 			UPDATE
// ******************************

const updateEventTag = async (req, res) => {
	const { tag, isOwner, isDefault } = req;
	const { name, color } = req.body;

	if (!tag) return res.status(400).json({ message: "Event tag not found!" });

	if (!isOwner)
		return res.status(400).json({ message: "You dont own this event!" });

	if (isDefault)
		return res.status(400).json({ message: "You can't edit the default tag" });

	tag.name = name || tag.name;
	tag.color = color || tag.color;

	try {
		const savedTag = await tag.save();
		return res.json(_eventTagToJSON(savedTag));
	} catch (err) {
		return res.status(400).json({ message: err });
	}
};

const updateEvent = async (req, res) => {
	const { name, description, sharedWith, dates } = req.body;
	const { user, event, tag } = req;
	const { start, end } = dates || {};

	if (!event) return res.status(400).json({ message: "Event not found!" });

	if (!tag) return res.status(400).json({ message: "Event tag not found!" });

	// Prepare sharedWithUsers array
	const sharedWithUsers = [];
	if (sharedWith !== undefined) {
		for (const e of sharedWith) {
			if (e === user.email)
				return res.status(400).json({
					message: "You cant share a todo to yourself. Find some friends",
				});
			const u = await await User.findOne({ email: e }).populate("sharedEvents");
			if (!u) return res.status(400).json({ message: `Email ${e} not found!` });
			sharedWithUsers.push(u);
		}
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
	event.dates = dates || event.end;

	// If the tag was specified in the request, update the event
	if (tag && !event.tag._id.equals(tag._id)) {
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
		return res.status(400).json({ message: err });
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
