// Main starting point of the application
const express = require("express");
const http = require("http");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const app = express();
const router = require("./router");
const mongoose = require("mongoose");
const cors = require("cors");
const uri = process.env.MONGODB_URL;

// DB Setup (connect mongoose and instance of mongodb)
mongoose.connect(uri.toString(), {
	useMongoClient: true,
});

// App Setup (morgan and body-parser are middleware in Express)
app.use(morgan("combined")); // middleware for logging
app.use(bodyParser.json({ type: "*/*" })); // middleware for helping parse incoming HTTP requests
app.use(cors()); // middleware for circumventing cors error

// Router Setup
router(app);

// Server Setup
const port = process.env.PORT;
const server = http.createServer(app);
server.listen(port);
console.log("Server listening on: ", port);
