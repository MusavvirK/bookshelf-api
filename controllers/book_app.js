let _ = require("lodash");

const Book = require("../models/book");

/**
 * ------- book APIs -------
 */

/**
 * Get a list of books
 *
 * @param req
 * @param res
 * @param next
 */
exports.fetchBooks = function (req, res, next) {
	Book.find({})
		.select({})
		.limit(100)
		.sort({
			time: -1,
		})
		.exec(function (err, books) {
			if (err) {
				console.log(err);
				return res.status(422).json({
					message: "Error! Could not retrieve books.",
				});
			}
			res.json(books);
		});
};

/**
 * Create a new book
 *
 * @param req
 * @param res
 * @param next
 */
exports.createBook = function (req, res, next) {
	// Require auth
	const user = req.user;

	const title = req.body.title;
	const author = req.body.author;
	const genre = req.body.genre;
	const publisher = req.body.publisher;
	const authorId = user._id;
	const authorName = user.firstName + " " + user.lastName;

	// Make sure title, genre and genre are not empty
	if (!title || !author || !genre || !publisher) {
		return res.status(422).json({
			message: "Title, author, genre and publisher are all required.",
		});
	}

	// Create a new book
	const book = new Book({
		title: title,
		author: author,
		genre: _.uniq(genre.split(",").map((item) => item.trim())), // remove leading and trailing spaces, remove duplicate genre
		publisher: publisher,
		authorId: authorId,
		authorName: authorName,
	});

	// Save the book
	book.save(function (err, book) {
		// callback function
		if (err) {
			return next(err);
		}
		res.json(book); // return the created book
	});
};

/**
 * Fetch a single book by book ID
 *
 * @param req
 * @param res
 * @param next
 */
exports.fetchBook = function (req, res, next) {
	Book.findById(
		{
			_id: req.params.id,
		},
		function (err, book) {
			if (err) {
				console.log(err);
				return res.status(422).json({
					message:
						"Error! Could not retrieve the book with the given book ID.",
				});
			}
			if (!book) {
				return res.status(404).json({
					message:
						"Error! The book with the given ID does not exist.",
				});
			}
			res.json(book); // return the single blog book
		}
	);
};

/**
 * Check if current book can be updated or deleted by the authenticated user: The author can only make change to his/her own books
 *
 * @param req
 * @param res
 * @param next
 */
exports.allowUpdateOrDelete = function (req, res, next) {
	// Require auth
	const user = req.user;

	// Find the book by book ID
	Book.findById(
		{
			_id: req.params.id,
		},
		function (err, book) {
			if (err) {
				console.log(err);
				return res.status(422).json({
					message:
						"Error! Could not retrieve the book with the given book ID.",
				});
			}

			// Check if the book exist
			if (!book) {
				return res.status(404).json({
					message: "Error! The book with the given ID is not exist.",
				});
			}

			console.log(user._id);
			console.log(book.authorId);

			// Check if the user ID is equal to the author ID
			if (!user._id.equals(book.authorId)) {
				return res.send({ allowChange: false });
			}
			res.send({ allowChange: true });
		}
	);
};

/**
 * Edit/Update a book
 *
 * @param req
 * @param res
 * @param next
 */
exports.updateBook = function (req, res, next) {
	// Require auth
	const user = req.user;

	// Find the book by book ID
	Book.findById(
		{
			_id: req.params.id,
		},
		function (err, book) {
			if (err) {
				console.log(err);
				return res.status(422).json({
					message:
						"Error! Could not retrieve the book with the given book ID.",
				});
			}

			// Check if the book exist
			if (!book) {
				return res.status(404).json({
					message:
						"Error! The book with the given ID does not exist.",
				});
			}

			// Make sure the user ID is equal to the author ID (Cause only the author can edit the book)
			// console.log(user._id);
			// console.log(book.authorId);
			if (!user._id.equals(book.authorId)) {
				return res.status(422).json({
					message:
						"Error! You have no authority to modify this book.",
				});
			}

			// Make sure title, genre and genre are not empty
			const title = req.body.title;
			const author = req.body.author;
			const genre = req.body.genre;
			const publisher = req.body.publisher;

			if (!title || !author || !genre || !publisher) {
				return res.status(422).json({
					message: "Title, author, genre and genre are all required.",
				});
			}

			// Update user
			book.title = title;
			book.author = author;
			(book.genre = _.uniq(genre.split(",").map((item) => item.trim()))), // remove leading and trailing spaces, remove duplicate genre;
				(book.publisher = publisher);

			// Save user
			book.save(function (err, book) {
				// callback function
				if (err) {
					return next(err);
				}
				res.json(book); // return the updated book
			});
		}
	);
};

/**
 * Delete a book by book ID
 *
 * @param req
 * @param res
 * @param next
 */
exports.deleteBook = function (req, res, next) {
	// Require auth

	// Delete the book
	Book.findByIdAndRemove(req.params.id, function (err, book) {
		if (err) {
			return next(err);
		}
		if (!book) {
			return res.status(422).json({
				message: "Error! The book with the given ID is not exist.",
			});
		}

		// Return a success message
		res.json({
			message: "The book has been deleted successfully!",
		});
	});
};

/**
 * Fetch books by author ID
 *
 * @param req
 * @param res
 * @param next
 */
exports.fetchBooksByAuthorId = function (req, res, next) {
	// Require auth
	const user = req.user;

	// Fetch books by author ID
	Book.find({
		authorId: user._id,
	})
		.select({})
		.limit(100)
		.sort({
			time: -1,
		})
		.exec(function (err, books) {
			if (err) {
				console.log(err);
				return res.status(422).json({
					message: "Error! Could not retrieve books.",
				});
			}
			res.json(books);
		});
};
