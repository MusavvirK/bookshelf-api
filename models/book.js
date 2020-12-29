const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define our model
const bookSchema = new Schema({
	title: String,
	author: String,
	genre: [String],
	publisher: String, // html
	authorId: String,
	authorName: String,
});

// Create the model class
const ModelClass = mongoose.model("book", bookSchema);

// Export the model
module.exports = ModelClass;
