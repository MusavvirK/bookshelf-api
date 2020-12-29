let _ = require("lodash");

const Book = require("../models/book");

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

exports.createBook = function (req, res, next) {
	const user = req.user;

	const title = req.body.title;
	const author = req.body.author;
	const genre = req.body.genre;
	const publisher = req.body.publisher;
	const authorId = user._id;
	const authorName = user.firstName + " " + user.lastName;

	if (!title || !author || !genre || !publisher) {
		return res.status(422).json({
			message: "Title, author, genre and publisher are all required.",
		});
	}

	const book = new Book({
		title: title,
		author: author,
		genre: _.uniq(genre.split(",").map((item) => item.trim())),
		publisher: publisher,
		authorId: authorId,
		authorName: authorName,
	});

	book.save(function (err, book) {
		if (err) {
			return next(err);
		}
		res.json(book);
	});
};

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
			res.json(book);
		}
	);
};

exports.allowUpdateOrDelete = function (req, res, next) {
	const user = req.user;

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
					message: "Error! The book with the given ID is not exist.",
				});
			}

			console.log(user._id);
			console.log(book.authorId);

			if (!user._id.equals(book.authorId)) {
				return res.send({ allowChange: false });
			}
			res.send({ allowChange: true });
		}
	);
};

exports.updateBook = function (req, res, next) {
	const user = req.user;

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

			if (!user._id.equals(book.authorId)) {
				return res.status(422).json({
					message:
						"Error! You have no authority to modify this book.",
				});
			}

			const title = req.body.title;
			const author = req.body.author;
			const genre = req.body.genre;
			const publisher = req.body.publisher;

			if (!title || !author || !genre || !publisher) {
				return res.status(422).json({
					message: "Title, author, genre and genre are all required.",
				});
			}

			book.title = title;
			book.author = author;
			(book.genre = _.uniq(genre.split(",").map((item) => item.trim()))),
				(book.publisher = publisher);

			book.save(function (err, book) {
				if (err) {
					return next(err);
				}
				res.json(book);
			});
		}
	);
};

exports.deleteBook = function (req, res, next) {
	Book.findByIdAndRemove(req.params.id, function (err, book) {
		if (err) {
			return next(err);
		}
		if (!book) {
			return res.status(422).json({
				message: "Error! The book with the given ID is not exist.",
			});
		}

		res.json({
			message: "The book has been deleted successfully!",
		});
	});
};

exports.fetchBooksByAuthorId = function (req, res, next) {
	const user = req.user;

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
