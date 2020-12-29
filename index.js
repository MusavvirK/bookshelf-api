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

mongoose.connect(uri.toString(), {
	useMongoClient: true,
});

app.use(morgan("combined"));
app.use(bodyParser.json({ type: "*/*" }));
app.use(cors());

router(app);

const port = process.env.PORT;
const server = http.createServer(app);
server.listen(port);
console.log("Server listening on: ", port);
