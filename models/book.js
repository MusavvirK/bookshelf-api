const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookSchema = new Schema({
	title: String,
	author: String,
	genre: [String],
	publisher: String,
	authorId: String,
	authorName: String,
});

const ModelClass = mongoose.model("book", bookSchema);

module.exports = ModelClass;
