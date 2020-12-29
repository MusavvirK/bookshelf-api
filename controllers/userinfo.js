const User = require("../models/user");
const Book = require("../models/book");

/**
 * Fetch profile information
 *
 * @param req
 * @param res
 * @param next
 */
exports.fetchProfile = function (req, res, next) {
	// Require auth

	// Return profile info
	const user = {
		email: req.user.email,
		firstName: req.user.firstName,
		lastName: req.user.lastName,
	};
	res.send({
		user: user,
	});
};
