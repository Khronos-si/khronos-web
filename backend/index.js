const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const PORT = 3000;

const app = express();

dotenv.config();

// Import routes
const authRoute = require("./routes/auth");
const todoRoute = require("./routes/todo");

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
app.use("/api/user", authRoute);
app.use("/api/todo", todoRoute);

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
