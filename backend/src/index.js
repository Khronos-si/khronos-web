const express = require("express");
const mongoose = require("mongoose");
const redis = require("redis");
const dotenv = require("dotenv");

const PORT = 3000;

const app = express();

dotenv.config({ path: `${__dirname}/.env` });

// Import routes
const userRoute = require("./routes/user");
const todoRoute = require("./routes/todo");
const eventRoute = require("./routes/event");

// Connect to DB
mongoose.connect(
	process.env.DB_CONNECT,
	{
		useNewUrlParser: true,
	},
	(err) => {
		console.log("Connected to DB", err);
	}
);

// Route Middleware
app.use(express.json());
app.use("/api/user", userRoute);
app.use("/api/todo", todoRoute);
app.use("/api/event", eventRoute);

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
